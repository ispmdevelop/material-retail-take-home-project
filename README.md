# Material Retail

A full-stack point-of-sale and inventory management system that helps merchants track stock and get alerts when items need reordering.

## Features

- **Authentication** — Email/password with JWT, auto-creates organization on signup
- **Products** — CRUD with feature/variant builder, default variant created automatically
- **Product Variants** — Full management with inherited features, stock tracking, low-stock alerts
- **Store** — Simulate purchases, auto-reduces stock, creates notifications when below threshold
- **Notifications** — Real-time alert dialog for unread stock alerts, mark-as-read (individual + bulk)
- **Profile** — View account info and decoded JWT payload

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript, Vite, Material UI, Zustand, TanStack Query, React Router |
| Backend | NestJS 12 + TypeScript, Prisma ORM, Passport JWT, bcrypt |
| Database | PostgreSQL |
| Auth | JWT (7-day expiry), bcrypt password hashing |

## Getting Started (Local Development)

### Prerequisites

- Node.js 24+
- Docker + Docker Compose

### 1. Start the Database

```bash
make up
```

This starts PostgreSQL on port 5432.

### 2. Install Dependencies & Generate Prisma Client

```bash
make install
```

### 3. Seed the Database

```bash
make seed
```

Creates demo data for two merchants with products, variants, and notifications.

**Demo accounts** (password: `password123`):
- `ashley@aquariuscosmetics.com` — Aquarius Cosmetics (nail polish store)
- `david@mountainhouse.com` — Mountain House (furniture retailer)

### 4. Start the Servers

```bash
make dev
```

- **Backend**: http://localhost:3000 (API + serves UI in production)
- **Frontend**: http://localhost:5173 (Vite dev server with HMR)

> The Vite dev server proxies API calls to the backend automatically. In production, the NestJS app serves the built React app from its `public/` folder.

### Manual Commands

```bash
# Start API only
cd api && npm run start:dev

# Start UI only
cd ui && npm run dev

# Run database migrations
cd api && npx prisma db push

# Seed data
cd api && npm run seed
```

## Building for Production

### Build UI and Copy to Backend

```bash
make build
```

This compiles the React app and copies the output to `api/public/`. The NestJS app then serves it as static assets.

### Build & Run Backend

```bash
cd api && npm run build && npm run start:prod
```

## Deployment

### Railway

Railway will auto-inject environment variables. Required:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for JWT signing |

The `Dockerfile` handles multi-stage builds (UI + API) and auto-runs `prisma db push` on startup.

### Docker (Generic / ECS / EC2)

```bash
# Build image
docker build -t material-retail .

# Run with env vars
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e JWT_SECRET="your-secret" \
  material-retail
```

### Docker Compose (Self-Hosted)

A full `docker-compose.yml` is provided at the root for running PostgreSQL. For a full production setup with the app container, add:

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://material:material_secret@postgres:5432/material_retail
      JWT_SECRET: your-secret-here
    depends_on:
      postgres:
        condition: service_healthy
```

## API Endpoints

### Auth
| Method | Path | Description |
|--------|------|-------------|
|  POST | `/api/auth/signup` | Register user + auto-create organization |
|  POST | `/api/auth/login` | Login with email/password |

### Products
| Method | Path | Description |
|--------|------|-------------|
|  GET | `/api/products` | List all products (org-scoped) |
|  GET | `/api/products/:id` | Get single product |
|  POST | `/api/products` | Create product + default variant |
| PUT | `/api/products/:id` | Update product |
|  DELETE | `/api/products/:id` | Delete product + all variants |

### Product Items (Variants)
| Method | Path | Description |
|--------|------|-------------|
|  GET | `/api/product-items?productId=...` | List variants for a product |
|  GET | `/api/product-items/:id` | Get single variant |
|  POST | `/api/product-items` | Create variant |
| PUT | `/api/product-items/:id` | Update variant |
|  DELETE | `/api/product-items/:id` | Delete variant |

### Store
| Method | Path | Description |
|--------|------|-------------|
|  GET | `/api/store/items` | List all product items (flattened) |
|  POST | `/api/store/purchase` | Purchase items (reduces stock) |

### Notifications
| Method | Path | Description |
|--------|------|-------------|
|  GET | `/api/notifications` | List all notifications |
|  PATCH | `/api/notifications/:id/read` | Mark single as read |
|  PATCH | `/api/notifications/mark-all-read` | Mark all as read |

All endpoints require `Authorization: Bearer <token>`.

## Project Structure

```
material-retail-take-home-project/
├── api/                          # NestJS backend
│   ├── src/
│   │   ├── auth/                 # Authentication module
│   │   ├── product/              # Products CRUD
│   │   ├── product-item/         # Product variants CRUD
│   │   ├── store/                # Purchase flow
│   │   ├── notifications/        # Notifications
│   │   ├── prisma.service.ts     # Global Prisma service
│   │   └── prisma.module.ts      # Global Prisma module
│   └── prisma/
│       ├── schema.prisma         # Database schema
│       └── seed.ts               # Seed data
├── ui/                           # React frontend
│   ├── src/
│   │   ├── components/           # Shared components (Sidebar)
│   │   ├── layouts/              # AuthLayout, AppLayout
│   │   ├── pages/                # Route pages
│   │   ├── modules/              # Feature modules
│   │   │   ├── auth/             # Auth forms, hooks, store
│   │   │   ├── product/          # Product CRUD
│   │   │   ├── product-item/     # Variant CRUD
│   │   │   ├── store/            # Store/purchase
│   │   │   └── notifications/    # Notifications
│   │   ├── ui/                   # Generic UI components
│   │   ├── lib/                  # API client, utilities
│   │   └── theme.ts              # MUI theme
│   └── public/                   # Static assets
├── docker-compose.yml            # PostgreSQL service
├── Dockerfile                    # Multi-stage build for deployment
└── Makefile                      # Common commands
```
