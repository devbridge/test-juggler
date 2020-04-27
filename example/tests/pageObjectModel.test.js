import HomePage from "../pages/HomePage";
import FeedbackPage from "../pages/FeedbackPage";

describe("Example", () => {
    let homepage = new HomePage();
    let feedbackpage = new FeedbackPage();

    beforeEach(async () => {
        await homepage.visit();
        console.log("Running test: " + jasmine["currentTest"].fullName);
    });

    it("should access methods defined in pages and components", async () => {
        await expect(homepage.isNavbarDisplayed()).resolves.toBeTruthy();
        await expect(homepage.TopBar.isTopBarDisplayed()).resolves.toBeTruthy();
    });

    it("should access an element defined in component defined in page", async () => {
        await expect(homepage.TopBar.LogoButton.exists()).resolves.toBeTruthy();
    });

    it("should access an element defined directly in page", async () => {
        await homepage.FeedBackLink.click();
        console.log("Clicked on feedback link");
        await expect(feedbackpage.TitleText.exists()).resolves.toBeTruthy();
    });
});