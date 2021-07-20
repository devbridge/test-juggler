const fs = require("fs");
const retry = require("async-retry");
const defaultCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

class Helpers {
    async takeScreenshot(filename) {
        var targetDir = `./logs/${jasmine["currentSuite"].fullName}`;
        if (typeof jasmine["currentTest"] !== "undefined") {
            targetDir = targetDir + `/${jasmine["currentTest"].description}`;
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
            randomize: false,
        });
    }

    async getFrame(selector) {
        await page.waitForSelector(selector);
        const elementHandle = await page.$(selector);
        return await elementHandle.contentFrame();
    }

    async pageSetup(page) {
        const environment = require(process.cwd() + "/test-environment/environment.js");
        await environment.prototype.pageSetup(page);
    }

    async generateRandomText(length, characters = defaultCharacters) {
        var result = "";
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * charactersLength)
            );
        }
        console.log(`Generated a random text: ${result}`);
        return result;
    }

    async acceptPopupsOnPage(page) {
        await page.on("dialog", dialog => {
            console.log(`Alert was detected: '${dialog.message()}'`);
            dialog.accept();
        });
    }
    
    async dismissPopupsOnPage(page) {
        await page.on("dialog", dialog => {
            console.log(`Alert was detected: '${dialog.message()}'`);
            dialog.dismiss();
        });
    }
}

export default new Helpers();