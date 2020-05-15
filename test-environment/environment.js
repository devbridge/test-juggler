const PuppeteerEnvironment = require("jest-environment-puppeteer");
const config = require(process.cwd() + "/framework.config");
const fs = require("fs");

class CustomEnvironment extends PuppeteerEnvironment {
    async setup() {
        await super.setup();
        this.global.page.setDefaultTimeout(config.defaultTimeout);
        const chalk = require("chalk");
        this.global.page
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
        if (config.useTracing) {
            const targetDir = "./logs/Timelines";
            fs.mkdirSync(targetDir, { recursive: true });
            await this.global.page.tracing.start({ screenshots: true, path: `${targetDir}/${Date.now()}_trace.json` });
            console.log("Page tracing has started");
        }
    }

    async teardown() {
        if (config.useTracing) {
            await this.global.page.tracing.stop();
            console.log("Page tracing has stopped");
        }
        await super.teardown();
    }
}

module.exports = CustomEnvironment;