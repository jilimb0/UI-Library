# Multi-stage production container build for UI-Library showcase & apps

# Stage 1: Build workspace
FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.7.0 --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml turbo.json ./
COPY packages/ ./packages/
COPY apps/ ./apps/
COPY public/ ./public/
COPY scripts/ ./scripts/
COPY tsconfig*.json ./

RUN pnpm install --frozen-lockfile
RUN pnpm build

# Stage 2: Production runtime with unprivileged user
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install lightweight static server
RUN npm install -g serve

# Copy built showcase artifacts
COPY --from=builder /app/apps/showcase/dist ./public
COPY --from=builder /app/public ./public/shared

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

CMD ["serve", "-s", "public", "-l", "3000"]
