/* Scroll-driven 3D neural network. Loads Three.js lazily; falls back to the 2D hero canvas. */
(() => {
  'use strict';
  const params = new URLSearchParams(location.search);
  const force = params.has('force3d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = innerWidth < 760;
  const cores = navigator.hardwareConcurrency || 4;
  if ((reduce || params.has('no3d')) && !force) return;
  if (small && cores < 6 && !force) return;          // weak phones keep the light 2D version
  try { const c = document.createElement('canvas'); if (!(c.getContext('webgl') || c.getContext('experimental-webgl'))) return; } catch (e) { return; }

  const load = src => new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.append(s); });
  const boot = () => load('three.r128.min.js').then(start).catch(() => {});
  if (force) boot(); else (window.requestIdleCallback || (f => setTimeout(f, 250)))(boot, { timeout: 1500 });

  function start() {
    const T = window.THREE; if (!T) return;
    const canvas = document.createElement('canvas'); canvas.id = 'scene3d'; canvas.setAttribute('aria-hidden', 'true'); document.body.prepend(canvas);
    const renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' });
    let pr = Math.min(devicePixelRatio || 1, small ? 1.25 : 1.75);
    renderer.setPixelRatio(pr); renderer.setClearColor(0x000000, 0);
    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(58, 1, .1, 400);

    // Camera path: a gentle winding tunnel through the network.
    const L = 300, ctrl = [];
    for (let i = 0; i <= 26; i++) { const t = i / 26; ctrl.push(new T.Vector3(Math.sin(t * 9) * 5.5, Math.cos(t * 6.3) * 3, -t * L)); }
    const path = new T.CatmullRomCurve3(ctrl);
    const P = t => path.getPointAt(Math.min(Math.max(t, 0), .999));

    // Nodes.
    const N = small ? 120 : 280;
    const pos = [], col = [], size = [], phase = [];
    const palette = [new T.Color('#65e6f2'), new T.Color('#628cff'), new T.Color('#a78bfa')];
    const rnd = (a, b) => a + Math.random() * (b - a);
    for (let i = 0; i < N; i++) {
      const c = P(Math.random()); const r = rnd(3.2, 17), a = Math.random() * 6.283;
      pos.push(c.x + Math.cos(a) * r, c.y + Math.sin(a) * r * .65, c.z + rnd(-6, 6));
      const k = palette[(Math.random() * 3) | 0]; col.push(k.r, k.g, k.b); size.push(rnd(.7, 2.1)); phase.push(Math.random() * 6.283);
    }
    const nodeMat = new T.ShaderMaterial({
      transparent: true, depthWrite: false, blending: T.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uPx: { value: pr } },
      vertexShader: 'attribute float size;attribute float phase;attribute vec3 color;uniform float uTime;uniform float uPx;varying vec3 vC;varying float vA;void main(){vC=color;vec4 mv=modelViewMatrix*vec4(position,1.);float d=-mv.z;float tw=.65+.35*sin(uTime*1.4+phase);vA=tw*smoothstep(95.,10.,d)*smoothstep(.6,3.,d);gl_PointSize=size*uPx*(95./d);gl_Position=projectionMatrix*mv;}',
      fragmentShader: 'varying vec3 vC;varying float vA;void main(){float r=length(gl_PointCoord-.5)*2.;float g=smoothstep(1.,0.,r);gl_FragColor=vec4(vC*(.55+g),g*g*vA);}'
    });
    const nodeGeo = new T.BufferGeometry();
    nodeGeo.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); nodeGeo.setAttribute('color', new T.Float32BufferAttribute(col, 3));
    nodeGeo.setAttribute('size', new T.Float32BufferAttribute(size, 1)); nodeGeo.setAttribute('phase', new T.Float32BufferAttribute(phase, 1));
    scene.add(new T.Points(nodeGeo, nodeMat));

    // Edges between nearby nodes (max 3 per node).
    const lp = [], lc = []; const deg = new Array(N).fill(0);
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
      if (deg[i] >= 3 || deg[j] >= 3) continue;
      const dx = pos[i * 3] - pos[j * 3], dy = pos[i * 3 + 1] - pos[j * 3 + 1], dz = pos[i * 3 + 2] - pos[j * 3 + 2];
      if (dx * dx + dy * dy + dz * dz < 80) { deg[i]++; deg[j]++; lp.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2], pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]); lc.push(col[i * 3], col[i * 3 + 1], col[i * 3 + 2], col[j * 3], col[j * 3 + 1], col[j * 3 + 2]); }
    }
    const lineGeo = new T.BufferGeometry(); lineGeo.setAttribute('position', new T.Float32BufferAttribute(lp, 3)); lineGeo.setAttribute('color', new T.Float32BufferAttribute(lc, 3));
    scene.add(new T.LineSegments(lineGeo, new T.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: .2, blending: T.AdditiveBlending, depthWrite: false })));

    // Hero object: a slowly turning wireframe form to the right of the headline.
    const core = new T.Group();
    core.add(new T.LineSegments(new T.EdgesGeometry(new T.IcosahedronGeometry(1.7, 1)), new T.LineBasicMaterial({ color: 0x65e6f2, transparent: true, opacity: .55, blending: T.AdditiveBlending })));
    core.add(new T.LineSegments(new T.EdgesGeometry(new T.IcosahedronGeometry(2.5, 0)), new T.LineBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: .3, blending: T.AdditiveBlending })));
    scene.add(core);

    // Journey milestones: one glowing node per timeline entry, placed where the camera reaches that entry.
    const items = [...document.querySelectorAll('.timeline li')];
    const mCount = items.length;
    const mPos = new Float32Array(mCount * 3), mLit = new Float32Array(mCount), mT = new Array(mCount).fill(.5);
    const mGeo = new T.BufferGeometry(); mGeo.setAttribute('position', new T.BufferAttribute(mPos, 3)); mGeo.setAttribute('lit', new T.BufferAttribute(mLit, 1));
    const mMat = new T.ShaderMaterial({
      transparent: true, depthWrite: false, blending: T.AdditiveBlending, uniforms: { uPx: { value: pr } },
      vertexShader: 'attribute float lit;uniform float uPx;varying float vL;void main(){vL=lit;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=(14.+lit*30.)*uPx*(40./-mv.z);gl_Position=projectionMatrix*mv;}',
      fragmentShader: 'varying float vL;void main(){float r=length(gl_PointCoord-.5)*2.;float g=smoothstep(1.,0.,r);float ring=smoothstep(.1,0.,abs(r-.62))*vL;vec3 c=mix(vec3(.4,.55,1.),vec3(1.,.77,.55),vL);gl_FragColor=vec4(c*(.5+g),(g*g*(.35+.65*vL)+ring*.7));}'
    });
    scene.add(new T.Points(mGeo, mMat));
    let page = { max: 1, vh: innerHeight };
    const place = () => {
      page.vh = innerHeight; page.max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      items.forEach((li, i) => { const r = li.getBoundingClientRect(); const y = r.top + scrollY + r.height / 2 - page.vh / 2; mT[i] = Math.min(Math.max(y / page.max, 0), .96); const c = P(mT[i] + .018); mPos.set([c.x + 3.3, c.y + (i % 3 - 1) * .6, c.z], i * 3); });
      mGeo.attributes.position.needsUpdate = true;
    };

    const resize = () => { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); place(); };
    resize(); addEventListener('resize', resize, { passive: true });
    if ('ResizeObserver' in window) new ResizeObserver(place).observe(document.body);
    document.fonts?.ready.then(place);

    // Which milestone is lit: the timeline entry nearest the viewport centre.
    let litIndex = -1;
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { litIndex = items.indexOf(e.target); items.forEach((li, i) => li.classList.toggle('is-lit', i === litIndex)); } }), { rootMargin: '-44% 0px -44% 0px' });
    items.forEach(li => io.observe(li));
    const journey = document.getElementById('journey');
    const jObs = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) { litIndex = -1; items.forEach(li => li.classList.remove('is-lit')); } }), { threshold: 0 }); journey && jObs.observe(journey);

    const ptr = { x: 0, y: 0, sx: 0, sy: 0 };
    addEventListener('pointermove', e => { ptr.x = e.clientX / innerWidth * 2 - 1; ptr.y = e.clientY / innerHeight * 2 - 1; }, { passive: true });

    // Render loop with a simple frame-time guard so a slow GPU degrades gracefully.
    let tc = 0, last = performance.now(), slow = 0, frames = 0, shown = false, running = true, level = 0;
    const look = new T.Vector3();
    const frame = now => {
      if (!running) return; requestAnimationFrame(frame);
      const dt = Math.min(now - last, 100); last = now;
      const target = Math.min(scrollY / page.max, 1); tc += (target - tc) * .07;
      ptr.sx += (ptr.x - ptr.sx) * .05; ptr.sy += (ptr.y - ptr.sy) * .05;
      const p = P(tc), q = P(tc + .018);
      camera.position.set(p.x + ptr.sx * 1.1, p.y - ptr.sy * .7, p.z);
      look.set(q.x + ptr.sx * .6, q.y - ptr.sy * .4, q.z); camera.lookAt(look);
      camera.rotation.z += ptr.sx * -.025;
      const hp = P(.012); core.position.set(hp.x + 4.4, hp.y + .2, hp.z - 7.5); core.rotation.y = now * .00012; core.rotation.x = now * .00007;
      core.visible = tc < .12;
      for (let i = 0; i < mCount; i++) { const want = i === litIndex ? 1 : 0; mLit[i] += (want - mLit[i]) * .1; } mGeo.attributes.lit.needsUpdate = true;
      nodeMat.uniforms.uTime.value = now * .001;
      renderer.render(scene, camera);
      if (!shown) { shown = true; document.body.classList.add('has-3d'); }
      frames++; if (!force && frames > 60) { slow += dt > 34 ? 1 : -1; slow = Math.max(slow, 0);
        if (slow > 70) { slow = 0; if (level === 0) { level = 1; pr = 1; renderer.setPixelRatio(1); nodeMat.uniforms.uPx.value = 1; mMat.uniforms.uPx.value = 1; resize(); } else { running = false; canvas.remove(); document.body.classList.remove('has-3d'); } } }
    };
    requestAnimationFrame(frame);
    document.addEventListener('visibilitychange', () => { if (document.hidden) running = false; else if (!running && document.body.contains(canvas)) { running = true; last = performance.now(); requestAnimationFrame(frame); } });
    window.__pb3d = { scene, camera, P };
  }
})();
