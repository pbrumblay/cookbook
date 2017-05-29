const test = require('tape');

const ReadModel = require('../api/model/read-model.js');

const sut = new ReadModel();

test('Find a Recipe by Id', t => {
    sut.getRecipeById(2).then(result => {
        t.equal(result.Name, "Chicken Fajitas");
        t.end();
    });
});

test('Get distinct categories', t => {
    sut.getDistinctCategories().then(results => {
        t.equal(results[1], "Beef");
        t.end();
    });
});

test('Get all recipes without filter', t => {
    sut.getRecipes().then(results => {
        t.ok(results.length > 100);
        t.equal(results[0].Name, "Apple Dumplings - Danish Style");
        t.end();
    });
});

test('Get all recipes with filter', t => {
    sut.getRecipes('apple').then(results => {
        t.ok(results.length > 0);
        t.equal(results[0].Name, "Apple Dumplings - Danish Style");
        t.end();
    });
});
