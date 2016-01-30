'use strict';

let test = require('tape');
let ReadModel = require("../model/json/json-read-model");
let WriteModel = require("../model/json/json-write-model");
let FakeReadModel = require('../tests/fake-read-model');
let Cookbook = require('../cookbook');
let sourceRecipes = require('../model/json/recipes.json');
let sut = new Cookbook(new ReadModel(), new WriteModel());

test('Find a Recipe', function (t) {
    //experiment with a fake object:
    let fakeReadModel = new FakeReadModel();
    let writeModel = new WriteModel();
    let fakeedSut = new Cookbook(fakeReadModel, writeModel);

    fakeedSut.findRecipe(3).then(function (recipe) {
        t.notEqual(null, recipe, 'We have a recipe');
        t.notEqual(null, recipe.Ingredients, 'We have recipe ingredients');
        t.equal(sourceRecipes[2].Name, recipe.Name, 'Recipe names are equal');
        t.equal(sourceRecipes[2].Description, recipe.Description, 'Recipe descriptions are equal');
        t.end();
    });
});

test('Cannot Find Invisible Recipe', function (t) {
    sut.findRecipe(19).then(function (recipe) {
        t.equal(null, recipe, 'Invisible recipes cannot be found');
        t.end();
    });
});

test('List Recipes', function (t) {
    sut.listRecipes().then(function (recipeList) {
        t.plan(3);
        t.notEqual(null, recipeList, 'We have a list of recipes');
        t.equal(115, recipeList.length, 'All visible recipes listed');
        t.equal(1, recipeList[0].Id, 'Recipes returned in Id order');
    });
});

test('Add Test Recipe', function (t) {
    t.plan(3);
    let recipe = {
        "Name":"Pizza",
        "Description":"Plain Jane American food.",
        "Visible":true,
        "Ingredients":[
            {
                "Name":"dough",
                "Amount":"enough"
            },
            {
                "Name":"cheese",
                "Amount":"lots"
            }
        ],
        "CategoryName":"Boring"
    };

    sut.addRecipe(recipe)
    .then(function() {
        sut.findRecipe(recipe.Id).then(function (found) {
            t.notEqual(null, found, 'Our new recipe is not null');
            t.ok(found.Id > 0, 'Our new recipe Id is > 0');
            t.equal(recipe.Id, found.Id, 'Our new recipe Id is a match');
        });
    })
    .catch(function(e) {
        assert.fail(e);
    });


});
