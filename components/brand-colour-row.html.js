(function () {
	if (window.brandColourRowTemplate) return;

	window.brandColourRowTemplate = function brandColourRowTemplate(item) {
		const { id, hex, name, usage = '', remark = '' } = item;
		return `
		<td>${id}</td>
		<td class="code">${hex}</td>
		<td>
		<div class="swatch">
			<div class="color-box" style="background:${hex};" data-hex="${hex}" role="button" tabindex="0" title="Click to copy ${hex}" aria-label="${name} colour ${hex}"></div>
			<div>
			<div class="color-label">${name}</div>
			<div class="remark">${usage}</div>
			</div>
		</div>
		</td>
		<td class="remark">${remark}</td>
	`;
	};
})();
