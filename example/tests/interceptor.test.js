import { Element, Interceptor } from "test-juggler";

const DemoQaSite = "https://demoqa.com/books";
const DemoOpenCartSite = "https://demo.opencart.com/";
let page;
let successMessage;
let addToCartButton;
let loadingWrapper;
let booksWrapper;
let interceptor;

describe("Interceptor", () => {
    beforeEach(async () => {
        console.log(`Running test: '${jasmine["currentTest"].fullName}'`);
        //this is workaraound to avoid 'Request is already handled!' error. Shoud be removed when https://github.com/smooth-code/jest-puppeteer/issues/308 defect is fixed.
        const context = await browser.newContext();
        page = await context.newPage();
        successMessage = new Element(".alert-success", page);
        addToCartButton = new Element(".product-layout:nth-child(1) > div button:nth-child(1)", page);
        loadingWrapper = new Element("#loading-wrapper", page);
        booksWrapper = new Element(".books-wrapper", page);
        interceptor = new Interceptor(page);
    });

    it("should block requests by any url fragment using Regex pattern while test case running", async () => {
        //Arrange
        const requestUrlRegex = /BookStore/;
        await interceptor.abortRequests(requestUrlRegex);

        //Act
        await page.goto(DemoQaSite);
        await loadingWrapper.waitUntilVisible();

        //Assert
        await expect(booksWrapper.exists()).resolves.toBeFalsy();

        //Act
        await page.reload();
        await loadingWrapper.waitUntilVisible();

        //Assert
        await expect(booksWrapper.exists()).resolves.toBeFalsy();
    });

    it("should block requests by any url fragment using Glob pattern after abort method is used", async () => {
        //Arrange
        const requestUrlGlob = "**/BookStore/**";

        //Act
        await page.goto(DemoQaSite);
        await booksWrapper.waitUntilVisible();

        //Assert
        await expect(booksWrapper.exists()).resolves.toBeTruthy();

        //Act
        await interceptor.abortRequests(requestUrlGlob);
        await page.reload();
        await loadingWrapper.waitUntilVisible();

        //Assert
        await expect(booksWrapper.exists()).resolves.toBeFalsy();
    });

    it("should block request by any url fragment after action", async () => {
        //Arrange

        const requestUrlGlob = "**/BookStore/**";
        await interceptor.abortRequestsAfterAction(page.goto(DemoQaSite), requestUrlGlob);

        //Assert
        await loadingWrapper.waitUntilVisible();

        //Assert
        await expect(booksWrapper.exists()).resolves.toBeFalsy();

        //Act
        await page.reload();
        await booksWrapper.waitUntilVisible();

        //Assert
        await expect(booksWrapper.exists()).resolves.toBeTruthy();
    });

    it("should block any request after action", async () => {
        //Arrange
        await page.goto(DemoOpenCartSite);
        var alertMessage = null;
        page.on("dialog", dialog => {
            console.log(`Alert was detected: '${dialog.message()}'`);
            alertMessage = dialog.message();
            dialog.dismiss();
        });

        //Act
        await interceptor.abortRequestsAfterAction(addToCartButton.click());

        //Assert
        await expect(successMessage.isVisible()).resolves.toBeFalsy();
        expect(alertMessage).toContain("error", "undefined");
    });

    it("should count all requests", async () => {
        //Act
        var totalRequests = await interceptor.getAllRequestsData(page.goto(DemoOpenCartSite));

        //Assert
        expect(totalRequests.length > 0).toBeTruthy();
        console.log(`Found ${totalRequests.length} request(s)`);
    });

    it("should detect specific response after action", async () => {
        //Arrange
        const responseUrlFragment = "cart/info";
        await page.goto(DemoOpenCartSite);

        //Act
        var responseAfterAction = await interceptor.waitForResponseAfterAction(addToCartButton.click(), responseUrlFragment);

        //Assert
        await expect(successMessage.isVisible()).resolves.toBeTruthy();
        expect(responseAfterAction).toBeTruthy();
        console.log(`Request Url after action: '${responseAfterAction.url()}'`);
        console.log(`Response Body: '${await responseAfterAction.text()}'`);
    });

    it("should detect any request after action", async () => {
        //Arrange
        await page.goto(DemoOpenCartSite);

        //Act
        var requestAfterAction = await interceptor.waitForRequestAfterAction(addToCartButton.click());

        //Assert
        await expect(successMessage.isVisible()).resolves.toBeTruthy();
        expect(requestAfterAction).toBeTruthy();
        console.log(`Request Url after action: '${requestAfterAction.url()}'`);
    });
});