FROM node:latest
RUN npm install nodemon -g

COPY package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /dist && cp -a /tmp/node_modules /dist/

COPY robots.txt /dist/
COPY content /dist/content/
COPY api /dist/api/
COPY client /dist/client/
COPY index.html /dist/

WORKDIR /dist

EXPOSE 80

CMD npm start