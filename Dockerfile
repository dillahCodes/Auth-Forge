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
# Migration (Minimal)
# ==========================
FROM base AS migration

ENV PRISMA_CLI_BINARY_TARGETS=native

COPY package-lock.json ./

# install minimal dependencies (prisma & dotenv only)
RUN PRISMA_VERSION=$(node -p "require('./package-lock.json').packages['node_modules/prisma']?.version || require('./package-lock.json').dependencies?.prisma?.version") && \
    DOTENV_VERSION=$(node -p "require('./package-lock.json').packages['node_modules/dotenv']?.version || require('./package-lock.json').dependencies?.dotenv?.version || 'latest'") && \
    npm install --ignore-scripts --no-audit --no-fund "prisma@$PRISMA_VERSION" "dotenv@$DOTENV_VERSION" && \
    rm -rf /app/node_modules/@prisma/query-engine-wasm && \
    find /app/node_modules -name "libquery_engine*" -delete && \
    find /app/node_modules -name "query_engine*" -delete && \
    rm -rf /root/.npm /tmp/* package-lock.json

# clean up devDependencies & bloat brought by standalone build
RUN rm -rf \
    node_modules/@types \
    node_modules/typescript \
    node_modules/prettier \
    node_modules/@swc/core* \
    && find node_modules -name "*.map" -delete \
    && find node_modules -name "*.md" -delete \
    && find node_modules -name "prisma-fmt*" -delete \
    && find node_modules -type d -name "test" -exec rm -rf {} + \
    && find node_modules -type d -name "tests" -exec rm -rf {} +

COPY prisma.config.ts ./
COPY prisma ./prisma

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

# nextjs standalone build
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

# prisma build
COPY --from=migration --chown=node:node /app/node_modules ./node_modules
COPY --from=migration --chown=node:node /app/prisma ./prisma
COPY --from=migration --chown=node:node /app/prisma.config.ts ./

USER node

EXPOSE 3000

CMD ["sh", "-c", "./node_modules/.bin/prisma migrate deploy && node server.js"]

