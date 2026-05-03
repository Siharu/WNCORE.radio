# WNCORE Radio - Production Docker Image
# Multi-stage build for optimized image size

# ─── BUILD STAGE ─────────────────────────────────────────────────────────
FROM node:18-slim AS builder

WORKDIR /build

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build optimized assets
RUN npm run build || echo "Build script not required"

# ─── PRODUCTION STAGE ────────────────────────────────────────────────────
FROM node:18-slim

WORKDIR /app

# Security: Create non-root user
RUN useradd -m -u 1000 wncore

# Copy dist folder from builder
COPY --from=builder --chown=wncore:wncore /build/dist .
COPY --from=builder --chown=wncore:wncore /build/*.html .
COPY --from=builder --chown=wncore:wncore /build/*.js .
COPY --from=builder --chown=wncore:wncore /build/*.css .
COPY --from=builder --chown=wncore:wncore /build/*.json .
COPY --from=builder --chown=wncore:wncore /build/images ./images 2>/dev/null || true

# Install lightweight HTTP server
RUN npm install -g http-server

# Switch to non-root user
USER wncore

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV ADMIN_PASSWORD=${ADMIN_PASSWORD:-node09}
ENV ENABLE_ARG_MODE=true

# Start server
CMD ["http-server", ".", "-p", "3000", "-c-1", "--gzip"]
