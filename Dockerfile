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

COPY package.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma

# install only prisma and dotenv
RUN PRISMA_VERSION=$(node -p "require('./package.json').devDependencies?.prisma || require('./package.json').dependencies?.prisma || 'latest'") && \
    DOTENV_VERSION=$(node -p "require('./package.json').devDependencies?.dotenv || require('./package.json').dependencies?.dotenv || 'latest'") && \
    echo '{"name":"migration","private":true}' > package.json && \
    npm install --ignore-scripts --no-audit --no-fund "prisma@$PRISMA_VERSION" "dotenv@$DOTENV_VERSION" && \
    rm -rf /app/node_modules/@prisma/query-engine-wasm && \
    find /app/node_modules -name "libquery_engine*" -delete && \
    find /app/node_modules -name "query_engine*" -delete && \
    rm -rf /root/.npm /tmp/* package-lock.json

CMD ["./node_modules/.bin/prisma", "migrate", "deploy"]

# ==========================
# Production Builder
# ==========================
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# dummy DATABASE_URL for prisma generate
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

RUN npx prisma generate

RUN npm run build

# ==========================
# Production (Minimal)
# ==========================
FROM base AS prod

# nextjs standalone build
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

USER node

EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=5s --start-period=15s --retries=3 \
CMD node -e "fetch('http://localhost:3000/').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

CMD ["node", "server.js"]

