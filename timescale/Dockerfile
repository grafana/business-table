FROM node:24-slim

WORKDIR /app

# Install pg dependency
RUN npm install pg@8

# Add docker-compose-wait for service readiness
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.12.1/wait /wait
RUN chmod +x /wait

COPY server.ts .

EXPOSE 3001

CMD /wait && node server.ts
