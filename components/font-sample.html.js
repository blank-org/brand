(function () {
	if (window.fontSampleTemplate) return;

	window.fontSampleTemplate = function fontSampleTemplate({ font, sampleText, color }) {
		const { name, family, weight, usage = '' } = font;
		const usageMarkup = usage ? `
								<div class="font-usage remark">${usage}</div>` : '';
		return `
					<div class="font-card">
						<div class="font-card-body">
							<div class="font-sample-text" contenteditable="true" style="font-family: ${family}; font-weight: ${weight}; color: ${color};">${sampleText}</div>
							<div class="font-card-meta">
								<span class="font-family-name" title="Click to edit font family">${family}</span>
								<input type="text" class="font-family-input" value="${family}" style="display: none;">
								<button class="load-google-font" type="button" aria-label="Load from Google Fonts">
									<i class="material-icons" aria-hidden="true">sync</i>
									<span class="sr-only">Load from Google Fonts</span>
								</button>
							</div>
						</div>
						<div class="font-card-content">
							<footer class="font-card-footer">
								<div class="font-source-column">
									<div class="font-source-toggles" role="group" aria-label="Font source">
										<button class="font-source-toggle active" data-source="system" type="button">
											<i class="material-icons" aria-hidden="true">computer</i>
											<span class="sr-only">Use system font</span>
										</button>
										<button class="font-source-toggle" data-source="google" type="button">
											<img src="resource/google_font.icon.svg" alt="Use Google font">
										</button>
									</div>
								</div>
								<div class="font-detail-column">
									<div class="font-card-actions">
										<div class="font-card-title">
											<div class="font-sample-name">${name}</div>
										</div>
										<div class="font-controls">
											<div class="color-picker-slot"></div>
										</div>
									</div>
									${usageMarkup}
								</div>
							</footer>
						</div>
					</div>
				`;
	};
})();
