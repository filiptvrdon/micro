# Micro

A lightweight social media application built with a modern split architecture (Frontend + Backend).

## 🏗 Architecture

The project follows a **Domain-Driven Feature** architecture. For a detailed breakdown of the system design, see [SYSTEM_DESIGN.md](./docs/SYSTEM_DESIGN.md).

- **`src/web`**: Pure React frontend (Vite, shadcn/ui).
- **`src/api`**: Lightweight Hono backend server (Node.js, Prisma).

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18 or later.
- **PostgreSQL**: A running instance (or use the provided `docker-compose.yml`).

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file in the root directory (you can copy `.env.example` if it exists, or follow the template below):
   ```env
   DATABASE_HOST=localhost
   DATABASE_USER=user
   DATABASE_PASSWORD=password
   DATABASE_NAME=micro_db
   DATABASE_PORT=5432
   HANKO_AUTH_URL="https://your-hanko-url.hanko.io"
   VITE_API_URL="http://localhost:3000"
   ```

3. **Database Initialization:**
   ```bash
   npx prisma migrate dev
   ```

### Development

You need to run both the backend and the frontend simultaneously.

- **Start Backend (`api`):**
  ```bash
  npm run dev:api
  ```
  The API will be available at `http://localhost:3000`.

- **Start Frontend (`web`):**
  ```bash
  npm run dev:web
  ```
  The Web app will be available at `http://localhost:5173`.

### Other Commands

- **Build:**
  ```bash
  npm run build
  ```
- **Architecture Check:**
  ```bash
  npm run check-arch
  ```
- **Lint:**
  ```bash
  npm run lint
  ```

## 🛡 Architectural Enforcement

We use `dependency-cruiser` to enforce the **Domain-Driven Feature** architecture. 
- `domain` MUST NOT depend on `features`, `pages`, `layouts`, or `providers`.
- `features` MUST NOT depend on other `features`.
- `web` MUST NOT depend on `api` internals (like Prisma).
- `components/ui` MUST be "leaf" components.
