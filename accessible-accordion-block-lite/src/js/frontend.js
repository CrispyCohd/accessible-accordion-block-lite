import { enhanceAccordion } from './a11y';
/* ---------- built-in fallback caret (never stored in attributes) */
const DEFAULT_CARET =
	'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="m21.707 8.707-9 9a1 1 0 0 1-1.414 0l-9-9a1 1 0 1 1 1.414-1.414L12 15.586l8.293-8.293a1 1 0 1 1 1.414 1.414Z"/></svg>';

(function () {
	const ACCORDION_SELECTOR = '.wp-block-aab_lite-accordion';

	/* inject the caret icon only once per accordion */
	function ensureIcon(acc) {
		const header = acc.querySelector('.aab_lite-accordion-header');
		if (!header || header.querySelector('.aab_lite-accordion-icon')) return;

		let iconMarkup = DEFAULT_CARET;
		const type = acc.dataset.iconType;

		if (type === 'svg' && acc.dataset.iconSvg)   iconMarkup = acc.dataset.iconSvg;
		if (type === 'image' && acc.dataset.iconImg) iconMarkup = `<img src="${acc.dataset.iconImg}" alt="" />`;

		const span = document.createElement('span');
		span.className = 'aab_lite-accordion-icon';
		span.innerHTML = iconMarkup;
		header.appendChild(span);
	}

	/* helper: fade in after display change & reflow */
	function fadeOpen(content, duration) {
		clearTimeout(content._hideTO);

		content.style.display    = 'block';
		content.style.transition = 'none';
		content.style.opacity    = '0';

		/* force reflow so the next style change can animate */
		void content.offsetWidth;

		content.style.transition = `opacity ${duration}ms`;
		content.style.opacity    = '1';
	}

	/* helper: fade out then hide */
	function fadeClose(content, duration) {
		clearTimeout(content._hideTO);

		content.style.transition = `opacity ${duration}ms`;
		content.style.opacity    = '0';
		content._hideTO = setTimeout(() => {
			content.style.display = 'none';
		}, duration);
	}

	/* slide / fade toggle — interrupt-safe and smooth on first run */
	function toggleAccordion(acc) {
		const content  = acc.querySelector('.aab_lite-accordion-content');
		const duration = parseInt(acc.dataset.duration, 10) || 300;
		const isFade   = acc.classList.contains('aab_lite-accordion--fade');
		if (!content) return;

		acc.classList.toggle('is-open');

		if (isFade) {
			acc.classList.contains('is-open')
				? fadeOpen(content, duration)
				: fadeClose(content, duration);
		} else {
			const startHeight = content.offsetHeight;
			content.style.transition = `max-height ${duration}ms ease`;

			if (acc.classList.contains('is-open')) {
				content.style.maxHeight = content.scrollHeight + 'px';
			} else {
				content.style.maxHeight = startHeight + 'px';
				requestAnimationFrame(() => (content.style.maxHeight = '0'));
			}
		}
	}

	/* initialise accordions */
	function init(root = document) {
		root.querySelectorAll(ACCORDION_SELECTOR).forEach((acc) => {
			ensureIcon(acc);

			/* make sure fade accordions start hidden */
			if (
				acc.classList.contains('aab_lite-accordion--fade') &&
				!acc.classList.contains('is-open')
			) {
				const c = acc.querySelector('.aab_lite-accordion-content');
				if (c) {
					c.style.opacity = '0';
					c.style.display = 'none';
				}
			}

			const header = acc.querySelector('.aab_lite-accordion-header');
			if (header && !header.dataset.ccBound) {
				header.dataset.ccBound = true;
				header.addEventListener('click', () => toggleAccordion(acc));
			}
		});
	}

	document.readyState === 'loading'
		? document.addEventListener('DOMContentLoaded', () => init())
		: init();
})();


document.addEventListener('DOMContentLoaded', () => enhanceAccordion(document));
