FROM node:24-slim@sha256:55fb5f5a527ea2c5c4a95f963e48ef90aa38c7b346054fdc8ee9957a2b55d205

WORKDIR /app

# Install pg dependency
RUN npm install pg@8

# Add docker-compose-wait for service readiness
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.12.1/wait /wait
RUN chmod +x /wait

COPY server.ts .

EXPOSE 3001

CMD /wait && node server.ts
