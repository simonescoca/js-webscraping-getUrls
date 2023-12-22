const puppeteer = require("puppeteer");
const website = require("../utils/website");
const createDelay = require("./createDelay");


function getModels(brands, index, finalindex, currentPage) {
    return new Promise((resolve) => {

        setTimeout(async() => {

            const browser = await puppeteer.launch({
                headless: "new",
                defaultViewport: false,
                userDataDir: "./tmp"
            });
        
            const page = await browser.newPage();

            if(currentPage === 1) pagina2 = "";
            else if (currentPage === 2) pagina2 = "/pagina-2";

            await page.goto(brands[index].url + pagina2)
            .then(async() => {

                const selettore = "h2.plist-pcard-title.plist-pcard-title--mh";

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

                const pager = "div.app-pager.pager";

                if(currentPage === 1) {
                    try {
                        
                        // se c'è il nodo che corrisponde al pager -> scrape dei modelli in brands[index].url/pagina-2 e pusha i modelli nello stesso brands[index].models !!!
                        await page.waitForSelector(pager, {"timeout": 1000});
                        
                        await browser.close();
                        brands[index]["models"] = models;

                        // richiama la funzione con il nuovo brands aggiornato e il goto deve essere su brands[index].url/pagina-2
                        getModels(brands, index, finalindex, 2)
                        .then(() => resolve(brands));

                    } catch (err) {

                        await browser.close();
                        brands[index]["models"] = models;
            
                        if (index < finalindex) {
                            getModels(brands, (index + 1), finalindex, 1)
                            .then(() => resolve(brands));
                            
                        } else resolve(brands);
                    }
                } else if(currentPage === 2) {

                    await browser.close();
                    models.forEach((model) => brands[index].models.push(model));
        
                    if (index < finalindex) {
                        getModels(brands, (index + 1), finalindex, 1)
                        .then(() => resolve(brands));
                        
                    } else resolve(brands);
                }
            })
            .catch(async(err) => {

                console.log(`> ${brands[index].url} non raggiungibile\n`, err);
                await browser.close();
                process.exit(1);
            });

        }, createDelay(1.5, 1));
    });
}

module.exports = getModels;