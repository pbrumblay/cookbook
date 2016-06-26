'use strict';
const Path = require('path');
const Hapi = require('hapi');
const Inert = require('inert');
const cookbook = require('./api/cookbook');
const healthcheck = require('./api/healthcheck');
const auth = require('./api/auth');
const jwtSecret = process.env.JWT_SECRET;

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

server.register(Inert, () => {});

server.register(require('hapi-auth-jwt2'), function (err) {

  if (err) {
    console.log(err);
  }

  server.auth.strategy('jwt', 'jwt',
      {
        key: jwtSecret,
        validateFunc: auth.isValidUser,
        verifyOptions: {algorithms: ['HS256']},
      });

  server.auth.strategy('jwtAdmin', 'jwt',
      {
        key: jwtSecret,
        validateFunc: auth.isAdminUser,
        verifyOptions: {algorithms: ['HS256']},
      });

  server.auth.default('jwt');
});


server.route({
  method: 'GET',
  path: '/{param*}',
  config: { auth: false },
  handler: {
    directory: {
      path: 'www'
    }
  },
});

server.route({
  method: 'GET',
  path: '/api/recipes/{param*}',
  handler: cookbook.get
});

server.route({
  method: 'PUT',
  config: { auth: 'jwtAdmin' },
  path: '/api/recipes/{param*}',
  handler: cookbook.changeRecipe,
});

server.route({
  method: 'POST',
  config: { auth: 'jwtAdmin' },
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
  config: { auth: false },
  path: '/api/',
  handler: healthcheck.hello
});

server.route({
  method: 'GET',
  config: { auth: false },
  path: '/api/live',
  handler: healthcheck.live
});

server.route({
  method: 'GET',
  config: { auth: false },
  path: '/api/ready',
  handler: healthcheck.ready
});

server.route({
  method: 'POST',
  config: { auth: false },
  path: '/api/auth',
  handler: auth.login
});

server.start((err) => {

  if (err) {
    throw err;
  }

  console.log('Server running at:', server.info.uri);
});