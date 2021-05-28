import { Element, Helpers } from "test-juggler";
import helpers from "../../framework/helpers";
const fs = require("fs");

describe("Helpers", () => {
    beforeEach(async () => {
        console.log("Running test: " + jasmine["currentTest"].fullName);
    });

    it("should take screenshot, save to logs folder and return filepath", async () => {
        //Arrange
        await page.goto("http://the-internet.herokuapp.com/");
        const fileName = Date.now();
        const expectedFilePath = `./logs/Helpers/should take screenshot, save to logs folder and return filepath/${fileName}.png`;

        //Act
        const actualFilePath = await Helpers.takeScreenshot(fileName);

        //Assert
        expect(actualFilePath).toBe(expectedFilePath);
        expect(fs.existsSync(actualFilePath)).toBeTruthy();
    });

    it("should use date now for screenshot file name when none is provided", async () => {
        //Arrange
        await page.goto("http://the-internet.herokuapp.com/");

        //Act
        const actualFilePath = await Helpers.takeScreenshot();

        //Assert
        expect(actualFilePath).toContain(Date.now().toString().slice(0, -6));
    });

    it("should retry until action have succeeded", async () => {
        //Arrange
        await page.goto("http://the-internet.herokuapp.com/dynamic_loading/2");
        const startButton = new Element("div#start>button");
        const elementToLoad = new Element("div#finish");

        //Act
        await startButton.click();
        await Helpers.retry(async () => {
            await elementToLoad.click();
        });

        //Assert
        await expect(elementToLoad.exists()).resolves.toBeTruthy();
    });

    it("should enter iFrame and get text", async () => {
        //Arrange
        const iFrameSelector = "#mce_0_ifr";
        const textFrameSelector = "#tinymce p";
        await page.goto("http://the-internet.herokuapp.com/iframe");

        //Act
        const frame = await Helpers.getFrame(iFrameSelector);
        const textContent = await frame.$eval(textFrameSelector, element => element.textContent);

        //Assert
        expect(textContent).toEqual("Your content goes here.");
    });

    it("should setup new page", async () => {
        //Arrange
        const config = require(process.cwd() + "/test-juggler.config");
        const newPage = await browser.newPage();

        //Act
        await Helpers.pageSetup(newPage);

        //Assert
        expect(newPage._timeoutSettings.timeout({})).toEqual(config.defaultTimeout);
    });

    it("should generate random text with no characters specified", async () => {
        //Arrange, Act
        const text = await Helpers.generateRandomText(10);
        const regex = /^[A-Za-z0-9]+$/;

        //Assert
        expect(regex.test(text)).toBeTruthy();
        expect(text.length).toEqual(10);
    });

    it("should generate random text with custom characters list", async () => {
        //Arrange
        const chars = "0123456789";
        const regex = /^[0-9]+$/;

        //Act
        const text = await Helpers.generateRandomText(8, chars);

        //Assert
        expect(regex.test(text)).toBeTruthy();
        expect(text.length).toEqual(8);
    });

    it("should accept opened alerts", async () => {
        //Arrange
        const pageWithAcceptAlertsSetup = await browser.newPage();
        await Helpers.acceptPopupsOnPage(pageWithAcceptAlertsSetup);
        const resultElement = new Element("#result", pageWithAcceptAlertsSetup);

        //Act 
        await pageWithAcceptAlertsSetup.goto("http://the-internet.herokuapp.com/javascript_alerts");
	    await pageWithAcceptAlertsSetup.click("button[onclick='jsAlert()']");
        const resultElementText = await resultElement.text();

        //Assert
        expect(resultElementText).toMatch("You successfully clicked an alert");
    });

    it("should close opened alerts", async () => {
        //Arrange
        const pageWithDismissAlertsSetup = await browser.newPage();
        await Helpers.dismissPopupsOnPage(pageWithDismissAlertsSetup);
        const resultElement = new Element("#result", pageWithDismissAlertsSetup);

        //Act 
        await pageWithDismissAlertsSetup.goto("http://the-internet.herokuapp.com/javascript_alerts");
	    await pageWithDismissAlertsSetup.click("button[onclick='jsAlert()']");
        const resultElementText = await resultElement.text();

        //Assert
        expect(resultElementText).toMatch("You successfully clicked an alert");
    });
});