// data.json.js - exports colour data used by Brand page
// This file intentionally uses a JS variable so it can be loaded via a simple <script> tag.
// If you prefer an ES module, rename to data.mjs and import from script.js.
// Top-level object with metadata and colours
window.BRAND = {
	title: 'Total Ingredients',
	showSerialNumbers: true,
	colours: [
		{
			id: 1,
			name: 'Primary',
			hex: '#f78444',
			remark: 'Primary brand colour',
			usage: 'Used for primary actions and links'
		},
		{
			id: 2,
			name: 'Secondary',
			hex: '#ffd06c',
			remark: 'Secondary / neutral tone',
			usage: 'Accent / UI elements'
		},
		{
			id: 3,
			name: 'Bright Red',
			hex: '#de3619',
			remark: 'Gray tone',
			usage: 'Used for backgrounds and borders'
		},
		{
			id: 4,
			name: 'Avocado Green',
			hex: '#c7d1c6',
			remark: 'Gray tone',
			usage: 'Used for backgrounds and borders'
		},
		{
			id: 4,
			name: 'Gray',
			hex: '#ccc',
			remark: 'Gray tone',
			usage: 'Used for backgrounds and borders'
		}
	]
};
