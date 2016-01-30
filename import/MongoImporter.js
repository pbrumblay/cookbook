'use strict';

const fs = require("fs");
const JSONStream = require("JSONStream");
const through = require("through");
const Recipe = require("./recipe.js");

class MongoImporter {
    constructor(dataFile) {
        this.dataFile = dataFile;
    }

    clean() {
        console.log('removing recipes');

        return new Promise(resolve => {
            Recipe.remove({}, resolve);
        });
    }


    import() {
        return new Promise(resolve => {
            let inFile = fs.createReadStream(this.dataFile);
            let parser = JSONStream.parse("*");
            inFile.on('end', resolve);
            inFile.pipe(parser).pipe(converter(this.mongoose));
        });
    }
}

function converter(client) {

    let stream = through(data => {
        let recipe = new Recipe(data);

        recipe.save((err) => {
            if(err) {
                console.log(err);
                console.log('Error with recipe data: ' + JSON.stringify(recipe));
            }
        });
    })
    return stream;
}

module.exports = MongoImporter;