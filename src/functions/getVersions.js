const puppeteer = require("puppeteer");
const fs = require("fs");
const _dirproj = require("../utils/dirproj");
const website = require("../utils/website");

async function getVersions() {

    try {
        let models = fs.readFileSync(_dirproj + "/output/models.json", "utf-8");

        models = JSON.parse(models);

        const browser = await puppeteer.launch({
            headless: "new",
            defaultViewport: false
        });
    
        const page = await browser.newPage();
        await page.goto(models[0].url);

        // X - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - >
    
        await page.waitForSelector("h2.plist-pcard-title.plist-pcard-title--mh");
    
        let versions = await page.$$("h2.plist-pcard-title.plist-pcard-title--mh");
        let versionsjson = [];

        for(const version of versions) {
            const newVersion = {};
    
            let url = await page.evaluate(
                element => element.querySelector("a.app-add-search").getAttribute("href"),
                version
            );
    
            let name = await page.evaluate(
                element => element.querySelector("a.app-add-search").textContent,
                version
            );
    
            name = name.replace(/\s{2,}/g, ' ').trim();
            url = `${website}${url}`;
    
            newVersion["name"] = name;
            newVersion["url"] = url;
    
            versionsjson.push(newVersion);
        }

        // X - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - >

        outputdir = fs.readdirSync(_dirproj + "/output", "utf-8");
        console.log("> leggo la cartella 'output'");

        const versionsjsonfile = fs.readFileSync(_dirproj + "/output/versions.json", "utf-8");

        if (versionsjsonfile) {
            console.log("> esiste già un file 'output/versions.json', lo sostituisco con quello nuovo");

            try {
                fs.unlinkSync(_dirproj + "/output/versions.json");
                console.log("> file 'output/versions.json' eliminato con successo");

            } catch (err) {
                console.log("> errore nell'eliminazione del file 'output/versions.json'", err);
            }
        }
    
        try {
            fs.writeFileSync(_dirproj + "/output/versions.json", JSON.stringify(versionsjson, null, 2));
            console.log("> scrivo il file 'output/versions.json'");
    
        } catch (err) {
            console.log("> errore nella scrittura del file", err);
        }
    
        await browser.close();

    } catch (err) {
        console.log("> output/models.json not found");
    }
};

module.exports = getVersions;