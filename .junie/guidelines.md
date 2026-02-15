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

after each finished task, ask for permission to commit
