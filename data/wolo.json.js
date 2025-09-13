// data.json.js - exports colour data used by Brand page
// This file intentionally uses a JS variable so it can be loaded via a simple <script> tag.
// If you prefer an ES module, rename to data.mjs and import from script.js.
// Top-level object with metadata and colours
window.BRAND = {
	title: 'Wolo',
	colours: [
		{
			id: 1,
			name: 'Primary',
			hex: '#049cfa',
			remark: 'Primary brand colour',
			usage: 'Used for primary actions and links'
		},
		{
			id: 2,
			name: 'Secondary',
			hex: '#4d4d4d',
			remark: 'Secondary / neutral tone',
			usage: 'Neutral / UI elements'
		},
		{
			id: 3,
			name: 'Gray',
			hex: '#d9d9d9',
			remark: 'Gray tone',
			usage: 'Used for backgrounds and borders'
		}
	]
};
