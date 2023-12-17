const puppeteer = require("puppeteer");
const fs = require("fs");
const _dirproj = require("../utils/dirproj");
const website = require("../utils/website");
const createDelay = require("./createDelay");


async function getVersions(startindex) {

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
    await page.goto(models[startindex].url);
    
    await page.waitForSelector("div.amodtable-item > div.row.small-gutters > div.col-6.col-md-3");
    const versions = await page.$$("div.amodtable-item > div.row.small-gutters > div.col-6.col-md-3");

    let versionsjson = [];
    for(const version of versions) {
        const newVersion = {};

        let url = await page.evaluate(
            element => element.querySelector("a.amodtable-item-name").getAttribute("href"),
            version
        );

        let name = await page.evaluate(
            element => element.querySelector("a.amodtable-item-name").textContent,
            version
        );

        name = name.replace(/\s{2,}/g, ' ').trim();
        url = `${website}${url}`;

        newVersion["name"] = name;
        newVersion["url"] = url;

        versionsjson.push(newVersion);
    }

    try {
        fs.writeFileSync(_dirproj + "/output/versions.json", JSON.stringify(versionsjson, null, 2), {flag: "a"});
        console.log("> aggiungo elemento nel file 'output/versions.json'");

    } catch (err) {
        console.log("> errore nella scrittura del file", err);
        
    }

    await browser.close();
};

module.exports = getVersions;