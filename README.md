# enhancement/interactive-design

This branch adds interactive UI improvements to the portfolio:

- Typewriter hero intro
- Reveal-on-scroll animations
- Dark / light theme toggle (saved to localStorage)
- Project cards that open a modal with details
- Smooth scrolling and small contact form demo

Files added/updated:
- index.html
- styles.css
- script.js
- images/placeholder.svg

Preview locally:
1. Clone the repo and checkout the branch:
   git fetch origin enhancement/interactive-design
   git checkout enhancement/interactive-design
2. Open index.html in your browser or serve with a static server (e.g., `npx http-server`).

Notes:
- I used a placeholder SVG for project images at `images/placeholder.svg`. Replace with your real screenshots and update the `data-image` attributes on project cards.
- I committed everything in one atomic commit. If you'd like the changes split into multiple commits (one per feature), tell me and I can split them.
