/*global page:true browser*/
import { Element, Helpers } from "test-juggler";
const fs = require("fs");

describe("Helpers", () => {
    let helpers = new Helpers();

    beforeEach(async () => {
        console.log("Running test: " + jasmine["currentTest"].fullName);
    });

    it("should take screenshot and save to test logs directory", async () => {
        //Arrange
        await page.goto("http://the-internet.herokuapp.com/");
        const filename = Date.now();
        const filepath = `./logs/Helpers/should take screenshot and save to test logs directory/${filename}.png`;

        //Act
        await helpers.takeScreenshot(filename);

        //Assert
        expect(fs.existsSync(filepath)).toBeTruthy();
    });

    it("should retry until action have succeeded", async () => {
        //Arrange
        await page.goto("http://the-internet.herokuapp.com/dynamic_loading/2");
        const startButton = new Element("div#start>button");
        const elementToLoad = new Element("div#finish");

        //Act
        await startButton.click();
        await helpers.retry(async () => {
            await elementToLoad.click();
        });

        //Assert
        await expect(elementToLoad.exists()).resolves.toBeTruthy();
    });

    it("should wait for navigation to be finished", async () => {
        //Arrange
        page = await browser.newPage();
        const progressLoader = new Element("html.nprogress-busy");

        //Act
        await helpers.goToUrlAndLoad("https://www.jqueryscript.net/demo/jQuery-Html5-Based-Preloader-Plugin-html5loader/");

        //Assert
        await expect(progressLoader.exists()).resolves.toBeFalsy();
    });

    it("should enter iFrame and get text", async () => {
        //Arrange
        const iFrameSelector = "#mce_0_ifr";
        const textFrameSelector = "#tinymce p";
        await page.goto("http://the-internet.herokuapp.com/iframe");

        //Act
        const frame = await helpers.getFrame(iFrameSelector);
        const textContent = await frame.$eval(textFrameSelector, element => element.textContent);

        //Assert
        expect(textContent).toEqual("Your content goes here.");
    });
});