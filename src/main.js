const cleanOutput = require("./functions/cleanOutput");
const writeJson = require("./functions/writeJson");
const readJson = require("./functions/readJson");

const getBrands = require("./functions/getBrands");
const getModels = require("./functions/getModels");
const getVersions = require("./functions/getVersions");
const createDelay = require("./functions/createDelay");
// const createFinalJson = require("./functions/createFinalJson");

cleanOutput();

getBrands()
    .then((brands) => {

        setTimeout(() => {
            getModels(brands[0].url)
                .then((models) => {
                    brands[0]["models"] = models;

                    setTimeout(() => {
                        getVersions(brands[0].models[0].url)
                            .then((versions) => {
                                brands[0].models[0]["versions"] = versions;
                                writeJson(brands, "brands");
                            })
                    }, 5768)

                })
        }, 8109);

    })


// X - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - >

// X - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - >