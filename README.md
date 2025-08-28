# Accessible Accordion Block (Lite)

A minimal Gutenberg block that renders an accessible accordion with smooth, optional animation.
Built to demonstrate modern WordPress block development and good front-end practices.

## Highlights
- WordPress Block API (`block.json`)
- React-based editor UI with Inspector controls
- Clean front-end script with ARIA (`aria-expanded`, `aria-controls`) and keyboard support
- Respects `prefers-reduced-motion` for reduced animations
- Small, dependency-light build via `@wordpress/scripts`

## Install
```bash
npm install
npm run build
```
Copy the plugin folder into `wp-content/plugins/accessible-accordion-block-lite` and activate in WP Admin.

## Usage
Add the **Accessible Accordion** block. Configure animation type and duration in the block sidebar.

## Accessibility
- Toggle buttons expose `aria-expanded`
- Panels use `role="region"` with `aria-labelledby`
- Keyboard: Enter/Space toggles; focus stays on the header
- `prefers-reduced-motion` disables transitions

## Scripts
- `npm run start` – watch build
- `npm run build` – production build
- `npm run lint` – lint sources

## License
Proprietary — Evaluation Only. © 2025 Marcus Albon. All rights reserved.


## Project Structure
```
accessible-accordion-block-lite/
├─ block.json
├─ package.json
└─ src/
   ├─ index.js                # Editor entry
   ├─ js/
   │  ├─ frontend.js          # Front-end behavior (view script)
   │  └─ a11y.js              # ARIA & keyboard helpers
   └─ styles/
      ├─ style.scss           # Front-end styles
      └─ editor.scss          # Editor-only styles
```

This uses **SCSS** for nesting and organization. `@wordpress/scripts` will compile the entries defined in `block.json`.

