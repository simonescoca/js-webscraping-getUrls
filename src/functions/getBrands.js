const puppeteer = require("puppeteer");
const website = require("../utils/website");

function getBrands() {

    return new Promise(async (resolve) => {

        const browser = await puppeteer.launch({
            headless: "new",
            defaultViewport: false,
            userDataDir: "./tmp"
        });
    
        const page = await browser.newPage();
        await page.goto(website + "/listino");
    
        await page.waitForSelector("h2.plist-bcard-title");
        await page.waitForSelector(".row.row-cols-2.row-cols-md-3.row-cols-xl-4");
    
        const brands = await page.$$("h2.plist-bcard-title");
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
    
        await browser.close();
    
        brandsjson.sort((a, b) => {
    
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
    
            if (nameA < nameB) return -1;
            else if (nameA > nameB) return 1;
            else return 0;
    
        });
    
        resolve(brandsjson);

    });
};

module.exports = getBrands;