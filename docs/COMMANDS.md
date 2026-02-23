# Anvara Take-Home — Command Reference

All commands are run from the **repo root** unless otherwise noted. Use `pnpm` (Node 20+).

---

## First-time setup

```bash
# One-time: install deps, env, Docker DB, Prisma, seed
pnpm setup-project
```

If you prefer manual steps:

```bash
pnpm install
cp .env.example .env
docker compose up -d
cd apps/backend && pnpm db:generate && pnpm db:push && pnpm db:seed && cd ../..
```

---

## Run the app (try it in the browser)

```bash
# Start backend (port 4291) + frontend (port 3847)
pnpm dev
```

Then open:

- **Frontend (app):** http://localhost:3847 or http://127.0.0.1:3847  
- **Backend API:** http://localhost:4291  

**Demo logins:**

| Role      | Email                 | Password   |
| --------- | --------------------- | ---------- |
| Sponsor   | sponsor@example.com   | password   |
| Publisher | publisher@example.com | password   |

Log in at: http://localhost:3847/login  

---

## Run tests

### All tests (both apps)

```bash
pnpm test
```

### Backend only

```bash
cd apps/backend
pnpm test
```

**Backend – run a specific test file:**

```bash
cd apps/backend

# Utility helpers only (unit tests, no server)
pnpm vitest run src/utils/helpers.test.ts

# API integration tests (needs server listen; may fail in some environments)
pnpm vitest run src/api.test.ts
pnpm vitest run src/newsletter.test.ts
pnpm vitest run src/quotes.test.ts
```

### Frontend only

```bash
cd apps/frontend
pnpm test
```

**Frontend – run a specific test file:**

```bash
cd apps/frontend

# All frontend tests
pnpm vitest run

# Utils only
pnpm vitest run lib/utils.test.ts

# UI components only
pnpm vitest run app/components/ui/button.test.tsx
pnpm vitest run app/components/ui/dialog.test.tsx

# Sanity check only
pnpm vitest run sanity.test.ts
```

### Watch mode (re-run on file changes)

```bash
# Backend
cd apps/backend && pnpm vitest

# Frontend
cd apps/frontend && pnpm vitest
```

### Frontend test UI (Vitest UI)

```bash
cd apps/frontend
pnpm test:ui
```

---

## Typecheck & lint

```bash
# All apps
pnpm typecheck
pnpm lint

# Backend only
cd apps/backend && pnpm typecheck && pnpm lint

# Frontend only
cd apps/frontend && pnpm typecheck && pnpm lint
```

---

## Format

```bash
pnpm format
```

---

## Database

```bash
# Start PostgreSQL (Docker)
docker compose up -d

# Stop
pnpm stop
# or: docker compose down

# From backend app: generate client, push schema, seed
cd apps/backend
pnpm db:generate
pnpm db:push
pnpm db:seed

# Prisma Studio (DB UI at http://localhost:5555)
pnpm --filter @anvara/backend db:studio
```

---

## Reset project (re-run setup)

```bash
pnpm reset
```

---

## Build for production

```bash
# Build both apps
pnpm build

# Run built backend (after pnpm build)
cd apps/backend && pnpm start

# Run built frontend (after pnpm build)
cd apps/frontend && pnpm start
```

---

## Quick reference

| Goal                    | Command |
|-------------------------|--------|
| Start app for browser   | `pnpm dev` |
| Open app               | http://localhost:3847 |
| All tests              | `pnpm test` |
| Backend helpers tests   | `cd apps/backend && pnpm vitest run src/utils/helpers.test.ts` |
| Frontend tests         | `cd apps/frontend && pnpm vitest run` |
| Typecheck              | `pnpm typecheck` |
| Lint                   | `pnpm lint` |
| Format                 | `pnpm format` |
| DB UI (Prisma Studio)  | `pnpm --filter @anvara/backend db:studio` → http://localhost:5555 |
| First-time setup       | `pnpm setup-project` |
