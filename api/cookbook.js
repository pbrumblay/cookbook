'use strict';

class Cookbook {
  constructor(readModel, writeModel) {
    if(!(this instanceof Cookbook)) return new Cookbook(readModel, writeModel);

    if(!readModel || !writeModel) {
      throw new Error("Cookbook expects a read model and a write model")
    }

    this.readModel = readModel;
    this.writeModel = writeModel;
  }

  /**
   * Returns a Promise for a complete list of recipes,
   * minus any recipes marked invisible.
   */
  listRecipes(searchFilter) {
    var promise = this.readModel.getAll(searchFilter);
    return promise.then(function (foundRecipes) {
      return foundRecipes.filter(isVisible);
    });
  }

  /**
   * Returns a Promise for a recipe by ID. The Promise returns null if the
   * recipe isn't found or is marked invisible.
   */
  findRecipe(id) {
    var promise = this.readModel.getRecipeById(id);
    return promise.then(function (foundRecipe) {
      if (foundRecipe && foundRecipe.Visible) {
        return foundRecipe;
      } else {
        return null;
      }
    });
  }

  /**
   * Returns a Promise to add a recipe. Name and ingredients are required.
   * Throws an Error with name 'BadRequestError' if name or ingredients are missing.
   */
  addRecipe(recipe) {
    validateRecipe(recipe);
    return this.writeModel.createRecipe(recipe);
  }

  /**
   * Updates a recipe with a Promise. Recipe with ID required.
   * Throws an Error if recipe ID isn't found or name or ingredients missing.
   */
  changeRecipe(id, updatedRecipe) {
    return this.readModel.getRecipeById(id).then(function (storedRecipe) {
      if (!storedRecipe) {
        throw Error("Recipe ID not found.");
      }
      validateRecipe(updatedRecipe);
      return this.writeModel.saveRecipe(id, updatedRecipe);
    }.bind(this));
  }

  /**
   * Deletes a recipe with a Promise. Recipe with ID required.
   * Throws an error if recipe ID not found or if recipe is a favorite.
   */
  throwOutRecipe(id) {
    return this.readModel.getRecipeById(id).then(function (recipe) {
      if (!recipe) {
        throw new Error("Recipe ID not found.");
      }
      if (recipe.Favorite) {
        throw new Error("Cannot delete a favorite!");
      }
      return this.writeModel.deleteRecipe(id);
    }.bind(this));
  }
}

/**
 * Validates recipe input for required name and ingredients.
 * Throws an Error with name 'BadRequestError' if validation fails.
 */
function validateRecipe(recipe) {
  if (!recipe.Name || recipe.Name.length === 0) {
    throw {
      name: "BadRequestError",
      message: "Recipe name is required."
    }
  } else if (!recipe.Ingredients || recipe.Ingredients.length === 0) {
    throw {
      name: "BadRequestError",
      message: "Ingredients are required."
    }
  }
}

function isVisible(recipe) {
  return recipe.Visible;
}


module.exports = Cookbook;
