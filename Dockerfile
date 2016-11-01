FROM node:latest     
RUN npm install nodemon -g

COPY package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /dist && cp -a /tmp/node_modules /dist/ && cp -a /tmp/package.json /dist/

COPY www /dist/www/
COPY api /dist/api/
COPY server.js /dist/
COPY start.sh /dist/

WORKDIR /dist

EXPOSE 80

CMD ./start.sh
