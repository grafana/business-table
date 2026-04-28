FROM node:24-slim@sha256:03eae3ef7e88a9de535496fb488d67e02b9d96a063a8967bae657744ecd513f2

WORKDIR /app

# Install pg dependency
RUN npm install pg@8

# Add docker-compose-wait for service readiness
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.12.1/wait /wait
RUN chmod +x /wait

COPY server.ts .

EXPOSE 3001

CMD /wait && node server.ts
