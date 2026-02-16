# 🛠 Coding Agent Guidelines

This document serves as the primary entry point for coding agents. It contains technical constraints and implementation details. For high-level product and UI principles, refer to the [General Documentation](#-general-documentation).

## 🏗 General Documentation
- [Product Guidelines](../docs/PRODUCT.md) - Vision, scope, and product philosophy.
- [UI Guidelines](../docs/UX-UI.md) - Design principles, components, and visual theme.
- [Architecture Guidelines](../docs/ARCHITECTURE.md) - Design principles, components, and visual theme.
- [Data Model Philosophy](../docs/DATA.md) - Data storage and privacy principles.
---

Instructions:
- Use shadcn/ui only
- Follow the **Domain-Driven Feature** architecture:
    - `src/domain/`: Centralized data layer (Types, Repository Interfaces, Stubs). Group by entity (e.g., `posts/`, `users/`).
    - `src/features/`: UI-specific modules and complex logic.
    - `src/providers/`: Global context providers.
    - `src/pages/`: Routing entry points.
    - `src/components/ui/`: Shared shadcn components.
- For now, all repositories should be defined and referenced as interfaces so that the implementations can be swapped out.

## 🛡 Architectural Enforcement
We use `dependency-cruiser` to enforce the **Domain-Driven Feature** architecture. 
- **Command**: `npm run check-arch`
- **Rules**:
    - `domain` MUST NOT depend on `features`, `pages`, `layouts`, or `providers`.
    - `features` MUST NOT depend on other `features` (to prevent coupling).
    - `components/ui` MUST be "leaf" components (no business logic/domain/features).
    - `providers` MUST NOT depend on `pages` or `layouts`.
- All PRs/changes should pass `npm run check-arch`.

## ✅ Build & Run Verification
All changes should be verified by building and running the application from the root.

- **Full Build**:
    - Run `npm run build` from the root.
    - This builds the web app, the API, and copies assets to `apps/api/public`.

- **Start Unified Server**:
    - Start the server: `npm start`.
    - Verify frontend: `curl http://localhost:3000/` should return the HTML content.
    - Verify API: `curl http://localhost:3000/api/health` should return `OK`.

## 🚀 Deployment (Koyeb)
- **Build Command**: `npm ci && npm run build`
- **Run Command**: `npm start`
- **Required Env Vars**:
    - `DATABASE_URL`: Postgres connection string.
    - `HANKO_AUTH_URL`: Your Hanko instance URL.
    - `NODE_ENV`: `production`

after each finished task, ask for permission to commit
