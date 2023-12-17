const fs = require("fs");
const _dirproj = require("../utils/dirproj");

createFinalJson(); // ! poi rimuovi

function createFinalJson() {

    try {
        const brands = fs.readFileSync(_dirproj + "/output/brands.json");
        const models = fs.readFileSync(_dirproj + "/output/models.json");
        const versions = fs.readFileSync(_dirproj + "/output/versions.json");
    
        if (brands && models && versions) {
            JSON.stringify(models);
            console.log()
        }
    
    } catch (err) {
    
        console.log(err);
    }

}

module.exports = createFinalJson;