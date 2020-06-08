/*global page*/
import teremock from "teremock";

const DEFAULT_INTERCEPTOR_CAPTURE = {
    resourceTypes: "xhr,fetch"
};

export default class RequestMocker {

    async stop() {
        await teremock.stop();
    }

    async start(interceptors = DEFAULT_INTERCEPTOR_CAPTURE) {

        const targetDir = `./mockData/${jasmine["currentSuite"].fullName}/${jasmine["currentTest"].description}`;
        await teremock.start({ page, wd: targetDir, interceptors: { interceptors } });
    }
}