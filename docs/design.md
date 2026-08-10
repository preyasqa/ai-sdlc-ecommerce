# Design Summary

## UI Layout

- Header with brand and cart status
- Product grid featuring product image, description, and add-to-cart button
- Dialog-based cart review and checkout form

## Wireframe Notes

- Use a card-based product gallery to keep the experience simple and mobile-friendly.
- Cart and checkout interactions are implemented with native HTML dialog elements.
- The design emphasizes clarity and speed rather than heavy styling.

## Low-Level Design

- `src/server.js` provides the REST API and hosts static assets.
- `public/app.js` manages cart state, product listing, and checkout submission.
- `playwright.config.js` launches the app during tests and runs end-to-end scenarios.
