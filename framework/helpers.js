/*global page*/
const fs = require("fs");
const retry = require("async-retry");
const config = require(process.cwd() + "/framework.config");
const defaultTimeout = config.defaultTimeout;

export default class Helpers {
    async takeScreenshot(filename) {
        var targetDir = `./logs/${jasmine["currentSuite"].fullName}`;
        if (typeof jasmine["currentTest"] !== "undefined") {
            targetDir = targetDir +`/${jasmine["currentTest"].description}`;
        }
        fs.mkdirSync(targetDir, { recursive: true });
        await page.screenshot({ path: `${targetDir}/${filename || Date.now()}.png` });
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

    async goToUrlAndLoad(url, timeout = defaultTimeout) {
        await page.goto(url, {
            waitUntil: "networkidle0", timeout: timeout
        });
    }

    async getFrame(selector) {
        await page.waitForSelector(selector);
        const elementHandle = await page.$(selector);
        return await elementHandle.contentFrame();
    }

    async enableConsoleLogs() {
        const chalk = require("chalk");
        page
            .on("console", msg => {
                const type = msg.type().substr(0, 3).toUpperCase();
                const colors = {
                    LOG: text => text,
                    ERR: chalk.red,
                    WAR: chalk.yellow,
                    INF: chalk.cyan
                };
                const color = colors[type] || chalk.blue;
                console.log(color(`${type} ${msg.text()}`));
            })
            .on("pageerror", ({ message }) => console.log(chalk.red(message)))
            .on("response", response => {
                if (response.status() > 399)
                {
                    console.log(chalk.red(`${response.status()} ${response.url()}`));
                }})
            .on("requestfailed", request =>
                console.log(chalk.magenta(`${request.failure().errorText} ${request.url()}`)));
    }
}