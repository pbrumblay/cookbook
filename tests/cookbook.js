'use strict';

const test = require('tape');
const FakeModel = require('./fake-model');
const Cookbook = require('../api/cookbook');
let fakeModel = new FakeModel();
let sut = new Cookbook(fakeModel, fakeModel);

test('Find a Recipe', function (t) {
    sut.findRecipe(3).then(function (recipe) {

        t.ok(recipe, 'We have a recipe');
        t.ok(recipe.Ingredients, 'We have recipe ingredients');
        t.equal(recipe.Name, fakeModel.getInternalRecipes()[2].Name, 'Recipe names are equal');
        t.equal(recipe.Description, fakeModel.getInternalRecipes()[2].Description, 'Recipe descriptions are equal');
        t.end();
    });
});

test('Cannot Find Invisible Recipe', function (t) {

    sut.findRecipe(19).then(function (recipe) {
        t.equal(recipe, null, 'Invisible recipes cannot be found');
        t.end();
    });
});

test('List Recipes', function (t) {

    sut.listRecipes().then(function (recipeList) {

        t.notEqual(recipeList, null, 'We have a list of recipes');
        t.equal(recipeList.length, 3, 'All visible recipes listed');
        t.end();
    });
});

test('Add Test Recipe', function (t) {

    let recipe = {
        "Id": 42,
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
            t.notEqual(found, null, 'Our new recipe is not null');
            t.ok(found.Id > 0, 'Our new recipe Id is > 0');
            t.equal(found.Id, recipe.Id, 'Our new recipe Id is a match');
            t.end();
        });
    })
    .catch(function(e) {
        assert.fail(e);
    });


});
