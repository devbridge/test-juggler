import { Element, Interceptor } from "test-juggler";

const DemoQaSite = "https://demoqa.com/books";
const DemoOpenCartSite = "https://demo.opencart.com/";
const successMessage = new Element(".alert-success");
const addToCartButton = new Element(".product-layout:nth-child(1) > div button:nth-child(1)");
const loadingWrapper = new Element("#loading-wrapper");
const booksWrapper = new Element(".books-wrapper");

describe("Interceptor", () => {
    beforeEach(async () => {
        console.log(`Running test: '${jasmine["currentTest"].fullName}'`);
        //this is workaraound to avoid 'Request is already handled!' error. Shoud be removed when https://github.com/smooth-code/jest-puppeteer/issues/308 defect is fixed.
        const context = await browser.newContext();
        page = await context.newPage();
    });

    it("should block requests by any url fragment using Regex pattern while test case running", async () => {
        //Arrange
        const requestUrlRegex = /BookStore/;
        await Interceptor.abortRequests(requestUrlRegex);

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
        await loadingWrapper.waitUntilInvisible();

        //Assert
        await expect(booksWrapper.exists()).resolves.toBeTruthy();

        //Act
        await Interceptor.abortRequests(requestUrlGlob);
        await page.reload();
        await loadingWrapper.waitUntilVisible();

        //Assert
        await expect(booksWrapper.exists()).resolves.toBeFalsy();
    });

    it("should block request by any url fragment after action", async () => {
        //Arrange

        const requestUrlGlob = "**/BookStore/**";
        await Interceptor.abortRequestsAfterAction(page.goto(DemoQaSite), requestUrlGlob);

        //Assert
        await loadingWrapper.waitUntilVisible();

        //Assert
        await expect(booksWrapper.exists()).resolves.toBeFalsy();

        //Act
        await page.reload();
        await loadingWrapper.waitUntilInvisible();

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
        await Interceptor.abortRequestsAfterAction(addToCartButton.click());

        //Assert
        await expect(successMessage.isVisible()).resolves.toBeFalsy();
        expect(alertMessage).toContain("error", "undefined");
    });

    it("should count all requests", async () => {
        //Act
        var totalRequests = await Interceptor.getAllRequestsData(page.goto(DemoOpenCartSite));

        //Assert
        expect(totalRequests.length > 0).toBeTruthy();
        console.log(`Found ${totalRequests.length} request(s)`);
    });

    it("should detect specific response after action", async () => {
        //Arrange
        const responseUrlFragment = "cart/info";
        await page.goto(DemoOpenCartSite);

        //Act
        var responseAfterAction = await Interceptor.waitForResponseAfterAction(addToCartButton.click(), responseUrlFragment);

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
        var requestAfterAction = await Interceptor.waitForRequestAfterAction(addToCartButton.click());

        //Assert
        await expect(successMessage.isVisible()).resolves.toBeTruthy();
        expect(requestAfterAction).toBeTruthy();
        console.log(`Request Url after action: '${requestAfterAction.url()}'`);
    });
});