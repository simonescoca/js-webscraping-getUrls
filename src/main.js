const getBrands = require("./functions/getBrands");
const getModels = require("./functions/getModels");
const getVersions = require("./functions/getVersions");
const createDelay = require("./functions/createDelay");
// const createFinalJson = require("./functions/createFinalJson");

const delay1 = createDelay(6, 9);
const delay2 = delay1 + createDelay(6, 9);

getBrands()
    .then(() => {
        setTimeout(getModels, delay1, 0);
    })
    .then(() => {
        setTimeout(getVersions, delay2, 0);
    })
    // .then(() => {
    //     createFinalJson();
    // })
    .catch((err) => {
        console.log(err);
    });