# Material Retail

A full-stack point-of-sale and inventory management system for merchants to track stock, manage products, and receive low-stock alerts.

**Live Demo**: https://material-retail-take-home-project-production.up.railway.app/auth

**Test accounts** (password: `password123`):
- `ashley@gmail.com` — Aquarius Cosmetics
- `david@gmail.com` — Mountain House

## Running Locally

### Prerequisites

- Node.js 24+
- Docker + Docker Compose

### Quick Start

```bash
# 1. Start PostgreSQL
make up

# 2. Install dependencies and generate Prisma client
make install

# 3. Push schema and seed demo data
cd api && npx prisma db push && npm run seed

# 4. Start both servers
make dev
```

- **Frontend**: http://localhost:5173 (Vite dev server, proxies `/api` to backend)
- **Backend**: http://localhost:3000

### Docker Deployment

```bash
docker build -t material-retail .
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e JWT_SECRET="your-secret" \
  material-retail
```

The single container serves both the API and the React app. No CORS or separate frontend hosting needed.

## Technology Choices

**Why NestJS + React SPA over Next.js?**

Next.js was the initial thought, but NestJS offers a more structured backend framework that's easier to deploy on any infrastructure without sacrificing capabilities. By serving the React SPA as static files from NestJS, the entire application runs behind a single host — eliminating CORS configuration, SSL duplication, and deployment complexity on platforms like Railway.

React was chosen over a meta-framework for the frontend because it's lightweight, familiar, and fully sufficient for an internal dashboard where SEO is not a concern.

**Other choices:**
- **Prisma** for type-safe database access
- **Material UI** for consistent, accessible components
- **Zustand + TanStack Query** for lightweight state management and server-state caching
- **PostgreSQL** as the relational database

## AI Usage

This project was built using **Opencode with Qwen 3.6 Plus**. I prefer open models for personal projects and quick iterations, though I have extensive experience with Claude as well.

**How I used AI:** Heavy pushback was required at the start. I needed to establish the architecture, library choices, folder structure, and coding standards I prefer — the AI doesn't know my preferences until I communicate them. Once a few modules were created, the AI became much more effective at generating code that followed the existing patterns. The sweet spot is: architect and set conventions yourself, let AI accelerate the repetitive work within those guardrails.

## Assumptions & Trade-offs

Several assumptions were made due to time constraints:

- **Single organization per user** — Users can only belong to one organization. A real system would need a many-to-many relationship with role-based access.
- **Owner-only organization** — No team members, no roles, no permissions hierarchy. The owner is the only user.
- **Product variants model** — I chose a flexible JSON-based variant system. A more rigorous inventory system would differentiate between serialized and non-serialized items, track individual units, and handle purchase orders.
- **Image handling** — Product images are not implemented. In production, I'd use S3 or a CDN for content delivery.
- **SEO** — React SPA is not ideal for SEO. If this were a customer-facing storefront, Next.js or SSR would be the right choice.
- **Purchase simulation** — The checkout flow is a simple stock reduction. Real commerce needs order management, payment processing, and fulfillment tracking.

**Questions I'd ask in a real project:**
1. Do users need to belong to multiple organizations with different roles?
2. What permission model is needed — predefined roles or custom role-permission assignments?
3. How important is SEO? Does this need to be customer-facing or purely internal?
4. What's the expected product catalog size? This affects search, pagination, and image strategy.
5. Is inventory serialized (tracking individual units) or bulk quantity?
6. What notification channels are needed — email, SMS, push, in-app only?

The answers to these would significantly change the database schema, API design, auth layer, and frontend architecture.

## What's Next

**With more time, I'd prioritize based on user feedback — which features are requested most often and which deliver the highest value.** Specific additions:

- **Email/SMS notifications** — Low-stock alerts delivered to phone, not just in-app banners that can feel intrusive
- **Automatic reorder** — System detects low stock and auto-places orders, or sends a one-click approval link
- **Product categories** — Organize products for easier browsing and searching
- **Product image CDN** — S3-backed image delivery with optimization
- **Accessibility themes** — Font size controls and dark/light mode for users in different environments
- **Configurable notification settings** — Let users control alert frequency and channels instead of mandatory popups
- **Order management** — Full purchase lifecycle with order history, returns, and supplier integration
