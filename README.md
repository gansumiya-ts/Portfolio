# Gansumiya Portfolio

A simple one-page portfolio website built with HTML, CSS, and JavaScript.

## Files
- `index.html`
- `style.css`
- `script.js`

## How to run locally
Just open `index.html` in your browser.

## Interactive features
- Filter all 10 projects by All / Data / Backend / AI / Telecom, or select a technology chip. All resets both filters.
- Open project details with the card or its keyboard-accessible Explore button. Escape closes the dialog and restores focus.
- Terminal commands: `help`, `projects`, `skills`, `contact`, `clear`. Touch command buttons are included.
- Kafka event demo: eligible, filtered and duplicate fixtures, with simulated Redis and API output. It sends no network requests.
- Copy email, active navigation and reduced-motion support.

`interactions.js` and `interactions.css` contain the enhancements. Project narratives summarize the original descriptions; diagrams are illustrative. No unpublished metrics, screenshots or repository URLs were invented. `screenshots/pipeline-demo.png` is an actual screenshot of the local simulation. Existing live-site links are preserved.

For clipboard support, serve over localhost or HTTPS (GitHub Pages). If the browser denies clipboard access, the page displays a manual-copy instruction.

## Verification
With Node.js, Playwright and Microsoft Edge installed, run `node verify.cjs`. Alternatively set `PLAYWRIGHT_MODULE` to an installed Playwright module path. The test serves the site on a temporary local port and checks filters, dialogs, keyboard/touch use, terminal output, all demo branches, clipboard and mobile overflow. It saves previews in `screenshots/`.

## How to publish on GitHub Pages
1. Create a new GitHub repository.
2. Upload these files to the repository root.
3. Go to **Settings** -> **Pages**.
4. Under **Build and deployment**, choose:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/root**
5. Save.
6. Your site will be published on a GitHub Pages URL.

## Suggested repo name
- `portfolio`
- `gansumiya-portfolio`
