# Get the latest version of Playwright (browsers are pre-installed)
FROM mcr.microsoft.com/playwright:v1.59.1-noble

# Set the work directory for the application
WORKDIR /app

# Install dependencies first for better layer caching
COPY package*.json ./
RUN npm ci

# Copy test files, config, and provisioning
COPY test/ test/
COPY playwright.config.ts .
COPY provisioning/ provisioning/

# Run tests
CMD ["npm", "run", "test:e2e"]
