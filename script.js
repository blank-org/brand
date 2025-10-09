// script.js - handles rendering and copy-on-click behaviour
(function () {
	// Wait for DOM
	function ready(fn) {
		if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn);
	}

	ready(() => {
		const heading = document.querySelector('main.content h3');
		const footer = document.getElementById('footer-brand');
		const tbody = document.querySelector('table tbody');
		const select = document.getElementById('brand-select');

		const previewToggle = document.getElementById('preview-toggle');
		if (previewToggle) {
			previewToggle.addEventListener('click', () => {
				document.body.classList.toggle('preview-mode');
			});
		}

		// Ensure the H3 shows the global company/brand name and is unaffected by the brand selector
		if (heading && window.brand) heading.textContent = window.brand;
		if (footer && window.brand) footer.textContent = window.brand;

		function copyText(text) {
			if (!text) return Promise.reject(new Error('no text'));
			if (navigator.clipboard && navigator.clipboard.writeText) {
				return navigator.clipboard.writeText(text);
			}
			return new Promise((resolve, reject) => {
				try {
					const ta = document.createElement('textarea');
					ta.value = text; document.body.appendChild(ta);
					ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
					resolve();
				} catch (err) { reject(err); }
			});
		}

		function flashCopied(el) {
			const row = el.closest('tr');
			if (!row) return;
			const codeCell = row.querySelector('.code');
			const original = codeCell.textContent;
			codeCell.textContent = 'Copied!';
			codeCell.classList.add('copied');
			setTimeout(() => { codeCell.textContent = original; codeCell.classList.remove('copied'); }, 1400);
		}

		// Render function - re-usable when loading new brand data
		function renderBrand(brand) {
			// Do not change the heading here; it should remain the global company name.
			// heading is intentionally left untouched so it's unaffected by selector changes.
			const data = brand.colours || [];
			if (!tbody) return;
			tbody.innerHTML = '';
			if (typeof window.brandColourRowTemplate !== 'function') {
				console.error('brandColourRowTemplate component is not available.');
				return;
			}

			data.forEach(item => {
				const tr = document.createElement('tr');
				tr.innerHTML = window.brandColourRowTemplate(item);
				tbody.appendChild(tr);
			});

			renderFonts(brand);
		}

		function renderFonts(brand) {
			const fontSamples = document.getElementById('font-samples');
			if (!fontSamples) return;

			const fonts = brand.fonts || [];
			if (fonts.length === 0) {
				fontSamples.innerHTML = '';
				return;
			}

			// let html = '<h2>Fonts</h2>';
			fontSamples.innerHTML = '<h2>Fonts</h2>';

			fonts.forEach((font, index) => {
				const sampleText = font.sampleText || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
				let color = font.color;
				if (brand.colours && brand.colours.find(c => c.name === color)) {
					color = brand.colours.find(c => c.name === color).hex;
				}

				const fontSampleDiv = document.createElement('div');
				fontSampleDiv.classList.add('font-sample');
				if (typeof window.fontSampleTemplate !== 'function') {
					console.error('fontSampleTemplate component is not available.');
					fontSampleDiv.innerHTML = '';
				} else {
					fontSampleDiv.innerHTML = window.fontSampleTemplate({ font, sampleText, color });
				}

				const colorSelect = document.createElement('select');
				colorSelect.id = `brand-color-select-${index}`;
				colorSelect.dataset.fontIndex = index;
				colorSelect.dataset.isColorSelect = true;

				const customOption = document.createElement('option');
				customOption.value = '';
				customOption.textContent = 'Custom';
				colorSelect.appendChild(customOption);

				brand.colours.forEach(c => {
					const opt = document.createElement('option');
					opt.value = c.hex;
					opt.textContent = c.name;
					if (color === c.hex) {
						opt.selected = true;
					}
					colorSelect.appendChild(opt);
				});

				const fontControls = fontSampleDiv.querySelector('.font-controls');
				const colorPickerContainer = document.createElement('div');
				colorPickerContainer.classList.add('color-picker-container');

				const colorCircle = document.createElement('span');
				colorCircle.classList.add('color-circle');
				colorCircle.style.backgroundColor = color;
				colorPickerContainer.appendChild(colorCircle);

				const colorPicker = document.createElement('input');
				colorPicker.type = 'color';
				colorPicker.id = `color-picker-${index}`;
				colorPicker.value = color;
				colorPicker.dataset.fontIndex = index;
				colorPickerContainer.appendChild(colorPicker);

				fontControls.appendChild(colorPickerContainer);
				fontControls.appendChild(colorSelect);

				createCustomSelect(colorSelect);

				const fontSourceToggles = fontSampleDiv.querySelectorAll('.font-source-toggle');
				const loadGoogleFontButton = fontSampleDiv.querySelector('.load-google-font');

				fontSourceToggles.forEach(toggle => {
					toggle.addEventListener('click', (e) => {
						fontSourceToggles.forEach(t => t.classList.remove('active'));
						e.target.classList.add('active');
						if (e.target.dataset.source === 'google') {
							loadGoogleFontButton.style.display = 'inline-block';
						} else {
							loadGoogleFontButton.style.display = 'none';
						}
					});
				});

				const fontFamilyName = fontSampleDiv.querySelector('.font-family-name');
				const fontFamilyInput = fontSampleDiv.querySelector('.font-family-input');
				const fontSampleText = fontSampleDiv.querySelector('.font-sample-text');

				fontFamilyName.addEventListener('click', () => {
					fontFamilyName.style.display = 'none';
					fontFamilyInput.style.display = 'inline-block';
					fontFamilyInput.focus();
				});

				fontFamilyInput.addEventListener('blur', () => {
					fontFamilyName.style.display = 'inline-block';
					fontFamilyInput.style.display = 'none';
					fontFamilyName.textContent = fontFamilyInput.value;
					fontSampleText.style.fontFamily = fontFamilyInput.value;
				});

				fontFamilyInput.addEventListener('keydown', (e) => {
					if (e.key === 'Enter') {
						fontFamilyInput.blur();
					}
				});

				loadGoogleFontButton.addEventListener('click', () => {
					const fontName = fontFamilyInput.value;
					if (fontName) {
						loadGoogleFont(fontName);
					}
				});

				colorSelect.addEventListener('change', (e) => {
					const fontIndex = e.target.dataset.fontIndex;
					const color = e.target.value;
					const fontSampleText = fontSampleDiv.querySelector('.font-sample-text');
					const customSelect = fontSampleDiv.querySelector('.select-custom .select-selected');
					const colorCircle = fontSampleDiv.querySelector('.color-circle');

					if (color) {
						fontSampleText.style.color = color;
						colorPicker.value = color;
						customSelect.textContent = e.target.options[e.target.selectedIndex].text;
						colorCircle.style.backgroundColor = color;
					} else {
						colorPicker.click();
					}
				});

				colorPicker.addEventListener('input', (e) => {
					const fontIndex = e.target.dataset.fontIndex;
					const color = e.target.value;
					const fontSampleText = fontSampleDiv.querySelector('.font-sample-text');
					fontSampleText.style.color = color;
					const customSelect = fontSampleDiv.querySelector('.select-custom .select-selected');
					customSelect.textContent = color;
					colorCircle.style.backgroundColor = color;

					// Add the new color to the select
					const newOption = document.createElement('option');
					newOption.value = color;
					newOption.textContent = color;
					newOption.selected = true;
					colorSelect.appendChild(newOption);

					// Add to custom select
					const items = fontSampleDiv.querySelector('.select-items');
					const item = document.createElement('div');
					item.textContent = color;
					const colorCircle = document.createElement('span');
					colorCircle.classList.add('color-circle');
					colorCircle.style.backgroundColor = color;
					item.prepend(colorCircle);
					item.addEventListener('click', function () {
						colorSelect.value = color;
						customSelect.textContent = color;
						items.classList.add('select-hide');
						colorSelect.dispatchEvent(new Event('change'));
					});
					items.appendChild(item);
				});

				fontSamples.appendChild(fontSampleDiv);
			});
		}

		function createCustomSelect(selectElement) {
			const customSelect = document.createElement('div');
			customSelect.classList.add('select-custom');

			const selected = document.createElement('div');
			selected.classList.add('select-selected');
			selected.textContent = selectElement.options[selectElement.selectedIndex].textContent;
			customSelect.appendChild(selected);

			const items = document.createElement('div');
			items.classList.add('select-items', 'select-hide');

			let maxWidth = 0;
			const tempDiv = document.createElement('div');
			tempDiv.style.position = 'absolute';
			tempDiv.style.left = '-9999px';
			document.body.appendChild(tempDiv);

			for (let i = 0; i < selectElement.options.length; i++) {
				const item = document.createElement('div');
				item.textContent = selectElement.options[i].textContent;
				tempDiv.appendChild(item);
				maxWidth = Math.max(maxWidth, item.offsetWidth);
				tempDiv.removeChild(item);

				if (selectElement.dataset.isColorSelect) {
					const colorCircle = document.createElement('span');
					colorCircle.classList.add('color-circle');
					colorCircle.style.backgroundColor = selectElement.options[i].value;
					item.prepend(colorCircle);
				}

				item.addEventListener('click', function () {
					selectElement.selectedIndex = i;
					selected.textContent = this.textContent;
					items.classList.add('select-hide');
					selectElement.dispatchEvent(new Event('change'));
				});
				items.appendChild(item);
			}

			document.body.removeChild(tempDiv);
			items.style.width = `${maxWidth}px`;

			customSelect.appendChild(items);

			selected.addEventListener('click', function () {
				items.classList.toggle('select-hide');
			});

			document.addEventListener('click', function (e) {
				if (!customSelect.contains(e.target)) {
					items.classList.add('select-hide');
				}
			});

			selectElement.parentNode.insertBefore(customSelect, selectElement);
			selectElement.style.display = 'none';
		}

		// Populate brand select from window.BRAND_LIST
		function populateSelect() {
			if (!select) return;
			const list = window.BRAND_LIST || [];
			select.innerHTML = '';
			list.forEach(id => {
				const opt = document.createElement('option');
				opt.value = id;
				opt.textContent = id.charAt(0).toUpperCase() + id.slice(1);
				select.appendChild(opt);
			});

			createCustomSelect(select);
		}

		// Dynamically load a brand data file by id (e.g. 'avyaan' -> data/avyaan.json.js)
		let currentBrandScript = null;
		function loadBrand(id) {
			return new Promise((resolve, reject) => {
				try {
					// remove previous script if present
					if (currentBrandScript) {
						currentBrandScript.remove();
						currentBrandScript = null;
					}
					// clear global so render only after new script sets it
					window.BRAND = undefined;
					const script = document.createElement('script');
					script.src = `data/${id}.json.js`;
					script.onload = () => {
						if (window.BRAND) {
							renderBrand(window.BRAND);
							resolve(window.BRAND);
						} else {
							reject(new Error('brand file did not set window.BRAND'));
						}
					};
					script.onerror = (e) => reject(new Error('failed to load brand file: ' + script.src));
					document.body.appendChild(script);
					currentBrandScript = script;
				} catch (err) { reject(err); }
			});
		}

		// attach copy-on-click and keyboard handlers once
		if (!document.body._brandHandlersAttached) {
			document.body.addEventListener('click', (e) => {
				const el = e.target.closest('[data-hex]');
				if (!el) return;
				const hex = el.getAttribute('data-hex');
				copyText(hex).then(() => flashCopied(el)).catch(err => {
					console.error('copy failed', err);
					const row = el.closest('tr');
					if (row) {
						const codeCell = row.querySelector('.code');
						const prev = codeCell.textContent;
						codeCell.textContent = 'Failed';
						setTimeout(() => codeCell.textContent = prev, 1400);
					}
				});
			});

			document.body.addEventListener('keydown', (e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					const el = document.activeElement;
					if (el && el.hasAttribute && el.hasAttribute('data-hex')) {
						e.preventDefault();
						el.click();
					}
				}
			});
			document.body._brandHandlersAttached = true;
		}

		// When the select changes, load the chosen brand
		if (select) {
			select.addEventListener('change', (e) => {
				const id = e.target.value;
				if (id) loadBrand(id).catch(err => console.error(err));
			});
		}

		// initial population and load first brand if available
		populateSelect();
		const first = (window.BRAND_LIST && window.BRAND_LIST[0]) || null;
		if (first && select) select.value = first;
		if (first) loadBrand(first).catch(err => console.error(err));

		function loadGoogleFont(fontName) {
			const fontUrl = `https://fonts.googleapis.com/css?family=${fontName.replace(/ /g, '+')}`;
			const link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = fontUrl;
			document.head.appendChild(link);
		}
	});

	
}) ();
