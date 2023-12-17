const fs = require("fs");
const _dirproj = require("../utils/dirproj");

function readJson(filename) {
    let file;
    
    try {
        file = fs.readFileSync(_dirproj + `/output/${filename}.json`, "utf-8");
        file = JSON.parse(file);

    } catch (err) {
        console.log("> errore nella lettura di")
    }

    return file;
}

module.exports = readJson;