# Brand Colours Reference

## Overview
This project is a static web experience for exploring brand palettes. Users can browse available brands, copy colour hex codes, and preview typography samples without any backend services. The stack is intentionally lightweight: HTML, CSS, and vanilla JavaScript.

## Project Structure
- `brand.html` – top-level document that loads styles, components, and client scripts.
- `styles.css` – shared styling for layout, tables, and controls.
- `script.js` – handles DOM hydration, brand selection, colour rendering, and font previews.
- `data/list.json.js` – declares `window.BRAND_LIST`, which drives the dropdown.
- `data/<brand>.json.js` – each file defines a `window.BRAND` object with metadata, colours, fonts, and optional icon comparisons.
- `components/` – reusable HTML snippets exposed as scripts (e.g., colour rows, font samples).
- `resource/` – supporting assets such as icons.

## Running Locally
Because everything is static, you can double-click `brand.html` to open it in a browser. For iterative development use a lightweight static server to avoid CORS issues when editing data files, e.g. `npx serve .`.

## Adding a Brand
1. Create `data/<brandId>.json.js` that sets `window.BRAND = { name, colours: [], fonts: [], icons: [] }`.
2. Append the same `<brandId>` to the array in `data/list.json.js` so it appears in the selector.
3. (Optional) Adjust `styles.css` or add assets under `resource/` if the new brand requires them.
4. Reload `brand.html` and confirm colours, copy-to-clipboard behaviour, font controls, and icon comparison interactions.

## Colour Data
Colour palettes may be flat, e.g. `colours: [{ id, name, hex, usage, remark }]`, or grouped like `colours: [{ category: "Core", rows: [{ id, name, hex, usage, remark }] }]`. Grouped colour sections also accept `items` or nested `colours` instead of `rows`; group titles can be edited and grouped sections can be reordered in the UI.

## Icon Comparison Data
Icon comparison rows are optional. Add an `icons` array to a brand with parent category objects, e.g. `{ category: "Sidebar", rows: [...] }`. Each row should include `label`, `currentIndex`, and `variants`. Each variant uses a Lucide component name string, e.g. `{ index: 1, icon: "LayoutDashboard", name: "LayoutDashboard" }`. The static page converts the name for the browser Lucide runtime; TSX surfaces can resolve the same string against `lucide-react`.

## Typography Data
Font samples may be flat, e.g. `fonts: [{ name, family, weight, sampleText }]`, or grouped like icon comparisons, e.g. `fonts: [{ category: "Headings", rows: [{ name, family, weight, sampleText }] }]`. Group labels are editable in the UI, and font samples can be reordered within their group.

## Notes
- Colour swatches expose `role="button"`, keyboard interaction, and clipboard feedback for accessibility.
- If you introduce tooling (linting, tests), document commands in `README.md` and `AGENTS.md`.
- Keep data scripts as simple assignments; no bundler or transpiler is configured.
