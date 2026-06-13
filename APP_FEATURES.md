# App Features

## Brand Selection
- Populates the brand dropdown from `window.BRAND_LIST`.
- Dynamically loads the selected brand data script from `data/<brandId>.json.js`.
- Re-renders colours, logo files, typography samples, and icon comparisons when the active brand changes.
- Restores the last selected brand from localStorage across page reloads.
- Exports the active brand data as a downloadable `window.BRAND` JSON script.

## Colour Reference
- Displays brand colours in a table with colour code, visual swatch, and remark fields.
- Supports optional serial numbers through `showSerialNumbers`.
- Copies a colour hex value when a colour row control is clicked.
- Supports keyboard copy interaction with Enter or Space.
- Shows temporary copy success or failure feedback in the colour code cell.
- Allows colour rows to be dragged into a new order with a hover-only row handle and updated serial numbers.

## Theme Support
- Supports optional brand themes through a `themes` array in brand data.
- Uses a light/dark toggle when the brand has only `light` and `dark` themes.
- Uses a theme dropdown when a brand exposes multiple named themes.
- Applies `theme-light` or `theme-dark` body classes based on the active theme.
- Preserves the selected theme when re-rendering the same brand where possible.
- Restores the last selected theme from localStorage across page reloads.

## Logo Files
- Displays optional brand logo assets from the brand `logos` array.
- Shows logo previews, names, and supporting metadata such as usage, variant, background, and notes.
- Links logo cards to files under `data/`.
- Enables download behavior unless a logo entry sets `download: false`.
- Allows logo cards to be reordered with drag/drop or left/right controls.

## Typography Samples
- Renders font sample sections from each brand's `fonts` array.
- Displays editable font family names and applies changes to the sample preview.
- Saves edited font family, sample text, and colour choices into exported brand data.
- Supports font weight selection when weights are provided.
- Supports sample text editing for live preview.
- Provides colour selection from the brand palette and a native colour picker for custom values.
- Allows Google Font loading for a named font family and tracks loading, synced, and idle states.

## Icon Comparison
- Supports optional icon comparison data through `icons`, `iconComparison`, or `iconComparisons`.
- Groups icon rows by category.
- Shows each group label outside the group container at the top-right and allows it to be edited inline.
- Renders icon variants using the Lucide browser runtime.
- Shows the current icon option and lets users select alternate variants.
- Allows icon names to be edited inline; the edited name is used as the Lucide icon component.
- Limits comparison rows to five icon variant slots.
- Allows icon rows to be dragged into a new order with a hover-only row handle and icon variants to be dragged within a row to rearrange or swap their slot order.
- Allows icon variants to be moved left or right with inline arrow controls.
- Removes an icon variant when its inline name is cleared, while the card eraser clears populated slots and changes to an x for removing already-empty slots.
- Shows add controls in empty icon cells, with a hover-only top-right x in gap cells to shift later icons left.
- Prevents stale drag/drop hover state from immediately revealing the empty-slot x until the pointer moves again.
- Supports row highlighting and exclusive row focus to compare one icon row at a time.
- Saves selected icon variants into exported brand data.

## Preview And Controls
- Provides a preview mode toggle that adds or removes `preview-mode` on the page body.
- Provides a preview-only `#` toggle for showing or hiding colour, font, and icon indexes.
- Uses custom-styled select controls while keeping the underlying native selects available to scripts.
- Closes custom select menus when users click outside them.
- Prevents accidental drag text selection on app controls while preserving text selection in editable fields.

## Static Runtime
- Runs as a static HTML, CSS, and JavaScript app.
- Requires no bundler, transpiler, or backend service.
- Can be opened directly through `brand.html`; a simple static server may be used for live reload workflows.
