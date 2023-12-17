const getBrands = require("./getBrands");
const getModels = require("./getModels");
const getVersions = require("./getVersions");

getBrands()
    .then(() => {
        getModels();
    })
    .then(() => {
        getVersions();
    })
    .catch((err) => {
        console.log(err);
    });