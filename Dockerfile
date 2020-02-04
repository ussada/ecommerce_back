FROM node:8.15.1-alpine

RUN mkdir -p /home/node/app/node_modules

WORKDIR /home/node/app

COPY package*.json /home/node/app/

RUN npm install

COPY . /home/node/app

EXPOSE 3000

CMD node server.js