import { Element } from "test-juggler";

export default class TopBar extends Element {
    constructor() {
        super(".navbar-inner");
        this.SignInButton = this.newChildElement("#signin_button");
        this.LogoButton = this.newChildElement(".brand");
    }

    async isTopBarDisplayed() {
        const displayed = await this.SignInButton.exists() && this.LogoButton.exists();
        return displayed;
    }

    async clickSignInButton() {
        await this.SignInButton.click();
    }
}