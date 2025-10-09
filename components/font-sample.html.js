(function () {
	if (window.fontSampleTemplate) return;

	window.fontSampleTemplate = function fontSampleTemplate({ font, sampleText, color }) {
		const { name, family, weight } = font;
		return `
					<div class="font-sample-name">${name}</div>
					<div class="font-sample-text" contenteditable="true" style="font-family: ${family}; font-weight: ${weight}; color: ${color};">${sampleText}</div>
					<div class="font-family-control">
						<div class="font-source-toggles">
							<button class="font-source-toggle active" data-source="system"><i class="material-icons">computer</i></button>
							<button class="font-source-toggle" data-source="google"><img src="resource/google_font.icon.svg" alt="Google Font"></button>
						</div>
						<span class="font-family-name">${family}</span>
						<input type="text" class="font-family-input" value="${family}" style="display: none;">
						<button class="load-google-font" style="display: none;">Load</button>
					</div>
					<div class="font-controls">
					</div>
				`;
	};
})();
