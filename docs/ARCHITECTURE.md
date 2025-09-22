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

**Status: Decided / To Be Implemented**

To resolve these fundamental issues, the following architectural decision has been made:

**The project will be refactored into a pure Single-Page Application (SPA).**

### Implementation Steps:

1.  **Adopt a Standard Router**: The `react-router-dom` library will be integrated to handle all client-side routing.

2.  **Consolidate to a Single Entry Point**: The `vite.config.js` file will be modified to have only one input entry point: `index.html`.

3.  **Eliminate Redundant HTML Files**: All static page files (`about.html`, `contact.html`, `privacy.html`, `terms.html`) will be deleted from the root directory.

4.  **Centralize Routing Logic**: The `src/App.jsx` component will be refactored to use `react-router-dom`'s declarative components (`<BrowserRouter>`, `<Routes>`, `<Route>`) to define the application's page structure.

5.  **Manage Page Metadata with React**: Page titles, meta tags, and canonical links will be dynamically managed within each page component, for example by using a library like `react-helmet-async`.

## 3. Consequences & Benefits

Adopting a pure SPA architecture will yield the following benefits:

- **Improved Performance**: After the initial load, subsequent page transitions will be near-instantaneous, as only the necessary components will be rendered without a full page reload.
- **Enhanced User Experience**: Browser history (back/forward buttons) will function correctly, providing a seamless and predictable navigation experience.
- **Simplified Build Process**: A single entry point simplifies the Vite configuration and the overall build logic.
- **Improved Maintainability**: With a single source of truth for all page content and routing, the codebase becomes significantly easier to understand, debug, and extend.
- **Architectural Consistency**: The project will align with modern, standard practices for building web applications with React, making it easier for new developers to onboard.
