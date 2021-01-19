import HomePage from "../pages/HomePage";
import FeedbackPage from "../pages/FeedbackPage";

describe("Example", () => {
    beforeEach(async () => {
        await HomePage.visit();
        console.log("Running test: " + jasmine["currentTest"].fullName);
    });

    it("should access methods defined in pages and components", async () => {
        await expect(HomePage.isNavbarDisplayed()).resolves.toBeTruthy();
        await expect(HomePage.TopBar.isTopBarDisplayed()).resolves.toBeTruthy();
    });

    it("should access an element defined in component defined in page", async () => {
        await HomePage.TopBar.LogoButton.waitUntilVisible();
        await expect(HomePage.TopBar.LogoButton.exists()).resolves.toBeTruthy();
    });

    it("should access an element defined directly in page", async () => {
        await HomePage.FeedBackLink.click();
        console.log("Clicked on feedback link");
        await FeedbackPage.TitleText.waitUntilVisible();
        await expect(FeedbackPage.TitleText.exists()).resolves.toBeTruthy();
    });
});
