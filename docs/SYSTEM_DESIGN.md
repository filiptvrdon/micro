# 🏗 Micro - System Design & Architecture

This document provides a comprehensive overview of the technical architecture and design of the Micro platform.

---

## 🏛 High-Level Architecture
Micro follows a **Domain-Driven Feature (DDF)** architecture across both the frontend and backend. This design prioritizes modularity, testability, and clear separation of concerns.

### Core Principles
- **Intentionality**: Features are designed to prevent "doom-scrolling" and infinite engagement loops.
- **Signal over Noise**: Chronological feeds with no algorithmic manipulation.
- **Privacy First**: Minimal data collection, EU-hosted infrastructure, and transparent media handling.

---

## 💻 Tech Stack
- **Frontend**: React (SPA), Vite, Tailwind CSS, shadcn/ui.
- **Backend**: Hono (Node.js/TypeScript), serving both API and static assets in a unified server.
- **Database**: PostgreSQL with Prisma ORM.
- **Authentication**: [Hanko](https://www.hanko.io/) (Passkey-first, GDPR compliant).
- **Media**: S3-compatible object storage with short-lived signed URLs for delivery.

---

## 🏗 Modular Structure (DDF)
The project is organized into `domain`, `features`, `pages`, and `providers`.

### `src/domain/` (Centralized Data Layer)
- **Types**: Shared TypeScript interfaces for entities (e.g., `User`, `Post`).
- **Repository Interfaces**: Abstract definitions of data access methods.
- **Implementations**:
  - `ApiUserRepository`: Fetches from the REST API.
  - `PgUserRepository`: (Backend-only) Interacts directly with Prisma/Postgres.
- **Constraint**: The domain layer MUST NOT depend on UI layers (`features`, `pages`).

### `src/features/` (UI Logic & Components)
- Focused, reusable modules that encapsulate specific functionality (e.g., `feed/`, `profile/`, `auth/`).
- Prevents coupling between unrelated parts of the UI.

### `src/providers/` (Dependency Injection)
- Global React Contexts that provide repository implementations to the UI.
- Allows for easy swapping of implementations (e.g., swapping a real API repo for a stub repo during development or testing).

---

## 📊 Data Model
The database is designed for relational integrity and efficient querying of social connections.

### Users & Connections
- **Self-Relation**: Users can follow each other via a many-to-many relationship (`followedBy` / `following`).
- **Implicit Joins**: Managed by Prisma for simplicity and performance.

### Posts & Discovery
- **Chronological Feed**: Posts are served in reverse-chronological order based on a user's following list.
- **Tag-Based Discovery**: Posts include a mandatory `tag` (e.g., #running, #climbing), enabling niche-specific discovery without global algorithms.

---

## 🛰 API Design
- **RESTful Endpoints**: Built using Hono for high performance and low latency.
- **Authentication Middleware**: `hankoAuth` validates Hanko JWTs on protected routes.
- **Media Proxying**: A secure `/media/*` proxy handles redirecting to signed S3 URLs, ensuring original storage keys are never exposed to the client.

---

## 🚀 Key Workflows

### 1. Intentional Exploration
- **Search-First**: Users discover others via active searching or by exploring recent "New Arrivals."
- **Niche Discovery**: Finding experts/athletes by searching for specific training tags (e.g., searching for `#calisthenics` returns users who frequently post with that tag).

### 2. Media Optimization
- **Client-Side Processing**: Images are resized and compressed (WebP/JPEG) *before* upload to reduce bandwidth and storage costs.
- **Privacy**: EXIF metadata is stripped during the client-side optimization process.

### 3. Finite Consumption
- The feed is strictly chronological. Once a user has viewed the latest updates from their network, the system does not inject "suggested content," signaling the end of the session.

---

## 🛡 Security & Compliance
- **GDPR by Design**: EU-based hosting (Koyeb/Postgres EU regions).
- **No Tracking**: No third-party behavioral analytics or cross-platform tracking pixels.
- **Data Minimization**: We store only what is required to operate the service.
