const puppeteer = require("puppeteer");
const website = require("../utils/website");
const createDelay = require("./createDelay");


function getModels(brands, index, finalindex) {
    return new Promise((resolve) => {

        setTimeout(async() => {

            const browser = await puppeteer.launch({
                headless: "new",
                defaultViewport: false,
                userDataDir: "./tmp"
            });
        
            const page = await browser.newPage();
            await page.goto(brands[index].url)
            .then(async() => {

                const selettore = "h2.plist-pcard-title.plist-pcard-title--mh";
                // const pager = "div.app-pager.pager";
                // await page.waitForSelector(pager, {"visible": true, "timeout": 1000});
                // se c'è il nodo che corrisponde a quel selettore, scrape dei modelli in brands[index].url/pagina-2 e pusha i modelli nello stesso brands[index] !!!

                try {
                    await page.waitForSelector(selettore);
                    
                } catch (err) {
                    console.log(`> selettore "${selettore}" non trovato in ${brands[index].url}`);
                    process.exit(1);
                }
        
                const modelsHandlers = await page.$$(selettore);
                const models = [];
            
                for(const handler of modelsHandlers) {
                    const newModel = {};
            
                    const url = await page.evaluate(
                        element => element.querySelector("a.app-add-search").getAttribute("href"),
                        handler
                    );
            
                    const name = await page.evaluate(
                        element => element.querySelector("a.app-add-search").textContent,
                        handler
                    );
            
                    newModel["name"] = name.replace(/\s{2,}/g, ' ').trim();
                    newModel["url"] = `${website}${url}`;
                        
                    console.log(` + ${newModel.name}`);
                    models.push(newModel);
                }
            
                await browser.close();
                brands[index]["models"] = models
    
                if (index < finalindex) {
                    getModels(brands, (index + 1), finalindex)
                    .then(() => resolve(brands));
                    
                } else resolve(brands);
            })
            .catch(async(err) => {

                console.log(`> ${brands[index].url} non raggiungibile\n`, err);
                await browser.close();
                process.exit(1);
            });

        }, createDelay(1.5, 1.5));
    });
}

module.exports = getModels;