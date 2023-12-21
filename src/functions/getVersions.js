const puppeteer = require("puppeteer");
const website = require("../utils/website");
const createDelay = require("./createDelay");


function getVersions(urls, index, finalindex, allversionsjson = []) {
    return new Promise((resolve) => {

        setTimeout(async () => {

            const browser = await puppeteer.launch({
                headless: "new",
                defaultViewport: false,
                userDataDir: "./tmp"
            });
        
            const page = await browser.newPage();
            await page.goto(urls[index]);
            
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
            allversionsjson.push(versionsjson);
    
            // Avvia la ricorsione e attendi la sua risoluzione
           if (index < finalindex) getVersions(urls, (index + 1), finalindex, allversionsjson).then(() => resolve(allversionsjson));
           else resolve(allversionsjson); // Risolve la Promise con i risultati accumulati

        }, createDelay(3, 5));
    });
};

module.exports = getVersions;