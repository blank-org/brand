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
`colours` is the canonical palette and must include every colour used by the brand, including colours that appear only in a light or dark theme. Palettes may be flat, e.g. `colours: [{ id, name, hex, usage, remark }]`, or grouped like `colours: [{ category: "Core", rows: [{ id, name, hex, usage, remark }] }]`. Grouped palette sections also accept `items` or nested `colours` instead of `rows`.

Themes define style families such as `soft` or `sharp`; appearances define light/dark variants within a theme. A theme may have no appearances, one appearance, or both `light` and `dark` appearances:

```js
themes: [{
	id: "soft",
	label: "Soft",
	appearances: {
		light: {
			label: "Light",
			logos: [
				{ logo: 1 }
			],
			colours: [
				{ category: "Core", rows: [1, 2] }
			],
			fonts: [
				{ category: "Headings", rows: [{ font: 1, colour: 1, textColour: 1, backgroundColour: 3 }] }
			],
			icons: [
				{ category: "Sidebar", rows: [{ icon: 1 }, { icon: 2 }] }
			]
		},
		dark: {
			label: "Dark",
			logos: [
				{ logo: 2 }
			],
			colours: [
				{ category: "Core", rows: [5, 6] }
			],
			fonts: [
				{ category: "Headings", rows: [{ font: 1, colour: 5, textColour: 5, backgroundColour: 7 }] }
			],
			icons: [
				{ category: "Sidebar", rows: [{ icon: 1 }, { icon: 2 }] }
			]
		}
	}
}]
```

Use `defaultTheme` to choose the initial theme family and `defaultAppearance` to choose the initial appearance when the selected theme supports it. If a theme has no appearances, put its grouped colour references directly on `theme.colours`. Theme group titles and row ordering are theme- or appearance-specific. Theme rows are numeric references only; full colour records live in the main palette.

Logo files belong in the canonical top-level `logos` array. Theme appearances can choose and order logo files with references such as `{ logo: 1 }`, so a light appearance can show the primary logo while a dark appearance shows a reversed logo.

## Icon Comparison Data
Icon comparison rows are optional. Add a canonical `icons` array to a brand with parent category objects, e.g. `{ category: "Sidebar", rows: [...] }`. Each row should include `id`, `label`, `currentIndex`, and `variants`. Each variant uses a Lucide component name string, e.g. `{ index: 1, icon: "LayoutDashboard", name: "LayoutDashboard" }`. Theme appearances can choose and order icon rows with references such as `{ icon: 1 }`. The static page converts the name for the browser Lucide runtime; TSX surfaces can resolve the same string against `lucide-react`.

## Typography Data
Font samples may be flat, e.g. `fonts: [{ id, name, family, weight, sampleText }]`, or grouped like icon comparisons, e.g. `fonts: [{ category: "Headings", rows: [{ id, name, family, weight, sampleText }] }]`. Canonical font rows should not include colour fields. Theme appearances reference font rows and own presentation fields such as `colour`, `textColour`, and `backgroundColour`, using palette ids or hex values. Group labels are editable in the UI, and font samples can be reordered within their group.

## Notes
- Colour swatches expose `role="button"`, keyboard interaction, and clipboard feedback for accessibility.
- If you introduce tooling (linting, tests), document commands in `README.md` and `AGENTS.md`.
- Keep data scripts as simple assignments; no bundler or transpiler is configured.
