import { RequestMocker, Element, Helpers } from "test-juggler";
const fs = require("fs");

describe("Request mocking by recording and replaying and indercetipt specific requests", () => {

    let mocker = new RequestMocker();
    let helpers = new Helpers();

    it("Recording all requests and replaying it on the second test run google", async () => {

        //Arrange
        await mocker.start();

        //Act
        await helpers.goToUrlAndLoad("https://downforeveryoneorjustme.com/google");
        await mocker.stop();

        //Assert
        expect(fs.existsSync("mockData\\Request mocking by recording and replaying and indercetipt specific requests\\Recording all requests and replaying it on the second test run google\\interceptors\\get.json")).toBe(true);
    });

    it("Interceptor response 404 to all requests", async () => {

        //Arrange
        const errorTextElement = new Element("div.humane.humane-jackedup-error.humane-animate");
        const notFoundInterceptor = {
            response: { status: 404 }
        };

        //Act
        await mocker.start(notFoundInterceptor);
        await helpers.goToUrlAndLoad("https://www.cheapshark.com/");
        await mocker.stop();
        const actualText = await errorTextElement.text();

        //Assert
        expect(actualText).toMatch("Error - 404 Not Found");
    });

    it("Interceptor changing response body", async () => {

        //Arrange
        const errorTextElement = new Element("#json > span:nth-child(42)");
        const responseBodyChanged = {
            url: "https://api.ratesapi.io/api/latest",
            response: {
                status: 200,
                body: { "base": "EUR", "rates": { "This": 0.89448, "Response": 8.7809, "is": 15882.4, "mocked": 3.9172, "!": 7.4564 }, "date": "2020-06-05" }
            }
        };

        //Act
        await mocker.start(responseBodyChanged);
        await helpers.goToUrlAndLoad("https://ratesapi.io/");
        await mocker.stop();
        const actualText = await errorTextElement.text();

        //Assert
        expect(actualText).toMatch("\"mocked\"");
    });


    it("Interceptor delaying response by 3s (ttfb)", async () => {

        //Arrange
        const timeStamp = Date.now();
        const responseBodyChanged = {
            url: "https://api.ratesapi.io/api/latest",
            response: {
                status: 200,
                body: { "base": "EUR", "rates": { "This": 0.89448, "Response": 8.7809, "is": 15882.4, "mocked": 3.9172, "!": 7.4564 }, "date": "2020-06-05" },
                ttfb: 3000
            }
        };

        //Act
        await mocker.start(responseBodyChanged);
        await helpers.goToUrlAndLoad("https://ratesapi.io/");
        const pageLoadTimeinMs = Date.now() - timeStamp;
        await mocker.stop();

        //Assert  
        expect(pageLoadTimeinMs).toBeGreaterThan(3000);
    });
});