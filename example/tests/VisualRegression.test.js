/*global page document*/
import HomePage from "../pages/HomePage";
import FeedbackPage from "../pages/FeedbackPage";

describe("Visual Regression", () => {
    let homepage = new HomePage();
    let feedbackpage = new FeedbackPage();

    beforeEach(async () => {
        await homepage.visit();
        console.log("Running test: " + jasmine["currentTest"].fullName);
    });

    it("should compare browser window viewport screenshots", async () => {
        //Arrange, Act
        const screenshot = await page.screenshot();

        //Assert
        expect(screenshot).toMatchImageSnapshot();
    });

    it("should compare full page screenshots", async () => {
        //Arrange, Act
        const screenshot = await page.screenshot({ fullPage: true });

        //Assert
        expect(screenshot).toMatchImageSnapshot();
    });

    it("should compare custom viewport size screenshots", async () => {
        //Arrange
        await page.setViewport({ width: 1920, height: 1080 });

        //Act
        const screenshot = await page.screenshot();

        //Assert
        expect(screenshot).toMatchImageSnapshot();
    });

    it("should compare screenshots of specific page area", async () => {
        //Arrange, Act
        const screenshot = await page.screenshot({
            clip: { x: 240, y: 0, width: 320, height: 50 }
        });

        //Assert
        expect(screenshot).toMatchImageSnapshot();
    });

    it("should capture screenshot of specific page element", async () => {
        //Arrange, Act
        const screenshot = await (await feedbackpage.TopBar.SignInButton.wait()).screenshot();

        //Assert
        expect(screenshot).toMatchImageSnapshot();
    });

    it("should manipulate DOM to modify dynamic/static content before making screenshot comparison", async () => {
        //Arrange
        await page.evaluate((selector) => {
            let signinButtonDomElement = document.querySelector(selector);
            signinButtonDomElement.innerText = "Expected Content";
        }, feedbackpage.TopBar.SignInButton.selector);

        //Act
        const screenshot = await page.screenshot();

        //Assert
        expect(screenshot).toMatchImageSnapshot();
    });

    it("should cover unwanted element before making screenshot comparison", async () => {
        //Arrange
        await homepage.NavigationBar.cover();

        //Act
        const screenshot = await page.screenshot();

        //Assert
        expect(screenshot).toMatchImageSnapshot();
    });
});