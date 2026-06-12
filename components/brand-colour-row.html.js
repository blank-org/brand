(function () {
	if (window.brandColourRowTemplate) return;

	window.brandColourRowTemplate = function brandColourRowTemplate(item, options) {
		const { id, hex, name, usage = '', remark = '' } = item;
		const showSerial = !options || options.showSerial !== false;
		const serial = options && options.serial !== undefined ? options.serial : id;
		return `
		<td>
		<div class="swatch">
			<div class="color-box" style="background:${hex};" data-hex="${hex}" role="button" tabindex="0" title="Click to copy ${hex}" aria-label="${name} colour ${hex}"></div>
			<div>
			<div class="color-label">${name}</div>
			<div class="remark">${usage}</div>
			</div>
		</div>
		</td>
		<td class="code">${hex}</td>
		<td class="remark">${remark}</td>
		${showSerial ? `<td class="serial">${serial}</td>` : ''}
		<td class="colour-row-actions">
			<button class="colour-row-drag-handle" type="button" draggable="true" aria-label="Reorder ${name}" title="Drag to reorder">
				<span aria-hidden="true"></span>
			</button>
		</td>
	`;
	};
})();
