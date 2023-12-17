const puppeteer = require("puppeteer");
const fs = require("fs");

let brands = fs.readFileSync("./brands.json", "utf-8");
brands = JSON.parse(brands);

getModels();

async function getModels() {

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
        
        // const name = url.replace("/listino/", "");

        let name = await page.evaluate(
            element => element.querySelector("a.app-add-search").textContent,
            model
        );

        name = name.replace(/\s{2,}/g, ' ').trim();
        const website = "https://www.automoto.it";
        url = `${website}${url}`;

        newModel["name"] = name;
        newModel["url"] = url;

        modelsjson.push(newModel);

    }

    console.log((modelsjson));

    try {

        fs.writeFileSync("models.json", JSON.stringify(modelsjson, null, 2));

    } catch (err) {

        console.log(err);
    }

    await browser.close();

};

module.exports = getModels;