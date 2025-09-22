# Architecture Overview & Decisions

This document outlines the current architectural state of the Pixel Art Village application, its identified issues, and the decisions made to guide its refactoring and future development.

## 1. Current State Analysis (As of Review)

**Status: Flawed / Inconsistent**

The project was found to be operating under a conflicting hybrid architecture that combines patterns from both Multi-Page Applications (MPA) and Single-Page Applications (SPA) in an inefficient and confusing manner.

### Key Issues:

1.  **Dual Entry Points**: The `vite.config.js` was configured with multiple HTML files as entry points (`index.html`, `about.html`, `contact.html`, etc.). This is an MPA setup.

2.  **Redundant Client-Side Routing**: Simultaneously, the main React component (`src/App.jsx`) implemented its own routing logic by inspecting `window.location.pathname` with a series of `if` statements.

3.  **Inefficiency**: This hybrid model results in the worst of both worlds. Every page navigation triggers a full page reload (like an MPA), but each loaded page then bootstraps the *entire* React application bundle (like an SPA), which then re-evaluates the URL in JavaScript to decide which component to render. This is highly redundant and leads to poor performance.

4.  **Poor Maintainability**: Content and page structure were duplicated. For example, metadata was defined in the static HTML files, while the actual page content was rendered by React components. This creates two sources of truth and makes updates cumbersome and error-prone.

5.  **Broken User Experience**: The JavaScript-based routing in `App.jsx` did not interact with the browser's History API, leading to non-functional back/forward buttons within the client-side navigation flow.

## 2. Architectural Decision: Refactor to a Pure SPA

**Status: Implemented**

To resolve these fundamental issues, the following architectural decision has been made:

**The project will be refactored into a pure Single-Page Application (SPA).**

### Implementation Summary:

1.  **Router**: Integrated `react-router-dom` and centralized page routing in `src/App.jsx` using `<BrowserRouter>`, `<Routes>`, `<Route>`. Route pages are lazy‑loaded.

2.  **Single Entry**: Simplified `vite.config.js` to a single input (`index.html`).

3.  **Remove Redundant HTML**: Deleted legacy root HTML files (`about.html`, `contact.html`, `privacy.html`, `terms.html`).

4.  **Client Metadata**: Added a lightweight `Seo` component to set `title`, `canonical`, and OG/Twitter meta at runtime (React 19‑compatible alternative to Helmet). Homepage OG/Twitter remain static in `index.html`.

5.  **Deep Link Support**: Added `public/404.html` and a small URL fixer in `src/consent-init.js` to support GitHub Pages SPA deep links.

## 3. Consequences & Benefits

Adopting a pure SPA architecture will yield the following benefits:

- **Improved Performance**: After the initial load, subsequent page transitions will be near-instantaneous, as only the necessary components will be rendered without a full page reload.
- **Enhanced User Experience**: Browser history (back/forward buttons) will function correctly, providing a seamless and predictable navigation experience.
- **Simplified Build Process**: A single entry point simplifies the Vite configuration and the overall build logic.
- **Improved Maintainability**: With a single source of truth for all page content and routing, the codebase becomes significantly easier to understand, debug, and extend.
- **Architectural Consistency**: The project will align with modern, standard practices for building web applications with React, making it easier for new developers to onboard.
