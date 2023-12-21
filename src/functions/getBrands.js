const puppeteer = require("puppeteer");
const website = require("../utils/website");


function getBrands() {

    return new Promise(async(resolve) => {

        const browser = await puppeteer.launch({
            headless: "new",
            defaultViewport: false,
            userDataDir: "./tmp"
        });
    
        const page = await browser.newPage();

        await page.goto(`${website}/catalogo`)
        .then(async() => {

            const selettore1 = "div.plist-bcard > span.plist-bcard-content > h2.plist-bcard-title";
            const selettore2 = "div.row.row-cols-2.row-cols-md-3.row-cols-xl-4 > div.col > h3.sqlink";

            try {
                await page.waitForSelector(selettore1);
                await page.waitForSelector(selettore2);
                
            } catch (err) {
                console.log(`> selettore: "${selettore1}" o selettore: "${selettore2}" non trovati in "${website}/catalogo"`);
                process.exit(1);
            }
        
            const brandsHandlers = await page.$$("div.plist-bcard > span.plist-bcard-content > h2.plist-bcard-title");
            const otherBrandsHandlers = await page.$$("div.row.row-cols-2.row-cols-md-3.row-cols-xl-4 > div.col > h3.sqlink");
            otherBrandsHandlers.forEach(handler => brandsHandlers.push(handler));
        
            const brands = [];
            for(const handler of brandsHandlers) {
        
                const newBrand = {};
        
                const url = await page.evaluate(
                    element => element.querySelector("a").getAttribute("href"),
                    handler
                );
        
                const name = await page.evaluate(
                    element => element.querySelector("a").textContent,
                    handler
                );
        
                newBrand["name"] = name.replace(/\s{2,}/g, ' ').trim();
                newBrand["url"] = `${website}${url}`;
        
                console.log(` + ${newBrand.name}`);
                brands.push(newBrand);
            }
        
            await browser.close();
        
            brands.sort((a, b) => {
        
                const nameA = a.name.toLowerCase();
                const nameB = b.name.toLowerCase();
        
                if (nameA < nameB) return -1;
                else if (nameA > nameB) return 1;
                else return 0;
        
            });
        
            resolve(brands);

        })
        .catch(async(err) => {
            
            console.log(`> ${website}/catalogo non raggiungibile\n`, err);
            await browser.close();
            process.exit(1);
        });
    });
};

module.exports = getBrands;