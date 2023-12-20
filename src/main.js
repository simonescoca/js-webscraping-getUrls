const cleanOutput = require("./functions/cleanOutput");
// const writeJson = require("./functions/writeJson");
// const readJson = require("./functions/readJson");

const getBrands = require("./functions/getBrands");
const getModels = require("./functions/getModels");
// const getVersions = require("./functions/getVersions");

cleanOutput();

getBrands().then((brands) => {

    console.log(brands);

    const brandsurls = [];
    brands.forEach(brand => brandsurls.push(brand.url));

    getModels(brandsurls, 0, (brandsurls.length - 1)).then((models) => {
        console.log(models);
    })

}).catch(err => console.log(err));