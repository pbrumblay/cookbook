FROM node:latest

RUN mkdir /dist
RUN mkdir /data

COPY package.json /dist/
RUN cd /dist && npm install

COPY data.json /data/
COPY *.js /dist/

WORKDIR /dist

CMD node import-mongo.js
