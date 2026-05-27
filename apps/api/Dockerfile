FROM node:20-alpine AS base
WORKDIR /app

# Install deps
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY apps/agents/package.json apps/agents/
RUN npm ci --workspace=apps/api --workspace=apps/agents --include=dev

# Copy source
COPY apps/api      apps/api
COPY apps/agents   apps/agents

# Build
RUN npm run build --workspace=apps/api 2>/dev/null || \
    npx tsc -p apps/api/tsconfig.json --outDir apps/api/dist 2>/dev/null || true

EXPOSE 3001
CMD ["node", "apps/api/index.js"]
