# syntax=docker/dockerfile:1.23@sha256:2780b5c3bab67f1f76c781860de469442999ed1a0d7992a5efdf2cffc0e3d769

# Browsers are pre-installed in this image. Keep the version in lockstep with
# @playwright/test in package.json — see AGENTS.md.
FROM mcr.microsoft.com/playwright:v1.59.1-noble

# Set the work directory for the application
WORKDIR /app

# Install dependencies first for better layer caching. The BuildKit cache
# mount reuses npm tarballs across builds when the layer itself misses.
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --prefer-offline

# Copy test files, source (test helpers import from src/), config, and provisioning
COPY test/ test/
COPY src/ src/
COPY .config/tsconfig.json .config/tsconfig.json
COPY playwright.config.ts .
COPY tsconfig.json .
COPY provisioning/ provisioning/

# Run tests
CMD ["npm", "run", "test:e2e"]
