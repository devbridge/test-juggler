/*global page document window*/
import Helpers from "./helpers";

const config = require(process.cwd() + "/framework.config");
var helpers = new Helpers();

const defaultTimeout = config.defaultTimeout;
const shortTimeout = config.shortTimeout;

export default class Element {
    constructor(selector) {
        this.selector = selector;
    }

    newChildElement(childSelector) {
        return new Element(`${this.selector} ${childSelector}`);
    }

    async wait(timeout = defaultTimeout) {
        console.log(`Waiting for ${this.selector} ...`);
        await page.waitForSelector(this.selector, { timeout: timeout });
        if (config.captureScreenshots) {
            await helpers.takeScreenshot();
        }
    }

    async waitUntilVisible(timeout = defaultTimeout) {
        console.log(`Waiting for ${this.selector} to be visible...`);
        await page.waitForSelector(this.selector, { visible: true, timeout: timeout });
        if (config.captureScreenshots) {
            await helpers.takeScreenshot();
        }
    }

    async waitUntilInvisible(timeout = defaultTimeout) {
        console.log(`Waiting for ${this.selector} to be invisible...`);
        await page.waitForSelector(this.selector, { hidden: true, timeout: timeout });
        if (config.captureScreenshots) {
            await helpers.takeScreenshot();
        }
    }

    async click() {
        await this.wait();
        console.log(`Clicking ${this.selector} ...`);
        await page.click(this.selector);
    }

    async doubleClick() {
        await this.wait();
        console.log(`Double clicking ${this.selector} ...`);
        await page.click(this.selector, { clickCount: 2 });
    }

    async rightClick() {
        await this.wait();
        console.log(`Right clicking ${this.selector} ...`);
        await page.click(this.selector, { button: "right" });
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
        await this.wait();
        await destination.wait();
        const sourceElement = await page.$(this.selector);
        const destinationElement = await page.$(destination.selector);
        const sourceBox = await sourceElement.boundingBox();
        const destinationBox = await destinationElement.boundingBox();
        console.log(`Drag and dropping ${this.selector} to ${destination.selector} ...`);
        await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
        await page.mouse.down();
        await page.mouse.move(destinationBox.x + destinationBox.width / 2, destinationBox.y + destinationBox.height / 2);
        await page.mouse.up();
    }

    async text() {
        await this.wait();
        console.log(`Getting inner text of ${this.selector} ...`);
        const text = await page.$eval(this.selector, e => e.innerText);
        return text;
    }

    async value() {
        await this.wait();
        console.log(`Getting value of ${this.selector} ...`);
        const value = await page.$eval(this.selector, e => e.value);
        return value;
    }

    async getAttributeValue(attributeName) {
        await this.wait();
        console.log(`Getting '${attributeName}' attribute value of element ${this.selector} ...`);
        const atributeValue = await page.$eval(this.selector, (element, attributeName) => element.getAttribute(`${attributeName}`), attributeName);
        return atributeValue;
    }

    async getStyleAttributeValue(name) {
        await this.wait();
        console.log(`Getting value of style attribute '${name}' of ${this.selector} ...`);
        const attributeValue = await page.$eval(this.selector, (element, name) => element.style[name], name);
        return attributeValue;
    }

    async hover() {
        await this.wait();
        console.log(`Hovering mouse on to ${this.selector} ...`);
        await page.hover(this.selector);
    }

    async getDomElement() {
        await this.wait();
        console.log(`Getting DOM element ${this.selector} ...`);
        return await page.$(this.selector);
    }

    async cover() {
        await page.evaluate((selector) => {
            //Get bounding area of element we want to cover
            const element = document.querySelector(selector);
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
        }, this.selector);
    }
}