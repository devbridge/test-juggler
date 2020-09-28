import { Element } from "test-juggler";
import TopBar from "../components/TopBar";

class FeedbackPage {
    constructor() {
        this.TopBar = new TopBar();
        this.TitleText = new Element("#feedback-title");
    }
}

export default new FeedbackPage();