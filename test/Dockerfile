# syntax=docker/dockerfile:1.7@sha256:a57df69d0ea827fb7266491f2813635de6f17269be881f696fbfdf2d83dda33e

# Browsers are pre-installed in this image. Keep the version in lockstep with
# @playwright/test in package.json — see AGENTS.md.
FROM mcr.microsoft.com/playwright:v1.59.1-noble@sha256:b0ab6f3cb99aa7803adbc14d9027ec1785fc6e433b97e134e0f8fe61683b6b53

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
