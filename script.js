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
		const themeSelector = document.getElementById('theme-selector');
		const themeSelect = document.getElementById('theme-select');
		const themeToggle = document.getElementById('theme-toggle');
		const logoSection = document.getElementById('logo-files');
		const logoList = document.getElementById('logo-files-list');
		const body = document.body;
		const bodyThemeClasses = ['theme-light', 'theme-dark'];
		let brandSelectMenu = null;
		let themeSelectMenu = null;
		let themeControlMode = 'none';
		const fontSelectMenus = [];
		let activeBrandData = null;
		let activeBrandId = null;
		let activeBrandThemes = [];
		let activeThemeId = null;

		const previewToggle = document.getElementById('preview-toggle');
		if (previewToggle) {
			const updatePreviewToggleState = () => {
				const isActive = body && body.classList.contains('preview-mode');
				previewToggle.setAttribute('aria-pressed', isActive ? 'true' : 'false');
			};
			const togglePreviewMode = () => {
				if (!body) return;
				body.classList.toggle('preview-mode');
				updatePreviewToggleState();
			};
			previewToggle.addEventListener('click', togglePreviewMode);
			previewToggle.addEventListener('keydown', (e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					togglePreviewMode();
				}
			});
			updatePreviewToggleState();
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

		function normalizeThemeId(value) {
			if (value === null || value === undefined) return null;
			const str = String(value).trim();
			return str ? str : null;
		}

		function getBrandThemes(brand) {
			if (!brand || !Array.isArray(brand.themes)) return [];
			return brand.themes.reduce((acc, theme) => {
				if (!theme) return acc;
				const themeId = normalizeThemeId(theme.id);
				const colours = Array.isArray(theme.colours) ? theme.colours : [];
				if (!themeId || !colours.length) return acc;
				acc.push(Object.assign({}, theme, { id: themeId, colours }));
				return acc;
			}, []);
		}

		function pickThemeId(themes, candidates) {
			if (!Array.isArray(themes) || !themes.length) return null;
			const list = Array.isArray(candidates) ? candidates : [candidates];
			const seen = new Set();
			for (let i = 0; i < list.length; i += 1) {
				const candidate = normalizeThemeId(list[i]);
				if (!candidate || seen.has(candidate)) continue;
				seen.add(candidate);
				const match = themes.find(theme => theme.id === candidate);
				if (match) return match.id;
			}
			return themes[0].id;
		}

		function buildBrandForTheme(brand, themeId, themes) {
			if (!brand) return null;
			const themeList = Array.isArray(themes) ? themes : getBrandThemes(brand);
			if (!themeList.length) return brand;
			const normalizedId = normalizeThemeId(themeId);
			const defaultThemeId = normalizeThemeId(brand && brand.defaultTheme);
			const theme = themeList.find(t => t.id === normalizedId)
				|| (defaultThemeId ? themeList.find(t => t.id === defaultThemeId) : null)
				|| themeList[0];
			if (!theme) return brand;
			const sourceColours = Array.isArray(theme.colours) && theme.colours.length
				? theme.colours
				: (Array.isArray(brand.colours) ? brand.colours : []);
			const clone = Object.assign({}, brand);
			clone.colours = sourceColours.map(colour => Object.assign({}, colour));
			clone.activeTheme = theme.id;
			clone.activeThemeLabel = theme.label || theme.name || theme.id;
			return clone;
		}

		function supportsBinaryThemeToggle(themes) {
			if (!Array.isArray(themes) || themes.length < 2) return false;
			let hasLight = false;
			let hasDark = false;
			themes.forEach((theme) => {
				const id = normalizeThemeId(theme && theme.id);
				if (id === 'light') hasLight = true;
				if (id === 'dark') hasDark = true;
			});
			return hasLight && hasDark && themes.length <= 2;
		}

		function applyDocumentTheme(themeId) {
			if (!body) return;
			const normalized = normalizeThemeId(themeId);
			const themeClass = normalized === 'dark' ? 'theme-dark' : 'theme-light';
			bodyThemeClasses.forEach(cls => body.classList.remove(cls));
			body.classList.add(themeClass);
			body.dataset.activeTheme = normalized || 'light';
		}

		function updateThemeToggleUI() {
			if (!themeToggle) return;
			if (themeControlMode !== 'toggle') {
				themeToggle.hidden = true;
				themeToggle.setAttribute('aria-hidden', 'true');
				return;
			}
			const icon = themeToggle.querySelector('i');
			const isDark = normalizeThemeId(activeThemeId) === 'dark';

			const nextLabel = isDark ? 'Switch to light theme' : 'Switch to dark theme';
			if (icon) {
				icon.textContent = isDark ? 'dark_mode' : 'light_mode';
			}
			themeToggle.hidden = false;
			themeToggle.setAttribute('aria-hidden', 'false');
			themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
			themeToggle.setAttribute('aria-label', nextLabel);
			themeToggle.setAttribute('title', nextLabel);
		}

		function updateThemeControls() {
			if (!themeSelector || !themeSelect) return;
			const hasThemes = Array.isArray(activeBrandThemes) && activeBrandThemes.length > 0;
			const useToggle = hasThemes && supportsBinaryThemeToggle(activeBrandThemes);

			if (!hasThemes) {
				if (themeSelectMenu && typeof themeSelectMenu.destroy === 'function') {
					themeSelectMenu.destroy();
					themeSelectMenu = null;
				}
				themeSelect.innerHTML = '';
				themeSelect.value = '';
				themeSelector.hidden = true;
				if (themeToggle) {
					themeToggle.hidden = true;
					themeToggle.setAttribute('aria-hidden', 'true');
				}
				themeControlMode = 'none';
				return;
			}

			if (useToggle) {
				if (themeSelectMenu && typeof themeSelectMenu.destroy === 'function') {
					themeSelectMenu.destroy();
					themeSelectMenu = null;
				}
				themeSelector.hidden = true;
				themeControlMode = 'toggle';
				if (themeToggle) {
					themeToggle.hidden = false;
				}
				updateThemeToggleUI();
				return;
			}

			themeControlMode = 'dropdown';
			themeSelector.hidden = false;
			if (themeToggle) {
				themeToggle.hidden = true;
				themeToggle.setAttribute('aria-hidden', 'true');
			}

			themeSelect.innerHTML = '';
			activeBrandThemes.forEach(theme => {
				const option = document.createElement('option');
				option.value = theme.id;
				option.textContent = theme.label || theme.name || theme.id;
				themeSelect.appendChild(option);
			});

			activeThemeId = pickThemeId(activeBrandThemes, [activeThemeId]);
			themeSelect.value = activeThemeId || '';

			if (themeSelectMenu && typeof themeSelectMenu.destroy === 'function') {
				themeSelectMenu.destroy();
			}
			themeSelectMenu = createCustomSelect(themeSelect, {
				formatSelected(option) {
					return option ? option.textContent : 'Select theme';
				},
				formatItem(option) {
					const item = document.createElement('div');
					item.textContent = option.textContent;
					return item;
				},
				className: 'theme-select-menu',
				matchOptionWidth: true,
				extraWidth: 2
			});
			if (themeSelectMenu && typeof themeSelectMenu.update === 'function') {
				themeSelectMenu.update();
			}
		}

		function renderActiveBrand() {
			if (!activeBrandData) return;
			let targetBrand = activeBrandData;
			if (activeBrandThemes.length) {
				activeThemeId = pickThemeId(activeBrandThemes, [activeThemeId]);
				targetBrand = buildBrandForTheme(activeBrandData, activeThemeId, activeBrandThemes);
			}
			activeThemeId = normalizeThemeId((targetBrand && targetBrand.activeTheme) || activeThemeId);
			renderBrand(targetBrand);
			applyDocumentTheme(activeThemeId);
			updateThemeToggleUI();
			if (themeControlMode === 'dropdown' && themeSelect && activeBrandThemes.length) {
				if (themeSelect.value !== (activeThemeId || '')) {
					themeSelect.value = activeThemeId || '';
				}
				if (themeSelectMenu && typeof themeSelectMenu.update === 'function') {
					themeSelectMenu.update();
				}
			}
		}

		function setActiveBrand(brand, id) {
			const previousBrandId = activeBrandId;
			const previousThemeId = activeThemeId;
			activeBrandId = id || null;
			activeBrandData = brand || null;
			activeBrandThemes = getBrandThemes(brand);
			const defaultThemeId = normalizeThemeId(brand && brand.defaultTheme);

			const candidates = [];
			if (id && id === previousBrandId && previousThemeId) {
				candidates.push(previousThemeId);
			}
			if (defaultThemeId) {
				candidates.push(defaultThemeId);
			}

			activeThemeId = pickThemeId(activeBrandThemes, candidates);
			updateThemeControls();
			renderActiveBrand();
		}

		function setActiveTheme(themeId) {
			if (!activeBrandThemes.length) return;
			const resolved = pickThemeId(activeBrandThemes, [themeId, activeThemeId]);
			if (resolved === activeThemeId) {
				return;
			}
			activeThemeId = resolved;
			renderActiveBrand();
		}

		// Render function - re-usable when loading new brand data
		function renderBrand(brand) {
			// Do not change the heading here; it should remain the global company name.
			// heading is intentionally left untouched so it's unaffected by selector changes.
			const data = brand.colours || [];
			if (!tbody) return;
			const table = tbody.closest('table');
			const showSerial = brand.showSerialNumbers === true;
			renderLogoFiles(brand);
			if (table) {
				table.classList.toggle('hide-serial', !showSerial);
			}
			tbody.innerHTML = '';
			if (typeof window.brandColourRowTemplate !== 'function') {
				console.error('brandColourRowTemplate component is not available.');
				return;
			}

			data.forEach(item => {
				const tr = document.createElement('tr');
				tr.innerHTML = window.brandColourRowTemplate(item, { showSerial });
				tbody.appendChild(tr);
			});

			renderFonts(brand);
		}

		function renderLogoFiles(brand) {
			if (!logoSection || !logoList) return;
			const logos = Array.isArray(brand.logos) ? brand.logos : [];
			logoList.innerHTML = '';
			if (!logos.length) {
				logoSection.classList.add('is-hidden');
				return;
			}
			logoSection.classList.remove('is-hidden');
			logos.forEach((logo, index) => {
				if (!logo || !logo.file) return;
				const link = document.createElement('a');
				link.className = 'logo-file';
				link.href = 'data'+'/'+logo.file;
				link.setAttribute('role', 'listitem');
				link.dataset.logoIndex = String(index);
				if (logo.download !== false) {
					link.setAttribute('download', '');
				}
				link.target = '_blank';
				link.rel = 'noopener';

				const preview = document.createElement('img');
				preview.className = 'logo-file-preview';
				preview.src = logo.preview || link.href;
				preview.alt = (logo.name || `Logo ${index + 1}`) + ' preview';
				preview.loading = 'lazy';
				link.appendChild(preview);

				const meta = document.createElement('div');
				meta.className = 'logo-file-meta';

				const name = document.createElement('div');
				name.className = 'logo-file-name';
				name.textContent = logo.name || `Logo ${index + 1}`;
				meta.appendChild(name);

				const detailParts = [];
				if (logo.usage) detailParts.push(logo.usage);
				if (logo.variant) detailParts.push(logo.variant);
				if (logo.background) detailParts.push(logo.background);
				if (logo.notes) detailParts.push(logo.notes);

				if (detailParts.length) {
					const detail = document.createElement('div');
					detail.className = 'logo-file-detail';
					detail.textContent = detailParts.join(' • ');
					meta.appendChild(detail);
				}

				link.appendChild(meta);
				logoList.appendChild(link);
			});
			if (!logoList.children.length) {
				logoSection.classList.add('is-hidden');
			}
		}


		function renderFonts(brand) {
			const fontSamples = document.getElementById('font-samples');
			if (!fontSamples) return;

			const fonts = brand.fonts || [];
			fontSelectMenus.forEach(menu => {
				if (menu && typeof menu.destroy === 'function') {
					menu.destroy();
				}
			});
			fontSelectMenus.length = 0;
			fontSamples.innerHTML = '';
			if (fonts.length === 0) {
				return;
			}

			const brandColours = Array.isArray(brand.colours) ? brand.colours : [];

			fonts.forEach((font, index) => {
				const sampleText = font.sampleText || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';
				let color = font.color;
				const brandColourMatch = brandColours.find(c => c.name === color);
				if (brandColourMatch) {
					color = brandColourMatch.hex;
				}
				if (!color) {
					color = brandColours.length ? brandColours[0].hex : '#1f2937';
				}

				const fontSampleDiv = document.createElement('div');
				fontSampleDiv.classList.add('font-sample');
				if (typeof window.fontSampleTemplate !== 'function') {
					console.error('fontSampleTemplate component is not available.');
					fontSampleDiv.innerHTML = '';
				} else {
					fontSampleDiv.innerHTML = window.fontSampleTemplate({ font, sampleText, color });
				}

				const fontSampleText = fontSampleDiv.querySelector('.font-sample-text');
				const fontControls = fontSampleDiv.querySelector('.font-controls');
				const colorPickerSlot = fontSampleDiv.querySelector('.color-picker-slot');
				if (!fontControls) {
					fontSamples.appendChild(fontSampleDiv);
					return;
				}
				const fontSourceToggles = fontSampleDiv.querySelectorAll('.font-source-toggle');
				const loadGoogleFontButton = fontSampleDiv.querySelector('.load-google-font');

				const colorSelect = document.createElement('select');
				colorSelect.id = `brand-color-select-${index}`;
				colorSelect.dataset.fontIndex = index;

				const customOption = document.createElement('option');
				customOption.value = '';
				customOption.textContent = 'Custom';
				colorSelect.appendChild(customOption);

				brandColours.forEach(c => {
					const opt = document.createElement('option');
					opt.value = c.hex;
					opt.textContent = c.name;
					if (color === c.hex) {
						opt.selected = true;
					}
					colorSelect.appendChild(opt);
				});

				if (color && colorSelect.value !== color) {
					const fallbackOption = document.createElement('option');
					fallbackOption.value = color;
					fallbackOption.textContent = color;
					fallbackOption.selected = true;
					colorSelect.appendChild(fallbackOption);
				}

				colorSelect.value = color;
				fontControls.appendChild(colorSelect);

				const colorMenu = createCustomSelect(colorSelect, {
					formatSelected(option) {
						if (!option) return 'Custom';
						if (!option.value) return option.textContent || 'Custom';
						const wrapper = document.createElement('span');
						wrapper.classList.add('select-color-summary');
						const swatch = document.createElement('span');
						swatch.classList.add('color-circle');
						swatch.style.backgroundColor = option.value;
						wrapper.appendChild(swatch);
						const text = document.createElement('span');
						text.textContent = option.textContent || option.value;
						wrapper.appendChild(text);
						return wrapper;
					},
					formatItem(option) {
						const item = document.createElement('div');
						item.classList.add('select-option');
						const label = option.textContent || option.value || 'Custom';
						if (option.value) {
							const swatch = document.createElement('span');
							swatch.classList.add('color-circle');
							swatch.style.backgroundColor = option.value;
							item.appendChild(swatch);
						}
						const text = document.createElement('span');
						text.textContent = label;
						item.appendChild(text);
						return item;
					},
					className: 'brand-select-menu',
					matchOptionWidth: true,
					extraWidth: 2
				});
				if (colorMenu) {
					fontSelectMenus.push(colorMenu);
				}

				const colorPickerContainer = document.createElement('div');
				colorPickerContainer.classList.add('color-picker-container');

				const controlColorCircle = document.createElement('span');
				controlColorCircle.classList.add('color-circle');
				controlColorCircle.style.backgroundColor = color;
				colorPickerContainer.appendChild(controlColorCircle);

				const colorPicker = document.createElement('input');
				colorPicker.type = 'color';
				colorPicker.id = `color-picker-${index}`;
				colorPicker.value = color;
				colorPicker.dataset.fontIndex = index;
				colorPickerContainer.appendChild(colorPicker);

				const colorPickerTarget = colorPickerSlot || fontControls;
				colorPickerTarget.appendChild(colorPickerContainer);

				function applyColorValue(nextColor) {
					if (!nextColor) return;
					if (fontSampleText) {
						fontSampleText.style.color = nextColor;
					}
					if (controlColorCircle) {
						controlColorCircle.style.backgroundColor = nextColor;
					}
					if (colorPicker.value !== nextColor) {
						colorPicker.value = nextColor;
					}
				}

				function ensureColorOption(optionValue) {
					if (!optionValue) return false;
					const normalizedValue = optionValue.trim();
					const target = normalizedValue.toLowerCase();
					const existing = Array.prototype.find.call(colorSelect.options, (opt) => opt.value && opt.value.toLowerCase() === target);
					if (existing) {
						existing.selected = true;
						return false;
					}
					const option = document.createElement('option');
					option.value = normalizedValue;
					option.textContent = normalizedValue;
					option.selected = true;
					colorSelect.appendChild(option);
					return true;
				}

				colorSelect.addEventListener('change', () => {
					const selectedOption = colorSelect.options[colorSelect.selectedIndex];
					const selectedColor = selectedOption ? selectedOption.value : '';
					if (!selectedColor) {
						colorPicker.click();
						return;
					}
					applyColorValue(selectedColor);
				});

				colorPicker.addEventListener('input', (e) => {
					const nextColor = e.target.value;
					if (!nextColor) return;
					const added = ensureColorOption(nextColor);
					if (added && colorMenu && typeof colorMenu.refresh === 'function') {
						colorMenu.refresh();
					} else if (colorMenu && typeof colorMenu.update === 'function') {
						colorMenu.update();
					}
					colorSelect.value = nextColor;
					colorSelect.dispatchEvent(new Event('change'));
				});

				function setGoogleButtonVisibility(shouldShow) {
					if (!loadGoogleFontButton) return;
					loadGoogleFontButton.classList.toggle('is-visible', shouldShow);
				}

				const activeSource = fontSampleDiv.querySelector('.font-source-toggle.active');
				if (activeSource) {
					setGoogleButtonVisibility(activeSource.dataset.source === 'google');
				}

				fontSampleDiv.addEventListener('click', (e) => {
					const button = e.target.closest('.font-source-toggle');
					if (!button || !fontSampleDiv.contains(button)) return;
					e.preventDefault();
					fontSourceToggles.forEach(t => t.classList.remove('active'));
					button.classList.add('active');
					setGoogleButtonVisibility(button.dataset.source === 'google');
				});

				const fontFamilyName = fontSampleDiv.querySelector('.font-family-name');
				const fontFamilyInput = fontSampleDiv.querySelector('.font-family-input');
				const srSyncLabel = loadGoogleFontButton ? loadGoogleFontButton.querySelector('.sr-only') : null;
				const defaultSyncLabel = srSyncLabel ? srSyncLabel.textContent : (loadGoogleFontButton ? loadGoogleFontButton.getAttribute('aria-label') || 'Load from Google Fonts' : 'Load from Google Fonts');
				const getNormalizedFontFamily = () => (fontFamilyInput && fontFamilyInput.value ? fontFamilyInput.value.trim() : '');
				let syncedFontFamilyNormalized = '';
				let syncButtonState = 'idle';

				const updateSyncButtonLabel = (label) => {
					if (!loadGoogleFontButton) return;
					loadGoogleFontButton.setAttribute('aria-label', label);
					if (srSyncLabel) {
						srSyncLabel.textContent = label;
					}
				};

				const setSyncButtonState = (state) => {
					if (!loadGoogleFontButton) return;
					const isIdle = state === 'idle';
					const isLoading = state === 'loading';
					const isSynced = state === 'synced';
					syncButtonState = state;
					loadGoogleFontButton.disabled = !isIdle;
					loadGoogleFontButton.setAttribute('aria-disabled', isIdle ? 'false' : 'true');
					loadGoogleFontButton.classList.toggle('is-loading', isLoading);
					loadGoogleFontButton.classList.toggle('is-disabled', isSynced);
					if (isSynced) {
						updateSyncButtonLabel('Font synced');
					} else if (isLoading) {
						updateSyncButtonLabel('Syncing font');
					} else {
						updateSyncButtonLabel(defaultSyncLabel);
					}
				};

				const refreshSyncButtonState = () => {
					if (!loadGoogleFontButton) return;
					if (syncButtonState === 'loading') return;
					const current = getNormalizedFontFamily();
					if (syncedFontFamilyNormalized && current && current.toLowerCase() === syncedFontFamilyNormalized) {
						setSyncButtonState('synced');
					} else {
						setSyncButtonState('idle');
					}
				};

				fontFamilyName.addEventListener('click', () => {
					fontFamilyName.style.display = 'none';
					fontFamilyInput.style.display = 'inline-block';
					fontFamilyInput.focus();
				});

				fontFamilyInput.addEventListener('blur', () => {
					fontFamilyName.style.display = 'inline-block';
					fontFamilyInput.style.display = 'none';
					fontFamilyName.textContent = fontFamilyInput.value;
					if (fontSampleText) {
						fontSampleText.style.fontFamily = fontFamilyInput.value;
					}
					refreshSyncButtonState();
				});

				fontFamilyInput.addEventListener('input', refreshSyncButtonState);

				fontFamilyInput.addEventListener('keydown', (e) => {
					if (e.key === 'Enter') {
						fontFamilyInput.blur();
					}
				});

				if (loadGoogleFontButton) {
					refreshSyncButtonState();
					loadGoogleFontButton.addEventListener('click', () => {
						if (loadGoogleFontButton.disabled) return;
						const fontName = getNormalizedFontFamily();
						if (!fontName) return;
						setSyncButtonState('loading');
						loadGoogleFont(fontName).then(() => {
							syncedFontFamilyNormalized = fontName.toLowerCase();
							setSyncButtonState('synced');
						}).catch((error) => {
							console.error('Failed to load Google font', error);
							syncedFontFamilyNormalized = '';
							setSyncButtonState('idle');
						});
					});
				}

				fontSamples.appendChild(fontSampleDiv);
				if (colorMenu && typeof colorMenu.update === 'function') {
					requestAnimationFrame(() => colorMenu.update());
				}
			});
		}

			function createCustomSelect(selectElement, config) {
			if (!selectElement || !selectElement.parentNode) return null;

			const settings = Object.assign({
				formatSelected(option) {
					return option ? option.textContent : '';
				},
				formatItem(option) {
					const item = document.createElement('div');
					item.textContent = option.textContent;
					return item;
				},
				className: '',
				matchOptionWidth: false,
				extraWidth: 0
			}, config || {});

			const matchOptionWidth = settings.matchOptionWidth === true;
			const extraWidth = Number(settings.extraWidth) || 0;

			const customSelect = document.createElement('div');
			customSelect.classList.add('select-custom');
			if (settings.className) customSelect.classList.add(settings.className);

			const selected = document.createElement('div');
			selected.classList.add('select-selected');
			selected.tabIndex = 0;
			selected.setAttribute('role', 'button');
			selected.setAttribute('aria-haspopup', 'listbox');
			selected.setAttribute('aria-expanded', 'false');
			customSelect.appendChild(selected);

			const items = document.createElement('div');
			items.classList.add('select-items', 'select-hide');
			items.setAttribute('role', 'listbox');
			customSelect.appendChild(items);

			const measurement = matchOptionWidth ? (() => {
				const selectedMeasure = selected.cloneNode(false);
				selectedMeasure.classList.add('select-selected-measure');
				selectedMeasure.tabIndex = -1;
				selectedMeasure.setAttribute('aria-hidden', 'true');
				selectedMeasure.style.position = 'absolute';
				selectedMeasure.style.visibility = 'hidden';
				selectedMeasure.style.pointerEvents = 'none';
				selectedMeasure.style.height = 'auto';
				selectedMeasure.style.whiteSpace = 'nowrap';
				selectedMeasure.style.left = '-9999px';
				selectedMeasure.style.top = '-9999px';
				customSelect.appendChild(selectedMeasure);

				const optionMeasure = document.createElement('div');
				optionMeasure.classList.add('select-option', 'select-option-measure');
				optionMeasure.setAttribute('aria-hidden', 'true');
				optionMeasure.style.position = 'absolute';
				optionMeasure.style.visibility = 'hidden';
				optionMeasure.style.pointerEvents = 'none';
				optionMeasure.style.height = 'auto';
				optionMeasure.style.whiteSpace = 'nowrap';
				optionMeasure.style.left = '-9999px';
				optionMeasure.style.top = '-9999px';
				customSelect.appendChild(optionMeasure);

				const measure = (target, content) => {
					setContent(target, content);
					return target.offsetWidth || target.scrollWidth || 0;
				};

				return {
					selected(content) {
						return measure(selectedMeasure, content);
					},
					option(content) {
						return measure(optionMeasure, content);
					},
					destroy() {
						if (selectedMeasure.parentNode) selectedMeasure.parentNode.removeChild(selectedMeasure);
						if (optionMeasure.parentNode) optionMeasure.parentNode.removeChild(optionMeasure);
					}
				};
			})() : null;

			const setContent = (target, content) => {
				target.innerHTML = '';
				if (content instanceof Node) {
					target.appendChild(content);
				} else if (typeof content === 'string') {
					target.textContent = content;
				} else if (content != null) {
					target.textContent = String(content);
				} else {
					target.textContent = '';
				}
			};

			const closeDropdown = () => {
				items.classList.add('select-hide');
				selected.setAttribute('aria-expanded', 'false');
			};

			const openDropdown = () => {
				items.classList.remove('select-hide');
				selected.setAttribute('aria-expanded', 'true');
			};

			const applyOptionWidth = () => {
				if (!matchOptionWidth || !measurement) return;
				customSelect.style.width = 'auto';
				selected.style.width = 'auto';
				items.style.minWidth = '';
				let maxWidth = 0;
				Array.prototype.forEach.call(selectElement.options, (option, index) => {
					if (option.disabled) return;
					const selectedContent = settings.formatSelected(option, index, selectElement);
					const optionContent = settings.formatItem(option, index, selectElement);
					maxWidth = Math.max(
						maxWidth,
						measurement.selected(selectedContent),
						measurement.option(optionContent)
					);
				});
				const currentOption = selectElement.options[selectElement.selectedIndex] || null;
				if (currentOption) {
					const currentContent = settings.formatSelected(currentOption, selectElement.selectedIndex, selectElement);
					maxWidth = Math.max(maxWidth, measurement.selected(currentContent));
				} else if (!selectElement.options.length) {
					const placeholderContent = settings.formatSelected(null, -1, selectElement);
					maxWidth = Math.max(maxWidth, measurement.selected(placeholderContent));
				}
				const computedWidth = Math.ceil(maxWidth + extraWidth);
				if (computedWidth > 0) {
					customSelect.style.width = `${computedWidth}px`;
					selected.style.width = '100%';
					items.style.minWidth = '100%';
				}
			};

			const updateSelectedDisplay = () => {
				const option = selectElement.options[selectElement.selectedIndex] || null;
				const content = settings.formatSelected(option, selectElement.selectedIndex, selectElement);
				setContent(selected, content);
				Array.prototype.forEach.call(items.children, (child) => {
					child.classList.toggle('same-as-selected', Number(child.dataset.index) === selectElement.selectedIndex);
				});
				applyOptionWidth();
			};

			const buildItems = () => {
				items.innerHTML = '';
				Array.prototype.forEach.call(selectElement.options, (option, index) => {
					if (option.disabled) return;
					const formatted = settings.formatItem(option, index, selectElement);
					const item = formatted instanceof Node ? formatted : (() => {
						const el = document.createElement('div');
						el.textContent = formatted != null ? String(formatted) : option.textContent;
						return el;
					})();
					item.classList.add('select-option');
					item.dataset.index = index;
					item.setAttribute('role', 'option');
					item.tabIndex = -1;
					item.addEventListener('click', () => {
						selectElement.selectedIndex = index;
						selectElement.dispatchEvent(new Event('change'));
						closeDropdown();
						selected.focus();
					});
					items.appendChild(item);
				});
				updateSelectedDisplay();
			};

			const onSelectedClick = (e) => {
				e.stopPropagation();
				if (items.classList.contains('select-hide')) {
					openDropdown();
				} else {
					closeDropdown();
				}
			};

			const onSelectedKeydown = (e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					onSelectedClick(e);
				} else if (e.key === 'Escape') {
					closeDropdown();
				}
			};

			const onDocumentClick = (e) => {
				if (!customSelect.contains(e.target)) {
					closeDropdown();
				}
			};

			selected.addEventListener('click', onSelectedClick);
			selected.addEventListener('keydown', onSelectedKeydown);
			document.addEventListener('click', onDocumentClick);

			selectElement.parentNode.insertBefore(customSelect, selectElement);
			selectElement.style.display = 'none';

			buildItems();

			const onChange = () => updateSelectedDisplay();
			selectElement.addEventListener('change', onChange);
			applyOptionWidth();

			const width = selectElement.offsetWidth;
			if (!matchOptionWidth && width) {
				customSelect.style.minWidth = `${width}px`;
			}

			return {
				root: customSelect,
				selectedEl: selected,
				itemsEl: items,
				refresh: () => {
					buildItems();
					applyOptionWidth();
				},
				update: () => {
					updateSelectedDisplay();
					applyOptionWidth();
				},
				destroy() {
					document.removeEventListener('click', onDocumentClick);
					selected.removeEventListener('click', onSelectedClick);
					selected.removeEventListener('keydown', onSelectedKeydown);
					selectElement.removeEventListener('change', onChange);
					closeDropdown();
					if (customSelect.parentNode) {
						customSelect.parentNode.removeChild(customSelect);
					}
					selectElement.style.display = '';
				}
			};
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

				if (brandSelectMenu && typeof brandSelectMenu.destroy === 'function') {
					brandSelectMenu.destroy();
					brandSelectMenu = null;
				}

				brandSelectMenu = createCustomSelect(select, {
					formatSelected(option) {
						return option ? option.textContent : 'Select brand';
					},
					formatItem(option) {
						const item = document.createElement('div');
						item.textContent = option.textContent;
						return item;
					},
					className: 'brand-select-menu',
					matchOptionWidth: true,
					extraWidth: 2
				});
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
							setActiveBrand(window.BRAND, id);
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

		if (themeSelect) {
			themeSelect.addEventListener('change', (e) => {
				setActiveTheme(e.target.value);
			});
		}

		if (themeToggle) {
			themeToggle.addEventListener('click', () => {
				if (themeControlMode !== 'toggle') return;
				const current = normalizeThemeId(activeThemeId);
				const next = current === 'dark' ? 'light' : 'dark';
				setActiveTheme(next);
			});
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
		if (first && select) {
			select.value = first;
			if (brandSelectMenu && typeof brandSelectMenu.update === 'function') {
				brandSelectMenu.update();
			}
		}
		if (first) loadBrand(first).catch(err => console.error(err));

		function loadGoogleFont(fontName) {
			return new Promise((resolve, reject) => {
				if (!fontName) {
					reject(new Error('fontName is required'));
					return;
				}
				const normalizedName = fontName.trim();
				if (!normalizedName) {
					reject(new Error('fontName is required'));
					return;
				}
				const normalizedKey = normalizedName.toLowerCase();
				const fontUrl = `https://fonts.googleapis.com/css?family=${normalizedName.replace(/ /g, '+')}`;
				const existing = Array.prototype.find.call(document.querySelectorAll('link[data-google-font]'), (node) => node.dataset.googleFont === normalizedKey);
				if (existing) {
					resolve(existing);
					return;
				}
				const link = document.createElement('link');
				link.rel = 'stylesheet';
				link.href = fontUrl;
				link.dataset.googleFont = normalizedKey;
				link.onload = () => resolve(link);
				link.onerror = (err) => reject(err || new Error(`Failed to load Google font: ${fontUrl}`));
				document.head.appendChild(link);
			});
		}
	});

	
}) ();
