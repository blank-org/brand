Brand Colours reference

This small static page lists the project's brand colours and allows quick copying of hex codes.

Files
- Brand.html - the main HTML file. It links to the external CSS/JS and data script.
- styles.css - externalized styles originally inline in `Brand.html`.
- script.js - handles rendering (if `data.json.js` is present) and copy-on-click behaviour.
- data.json.js - contains an array of colour definitions as `window.BRAND_COLORS`.

Usage
1. Open `Brand.html` in a browser (double-click or serve from a static server).
2. Click any colour swatch (the coloured box) to copy its hex code to the clipboard.

Notes
- `data.json.js` is a plain script that sets `window.BRAND_COLORS`. You can edit or replace it with a JSON fetch if you prefer.
- The page uses the Clipboard API when available; a textarea fallback is included for older browsers.
- Accessibility: colour swatches have `role="button"` and keyboard support (Enter/Space).
