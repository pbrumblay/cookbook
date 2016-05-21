'use strict';
const Path = require('path');
const Hapi = require('hapi');
const Inert = require('inert');
const api = require('./api/api');
const healthcheck = require('./api/healthcheck');

function throwOut(req, res, next) {
  cookbook.throwOutRecipe(req.params.id).then(function (r) {
    res.send(200);
    next();
  }).catch(function (e) {
    if (e.message === "Recipe ID not found.") {
      res.send(404);
    } else if (e.message === "Cannot delete a favorite!") {
      res.send(405, e.message);
    } else {
      res.send(500, e.message);
    }
    next();
  });
}

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
  handler: api.get
});

server.route({
  method: 'PUT',
  path: '/api/recipes/{param*}',
  handler: api.changeRecipe
});

server.route({
  method: 'POST',
  path: '/api/recipes',
  handler: api.create
});

server.route({
  method: 'GET',
  path: '/api/categories/{param*}',
  handler: api.getCategories
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

server.start((err) => {

  if (err) {
    throw err;
  }

  console.log('Server running at:', server.info.uri);
});