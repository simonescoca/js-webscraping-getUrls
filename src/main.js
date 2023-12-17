const cleanOutput = require("./functions/cleanOutput");
const writeJson = require("./functions/writeJson");
const readJson = require("./functions/readJson");

const getBrands = require("./functions/getBrands");
const getModels = require("./functions/getModels");
const getVersions = require("./functions/getVersions");
const createDelay = require("./functions/createDelay");

cleanOutput();

getBrands()
    .then((brands) => {

        // * attempt 1 - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

        // setTimeout(() => {
        //     getModels(brands[0].url)
        //         .then((models) => {
        //             brands[0]["models"] = models;

        //             setTimeout(() => {
        //                 getVersions(brands[0].models[0].url)
        //                     .then((versions) => {
        //                         brands[0].models[0]["versions"] = versions;
        //                         writeJson(brands, "brands");
        //                     })
        //             }, 5768)

        //         })
        // }, 8109);

        // * attempt 2 - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

        // setTimeout(() => {
        //     getModels(brands)
        //         .then((models) => {
        //             brands.forEach(brand => brand["models"] = models);

        //             setTimeout(() => {
        //                 getVersions(models)
        //                     .then((versions) => {
                            
        //                         brands.forEach(brand => brand.models.forEach(model => model["versions"] = versions));
        //                         writeJson(brands, "brands");
        //                     })
        //             }, createDelay(5, 12))

        //         })
        // }, createDelay(6, 9));

        // * attempt 3 - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


        getModels(brands)
            .then((models) => {
                brands.forEach(brand => brand["models"] = models);

                getVersions(models)
                    .then((versions) => {
                    
                        brands.forEach(brand => brand.models.forEach(model => model["versions"] = versions));
                        writeJson(brands, "brands");
                    })
            })
    })


// X - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - >

// X - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - >