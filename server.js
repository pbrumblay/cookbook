'use strict';
const Path = require('path');
const Hapi = require('hapi');
const Inert = require('inert');
const cookbook = require('./api/cookbook');
const healthcheck = require('./api/healthcheck');
const auth = require('./api/auth');

/* Initialize server and routes */

const server = new Hapi.Server({
  connections: {
    routes: {
      files: {
        relativeTo: Path.join(__dirname, '.')
      }
    }
  }
});
server.connection({ port: 80 });

server.register(Inert, () => {})

server.route({
  method: 'GET',
  path: '/{param*}',
  handler: {
    directory: {
      path: 'www'
    }
  }
});

server.route({
  method: 'GET',
  path: '/api/recipes/{param*}',
  handler: cookbook.get
});

server.route({
  method: 'PUT',
  path: '/api/recipes/{param*}',
  handler: cookbook.changeRecipe
});

server.route({
  method: 'POST',
  path: '/api/recipes',
  handler: cookbook.create
});

server.route({
  method: 'GET',
  path: '/api/categories/{param*}',
  handler: cookbook.getCategories
});

server.route({
  method: 'GET',
  path: '/api/',
  handler: healthcheck.hello
});

server.route({
  method: 'GET',
  path: '/api/live',
  handler: healthcheck.live
});

server.route({
  method: 'GET',
  path: '/api/ready',
  handler: healthcheck.ready
});

server.route({
  method: 'POST',
  path: '/api/auth',
  handler: auth.login
});

server.start((err) => {

  if (err) {
    throw err;
  }

  console.log('Server running at:', server.info.uri);
});