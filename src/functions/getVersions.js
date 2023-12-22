const puppeteer = require("puppeteer");
const website = require("../utils/website");
const createDelay = require("./createDelay");


function getVersions(brands, brandindex, modelindex, finalbrandindex, finalmodelindex, gotoErrCount = 0) {
    return new Promise((resolve) => {

        setTimeout(async() => {

            const browser = await puppeteer.launch({
                headless: "new",
                defaultViewport: false,
                userDataDir: "./tmp"
            });
        
            const page = await browser.newPage();
            await page.goto(brands[brandindex].models[modelindex].url)
            .then(async() => {

                await page.waitForSelector("div.amodtable-item > div.row.small-gutters > div.col-6.col-md-3");
    
                const versionsHandlers = await page.$$("div.amodtable-item > div.row.small-gutters > div.col-6.col-md-3");
                const versions = [];
        
                for(const handler of versionsHandlers) {
                    const newVersion = {};
            
                    const url = await page.evaluate(
                        element => element.querySelector("a.amodtable-item-name").getAttribute("href"),
                        handler
                    );
            
                    const name = await page.evaluate(
                        element => element.querySelector("a.amodtable-item-name").textContent,
                        handler
                    );
            
                    newVersion["name"] = name.replace(/\s{2,}/g, ' ').trim();
                    newVersion["url"] = `${website}${url}`;
            
                    console.log(` + ${newVersion.name}`);
                    versions.push(newVersion);
                }
            
                await browser.close();
                brands[brandindex].models[modelindex]["versions"] = versions;
        
    
                if (modelindex < finalmodelindex) {
                    await getVersions(brands, brandindex, (modelindex + 1), finalbrandindex, finalmodelindex)
                    .then(() => resolve(brands));
    
                } else if (brandindex < finalbrandindex) {
                    await getVersions(brands, (brandindex + 1), 0, finalbrandindex, (brands[brandindex + 1].models.length - 1))
                    .then(() => resolve(brands));
    
                } else resolve(brands);

            })
            .catch(async(err) => {

                if(err) gotoErrCount++;

                if(gotoErrCount < 3) {
                    console.log(`> non riesco ad estrarre le versioni di ${brands[brandindex].models[modelindex].name} da ${brands[brandindex].models[modelindex].url}\n`, err.message);
                    await browser.close();

                    console.log(`> ${gotoErrCount}º tentativo: provo di nuovo ad estrarre le versioni...`);

                    setTimeout(async() => {

                        await getVersions(brands, brandindex, modelindex, finalbrandindex, finalmodelindex)
                        .then(() => resolve(brands));

                    }, 4000);

                } else {
                    gotoErrCount = 0;
                    console.log(`> estrazione versioni di ${brands[brandindex].models[modelindex].name} da ${brands[brandindex].models[modelindex].url} skippata`);
                    await browser.close();

                    if (modelindex < finalmodelindex) {
                        await getVersions(brands, brandindex, (modelindex + 1), finalbrandindex, finalmodelindex)
                        .then(() => resolve(brands));
        
                    } else if (brandindex < finalbrandindex) {
                        await getVersions(brands, (brandindex + 1), 0, finalbrandindex, (brands[brandindex + 1].models.length - 1))
                        .then(() => resolve(brands));
                    }
                }
            });

        }, createDelay(1.5, 1));
    });
};

module.exports = getVersions;