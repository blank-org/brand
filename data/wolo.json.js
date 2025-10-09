// data.json.js - exports colour data used by Brand page
// This file intentionally uses a JS variable so it can be loaded via a simple <script> tag.
// If you prefer an ES module, rename to data.mjs and import from script.js.
// Top-level object with metadata and colours
window.BRAND = {
	title: 'Wolo',
	showSerialNumbers: false,
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
	],
	fonts: [
		{
			name: 'Primary Header',
			family: 'Arial, sans-serif',
			weight: 'bold',
			color: 'Primary',
			sampleText: 'The quick brown fox jumps over the lazy dog',
			usage: 'use for hero headlines and marketing highlight copy'
		},
		{
			name: 'Body Text',
			family: 'Georgia, serif',
			weight: 'normal',
			color: '#333333',
			usage: 'default body copy for paragraphs, lists, and long-form content'
		}
	]
};
