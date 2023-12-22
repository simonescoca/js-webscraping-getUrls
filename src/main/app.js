const cleanOutput = require("../functions/cleanOutput");
const writeJson = require("../functions/writeJson");
const getBrands = require("../functions/getBrands");
const getModels = require("../functions/getModels");
const _dirproj = require("../utils/dirproj");
const getVersions = require("../functions/getVersions");


console.time("> fine esecuzione");
console.log(`> pulisco ${_dirproj}/output`);
cleanOutput();

console.log("\n> scarico tutti i brand...");
getBrands().then((brands) => {

    // brands.length = 2; // ! LEVALOO

    console.log("\n> scarico ogni modello di ogni brand...");
    getModels(brands, 0, (brands.length - 1), 1)
    .then((brands) => {

        console.log("\n> scarico ogni versione di ogni modello di ogni brand...");
        getVersions(brands, 0, 0, (brands.length - 1), (brands[0].models.length - 1))
        .then((brands) => {

            writeJson(brands, "brands");
            console.timeEnd("> fine esecuzione");
        });
    });

}).catch(err => console.log(err));