var mongoose = require('mongoose');

var recipeSchema = new mongoose.Schema({
  Name: String,
  Description: String,
  Source: String,
  Instructions: String,
  IngredientsSearchText: String,
  Visible: Boolean,
  Favorite: Boolean,
  Ingredients: [{ Name: String, Amount: String }],
  CategoryName: String,
  Id: Number
});

module.exports = mongoose.model('Recipe', recipeSchema, 'recipes');