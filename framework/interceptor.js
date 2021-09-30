const fs = require("fs");

export default class Interceptor {
    constructor(interceptorPage = page) {
        this.page = interceptorPage
    }

    async takeScreenshot(filename) {
        const targetDir = `./logs/${jasmine["currentSuite"].fullName}/${jasmine["currentTest"].description}`;
        fs.mkdirSync(targetDir, { recursive: true });
        await this.page.screenshot({ path: `${targetDir}/${filename || Date.now()}.png` });
    }

    async abortRequests(requestUrlFragment = "**") {
        await this.page.route(requestUrlFragment, route => {
            route.abort();
            console.log(`Aborted request Url: '${route.request().url()}'`);
        } );
    }

    async abortRequestsAfterAction(action, requestUrlFragment = "", waitDuration = 500) {
        await this.abortRequests(requestUrlFragment);
        await action;
        await this.page.waitForTimeout(waitDuration);
        await this.page.unroute(requestUrlFragment);
    }

    async getAllRequestsData(action) {
        let requestsData = [];
        const requestLogger = request => {
            requestsData.push(request);
        };
        this.page.on("request", requestLogger);
        await action;
        this.page.removeListener("request", requestLogger);
        return requestsData;
    }

    async waitForRequestAfterAction(action, requestUrlFragment = "") {
        const requestAferAction = await this.page.waitForRequest(request => request.url().indexOf(requestUrlFragment) > -1);
        await action;
        console.log(`Url: '${requestAferAction.url()}'`);
        return requestAferAction;
    }

    async waitForResponseAfterAction(action, responsetUrlFragment = "") {
        const responseAferAction = await this.page.waitForResponse(response => response.url().indexOf(responsetUrlFragment) > -1);
        await action;
        console.log(`Url: '${responseAferAction.url()}'`);
        return responseAferAction;
    }
}

