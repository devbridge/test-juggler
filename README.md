![Juggler](https://user-images.githubusercontent.com/11597256/83160670-26292200-a110-11ea-93a0-7c05ef293fdf.png)

# README #

### What is this repository for? ###

* This Repository is for developing Test Juggler E2E test automation framework:
  https://github.com/devbridge/test-juggler

### How do I get set up? ###

1. Go to existing node project where you want to install test-juggler. In case of having tests in seperate project, go to empty folder and run "npm init --yes", to create new project.
2. Run "npm install test-juggler"
3. Run "npx jest" to run example tests.
4. For installing framework without copying examples (i.e. for continious integration), set environment varaible "DO_NOT_INSTALL_EXAMPLES = true" before installing.

### Default Timeout ###

* Default time in milliseconds for Puppeteer to wait for an element can be set in framework.config i.e. defaultTimeout: 10000

### Performance Tracing ###

* To enable Chrome performance tracing set useTracing to true in framework.config
* Chromium does not support tracing of different tabs in parallel, so this option will only work when tests are run in serial mode
* Use "jest --runInBand" as your "test" command to run tests serially

### Screenshot Capturing ###

* Set captureScreenshots: true in framework.config to enable capturing screenshots on every action.
* Note that screen capture does not work well with headful browser mode.
* There might be some performance degradation when using screenshots capturing.

### Visual regression functionality ###

* Currently we are using unmodified jest-image-snapshot library
* The documentation is located at: https://github.com/americanexpress/jest-image-snapshot#readme

### Retrying actions ###

* helpers.retry() allows to retry any async function. 
* By default it uses exponential factoring, i.e. every next timeout is twice as long.
* Use retry as last resort, when tests depends on flaky third party behaviour.

### Waiting for full page load ###

* helpers.goToUrlAndLoad() waits for page to be fully loaded. 
* It uses parameter 'waitUntil: "networkidle0"' to consider navigation to be finished when there are no more than 0 network connections for at least 500 ms.

### Intercept requests ###

* Interceptor helper introduced to take some actions with requests and responses: 
* interceptor.abortRequests() allows to abort all requests or requests by url fragment.
* interceptor.abortRequestsDuringAction() allows to abort all requests or requests by url fragment when specific action is being performed.
* interceptor.getAllRequestsData() allows to get all requests information when specific action is being performed.
* interceptor.waitForRequestAfterAction() waits for specific or any first request and returns all its data.
* interceptor.waitForResponseAfterAction() waits for specific or any first response and returns all its data.

### Request Mocking ###

* We are using teremock - Easy to use test request mocker for puppeteer / mocha / karma
* The documentation is located at: https://github.com/Diokuz/teremock
* The Helper (RequestMocker) that is implemented has simplified behavior where it will record all xhr and fetch responses from backend and when replay on the subsequent runs.
Default behavior can be overridden with custom options passed. The options allow to target specific requests and allow to specify response body, headers, status and delay.

### Parallel execution ###
* By default Jest runs tests in parallel with a worker pool of child processes
* The console commands responsible for parallelization settings ([Official Jest documentation](https://jestjs.io/docs/en/cli.html)):

> __-maxConcurrency=<num> (Default: 5)__
Prevents Jest from executing more than the specified amount of tests at the same time. Only affects tests that use test.concurrent.

> __-maxWorkers=<num>|<string>__
Specifies the maximum number of workers the worker-pool will spawn for running tests. In single run mode, this defaults to the number of the cores available on your machine minus one for the main thread.
In watch mode, this defaults to half of the available cores on your machine to ensure Jest is unobtrusive and does not grind your machine to a halt.
It may be useful to adjust this in resource limited environments like CIs but the defaults should be adequate for most use-cases.
For environments with variable CPUs available, you can use percentage based configuration: __--maxWorkers=50%__

* Create at least 21 test files and invoke with __--maxWorkers=4__ to run tests on 4 threads for example.
That should be enough to trick Jest into running your tests always in parallel. ([Source](https://github.com/facebook/jest/issues/5818#issuecomment-383674946))
* Running with __--no-cache__ it always seems to run in parallel (as long as there are at least two files anyway). ([Source](https://github.com/facebook/jest/issues/5818#issuecomment-383739607)) 

### Junit report ###
* junit report is generated on every test run. Report can be found in junit-report/junit.xml. Path and other parameters can be changed. More info:([Source](https://www.npmjs.com/package/jest-junit))

### Running tests sequentially ###
* Use --runInBand cli command if tests need to be executed serially ([Official Jest documentation](https://jestjs.io/docs/en/cli.html))

### Contribution guidelines ###

* Contribution should be done and tested in feature branch
* PR review is required to merge to Master
* All code should be covered in Unit tests

### Who do I talk to? ###

* For any questions regarding repo reach out to: vaidas.maciulis@devbridge.com