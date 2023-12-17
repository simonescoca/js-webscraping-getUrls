const puppeteer = require("puppeteer");
const fs = require("fs");
const _dirproj = require("../utils/dirproj");
const website = require("../utils/website");

async function getBrands() {

    const browser = await puppeteer.launch({
        headless: "new",
        defaultViewport: false,
        userDataDir: "./tmp"
    });

    const page = await browser.newPage();
    await page.goto(website + "/listino");

    await page.waitForSelector("h2.plist-bcard-title");
    await page.waitForSelector(".row.row-cols-2.row-cols-md-3.row-cols-xl-4");

    let brands = await page.$$("h2.plist-bcard-title");
    const otherBrands = await page.$$(".row.row-cols-2.row-cols-md-3.row-cols-xl-4 > .col > .sqlink");
    otherBrands.forEach(brand => brands.push(brand));

    let brandsjson = [];
    for(const brand of brands) {

        const newBrand = {};

        let url = await page.evaluate(
            element => element.querySelector("a").getAttribute("href"),
            brand
        );

        let name = await page.evaluate(
            element => element.querySelector("a").textContent,
            brand
        );

        name = name.replace(/\s{2,}/g, ' ').trim();

        url = `${website}${url}`;

        newBrand["name"] = name;
        newBrand["url"] = url;

        brandsjson.push(newBrand);

    }

    // scrittura dei file

    try {
        fs.readdirSync(_dirproj + "/output", "utf-8");
        console.log("> leggo la cartella 'output'");

        try {
            fs.readFileSync(_dirproj + "/output/brands.json", "utf-8");
            console.log("> esiste già un file 'output/brands.json', lo sostituisco con quello nuovo");

            try {
                fs.unlinkSync(_dirproj + "/output");
                console.log("> file 'output/brands.json' eliminato con successo");
            } catch (err) {
                console.log("> errore nell'eliminazione del file 'output/brands.json'", err);
            }

        } catch (err) {
            try {
                fs.writeFileSync(_dirproj + "/output/brands.json", JSON.stringify(brandsjson, null, 2), {flag: "a"});
                console.log("> scrivo il file 'output/brands.json'");
        
            } catch (err) {
                console.log("> errore nella scrittura del file", err);
            }
        }

    } catch (err) {
        try {
            fs.mkdirSync(_dirproj + "/output");
            console.log("> creo la cartella 'output'");

            try {
                fs.writeFileSync(_dirproj + "/output/brands.json", JSON.stringify(brandsjson, null, 2), {flag: "a"});
                console.log("> scrivo il file 'output/brands.json'");
        
            } catch (err) {
                console.log("> errore nella scrittura del file", err);
            }

        } catch (err) {
            if (err.code !== "EEXIST") console.log("> errore nella creazione della cartella", err);
        }
    }

    await browser.close();

};

module.exports = getBrands;