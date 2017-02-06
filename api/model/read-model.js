const Datastore = require('@google-cloud/datastore');
const datastore = Datastore({
    projectId: 'cookbook-1180'
});
const RECIPE = 'Recipe';

class ReadModel {
    getRecipes(searchFilter) {
        const query = datastore.createQuery(RECIPE)
            .order('Name');

        return datastore.runQuery(query).then(results => {
            if(searchFilter && typeof searchFilter === 'string') {
                const lowerFilter = searchFilter.toLowerCase();
                const filteredResults = [];
                results[0].forEach(r => {

                    const searchStr = `${r.Name} ${r.Description} ${r.CategoryName} ${r.IngredientsSearchText}`.toLowerCase();

                    if(searchStr.toLowerCase().includes(lowerFilter)) {
                        filteredResults.push(r);
                    }
                });
                return filteredResults;
            } else {
                return results[0];
            }
        });
    }

    getRecipeById(id) {
        const key = datastore.key([RECIPE, id]);
        return datastore.get(key).then(results => {
            if(!results || results.length === 0) {
                return null;
            } else {
                return results[0];
            }
        });
    }

    getDistinctCategories() {
        const categoryNames = [];

        const query = datastore.createQuery(RECIPE)
            .select(['CategoryName'])
            .groupBy('CategoryName')
            .order('CategoryName');

        return datastore.runQuery(query)
            .then(results => {
                const catNames = results[0];
                catNames.forEach(cat => {
                    categoryNames.push(cat.CategoryName);
                })
                return categoryNames;
            });
    }
}

module.exports = ReadModel;
