const getBrands = require("./functions/getBrands");
const getModels = require("./functions/getModels");
const getVersions = require("./functions/getVersions");

getBrands()
    .then(() => {
        setTimeout(getModels(), ((Math.random() * 9000) + 6000));
    })
    .then(() => {
        setTimeout(getVersions(), ((Math.random() * 9000) + 6000));
    })
    .catch((err) => {
        console.log(err);
    });