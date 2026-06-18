# Bundle Builder

React/TypeScript prototype for a multi-step bundle builder with a live review panel.

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run lint
```

## Architecture

- Vite, React, TypeScript, and Tailwind CSS v4.
- Local JSON data in `src/data/bundleData.json`, with typed exports from `src/data/bundleData.ts`.
- Shared state via React Context and `useReducer`.
- Quantities are stored once by product and variant/default option.
- Review lines, selected counts, totals, and savings are derived from selectors.

## Quantity And Variants

Variant product quantities are grouped under the product ID, for example `wyze-cam-v4.white`. Non-variant products use a `default` option. A product card stepper edits the active variant only, while the review panel lists every selected variant independently.

## Persistence

`Save my system for later` stores quantities, active variants, and the open step in `localStorage`. Reloading restores the saved system; otherwise the app uses Figma-matching seeded defaults.

## Notes

- Product images are local assets under `public/figma-assets`.
- Gilroy font files are bundled locally under `src/assets/fonts`.
- Non-camera accordion steps render the seeded system items as read-only cards because the design view has no add controls for those products.
- Required seeded items use `minQuantity` in the JSON data so their steppers show the disabled state at the design minimum.
- Shipping is shown in review as `FREE` but excluded from totals to match the Figma total.
