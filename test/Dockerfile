# Get the latest version of Playwright (browsers are pre-installed)
FROM mcr.microsoft.com/playwright:v1.59.1-noble

# Set the work directory for the application
WORKDIR /app

# Install dependencies first for better layer caching
COPY package*.json ./
RUN npm ci

# Install browsers (they are pre-installed in the base image but may be outdated)
RUN npx playwright install --with-deps chromium

# Copy test files, source (test helpers import from src/), config, and provisioning
COPY test/ test/
COPY src/ src/
COPY playwright.config.ts .
COPY tsconfig.json .
COPY provisioning/ provisioning/

# Run tests
CMD ["npm", "run", "test:e2e"]
