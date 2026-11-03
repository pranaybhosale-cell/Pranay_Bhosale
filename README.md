# Pranay Bhosale — Student Portfolio

A photo-free, responsive portfolio built with semantic HTML5, CSS3 and vanilla JavaScript. It has no framework, build step, backend or server dependency.

## Run locally

Extract the folder and open `index.html` in a modern browser. The site also works on GitHub Pages. Google Fonts are optional; local system-font fallbacks are included.

## What's included

- Cinematic midnight palette with layered glass surfaces, soft aurora lighting and subtle film grain
- Pointer-following ambient light, fine-pointer custom cursor, card spotlight, restrained tilt and button interactions
- Interactive neural-network canvas in the hero; it pauses when off-screen or the tab is hidden
- Responsive glass navigation, active-section tracking and scroll progress
- Learning journey, current learning areas, project filters and project case-study dialog
- Certificate lightbox with previous/next controls, Escape and arrow-key support
- Copy-email toast, keyboard focus states, reduced-motion handling and touch-device fallbacks
- SEO metadata, Open Graph/Twitter metadata, favicon and social preview artwork
- Existing resume and original certificate images retained

## Folder structure

```text
Pranay_Bhosale_Portfolio_Complete/
├── index.html
├── style.css
├── script.js
├── README.md
├── resume.pdf
└── assets/
    ├── favicon.svg
    ├── og-cover.svg
    ├── microsoft-certificate.jpg
    └── be10x-certificate.jpg
```

## Before publishing — verify these items

1. **Email:** `pranaybhosale1409@gmail.com` is displayed publicly in the contact section. Change it if needed.
2. **Resume:** replace `resume.pdf` with the latest accurate version when it changes.
3. **LinkedIn:** confirm `https://www.linkedin.com/in/pranay-bhosale/` is your preferred public profile.
4. **GitHub:** current project links point to your GitHub profile, not a specific repository. Replace them with a direct repository URL when it is public.
5. **Dataset evidence:** replace the screenshot placeholder with a real screenshot from the cleaned dataset when ready.
6. **Analysis chart:** add a chart only when it is based on validated figures and correctly labelled.
7. **Certificates:** confirm the supplied scans, titles and dates before publishing. Add issuer verification links only if available.
8. **Social preview:** `assets/og-cover.svg` is the social preview artwork. Some platforms may require a 1200×630 PNG; export one and update `og:image` if needed.
9. **Website URL:** update `og:url` and `og:image` if the GitHub Pages URL changes.

## Publish on GitHub Pages

1. Extract the ZIP.
2. Open the existing repository: https://github.com/pranaybhosale-cell/Pranay_Bhosale
3. Upload the *contents* of this folder to the repository root, preserving `assets/` and all its files.
4. Replace `index.html`, `style.css`, `script.js` and `README.md`. Keep `resume.pdf` and both certificate scans.
5. Commit the changes, wait for GitHub Pages to deploy, then hard-refresh the website.

Live site currently listed in the project: https://pranaybhosale-cell.github.io/Pranay_Bhosale/

## Accuracy note

The Maharashtra livestock dataset is presented as in progress. The table is a schema illustration, not actual observations. The screenshot and chart areas remain placeholders until verified evidence is available. The electricity subsidy comparison is planned. Workshop credentials are described as workshop participation/completion, not professional certifications.

## Accessibility and performance

- Semantic landmarks and a skip link
- Keyboard-visible focus styles and native dialog elements
- Escape support for navigation and dialogs; arrow-key navigation in the certificate lightbox
- `prefers-reduced-motion` and coarse-pointer fallbacks
- Canvas particle count is capped and animation pauses off-screen / when the tab is hidden
- No external JavaScript libraries or build tools
