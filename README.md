# AI SDLC Ecommerce App

A lightweight ecommerce application built with Node.js and Express, designed for a capstone project that demonstrates an AI-assisted software development lifecycle with human-in-the-loop processes and Playwright test automation.

## Features

- Product catalog served by REST API
- Client-side shopping cart and checkout flow
- Server-side order persistence and order history API
- Required checkout address validation and order confirmation
- Playwright end-to-end tests for core user journeys
- Project documentation for epics, architecture, and test cases

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm

### Install dependencies

```bash
npm install
npm run prepare
```

### Run the app

```bash
npm start
```

Open `http://localhost:3000` in your browser.

### Run tests

```bash
npm test
```

## Project Structure

- `src/` - server source code
- `public/` - static UI assets and client-side interaction
- `tests/` - Playwright end-to-end test suites
- `docs/` - project planning, design, and test artifacts

## Notes

This project is intentionally small to focus on process and tooling, including planning, documentation, testing, and local deployment.
