const puppeteer = require("puppeteer");
const website = require("../utils/website");


async function getVersions(url) {

    const browser = await puppeteer.launch({
        headless: "new",
        defaultViewport: false,
        userDataDir: "./tmp"
    });

    const page = await browser.newPage();
    await page.goto(url);
    
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

    await browser.close();
    return versionsjson;
};

module.exports = getVersions;