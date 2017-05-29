FROM node:latest
RUN npm install nodemon -g

COPY package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /dist && cp -a /tmp/node_modules /dist/ && cp -a /tmp/package.json /dist/

COPY . /dist
RUN chown node:node /dist
WORKDIR /dist
USER node
ENV GOOGLE_APPLICATION_CREDENTIALS /home/node/creds/datastore-svc-acct.json

EXPOSE 8080

CMD ./start.sh
