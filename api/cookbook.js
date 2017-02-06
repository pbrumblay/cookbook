'use strict';

const ReadModel = require("./model/read-model");
const WriteModel = require("./model/write-model");
const Boom = require('boom');

const readModel = new ReadModel();
const writeModel = new WriteModel();

/**
 * Validates recipe input for required name and ingredients.
 */
function validateRecipe(recipe) {
    if (!recipe.Name || recipe.Name.length === 0) {
        return Boom.badRequest("Recipe name is required.");
    } else if (!recipe.Ingredients || recipe.Ingredients.length === 0) {
        return Boom.badRequest("Ingredients are required.");
    }
    return null;
}

function isVisible(recipe) {
    return recipe.Visible;
}

function getAll (request, reply) {
    const searchFilter = request.query.searchText;
    const result = readModel.getAll(searchFilter).then(
        foundRecipes => {
            return foundRecipes.filter(isVisible);
        }
    );
    return reply(result);
}

function get(request, reply) {
    const id = request.params.param;
    if(!id) {
        return getAll(request, reply);
    } else {
        const result = readModel.getRecipeById(request.params.param).then(result => {

            if (!result) {
                return Boom.notFound('Recipe not found.');
            }
            return result;
        });
        return reply(result);
    }
}

function getCategories(request, reply) {
    reply(readModel.getDistinctCategories());
}

function changeRecipe(request, reply) {
    const id = request.params.param;
    const updatedRecipe = request.payload;

    const result = readModel.getRecipeById(id).then(result => {
        if (!result) {
            return Boom.notFound("Recipe ID not found.");
        }

        const validationError = validateRecipe(updatedRecipe);
        if(validationError) return validationError;

        return writeModel.saveRecipe(id, updatedRecipe);
    });

    return reply(result);
}

function deleteRecipe(request, reply) {
    const id = request.params.param;

    const result = readModel.getRecipeById(id).then(result => {
        if (!result) {
            return Boom.notFound('Recipe ID not found.');
        }

        if (result.Favorite) {
            return Boom.badRequest('Cannot delete a favorite!');
        }

        return writeModel.deleteRecipe(id);
    });

    return reply(result);
}

function create(request, reply) {
    const newRecipe = request.payload;

    const validationError = validateRecipe(newRecipe);
    if(validationError) return reply(validationError);

    return reply(writeModel.createRecipe(newRecipe));
}


module.exports = {
    get: get,
    getCategories: getCategories,
    changeRecipe: changeRecipe,
    deleteRecipe: deleteRecipe,
    create : create
};