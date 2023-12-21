const puppeteer = require("puppeteer");
const website = require("../utils/website");
const createDelay = require("./createDelay");


function getModels(brands, index, finalindex) {
    return new Promise((resolve) => {

        setTimeout(async () => {

            const browser = await puppeteer.launch({
                headless: "new",
                defaultViewport: false,
                userDataDir: "./tmp"
            });
        
            const page = await browser.newPage();
            await page.goto(brands[index].url);
        
            await page.waitForSelector("h2.plist-pcard-title.plist-pcard-title--mh");
        
            const models = await page.$$("h2.plist-pcard-title.plist-pcard-title--mh");
            const modelsjson = [];
        
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
                    
                console.log(` + ${newModel.name}`);
                modelsjson.push(newModel);
            }
        
            await browser.close();
            brands[index]["models"] = modelsjson


            if (index < finalindex) {
                getModels(brands, (index + 1), finalindex)
                .then(() => resolve(brands));
                
            } else resolve(brands);

        }, createDelay(3, 5));
    });
}

module.exports = getModels;