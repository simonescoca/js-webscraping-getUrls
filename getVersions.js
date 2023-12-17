const puppeteer = require("puppeteer");
const fs = require("fs");

let models = fs.readFileSync("./models.json", "utf-8");
models = JSON.parse(models);

getVersions();

async function getVersions() {

    const browser = await puppeteer.launch({
        headless: "new",
        defaultViewport: false
    });

    const page = await browser.newPage();
    await page.goto(models[0].url);

    // await page.waitForSelector("div.aside-panel-link-wrapper");
    await page.waitForSelector("a.aside-panel-link");

    // let versionsContainer = await page.$("div.aside-panel-link-wrapper");
    // let versions = await page.$$("a.aside-panel-link");


    let urls = await page.$$eval("div.aside-panel-link-wrapper a.aside-panel-link", urls => {
        return urls.map((url) => {
            url.getAttribute("href");
        });
    });

    // const versionsCount = await page.$$eval("div.aside-panel-link-wrapper a.aside-panel-link", anchors => anchors.length);
    // console.log(versionsCount);

    let names = await page.$$eval("div.aside-panel-link-wrapper a.aside-panel-link", names => {
        return names.map((name) => {
            name.textContent.replace(/\s{2,}/g, ' ').trim();
        });
    });

    // let versionsjson = [];


        // const newVersion = {};

        // let urls = await page.evaluate(
        //     element => element.$$("a.aside-panel-link").getAttribute("href"),
        //     versions
        // );

        // let names = await page.evaluate(
        //     element => element.$$("a.aside-panel-link").textContent,
        //     versions
        // );

        console.log(urls, names);

        // name = name.replace(/\s{2,}/g, ' ').trim();
        // const website = "https://www.automoto.it";
        // url = `${website}${url}`;

        // newVersion["name"] = name;
        // newVersion["url"] = url;

        // versionsjson.push(newVersion);



    // console.log((versionsjson));

    // try {

    //     fs.writeFileSync("versions.json", JSON.stringify(versionsjson, null, 2));

    // } catch (err) {

    //     console.log(err);
    // }

    await browser.close();

};

// module.exports = getVersions;