const puppeteer = require("puppeteer");
const website = require("../utils/website");
const createDelay = require("./createDelay");


const allmodelsjson = [];

async function ricorsiva (array, startindex) {
        
    const browser = await puppeteer.launch({
        headless: "new",
        defaultViewport: false,
        userDataDir: "./tmp"
    });

    const page = await browser.newPage();
    await page.goto(array[startindex]);

    await page.waitForSelector("h2.plist-pcard-title.plist-pcard-title--mh");

    let models = await page.$$("h2.plist-pcard-title.plist-pcard-title--mh");
    let modelsjson = [];

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

        modelsjson.push(newModel);
    }

    await browser.close();
    allmodelsjson.push(modelsjson);
}

async function getModels(brandsJson) {
    
    const urls = [];
    brandsJson.forEach(brand => urls.push(brand.url));
    let startindex = 0;
    
    await ricorsiva(urls, startindex)
        .then(() => {
            if(startindex < urls.length){
                setTimeout(() => {
                    ricorsiva(urls.length, (startindex + 1));
                }, createDelay(5, 12));
            }
        })
        .catch ((err) => {
            console.log(err);
        })
        
    return allmodelsjson.flat();
};

module.exports = getModels;