export function enhanceAccordion(root) {
  if (!root) root = document;
  const accordions = root.querySelectorAll('[data-aab-accordion], .wp-block-aab_lite-accordion');
  accordions.forEach((acc) => {
    const headers = acc.querySelectorAll('[data-aab-accordion-toggle], .aab_lite-accordion-header');
    headers.forEach((btn, idx) => {
      const panel = btn.nextElementSibling;
      if (!panel) return;
      const panelId = panel.id || `aab-panel-${Math.random().toString(36).slice(2)}`;
      panel.id = panelId;

      // Button ARIA
      btn.setAttribute('aria-controls', panelId);
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      btn.setAttribute('role', 'button');
      btn.setAttribute('tabindex', '0');

      // Panel ARIA
      panel.setAttribute('role', 'region');
      const labelledbyId = btn.id || `aab-header-${Math.random().toString(36).slice(2)}`;
      btn.id = labelledbyId;
      panel.setAttribute('aria-labelledby', labelledbyId);

      // Reduced motion support
      const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      function setOpen(isOpen) {
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        if (isOpen) {
          panel.style.display = 'block';
          if (!prefersReduced) {
            panel.style.maxHeight = panel.scrollHeight + 'px';
            panel.style.transition = 'max-height 200ms ease';
          } else {
            panel.style.maxHeight = 'none';
          }
        } else {
          if (!prefersReduced) {
            panel.style.maxHeight = '0';
            panel.style.transition = 'max-height 200ms ease';
            setTimeout(() => (panel.style.display = 'none'), 200);
          } else {
            panel.style.display = 'none';
            panel.style.maxHeight = '0';
          }
        }
      }

      // Initialize
      if (expanded) {
        panel.style.display = 'block';
        panel.style.maxHeight = 'none';
      } else {
        panel.style.display = 'none';
        panel.style.maxHeight = '0';
      }

      // Click + keyboard
      const toggle = (e) => {
        e && e.preventDefault && e.preventDefault();
        const isOpen = btn.getAttribute('aria-expanded') === 'true';
        setOpen(!isOpen);
      };
      btn.addEventListener('click', toggle);
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          toggle(e);
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          // move to next header
          const next = headers[idx + 1];
          if (next) next.focus();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          const prev = headers[idx - 1];
          if (prev) prev.focus();
        } else if (e.key === 'Home') {
          if (headers[0]) headers[0].focus();
        } else if (e.key === 'End') {
          if (headers[headers.length - 1]) headers[headers.length - 1].focus();
        }
      });
    });
  });
}