/*global page*/
const fs = require("fs");
const retry = require("async-retry");

export default class Helpers {
    async takeScreenshot(filename) {
        var targetDir = `./logs/${jasmine["currentSuite"].fullName}`;
        if (typeof jasmine["currentTest"] !== "undefined") {
            targetDir = targetDir +`/${jasmine["currentTest"].description}`;
        }
        fs.mkdirSync(targetDir, { recursive: true });
        const screenshotPath = `${targetDir}/${filename || Date.now()}.png`;
        await page.screenshot({ path: screenshotPath });
        return screenshotPath;
    }

    async retry(fn, retries = 5, minTimeout = 500) {
        await retry(fn, {
            retries: retries,
            factor: 2,
            minTimeout: minTimeout,
            maxTimeout: Infinity,
            randomize: false
        });
    }

    async goToUrlAndLoad(url) {
        await page.goto(url, {
            waitUntil: "networkidle0"
        });
    }

    async getFrame(selector) {
        await page.waitForSelector(selector);
        const elementHandle = await page.$(selector);
        return await elementHandle.contentFrame();
    }
}