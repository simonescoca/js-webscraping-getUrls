const puppeteer = require("puppeteer");
const fs = require("fs");
const _dirproj = require("../utils/dirproj");
const website = require("../utils/website");

async function getModels() {

    try {
        let brands = fs.readFileSync(_dirproj + "/output/brands.json", "utf-8");

        brands = JSON.parse(brands);

        const browser = await puppeteer.launch({
            headless: "new",
            defaultViewport: false
        });
    
        const page = await browser.newPage();
        await page.goto(brands[0].url);
    
        await page.waitForSelector("h2.plist-pcard-title.plist-pcard-title--mh");
    
        let models = await page.$$("h2.plist-pcard-title.plist-pcard-title--mh");
        let modelsjson = [];

        for(const model of models) {
            const newModel = {};
    
            let url = await page.evaluate(
                element => element.querySelector("a.app-add-search").getAttribute("href"),
                model
            );
    
            let name = await page.evaluate(
                element => element.querySelector("a.app-add-search").textContent,
                model
            );
    
            name = name.replace(/\s{2,}/g, ' ').trim();
            url = `${website}${url}`;
    
            newModel["name"] = name;
            newModel["url"] = url;
    
            modelsjson.push(newModel);
        }
    
        outputdir = fs.readdirSync(_dirproj + "/output", "utf-8");
        console.log("> leggo la cartella 'output'");


        const modelsjsonfile = fs.readFileSync(_dirproj + "/output/models.json", "utf-8");

        if (modelsjsonfile) {
            console.log("> esiste già un file 'output/models.json', lo sostituisco con quello nuovo");

            try {
                fs.unlinkSync(_dirproj + "/output/models.json");
                console.log("> file 'output/models.json' eliminato con successo");

            } catch (err) {
                console.log("> errore nell'eliminazione del file 'output/models.json'", err);
            }
        }

        try {
            fs.writeFileSync(_dirproj + "/output/models.json", JSON.stringify(modelsjson, null, 2));
            console.log("> scrivo il file 'output/models.json'");
    
        } catch (err) {
            console.log("> errore nella scrittura del file", err);
        }
    
        await browser.close();

    } catch (err) {
        console.log("> output/brands.json not found");
    }
};

module.exports = getModels;