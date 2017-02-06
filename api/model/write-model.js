const Datastore = require('@google-cloud/datastore');
const datastore = Datastore({
    projectId: 'cookbook-1180'
});
const RECIPE = 'Recipe';

class WriteModel {
    createRecipe(newRecipe) {
        const key = datastore.key([RECIPE]);

        return datastore.allocateIds(key, 1).then(response => {
            newRecipe.Id = response[0][0].id;
            const dsRecipe = {
                key: response[0][0],
                data: this.convertToExplicit(newRecipe),
            }
            return datastore.insert(dsRecipe).then(r => {
                console.log(`Created ${dsRecipe.key.id} : ${newRecipe.Name}`);
                return newRecipe;
            });
        });
    }

    saveRecipe(id, newRecipe) {
        const key = datastore.key([RECIPE, id]);

        const dsRecipe = {
            key: key,
            data: this.convertToExplicit(newRecipe),
        }
        return datastore.upsert(dsRecipe).then(r => {
            console.log(`Saved ${dsRecipe.key.id} : ${newRecipe.Name}`);
            return newRecipe;
        });
    }

    deleteRecipe(id) {
        const key = datastore.key([RECIPE, id]);

        return datastore.delete(key).then(r => {
            console.log(`Deleted ${id}`);
        });
    }

    convertToExplicit(recipe) {
        return [
            {name: 'Id', value: recipe.Id,},
            {name: 'Name', value: recipe.Name,},
            {name: 'CategoryName', value: recipe.CategoryName,},
            {name: 'Description', value: recipe.Description,},
            {name: 'Source', value: recipe.Source,},
            {name: 'Instructions', value: recipe.Instructions, excludeFromIndexes: true},
            {name: 'IngredientsSearchText', value: recipe.IngredientsSearchText,},
            {name: 'Visible', value: recipe.Visible,},
            {name: 'Ingredients', value: recipe.Ingredients,},
            {name: 'Favorite', value: recipe.Favorite,},
        ];
    }
}

module.exports = WriteModel;
