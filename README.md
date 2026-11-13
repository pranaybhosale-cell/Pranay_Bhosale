# Pranay Bhosale — Student Portfolio

A responsive, photo-free student portfolio built with plain HTML, CSS and JavaScript. No framework, build step or server is required.

## Run locally

Open `index.html` in a modern browser. The Google Fonts connection is optional; the page falls back to system fonts if offline.

## Included

- Interactive canvas network in the hero (pauses off-screen)
- Responsive navigation, active section state and scroll progress
- Project filters, subtle reveal effects, fine-pointer cursor/spotlight/tilt
- Certificate lightbox using the supplied certificate scans
- Reduced-motion and touch-device handling
- SEO metadata, Open Graph metadata, favicon and social preview artwork
- Dataset case study with honest status, source/method notes, schema example and clearly marked evidence placeholders

## Design layer (latest update)

- Aurora background, cursor light, parallax and film grain (all off for reduced motion and touch devices)
- Full-bleed neural hero with scramble headline and floating glass panel
- Glass cards with cursor-following edge light, spotlight, shine sweep and 3D tilt
- Learning Journey timeline, animated project filters, animated modals, mailto contact form (no server)
- Placeholders for the dataset screenshot and chart remain until verified outputs exist

## Before publishing — verify these items

1. **Email:** `pranaybhosale1409@gmail.com` is currently displayed in the contact section. Change it in `index.html` if you prefer another public address.
2. **Resume:** replace `resume.pdf` with your latest accurate PDF if it has changed.
3. **LinkedIn:** confirm `https://www.linkedin.com/in/pranay-bhosale/` is your preferred public profile URL.
4. **GitHub:** replace the profile links with specific project repository URLs when those repositories are ready. The current links point to your profile, not to project source code.
5. **Dataset screenshot:** replace the first evidence placeholder in `index.html` with a real screenshot. Put the image in `assets/`, add an `<img>` with useful alt text, and keep it compressed (WebP/AVIF preferred).
6. **Analysis chart:** replace the second evidence placeholder only when you have a chart built from validated figures. Do not publish illustrative or unverified values as real findings.
7. **Project links:** add a direct repository, README, report or dataset link for the livestock project when it is public and ready.
8. **Certificates:** confirm the two supplied scans and their displayed titles/dates are accurate. Add verification links only if the issuer provides them.
9. **Social preview:** `assets/og-cover.svg` is a designed preview image. If your sharing platform does not accept SVG previews, export an equivalent 1200×630 PNG and update `og:image` in `index.html`.
10. **Website URL:** if the repository or GitHub Pages URL changes, update `og:url` and `og:image` in the page head.

## Publish on the existing GitHub Pages site

1. Extract the ZIP.
2. Open your existing repository: https://github.com/pranaybhosale-cell/Pranay_Bhosale
3. Upload the *contents* of this folder to the repository root, preserving the `assets/` folder and its files.
4. Replace the existing `index.html`, `style.css`, `script.js`, and `README.md`. Upload the new `assets/` files. Keep `resume.pdf` and the two certificate scans.
5. Commit the changes, wait for GitHub Pages to deploy, then hard-refresh the site.

Live site: https://pranaybhosale-cell.github.io/Pranay_Bhosale/

## Accuracy note

The livestock project is described as in progress. The table is a schema illustration, not actual observations. The chart and screenshot spaces are intentionally placeholders until verified evidence is ready. Workshop credentials are not described as professional certifications.

## Certificate privacy note

`assets/nielit-yuva-ai-certificate.jpg` is a redacted copy: the photo, date of birth, enrolment number, certificate number and APAAR ID are covered. Keep your original private; do not upload it to the public repository.

## Latest additions

- LearnTube.ai Project Management Assessment certificate (7 Nov 2026) added to Certificates and the Learning Journey.
- `resume.pdf` regenerated to list all four certificates and the public email address; the "starter resume" placeholder line was removed.

- Scaler Masterclass (RAG vs AI Agents vs Agentic AI, 12 Nov 2026) certificate of participation added to the site and resume.

## 3D layer (Pass 1)
- `scene3d.js` draws a scroll-driven 3D neural network with Three.js r128 (vendored in `assets/vendor/`, loaded lazily). The camera travels through it as you scroll, and each Learning Journey entry lights up a matching node. Phones with weak hardware, `prefers-reduced-motion` and browsers without WebGL keep the original 2D hero canvas. If frames run slow, it lowers resolution, then turns itself off.
- `fx.js` adds inertia scrolling (Lenis 1.1.18, desktop pointers only), the 3D certificate coverflow (drag, swipe, arrow keys, buttons), and section dots. `fx.css` styles them and stacks the project cards.
- Add `?no3d` to the URL to turn the 3D scene off for testing.
