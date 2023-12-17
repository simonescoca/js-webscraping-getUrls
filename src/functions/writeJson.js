const fs = require("fs");
const _dirproj = require("../utils/dirproj");

function writeJson(data, filename) {
    
    try {
        fs.writeFileSync(_dirproj + `/output/${filename}.json`, JSON.stringify(data, null, 2), {flag: "a"});
        console.log(`> scrivo il file 'output/${filename}.json'`);
    
    } catch (err) {
        console.log("> errore nella scrittura del file", err);
    }
}

module.exports = writeJson;