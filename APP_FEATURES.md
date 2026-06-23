# App Features

## Brand Selection
- Populates the brand dropdown from `window.BRAND_LIST`.
- Dynamically loads the selected brand data script from `data/<brandId>.json.js`.
- Re-renders colours, logo files, typography samples, and icon comparisons when the active brand changes.
- Restores the last selected brand from localStorage across page reloads.
- Exports the active brand data as a downloadable `window.BRAND` JSON script.

## Colour Reference
- Displays brand colours in a table with colour code, visual swatch, and remark fields.
- Supports a canonical brand palette as flat colour arrays or grouped colour sections with `category` plus `rows`, `items`, or `colours`.
- Shows editable colour group titles and lets backed grouped sections be reordered.
- Supports optional serial numbers through `showSerialNumbers`.
- Copies a colour hex value when a colour row control is clicked.
- Supports keyboard copy interaction with Enter or Space.
- Shows temporary copy success or failure feedback in the colour code cell.
- Allows colour rows to be dragged into a new order within their colour group with a hover-only row handle and updated serial numbers.

## Theme Support
- Supports optional brand themes through a `themes` array in brand data.
- Resolves theme and appearance colour rows from numeric references into the canonical brand palette.
- Resolves theme and appearance logo references from the canonical logo list so light and dark appearances can show different logo variants.
- Resolves theme and appearance typography rows from canonical font references, with appearance-specific colour, text colour, and background colour fields.
- Resolves theme and appearance icon rows from canonical icon references so each appearance can choose and order icon groups independently.
- Uses a theme dropdown for named theme families such as `soft` and `sharp`.
- Uses the appearance button as a light/dark toggle when the selected theme has both appearances.
- Shows a muted, disabled appearance button when the selected theme has only one appearance.
- Visually hides the appearance button while keeping its layout space when the selected theme has no appearances.
- Applies `theme-light` or `theme-dark` body classes based on the active appearance, defaulting to light when no appearance is active.
- Preserves the selected theme when re-rendering the same brand where possible.
- Restores the last selected theme and appearance from localStorage across page reloads.

## Logo Files
- Displays optional brand logo assets from the brand `logos` array.
- Supports appearance-specific logo references while keeping canonical logo file data in the top-level `logos` array.
- Shows logo previews, names, and supporting metadata such as usage, variant, background, and notes.
- Links logo cards to files under `data/`.
- Enables download behavior unless a logo entry sets `download: false`.
- Allows logo cards to be reordered with drag/drop or left/right controls.

## Typography Samples
- Renders font sample sections from each brand's `fonts` array, including optional grouped font sections.
- Shows each font group label outside the group at the top-right and allows it to be edited inline.
- Displays editable font family names and applies changes to the sample preview.
- Saves edited font family and sample text into canonical font data, and saves colour choices into the active theme appearance when font references are used.
- Supports font weight selection when weights are provided.
- Supports sample text editing for live preview.
- Provides typography colour selection from the active appearance palette and a native colour picker for custom values.
- Allows Google Font loading for a named font family and tracks loading, synced, and idle states.
- Allows font samples to be dragged into a new order within the same font group.
- Shows a hover-only drag handle beside grouped font titles and allows grouped font sections to be reordered when backed by grouped brand data.

## Icon Comparison
- Supports optional icon comparison data through `icons`, `iconComparison`, or `iconComparisons`.
- Groups icon rows by category.
- Shows each group label outside the group container at the top-right and allows it to be edited inline.
- Renders icon variants using the Lucide browser runtime.
- Shows the current icon option and lets users select alternate variants.
- Allows icon names to be edited inline; the edited name is used as the Lucide icon component.
- Limits comparison rows to five icon variant slots.
- Allows icon rows to be dragged into a new order with a hover-only row handle and icon variants to be dragged within a row to rearrange or swap their slot order.
- Shows a hover-only drag handle beside grouped icon titles and allows grouped icon sections to be reordered.
- Allows icon variants to be moved left or right with inline arrow controls.
- Removes an icon variant when its inline name is cleared, while the card eraser clears populated slots and changes to an x for removing already-empty slots.
- Shows add controls in empty icon cells, with a hover-only top-right x in gap cells to shift later icons left.
- Prevents stale drag/drop hover state from immediately revealing the empty-slot x until the pointer moves again.
- Supports row highlighting and exclusive row focus to compare one icon row at a time.
- Saves selected icon variants into exported brand data.

## Preview And Controls
- Provides a preview mode toggle that adds or removes `preview-mode` on the page body and hides editing controls including logo move buttons.
- Provides a preview-only `#` toggle for showing or hiding colour, font, and icon indexes.
- Shows subtle right-side section navigation and per-section title markers with icons for logos, colour palette, typography, and icons when those sections are available.
- Uses custom-styled select controls while keeping the underlying native selects available to scripts.
- Closes custom select menus when users click outside them.
- Prevents accidental drag text selection on app controls while preserving text selection in editable fields.

## Static Runtime
- Runs as a static HTML, CSS, and JavaScript app.
- Requires no bundler, transpiler, or backend service.
- Can be opened directly through `brand.html`; a simple static server may be used for live reload workflows.
