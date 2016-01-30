FROM node:latest

RUN mkdir /dist

RUN npm install nodemon -g

COPY package.json /dist/package.json

RUN cd /dist && npm install

COPY *.js /dist/
COPY model /dist/model

WORKDIR /dist

EXPOSE 8080

CMD npm start