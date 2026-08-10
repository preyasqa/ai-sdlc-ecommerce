# Architecture Overview

## System Components

- **Express API Server**: Serves product catalog and checkout endpoints, and hosts the static frontend.
- **Static Frontend**: HTML/CSS/JavaScript application that consumes the REST API and manages a client-side cart.
- **Order Persistence**: The server stores completed orders in a lightweight JSON store so purchase data is preserved between restarts.
- **Playwright Test Suite**: End-to-end tests that verify product discovery, cart interaction, checkout behavior, and order persistence.

## Data Flow

1. The browser loads `index.html` and client-side JavaScript fetches `/api/products`.
2. Users add products to a local cart stored in browser `localStorage`.
3. When checkout is submitted, the frontend sends cart and customer details to `/api/checkout`.
4. The server validates the request and returns an order confirmation payload.

## Deployment

- Local deployment is handled with `npm start`.
- Automated tests launch a temporary server via Playwright's `webServer` configuration.

## Design Goals

- Keep the application small and maintainable.
- Enable an AI-driven SDLC approach by documenting user stories, architecture, and test cases.
- Use lightweight Node.js tooling so the app can run locally without additional infrastructure.
