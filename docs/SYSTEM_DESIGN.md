# 🏗 System Design

Detailed technical map of Micro.

## 🏛 Architecture: Domain-Driven Feature (DDF)
- **Frontend**: React (SPA), Vite, Tailwind, shadcn/ui.
- **Backend**: Hono (Node.js/TS), Unified server (API + Assets).
- **Database**: PostgreSQL with Prisma ORM.
- **Auth**: Hanko (Passkey-first, GDPR).
- **Media**: S3-compatible, short-lived signed URLs.

## 🏗 Structure (DDF)
- `src/domain/`: Types and Repository Interfaces. **Strict rule**: No dependencies on UI layers.
- `src/features/`: Encapsulated UI logic/components (e.g., `feed/`, `profile/`).
- `src/providers/`: Contexts for Dependency Injection (swapping repos).
- `src/pages/`: Routing entry points.

## 📊 Data Model
- **Users**: Self-relation for following/followed.
- **Posts**: Chronological, mandatory `tag` for discovery (no global algorithms).

## 🛰 API & Security
- **REST**: Hono endpoints.
- **Middleware**: `hankoAuth` JWT validation.
- **Media Proxy**: `/media/*` secure proxy to signed S3 URLs.
- **GDPR**: EU regions (Koyeb/Postgres EU). Data minimization.

## 🚀 Workflows
1. **Discovery**: Search-first and tag-based. No suggested content.
2. **Media**: Client-side resize + WebP conversion + EXIF strip.
3. **Consumption**: Chronological only. Session ends when feed is caught up.
