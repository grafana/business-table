FROM node:24-slim@sha256:ba849c60be29959425b8734d57b8b4b7d56f98edd9504c9af091d5281095a71e

WORKDIR /app

# Install pg dependency
RUN npm install pg@8

# Add docker-compose-wait for service readiness
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.12.1/wait /wait
RUN chmod +x /wait

COPY server.ts .

EXPOSE 3001

CMD /wait && node server.ts
