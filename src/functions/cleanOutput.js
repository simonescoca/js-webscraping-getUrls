const fs = require("fs");
const _dirproj = require("../utils/dirproj");

function cleanOutput() {
    try {
        fs.readdirSync(_dirproj + "/output", "utf-8");
        console.log("> leggo la cartella 'output'");
    
    } catch (err) {
        fs.mkdirSync(_dirproj + "/output");
        console.log("> creo la cartella 'output'");
    }
    
    try {
        fs.readFileSync(_dirproj + "/output/models.json", "utf-8");
        console.log("> elimino il contenuto di 'output'");
    
        try {
            fs.unlinkSync(_dirproj + "/output/models.json");
            console.log("> file 'output/models.json' eliminato con successo");
            
        } catch (err) {
            console.log("> errore nell'eliminazione del file 'output/models.json'");
        }
        
    } catch (err) {
        
    }
    
    try {
        fs.readFileSync(_dirproj + "/output/versions.json", "utf-8");
    
        try {
            fs.unlinkSync(_dirproj + "/output/versions.json");
            console.log("> file 'output/versions.json' eliminato con successo");
            
        } catch (err) {
            console.log("> errore nell'eliminazione del file 'output/versions.json'");
        }
        
    } catch (err) {
        
    }
    
    try {
        fs.readFileSync(_dirproj + "/output/brands.json", "utf-8");
    
        try {
            fs.unlinkSync(_dirproj + "/output/brands.json");
            console.log("> file 'output/brands.json' eliminato con successo");
            
        } catch (err) {
            console.log("> errore nell'eliminazione del file 'output/brands.json'");
        }
        
    } catch (err) {
        
    }
}

module.exports = cleanOutput;