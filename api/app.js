'use strict';
const restify = require('restify');

const ReadModel = require("./model/read-model");
const WriteModel = require("./model/write-model");
const Cookbook = require('./cookbook');

let readModel = new ReadModel();
let writeModel = new WriteModel();
let cookbook = new Cookbook(readModel, writeModel);

function getAll(req, res, next) {
  let searchFilter = req.query.searchText;
  cookbook.listRecipes(searchFilter).then(function (recipes) {
    res.send(recipes);
    next();
  });
}

function get(req, res, next) {
  cookbook.findRecipe(req.params.id).then(function (recipe) {
    if (recipe) {
      res.send(recipe);
    } else {
      res.send(404);
    }
    next();
  });
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

let server = restify.createServer();
server.use(restify.bodyParser());
server.use(restify.queryParser());

server.get('/recipes', getAll);
server.get('/categories', getCategories);
server.post('/recipes', create);
server.get('/recipes/:id', get);
server.put('/recipes/:id', save);
server.del('/recipes/:id', throwOut);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
