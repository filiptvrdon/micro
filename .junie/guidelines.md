# 🛠 Coding Agent Guidelines

This is the primary entry point for coding agents. For product/UI details, see [General Documentation](#-general-documentation).

## 🏗 General Documentation
- [Product](../docs/PRODUCT.md) - Vision, scope, and philosophy.
- [Architecture](../docs/ARCHITECTURE.md) - Technical constraints and image handling.
- [System Design](../docs/SYSTEM_DESIGN.md) - Detailed technical map.
- [UI/UX](../docs/UX-UI.md) - Design principles and components.
- [Data](../docs/DATA.md) - Data storage and privacy.

---

## 📐 Architecture: Domain-Driven Feature (DDF)
- `src/domain/`: Types, Repository Interfaces, Stubs. No dependencies on other layers.
- `src/features/`: UI-specific modules and complex logic. No inter-feature dependencies.
- `src/providers/`: Global context providers. No dependencies on `pages` or `layouts`.
- `src/pages/`: Routing entry points.
- `src/components/ui/`: Leaf shadcn components. No business logic.

**Enforcement**: `npm run check-arch` (uses `dependency-cruiser`).

## 🛠 Tech Constraints
- **Name**: The project name is **FINITE.** (all caps, with a period at the end).
- **Typography**: The primary font is **JetBrains Mono**.
- **UI**: Use `shadcn/ui` ONLY.
- **Data**: All repositories MUST be interfaces; swap implementations via providers.
- **Verification**: `npm run build` from root (builds web + api, copies assets).
- **Run**: `npm start` (Unified server: `:3000` (Web), `:3000/api/health` (API)).

## 🚀 Deployment (Koyeb)
- **Build**: `npm ci && npm run build`
- **Run**: `npm start`
- **Required Env**: `DATABASE_URL`, `HANKO_AUTH_URL`, `NODE_ENV=production`.

## 📜 Workflow
- After each task: ask for permission to commit.
