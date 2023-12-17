const puppeteer = require("puppeteer");
const website = require("../utils/website");


async function getModels(url) {

    const browser = await puppeteer.launch({
        headless: "new",
        defaultViewport: false,
        userDataDir: "./tmp"
    });

    const page = await browser.newPage();
    await page.goto(url);

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

    await browser.close();
    return modelsjson;
};

module.exports = getModels;