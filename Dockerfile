FROM node:10-alpine as client

WORKDIR /client

COPY client /client

RUN cd /client && npm install && npm run build



FROM node:10-alpine as server

WORKDIR /app

COPY server.js /app/
COPY package*.json /app/

COPY --from=client /client/build /app/client/build

RUN cd /app && npm install

ENTRYPOINT ["npm", "run", "server"]