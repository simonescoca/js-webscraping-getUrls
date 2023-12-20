const fs = require("fs");
const _dirproj = require("../utils/dirproj");

function cleanOutput() {
    if(!fs.existsSync(_dirproj + "/output")) fs.mkdirSync(_dirproj + "/output");
    else {
        try {
            fs.readdirSync(_dirproj + "/output", "utf-8")
            .forEach((file) => {
                if (file) {
                    try {
                        fs.unlinkSync(_dirproj + `/output/${file}`);
                    } catch (err) {
                        console.log(`> errore nell'eliminazione del file ${file}`, err);
                    }
                }
            });
        
        } catch (err) {
            console.log("> errore nella lettura della cartella 'output'", err);
        }
    }
}

module.exports = cleanOutput;