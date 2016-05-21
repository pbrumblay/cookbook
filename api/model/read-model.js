'use strict';

var db = require('./db');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var Recipe = mongoose.model('Recipe');

class ReadModel {
  getAll(searchFilter) {
    if(searchFilter) {
      let regex = new RegExp(searchFilter, "i")
      return Recipe.find(
          {
            $or: [ { Name: regex}, { Description: regex}, { IngredientsSearchText: regex} ]
          }).sort({ Name: 1});
    }
    return Recipe.find().sort({ Name: 1});
  }

  getRecipeById(id) {
    return Recipe.findOne({ "Id": id });
  }

  getDistinctCategories() {
    return Recipe.find().distinct("CategoryName").then(f => {
      return f.sort();
    });
  }
}

module.exports = ReadModel;
