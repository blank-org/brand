// script.js - handles rendering and copy-on-click behaviour
(function () {
	// Wait for DOM
	function ready(fn) {
		if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn);
	}

	ready(() => {
		// Use window.BRAND if available (metadata + colours). Fallback to empty.
		const brand = window.BRAND || { title: document.title || 'Brand colours', colours: [] };
		// set page title / heading from data
		const heading = document.querySelector('main.content h3');
		if (heading && brand.title) heading.textContent = brand.title;

		const data = brand.colours || [];
		const tbody = document.querySelector('table tbody');
		if (tbody) {
			// clear existing rows
			tbody.innerHTML = '';
			data.forEach(item => {
				const tr = document.createElement('tr');
				// Render code column before colour column: Serial | Code | Colour | Remark
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

		// Copy-on-click behaviour for any element with data-hex
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
			// find the row and temporarily show a small "Copied" label in the code cell
			const row = el.closest('tr');
			if (!row) return;
			const codeCell = row.querySelector('.code');
			const original = codeCell.textContent;
			codeCell.textContent = 'Copied!';
			codeCell.classList.add('copied');
			setTimeout(() => { codeCell.textContent = original; codeCell.classList.remove('copied'); }, 1400);
		}

		document.body.addEventListener('click', (e) => {
			const el = e.target.closest('[data-hex]');
			if (!el) return;
			const hex = el.getAttribute('data-hex');
			copyText(hex).then(() => flashCopied(el)).catch(err => {
				console.error('copy failed', err);
				// if failed, show a brief failure message in code cell
				const row = el.closest('tr');
				if (row) {
					const codeCell = row.querySelector('.code');
					const prev = codeCell.textContent;
					codeCell.textContent = 'Failed';
					setTimeout(() => codeCell.textContent = prev, 1400);
				}
			});
		});

		// keyboard accessibility: Enter/Space on focused colour box
		document.body.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				const el = document.activeElement;
				if (el && el.hasAttribute && el.hasAttribute('data-hex')) {
					e.preventDefault();
					el.click();
				}
			}
		});
	});
})();
