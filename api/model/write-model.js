'use strict';

var db = require('./db');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var Recipe = mongoose.model('Recipe');

class WriteModel {
  createRecipe(recipe) {
    // Get the maximum Id in use. Save this recipe with maxId + 1
    return Recipe.findOne().sort("-Id").limit(1).then(function (r) {
      recipe.Id = r.Id + 1;
      const recipeDoc = new Recipe(recipe);
      return recipeDoc.save();
    });
  }

  saveRecipe(id, newRecipe) {
    // Update recipe by Id. Ask mongo to return the "new" representation
    // of the document in the database.
    return Recipe.findOneAndUpdate({"Id": id}, newRecipe, {new: true});
  }

  deleteRecipe(id) {
    return Recipe.findOneAndRemove({"Id": id});
  }
}

module.exports = WriteModel;
