FROM node:24-slim@sha256:c86ecead9e55a5210ac1727de38a4ca840bf03dcaf34dc9749addbf383b1920c

WORKDIR /app

# Install pg dependency
RUN npm install pg@8

# Add docker-compose-wait for service readiness
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.12.1/wait /wait
RUN chmod +x /wait

COPY server.ts .

EXPOSE 3001

CMD /wait && node server.ts
