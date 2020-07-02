/*global page*/
const fs = require("fs");

export default class Interceptor {
    async takeScreenshot(filename) {
        const targetDir = `./logs/${jasmine["currentSuite"].fullName}/${jasmine["currentTest"].description}`;
        fs.mkdirSync(targetDir, { recursive: true });
        await page.screenshot({ path: `${targetDir}/${filename || Date.now()}.png` });
    }

    async abortRequests(requestUrlFragment = "") {
        const requestStopper = request => {
            if (request.url().indexOf(requestUrlFragment) > -1) {
                request.abort();
                console.log(`Aborted request Url: '${request.url()}'`);
            }
            else
                request.continue();
        };
        await page.setRequestInterception(true);
        page.on("request", requestStopper);
        return requestStopper;
    }

    async abortRequestsAfterAction(action, requestUrlFragment = "", waitDuration = 500) {
        let requestStopper = await this.abortRequests(requestUrlFragment);
        await action;
        await page.waitFor(waitDuration);
        page.removeListener("request", requestStopper);
        await page.setRequestInterception(false);
    }

    async getAllRequestsData(action) {
        let requestsData = [];
        const requestLogger = request => {
            requestsData.push(request);
        };
        page.on("request", requestLogger);
        await action;
        page.removeListener("request", requestLogger);
        return requestsData;
    }

    async waitForRequestAfterAction(action, requestUrlFragment = "") {
        const requestAferAction = await page.waitForRequest(request => request.url().indexOf(requestUrlFragment) > -1);
        await action;
        console.log(`Url: '${requestAferAction.url()}'`);
        return requestAferAction;
    }

    async waitForResponseAfterAction(action, responsetUrlFragment = "") {
        const responseAferAction = await page.waitForResponse(response => response.url().indexOf(responsetUrlFragment) > -1);
        await action;
        console.log(`Url: '${responseAferAction.url()}'`);
        return responseAferAction;
    }
}