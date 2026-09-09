FROM node:24-alpine AS ui-builder

WORKDIR /app/ui

COPY ui/package*.json ./
RUN npm ci

COPY ui/ ./
RUN npm run build

FROM node:24-alpine AS api-builder

WORKDIR /app/api

COPY api/package*.json ./
RUN npm ci

COPY api/ ./

COPY --from=ui-builder /app/ui/dist ./public

RUN npx nest build

FROM node:24-alpine AS runner

WORKDIR /app/api

COPY --from=api-builder /app/api/node_modules ./node_modules
COPY --from=api-builder /app/api/dist ./dist
COPY --from=api-builder /app/api/public ./public
COPY --from=api-builder /app/api/package.json ./
COPY --from=api-builder /app/api/prisma ./prisma

ENV NODE_ENV=production
ENV UI_PATH=./public

RUN npx prisma generate

EXPOSE 3000

CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node dist/main.js"]
