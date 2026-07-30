# ==========================
# Base
# ==========================
FROM node:22-alpine AS base

WORKDIR /app

# Disable Vercel collecting telemetry data from this app
ENV NEXT_TELEMETRY_DISABLED=1

# ==========================
# Install Dependencies
# ==========================
FROM base AS deps

COPY package*.json ./

RUN npm ci

# ==========================
# Development
# ==========================
FROM base AS dev

COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./

EXPOSE 3000

CMD [ "npm", "run", "dev" ]

# ==========================
# Production Builder
# ==========================
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ==========================
# Production
# ==========================
FROM base AS prod

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

USER node

EXPOSE 3000

CMD [ "node", "server.js" ]

