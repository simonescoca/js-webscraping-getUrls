const puppeteer = require("puppeteer");
const fs = require("fs");

async function getBrands() {

    const website = "https://www.automoto.it";

    const browser = await puppeteer.launch({
        headless: "new",
        defaultViewport: false
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
        
        // const name = url.replace("/listino/", "");

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

    console.log((brandsjson));

    try {

        fs.writeFileSync("brands.json", JSON.stringify(brandsjson, null, 2));

    } catch (err) {

        console.log(err);
    }

    await browser.close();

};

module.exports = getBrands;