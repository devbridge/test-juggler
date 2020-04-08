import { Element } from "test-juggler";
import TopBar from "../components/TopBar";

export default class FeedbackPage {
    constructor() {
        this.TopBar = new TopBar();
        this.TitleText = new Element("#feedback-title");
    }
}