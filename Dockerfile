# ──────────────────────────────────────────────
# Stage 1 — Install dependencies
# ──────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# ──────────────────────────────────────────────
# Stage 2 — Build the Nuxt app + Prisma client
# ──────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# ──────────────────────────────────────────────
# Stage 3 — Production runtime
# ──────────────────────────────────────────────
FROM node:20-alpine AS runtime
WORKDIR /app

# Copy the Nuxt server output
COPY --from=build /app/.output ./.output

# Copy Prisma schema + migrations (needed for prisma migrate deploy)
COPY --from=build /app/prisma ./prisma

# Copy Prisma config (needed for prisma migrate deploy in Prisma 7.x)
COPY --from=build /app/prisma.config.ts ./prisma.config.ts

# Copy the generated Prisma client
COPY --from=build /app/lib/generated ./lib/generated

# Copy package files (needed for npx prisma)
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/package-lock.json ./package-lock.json

# Install only production deps + Prisma CLI for migrations
RUN npm install --omit=dev && npx prisma --version

ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
