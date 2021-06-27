FROM node:14-alpine AS build

WORKDIR /root/polls-server

COPY client ./client
COPY server ./server
COPY shared ./shared
COPY docker-build.sh .

RUN ./docker-build.sh

FROM build AS deploy

WORKDIR /root/polls-server/server

CMD node ./build/index.js
