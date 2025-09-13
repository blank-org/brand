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
			data.forEach(item => {
				const tr = document.createElement('tr');
				tr.innerHTML = `
	  <td>${item.id}</td>
	  <td class="code">${item.hex}</td>
	  <td>
		<div class="swatch">
		  <div class="color-box" style="background:${item.hex};" data-hex="${item.hex}" role="button" tabindex="0" title="Click to copy ${item.hex}" aria-label="${item.name} colour ${item.hex}"></div>
		  <div>
			<div class="color-label">${item.name}</div>
			<div class="remark">${item.usage || ''}</div>
		  </div>
		</div>
	  </td>
	  <td class="remark">${item.remark || ''}</td>
	`;
				tbody.appendChild(tr);
			});
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
	});
})();
