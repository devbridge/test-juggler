/*global page document window*/
import Helpers from "./helpers";

const config = require(process.cwd() + "/framework.config");
const defaultTimeout = config.defaultTimeout;
const shortTimeout = config.shortTimeout;

export default class Element {
    constructor(selector) {
        this.selector = selector;
    }

    newChildElement(childSelector) {
        var isXPathSlector = (selector) => selector.startsWith("//");
        if (isXPathSlector(this.selector) != isXPathSlector(childSelector)) {
            throw "Cannot combine different selectors types!";
        }
        return new Element(`${this.selector} ${childSelector}`);
    }

    async wait(timeout = defaultTimeout) {
        console.log(`Waiting for ${this.selector} ...`);
        const elementHandle = await page.waitFor(this.selector, { timeout: timeout });
        if (config.captureScreenshots) {
            await Helpers.takeScreenshot();
        }
        return elementHandle;
    }

    async waitUntilVisible(timeout = defaultTimeout) {
        console.log(`Waiting for ${this.selector} to be visible...`);
        const elementHandle = await page.waitFor(this.selector, { visible: true, timeout: timeout });
        if (config.captureScreenshots) {
            await Helpers.takeScreenshot();
        }
        return elementHandle;
    }

    async waitUntilInvisible(timeout = defaultTimeout) {
        console.log(`Waiting for ${this.selector} to be invisible...`);
        await page.waitFor(this.selector, { hidden: true, timeout: timeout });
        if (config.captureScreenshots) {
            await Helpers.takeScreenshot();
        }
    }

    async click() {
        console.log(`Clicking ${this.selector} ...`);
        const elementHandle = await this.wait();
        await elementHandle.click();
    }

    async doubleClick() {
        console.log(`Double clicking ${this.selector} ...`);
        const elementHandle = await this.wait();
        await elementHandle.click({ clickCount: 2 });
    }

    async rightClick() {
        console.log(`Right clicking ${this.selector} ...`);
        const elementHandle = await this.wait();
        await elementHandle.click({ button: "right" });
    }

    async exists() {
        let exist;
        try {
            await this.wait(shortTimeout);
            exist = true;
            console.log(`Element ${this.selector} exists`);
        }
        catch (error) {
            exist = false;
            console.log(`Element ${this.selector} does not exist`);
        }
        return exist;
    }

    async isVisible() {
        let visible;
        try {
            await this.waitUntilVisible(shortTimeout);
            visible = true;
            console.log(`Element ${this.selector} is visible`);
        }
        catch (error) {
            visible = false;
            console.log(`Element ${this.selector} is not visible`);
        }
        return visible;
    }

    async dragAndDrop(destination) {
        const sourceElement = await page.waitFor(this.selector);
        const destinationElement = await page.waitFor(destination.selector);
        const sourceBox = await sourceElement.boundingBox();
        const destinationBox = await destinationElement.boundingBox();
        console.log(`Drag and dropping ${this.selector} to ${destination.selector} ...`);
        await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
        await page.mouse.down();
        await page.mouse.move(destinationBox.x + destinationBox.width / 2, destinationBox.y + destinationBox.height / 2);
        await page.mouse.up();
    }

    async text() {
        console.log(`Getting inner text of ${this.selector} ...`);
        const elementHandle = await this.wait();
        const text = await elementHandle.evaluate(element => element.innerText);
        return text;
    }

    async value() {
        console.log(`Getting value of ${this.selector} ...`);
        const elementHandle = await this.wait();
        const value = await elementHandle.evaluate(element => element.value);
        return value;
    }

    async enterText(text) {
        console.log(`Entering the text value for ${this.selector} ...`);
        const elementHandle = await this.wait();
        await elementHandle.type(text);
    }

    async getAttributeValue(attributeName) {
        const elementHandle = await this.wait();
        console.log(`Getting '${attributeName}' attribute value of element ${this.selector} ...`);
        const atributeValue = await elementHandle.evaluate((element, attributeName) => element.getAttribute(`${attributeName}`), attributeName);
        return atributeValue;
    }

    async getStyleAttributeValue(name) {
        const elementHandle = await this.wait();
        console.log(`Getting value of style attribute '${name}' of ${this.selector} ...`);
        const attributeValue = await elementHandle.evaluate((element, name) => element.style[name], name);
        return attributeValue;
    }

    async hover() {
        console.log(`Hovering mouse on to ${this.selector} ...`);
        const elementHandle = await this.wait();
        await elementHandle.hover();
    }

    async cover() {
        const elementHandle = await this.wait();
        await elementHandle.evaluate((element) => {
            //Get bounding area of element we want to cover
            const rect = element.getBoundingClientRect();
            //Create a canvas element
            var canvas = document.createElement("canvas");
            //Set canvas drawing area width/height
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            //Position canvas
            canvas.style.position = "absolute";
            canvas.style.left = 0;
            canvas.style.top = 0;
            canvas.style.zIndex = 100000;
            //Make sure you can click 'through' the canvas
            canvas.style.pointerEvents = "none";
            //Append canvas to body element
            document.body.appendChild(canvas);
            var context = canvas.getContext("2d");
            //Draw rectangle
            context.rect(rect.x, rect.y, rect.width, rect.height);
            context.fillStyle = "yellow";
            context.fill();
        });
    }
}