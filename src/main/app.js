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

    const brandsurls = [];
    brands.forEach(brand => brandsurls.push(brand.url));
    brandsurls.length = 2; // ! LEVALOO

    console.log("\n> scarico ogni modello di ogni brand...");
    getModels(brandsurls, 0, (brandsurls.length - 1)).then((models) => {

        models = models.flat();

        const modelsurls = [];
        models.forEach(model => modelsurls.push(model.url));

        console.log("\n> scarico ogni versione di ogni modello di ogni brand...");
        getVersions(modelsurls, 0, (modelsurls.length - 1)).then((versions) => {

            writeJson(versions, "cars");
            console.timeEnd("> fine esecuzione");
        });
    });

}).catch(err => console.log(err));