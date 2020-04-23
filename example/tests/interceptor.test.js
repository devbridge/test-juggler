/*global page:true browser*/
import { Element, Helpers, Interceptor } from "test-juggler";

const DemoGuruSite = "http://demo.guru99.com/test/radio.html";
const DemoOpenCartSite = "https://demo.opencart.com/";
const successMessage = new Element(".alert-success");
const addToCartButton = new Element(".product-layout:nth-child(1) > div button:nth-child(1)");

describe("Interceptor", () => {
    let helpers = new Helpers();
    let interceptor = new Interceptor();

    beforeEach(async () => {
        console.log(`Running test: '${jasmine["currentTest"].fullName}'`);
        //this is workaraound to avoid 'Request is already handled!' error. Shoud be removed when https://github.com/smooth-code/jest-puppeteer/issues/308 defect is fixed.
        page = await browser.newPage();
    });

    it("should block requests by any url fragment while test case running", async () => {
        //Arrange
        const navBar = new Element(".navbar");
        const requestUrlFragment = "topmenu";

        await interceptor.abortRequests(requestUrlFragment);

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
        await interceptor.abortRequests(requestUrlFragment);
        await page.reload( { waitUntil: "networkidle2" } );

        //Assert
        await expect(navBar.exists()).resolves.toBeFalsy();
    });

    it("should block request by any url fragment during action", async () => {
        //Arrange
        const navBar = new Element(".navbar");
        const requestUrlFragment = "topmenu";
        await interceptor.abortRequestsDuringAction(page.goto(DemoGuruSite), requestUrlFragment);

        //Assert
        await expect(navBar.exists()).resolves.toBeFalsy();

        //Act
        await page.reload( { waitUntil: "networkidle2" } );

        //Assert
        await expect(navBar.exists()).resolves.toBeTruthy();
    });

    it("should block any request during action", async () => {
        //Arrange
        await helpers.goToUrlAndLoad(DemoOpenCartSite);
        await page.on("dialog", dialog => {
            console.log(`Alert was detected: '${dialog.message()}'`);
            dialog.dismiss();
        });

        //Act
        await interceptor.abortRequestsDuringAction(() => { addToCartButton.click(); });

        //Assert
        await expect(successMessage.isVisible()).resolves.toBeFalsy();
    });

    it("should count all requests", async () => {
        //Act
        var totalRequests = await interceptor.getAllRequestsData(helpers.goToUrlAndLoad(DemoOpenCartSite));

        //Assert
        expect(totalRequests.length > 0).toBeTruthy();
        console.log(`Found ${totalRequests.length} request(s)`);
    });

    it("should detect specific response after action", async () => {
        //Arrange
        const responsetUrlFragment = "cart/info";
        await helpers.goToUrlAndLoad(DemoOpenCartSite);

        //Act
        var responseAfterAction = await interceptor.waitForResponseAfterAction(addToCartButton.click(), responsetUrlFragment);

        //Assert
        await expect(successMessage.isVisible()).resolves.toBeTruthy();
        expect(responseAfterAction).toBeTruthy();
        console.log(`Request Url after action: '${responseAfterAction.url()}'`);
        console.log(`Request Body: '${await responseAfterAction.text()}'`);
    });

    it("should detect any request after action", async () => {
        //Arrange
        await helpers.goToUrlAndLoad(DemoOpenCartSite);

        //Act
        var requestAfterAction = await interceptor.waitForRequestAfterAction(addToCartButton.click());

        //Assert
        await expect(successMessage.isVisible()).resolves.toBeTruthy();
        expect(requestAfterAction).toBeTruthy();
        console.log(`Request Url after action: '${requestAfterAction.url()}'`);
        console.log(`Request Body: '${await requestAfterAction.response().text()}'`);
    });
});