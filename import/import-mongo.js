'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const MongoImporter = require('./MongoImporter');


console.log('connecting...');
mongoose.connect('mongodb://db:27017/cookbook');

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

console.log('importing data');
let importer = new MongoImporter('/data/data.json', mongoose);
importer
    .clean()
    .catch(e => {
        console.log('clean failed');
        console.log(e);
    })
    .then(importer.import())
    .catch(e => {
        console.log('import failed');
        console.log(e);
        process.exit(1);
    })
    .then(() => {
        console.log('done');
        process.exit();
    });

