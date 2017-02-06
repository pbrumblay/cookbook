const test = require('tape');

const WriteModel = require('../api/model/write-model.js');
const ReadModel = require('../api/model/read-model.js');

const sut = new WriteModel();
const readModel = new ReadModel();

const recipe =  {
    "Name":"Chicken Fried Chicken",
    "Description":"Because we 'chicken' fry it.",
    "Source":"Your Mom",
    "Instructions":"Flour. Oil. Pan",
    "IngredientsSearchText":"flour oil chicken",
    "Visible":true,
    "Favorite":false,
    "Ingredients":[
        {
            "Name":"flour",
            "Amount":"a lot"
        },
        {
            "Name":"oil",
            "Amount":"a lot"
        },
        {
            "Name": "chicken",
            "Amount": "as much as you can"
        }
    ],
    "CategoryName":"Murica",
}

test('Create, Update, Delete Recipe', t => {
    let newId = -1;
    sut.createRecipe(recipe)
        .then(result => {
            newId = result.Id;
            t.equal(result.Name, "Chicken Fried Chicken");
            result.Name = "Chicken Fried Chicken Chicken";
            return sut.saveRecipe(result.Id, result);
        })
        .then(result => {
            t.equal(result.Name, "Chicken Fried Chicken Chicken");
            return readModel.getRecipeById(result.Id);
        })
        .then(result => {
            t.equal(result.Name, "Chicken Fried Chicken Chicken")
            return sut.deleteRecipe(result.Id);
        })
        .then(() => {
            return readModel.getRecipeById(newId);
        })
        .then(result => {
            t.false(result);
            t.end();
        });
});

