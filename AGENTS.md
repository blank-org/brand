# Repository Guidelines

## Project Structure & Module Organization
- `brand.html` loads static assets and defines the page shell.
- `script.js` handles DOM hydration, brand/font rendering, and event wiring; expect most logic changes here.
- `styles.css` contains the global styling rules shared by all brands.
- `data/*.json.js` files expose `window.BRAND` objects consumed at runtime; `data/list.json.js` lists selectable brands.
- `components/` holds reusable HTML snippets published as scripts (e.g., `font-sample.html.js`).
- `resource/` stores supporting assets such as icons or SVGs.

## Architecture Overview
- Entire app is static; no bundlers or build steps. Loading `brand.html` executes each script in source order.
- Brand data files (`data/<brand>.json.js`) attach `window.BRAND` with `name`, `colours`, `fonts`, and optional `icons`. The main script imports them dynamically based on the dropdown.
- Clipboard support relies on the modern API with a textarea fallback; keep interactions progressive.

## Build, Test, and Development Commands
- Open `brand.html` directly in a browser for manual QA; no bundler or local server is required.
- For live reload, use any static file server (e.g., `npx serve .`) to avoid CORS issues when editing JSON.
- If you add tooling (lint/tests), document the command in this file and the README.

## Coding Style & Naming Conventions
- Stick to plain ES5/ES6 without transpilation; keep modules self-invoking to avoid polluting globals.
- Use tab indentation (matches existing JS/HTML) and double quotes in HTML attributes.
- DOM helpers and globals follow lowerCamelCase; constructors or exported factories use PascalCase.
- Keep inline comments brief and purposeful; prefer extracting helper functions for clarity.

## Testing Guidelines
- Manual verification is the norm: confirm brand selection, colour copy-to-clipboard, and font controls across browsers.
- Local Chrome executables found for headless smoke checks: `C:\Program Files\Google\Chrome\Application\chrome.exe` and `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`.
- When adding automated tests, mirror the manual scenarios and store specs under `tests/`.
- Name future test files `<feature>.spec.js` and ensure they run via a documented npm script.

## Brand Data Workflow
- To add a brand, create `data/<brandId>.json.js` exporting `window.BRAND` and append the id to `window.BRAND_LIST` in `data/list.json.js`.
- Ensure each `colours` entry includes `id`, `hex`, `name`, and optional `usage`/`remark`; fonts should provide `name`, `family`, `weight`, and `sampleText`; icon comparison categories should provide `category` and `rows`, with each row providing `label`, `currentIndex`, and `variants` with Lucide icon name strings.
- Keep new assets under `resource/` and update CSS only when a brand needs bespoke styling.

## Commit & Pull Request Guidelines
- Adopt concise, imperative commit subjects (e.g., `Extract font sample template`), mirroring current history.
- Reference related issues in commit bodies or PR descriptions (`Fixes #123`) when applicable.
- PRs should include: scope summary, validation notes (browsers tested, commands run), and screenshots/GIFs for UI changes.
- Try to keep every commit standalone and atomic.
- At the end of complete change - provide appropriate commit message that can be used to save to scm, beneath initial line add detailed commit change. This should Not end with a fullstop
- Update the APP_FEATURES doc when applicable
- Testing can be done by opening the brand.html file directly in the browser
