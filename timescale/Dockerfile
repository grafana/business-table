FROM node@sha256:9e69791906aaabda0fc123beb81861d53bcdf4e9611c15df0b916fff5c1ccc02

## Create app directory
WORKDIR /app

## Copy Server
COPY server.ts .

## Add Postgres package
RUN yarn add pg

## Add the wait script to the image
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

EXPOSE 3001

CMD /wait && node server.ts
