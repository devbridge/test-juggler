/*global page:true browser*/
import { Element, Helpers } from "test-juggler";
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

    it("should wait for navigation to be finished", async () => {
        //Arrange
        const progressLoader = new Element("html.nprogress-busy");
        const loadTimeout = 30000;

        //Act
        await Helpers.goToUrlAndLoad("https://www.jqueryscript.net/demo/jQuery-Html5-Based-Preloader-Plugin-html5loader/", loadTimeout);

        //Assert
        await expect(progressLoader.exists()).resolves.toBeFalsy();
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
        const config = require(process.cwd() + "/framework.config");
        const newPage = await browser.newPage();
        
        //Act
        await Helpers.pageSetup(newPage);

        //Assert
        expect(newPage._timeoutSettings.timeout()).toEqual(config.defaultTimeout);
    });

    it("should generate random text without numbers", async () => {
        //Arrange, Act
        const text = await Helpers.generateRandomText(8, false);
        const regex = /[^A-Za-z]/;

        //Assert
        expect(regex.test(text)).toBeFalsy();
        expect(text.length).toEqual(8);
    });

    it("should generate random text with numbers", async () => {
        //Arrange, Act
        const text = await Helpers.generateRandomText(10, true);
        const regex = /[^A-Za-z0-9]/;

        //Assert
        expect(regex.test(text)).toBeFalsy();
        expect(text.length).toEqual(10);
    });
});