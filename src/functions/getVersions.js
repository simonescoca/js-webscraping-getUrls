const puppeteer = require("puppeteer");
const fs = require("fs");
const _dirproj = require("../utils/dirproj");
const website = require("../utils/website");

async function getVersions() {

    let models;

    try {
        models = fs.readFileSync(_dirproj + "/output/models.json", "utf-8");
    } catch (err) {
        console.log("> output/models.json not found");
    }

    models = JSON.parse(models);

    const browser = await puppeteer.launch({
        headless: "new",
        defaultViewport: false,
        userDataDir: "./tmp"
    });

    const page = await browser.newPage();
    await page.goto(models[0].url);
    
    await page.waitForSelector("div.amodtable-item-tool");
    const versions = await page.$$("div.amodtable-item-tool");

    // X - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - >

    let versionsjson = [];
    for(const version of versions) {
        const newVersion = {};

        let url = await page.evaluate(
            element => element.querySelector("a.amodtable-item-goto").getAttribute("href"),
            version
        );

        let name = await page.evaluate(
            element => element.querySelector("a.amodtable-item-goto").textContent,
            version
        );

        name = name.replace(/\s{2,}/g, ' ').trim();
        url = `${website}${url}`;

        newVersion["name"] = name;
        newVersion["url"] = url;

        versionsjson.push(newVersion);
    }

    // X - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - >

    try {
        outputdir = fs.readdirSync(_dirproj + "/output", "utf-8");
        console.log("> leggo la cartella 'output'");

        if(outputdir) {
            const versionsjson = fs.readFileSync(_dirproj + "/output/versions.json", "utf-8");

            if (versionsjson) {
                console.log("> esiste già un file 'output/versions.json', lo sostituisco con quello nuovo");

                try {
                    fs.unlinkSync(_dirproj + "/output/versions.json");
                    console.log("> file 'output/versions.json' eliminato con successo");

                } catch (err) {
                    console.log("> errore nell'eliminazione del file 'output/versions.json'", err);
                }
            }
        }

    } catch (err) {
        try {
            fs.mkdirSync(_dirproj + "/output");
            console.log("> creo la cartella 'output'");

        } catch (err) {
            if (err.code !== "EEXIST") console.log("> errore nella creazione della cartella", err);
        }
    }

    try {
        fs.writeFileSync(_dirproj + "/output/versions.json", JSON.stringify(versionsjson, null, 2));
        console.log("> scrivo il file 'output/versions.json'");

    } catch (err) {
        console.log("> errore nella scrittura del file", err);
    }

    await browser.close();
};

module.exports = getVersions;