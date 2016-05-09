'use strict';
const Path = require('path');
const Hapi = require('hapi');
const Inert = require('inert');

const ReadModel = require("./api/model/read-model");
const WriteModel = require("./api/model/write-model");
const Cookbook = require('./api/cookbook');

let readModel = new ReadModel();
let writeModel = new WriteModel();
let cookbook = new Cookbook(readModel, writeModel);

function getAll(request, reply) {
  let searchFilter = request.query.searchText;
  cookbook.listRecipes(searchFilter).then(function (recipes) {
    reply(recipes);
  });
}

function get(request, reply) {
  if(request.params.param) {
    cookbook.findRecipe(request.params.param).then(function (recipe) {
      if (recipe) {
        reply(recipe);
      } else {
        reply.send(404);
      }
    });
  } else {
    getAll(request, reply);
  }
}

function getCategories(req, res, next) {
  res.send(["Beef", "Chicken", "Pork", "Vegetarian"]);
  next();
}

function create(req, res, next) {
    cookbook.addRecipe(req.body).then(function (r) {
      res.setHeader('Location', req.url + "/" + req.body.Id);
      res.send(201);
      next();
    }).catch(function (e) {
      if (e.name === "BadRequestError") {
        res.send(400, e.message);
      } else {
        res.send(500, e.message);
      }
      next();
    });
}

function save(req, res, next) {
  var recipe = req.body;
  cookbook.changeRecipe(req.params.id, recipe).then(function (r) {
    res.send(recipe);
    next();
  }).catch(function (e) {
    if (e.name === "BadRequestError") {
      res.send(400, e.message);
    } else if (e.message === "Recipe ID not found."){
      console.log('responding 404');
      res.send(404);
    } else {
      console.log('responding 500');
      res.send(500, e.message);
    }
  });
}

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
  handler: get
});

server.start((err) => {

  if (err) {
    throw err;
  }

  console.log('Server running at:', server.info.uri);
});