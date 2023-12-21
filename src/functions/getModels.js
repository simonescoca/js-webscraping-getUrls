const puppeteer = require("puppeteer");
const website = require("../utils/website");
const createDelay = require("./createDelay");


function getModels(urls, index, finalindex, allmodelsjson = []) {
    return new Promise((resolve) => {

        setTimeout(async () => {

            const browser = await puppeteer.launch({
                headless: "new",
                defaultViewport: false,
                userDataDir: "./tmp"
            });
        
            const page = await browser.newPage();
            await page.goto(urls[index]);
        
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
            allmodelsjson.push(modelsjson);

             // Avvia la ricorsione e attendi la sua risoluzione
            if (index < finalindex) getModels(urls, (index + 1), finalindex, allmodelsjson).then(() => resolve(allmodelsjson));
            else resolve(allmodelsjson); // Risolve la Promise con i risultati accumulati

        }, createDelay(3, 5));
    });
}

module.exports = getModels;