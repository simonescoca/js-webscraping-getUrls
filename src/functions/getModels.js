const puppeteer = require("puppeteer");
const website = require("../utils/website");
const createDelay = require("./createDelay");


// X  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - >

function getModels(urls, index, finalindex, allmodelsjson = []) {
    return new Promise((resolve) => {

        console.log(`[ ${urls[index]} ]`);

        setTimeout(async () => {

            const browser = await puppeteer.launch({
                headless: "new",
                defaultViewport: false,
                userDataDir: "./tmp"
            });
        
            const page = await browser.newPage();
            await page.goto(urls[index]);
        
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
                    
                console.log(newModel) // ! !!!!!!!!!!!!!!!!!
                modelsjson.push(newModel);
            }
        
            await browser.close();
            allmodelsjson.push(modelsjson);

            if (index < finalindex) getModels(urls, (index + 1), finalindex, allmodelsjson).then(() => resolve(allmodelsjson)); // Avvia la ricorsione e attendi la sua risoluzione
            else resolve(allmodelsjson); // Risolve la Promise con i risultati accumulati

        }, createDelay(3, 8));

    });
}

// X  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - >


// const allmodelsjson = [];

// async function ricorsiva (array, startindex) {
        
//     const browser = await puppeteer.launch({
//         headless: "new",
//         defaultViewport: false,
//         userDataDir: "./tmp"
//     });

//     const page = await browser.newPage();
//     await page.goto(array[startindex]);

//     await page.waitForSelector("h2.plist-pcard-title.plist-pcard-title--mh");

//     let models = await page.$$("h2.plist-pcard-title.plist-pcard-title--mh");
//     let modelsjson = [];

//     for(const model of models) {
//         const newModel = {};

//         let url = await page.evaluate(
//             element => element.querySelector("a.app-add-search").getAttribute("href"),
//             model
//         );

//         let name = await page.evaluate(
//             element => element.querySelector("a.app-add-search").textContent,
//             model
//         );

//         name = name.replace(/\s{2,}/g, ' ').trim();
//         url = `${website}${url}`;

//         newModel["name"] = name;
//         newModel["url"] = url;

//         modelsjson.push(newModel);
//     }

//     await browser.close();
//     allmodelsjson.push(modelsjson);
// }

// async function getModels(brandsJson) {
    
//     brandsJson.forEach((brand) => {

//     });
    
//     await ricorsiva(urls, startindex)
//         .then(() => {
//             if(startindex < urls.length){
//                 setTimeout(() => {
//                     ricorsiva(urls.length, (startindex + 1));
//                 }, createDelay(5, 12));
//             }
//         })
//         .catch ((err) => {
//             console.log(err);
//         })
        
//     return allmodelsjson.flat();
// };

module.exports = getModels;