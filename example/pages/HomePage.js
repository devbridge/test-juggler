/*global page*/
import { Element } from "test-juggler";
import TopBar from "../components/TopBar";

export default class HomePage {
    constructor() {
        this.TopBar = new TopBar();
        this.NavigationBar = new Element("#nav");
        this.HomePageLink = new Element("#homeMenu");
        this.OnlineBankingLink = new Element("#onlineBankingMenu");
        this.FeedBackLink = new Element("#feedback");
    }

    async visit() {
        await page.goto("http://zero.webappsecurity.com/index.html");
        await this.NavigationBar.wait();
    }

    async isNavbarDisplayed() {
        const displayed = await this.HomePageLink.exists() && this.OnlineBankingLink.exists() && this.FeedBackLink.exists();
        return displayed;
    }

    async clickHomepageLink() {
        await this.HomePageLink.click();
    }

    async clicOnlineBankingLink() {
        await this.OnlineBankingLink.click();
    }

    async clicOnlineFeedBackLink() {
        await this.FeedBackLink.click();
    }
}