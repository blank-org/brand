# Brand Colours Reference

## Overview
This project is a static web experience for exploring brand palettes. Users can browse available brands, copy colour hex codes, and preview typography samples without any backend services. The stack is intentionally lightweight: HTML, CSS, and vanilla JavaScript.

## Project Structure
- `brand.html` – top-level document that loads styles, components, and client scripts.
- `styles.css` – shared styling for layout, tables, and controls.
- `script.js` – handles DOM hydration, brand selection, colour rendering, and font previews.
- `data/list.json.js` – declares `window.BRAND_LIST`, which drives the dropdown.
- `data/<brand>.json.js` – each file defines a `window.BRAND` object with metadata, colours, and fonts.
- `components/` – reusable HTML snippets exposed as scripts (e.g., colour rows, font samples).
- `resource/` – supporting assets such as icons.

## Running Locally
Because everything is static, you can double-click `brand.html` to open it in a browser. For iterative development use a lightweight static server to avoid CORS issues when editing data files, e.g. `npx serve .`.

## Adding a Brand
1. Create `data/<brandId>.json.js` that sets `window.BRAND = { name, colours: [], fonts: [] }`.
2. Append the same `<brandId>` to the array in `data/list.json.js` so it appears in the selector.
3. (Optional) Adjust `styles.css` or add assets under `resource/` if the new brand requires them.
4. Reload `brand.html` and confirm colours, copy-to-clipboard behaviour, and font controls.

## Notes
- Colour swatches expose `role="button"`, keyboard interaction, and clipboard feedback for accessibility.
- If you introduce tooling (linting, tests), document commands in `README.md` and `AGENTS.md`.
- Keep data scripts as simple assignments; no bundler or transpiler is configured.
