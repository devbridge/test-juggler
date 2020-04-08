const PuppeteerEnvironment = require("jest-environment-puppeteer");
const config = require(process.cwd() + "/framework.config");
const fs = require("fs");

class CustomEnvironment extends PuppeteerEnvironment {
    async setup() {
        await super.setup();
        this.global.page.setDefaultTimeout(config.defaultTimeout);
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