const puppeteer = require("puppeteer");
const fs = require("fs");
const _dirproj = require("../utils/dirproj");
const website = require("../utils/website");
const createDelay = require("./createDelay");


async function getModels(startindex) {

    let brands;

    try {
        brands = fs.readFileSync(_dirproj + "/output/brands.json", "utf-8");

    } catch (err) {
        console.log("> output/brands.json not found");
    }

    brands = JSON.parse(brands);

    const browser = await puppeteer.launch({
        headless: "new",
        defaultViewport: false,
        userDataDir: "./tmp"
    });

    const page = await browser.newPage();
    await page.goto(brands[startindex].url);

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

    try {
        fs.writeFileSync(_dirproj + "/output/models.json", JSON.stringify(modelsjson, null, 2), {flag: "a"});
        console.log("> aggiungo elemento nel file 'output/models.json'");

    } catch (err) {
        console.log("> errore nella scrittura del file", err);
        
    }

    await browser.close();
};

module.exports = getModels;