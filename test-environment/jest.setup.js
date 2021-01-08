jasmine.getEnv().addReporter({
    specStarted: result => jasmine.currentTest = result,
    specDone: result => jasmine.currentTest = result,
    suiteStarted: result => jasmine.currentSuite = result,
    suiteDone: result => jasmine.currentSuite = result,
});
const { toMatchImageSnapshot } = require("jest-image-snapshot");
expect.extend({ toMatchImageSnapshot });