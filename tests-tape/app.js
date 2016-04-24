'use strict';

let restify = require('restify');
let test = require('tape');
let proxyquire = require('proxyquire');
//let sinon = require('sinon');
//let app = require('../app');
let app = proxyquire('../app',{
    './model/mongo/mongo-read-model': require("../model/json/json-read-model"),
    './model/mongo/mongo-write-model': require("../model/json/json-write-model")
});

let sourceRecipes = require('../model/json/recipes.json');
let client = restify.createJsonClient({
    version: '*',
    url: 'http://localhost:8080'
});

test('Get All Recipes', function (t) {
    client.get('/recipes', function(err, req, res, recipes){
        t.plan(2);
        t.notEqual(null, recipes, 'Recipe data is not null');
        t.ok(recipes.length > 0, 'We have recipes');
        //t.end();
    });
});

test('Find a Recipe', function (t) {
    client.get('/recipes/3', function(err, req, res, recipe){
        t.plan(4);
        t.notEqual(null, recipe, 'We have a recipe');
        t.notEqual(null, recipe.Ingredients, 'We have recipe ingredients');
        t.equal(sourceRecipes[2].Name, recipe.Name, 'Recipe names are equal');
        t.equal(sourceRecipes[2].Description, recipe.Description, 'Recipe descriptions are equal');
        //t.end();
    });
});

test.onFinish(function() {
    client.close();
    process.exit();
});

