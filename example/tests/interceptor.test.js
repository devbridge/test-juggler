/*global page:true browser*/
import { Element, Helpers, Interceptor } from "test-juggler";

const DemoGuruSite = "http://demo.guru99.com/test/radio.html";
const DemoOpenCartSite = "https://demo.opencart.com/";
const successMessage = new Element(".alert-success");
const addToCartButton = new Element(".product-layout:nth-child(1) > div button:nth-child(1)");

describe("Interceptor", () => {
    beforeEach(async () => {
        console.log(`Running test: '${jasmine["currentTest"].fullName}'`);
        //this is workaraound to avoid 'Request is already handled!' error. Shoud be removed when https://github.com/smooth-code/jest-puppeteer/issues/308 defect is fixed.
        page = await browser.newPage();
        Helpers.enableConsoleLogs();
    });

    it("should block requests by any url fragment while test case running", async () => {
        //Arrange
        const navBar = new Element(".navbar");
        const requestUrlFragment = "topmenu";

        await Interceptor.abortRequests(requestUrlFragment);

        //Act
        await page.goto(DemoGuruSite);

        //Assert
        await expect(navBar.exists()).resolves.toBeFalsy();

        //Act
        await page.reload( { waitUntil: "networkidle2" } );

        //Assert
        await expect(navBar.exists()).resolves.toBeFalsy();
    });

    it("should block requests by any url fragment after abort method is used", async () => {
        //Arrange
        const navBar = new Element(".navbar");
        const requestUrlFragment = "topmenu";

        //Act
        await page.goto(DemoGuruSite);

        //Assert
        await expect(navBar.exists()).resolves.toBeTruthy();

        //Act
        await Interceptor.abortRequests(requestUrlFragment);
        await page.reload( { waitUntil: "networkidle2" } );

        //Assert
        await expect(navBar.exists()).resolves.toBeFalsy();
    });

    it("should block request by any url fragment during action", async () => {
        //Arrange
        const navBar = new Element(".navbar");
        const requestUrlFragment = "topmenu";
        await Interceptor.abortRequestsDuringAction(page.goto(DemoGuruSite), requestUrlFragment);

        //Assert
        await expect(navBar.exists()).resolves.toBeFalsy();

        //Act
        await page.reload( { waitUntil: "networkidle2" } );

        //Assert
        await expect(navBar.exists()).resolves.toBeTruthy();
    });

    it("should block any request during action", async () => {
        //Arrange
        await Helpers.goToUrlAndLoad(DemoOpenCartSite);
        page.on("dialog", dialog => {
            console.log(`Alert was detected: '${dialog.message()}'`);
            dialog.dismiss();
        });

        //Act
        await Interceptor.abortRequestsDuringAction(() => { addToCartButton.click(); });

        //Assert
        await expect(successMessage.isVisible()).resolves.toBeFalsy();
    });

    it("should count all requests", async () => {
        //Act
        var totalRequests = await Interceptor.getAllRequestsData(Helpers.goToUrlAndLoad(DemoOpenCartSite));

        //Assert
        expect(totalRequests.length > 0).toBeTruthy();
        console.log(`Found ${totalRequests.length} request(s)`);
    });

    it("should detect specific response after action", async () => {
        //Arrange
        const responsetUrlFragment = "cart/info";
        await Helpers.goToUrlAndLoad(DemoOpenCartSite);

        //Act
        var responseAfterAction = await Interceptor.waitForResponseAfterAction(addToCartButton.click(), responsetUrlFragment);

        //Assert
        await expect(successMessage.isVisible()).resolves.toBeTruthy();
        expect(responseAfterAction).toBeTruthy();
        console.log(`Request Url after action: '${responseAfterAction.url()}'`);
        console.log(`Request Body: '${await responseAfterAction.text()}'`);
    });

    it("should detect any request after action", async () => {
        //Arrange
        await Helpers.goToUrlAndLoad(DemoOpenCartSite);

        //Act
        var requestAfterAction = await Interceptor.waitForRequestAfterAction(addToCartButton.click());

        //Assert
        await expect(successMessage.isVisible()).resolves.toBeTruthy();
        expect(requestAfterAction).toBeTruthy();
        console.log(`Request Url after action: '${requestAfterAction.url()}'`);
        console.log(`Request Body: '${await requestAfterAction.response().text()}'`);
    });
});