const puppeteer = require("puppeteer");
const website = require("../utils/website");
const createDelay = require("./createDelay");


function getVersions(brandsWmodels, brandindex, modelindex, finalbrandindex, finalmodelindex) {
    return new Promise((resolve) => {

        setTimeout(async () => {

            const browser = await puppeteer.launch({
                headless: "new",
                defaultViewport: false,
                userDataDir: "./tmp"
            });
        
            const page = await browser.newPage();
            await page.goto(brandsWmodels[brandindex].models[modelindex].url);
            
            await page.waitForSelector("div.amodtable-item > div.row.small-gutters > div.col-6.col-md-3");
    
            const versions = await page.$$("div.amodtable-item > div.row.small-gutters > div.col-6.col-md-3");
            const versionsjson = [];
    
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
        
                console.log(` + ${newVersion.name}`);
                versionsjson.push(newVersion);
            }
        
            await browser.close();
            brandsWmodels[brandindex].models[modelindex]["versions"] = versionsjson;
    

            if (modelindex < finalmodelindex) {
                await getVersions(brandsWmodels, brandindex, (modelindex + 1), finalbrandindex, finalmodelindex)
                .then(() => resolve(brandsWmodels));

            } else if (brandindex < finalbrandindex) {
                await getVersions(brandsWmodels, (brandindex + 1), 0, finalbrandindex, (brandsWmodels[brandindex + 1].models.length - 1))
                .then(() => resolve(brandsWmodels));

            } else resolve(brandsWmodels);

        }, createDelay(3, 5));
    });
};

module.exports = getVersions;