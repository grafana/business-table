FROM node@sha256:2e45682ea560ac050cca0fd1ff5e82457a717a98e95e30bbf93306833a31332c

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
