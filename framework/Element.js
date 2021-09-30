import Helpers from "./helpers";

const path = require("path");
const config = require(process.cwd() + "/test-juggler.config");
const defaultTimeout = config.defaultTimeout;
const shortTimeout = config.shortTimeout;

export default class Element {
    constructor(selector, elementPage = page) {
        this.selector = selector,
        this.page = elementPage
    }

    newChildElement(childSelector, childElementPage = page) {
        var isXPathSlector = (selector) => selector.startsWith("//");
        if (isXPathSlector(this.selector) != isXPathSlector(childSelector)) {
            throw "Cannot combine different selectors types!";
        }
        return new Element(`${this.selector} ${childSelector}`, childElementPage);
    }

    async wait(timeout = defaultTimeout) {
        console.log(`Waiting for ${this.selector} ...`);
        const elementHandle = await this.page.waitForSelector(this.selector, { timeout: timeout });
        if (config.captureScreenshots) {
            await Helpers.takeScreenshot();
        }
        return elementHandle;
    }

    async waitUntilVisible(timeout = defaultTimeout) {
        console.log(`Waiting for ${this.selector} to be visible...`);
        const elementHandle = await this.page.waitForSelector(this.selector, { state: "visible", timeout: timeout });
        if (config.captureScreenshots) {
            await Helpers.takeScreenshot();
        }
        return elementHandle;
    }

    async waitUntilInvisible(timeout = defaultTimeout) {
        console.log(`Waiting for ${this.selector} to be invisible...`);
        await this.page.waitForSelector(this.selector, { state: "hidden", timeout: timeout });
        if (config.captureScreenshots) {
            await Helpers.takeScreenshot();
        }
    }

    async getCoordinates(xOffset = null, yOffset = null) {
        const elementHandle = await this.wait();
        const rect = await elementHandle.boundingBox();
        const xCoordinate = xOffset !== null ? xOffset : rect.width / 2;
        const yCoordinate = yOffset !== null ? yOffset : rect.height / 2;
        console.log(`Element width: ${rect.width}, height: ${rect.height}`);
        console.log(`Action on element rectangle at position x: ${xCoordinate}, y: ${yCoordinate}`);
        return  { x: xCoordinate, y: yCoordinate };
    }

    async click(xOffset = null, yOffset = null) {
        console.log(`Clicking ${this.selector} ...`);
        if (xOffset != null || yOffset != null) {
            const coordinates = await this.getCoordinates(xOffset, yOffset);
            await this.page.click(this.selector, { position: { x: coordinates.x, y: coordinates.y } });
        }
        else await this.page.click(this.selector);
    }

    async doubleClick(xOffset = null, yOffset = null) {
        console.log(`Double clicking ${this.selector} ...`);
        if (xOffset != null || yOffset != null) {
            const coordinates = await this.getCoordinates(xOffset, yOffset);
            await this.page.dblclick(this.selector, { position: { x: coordinates.x, y: coordinates.y } });
        }
        else await this.page.dblclick(this.selector);
    }

    async rightClick(xOffset = null, yOffset = null) {
        console.log(`Right clicking ${this.selector} ...`);
        if (xOffset != null || yOffset != null) {
            const coordinates = await this.getCoordinates(xOffset, yOffset);
            await this.page.click(this.selector, { position: { x: coordinates.x, y: coordinates.y }, button: "right" } );
        }
        else await this.page.click(this.selector, { button: "right" });
    }

    async hover(xOffset = null, yOffset = null) {
        console.log(`Hovering mouse on to ${this.selector} ...`);
        if (xOffset != null || yOffset != null) {
            const coordinates = await this.getCoordinates(xOffset, yOffset);
            await this.page.hover(this.selector, { position: { x: coordinates.x, y: coordinates.y } });
        }
        else await this.page.hover(this.selector);
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
        const sourceElement = await this.page.waitForSelector(this.selector);
        const destinationElement = await this.page.waitForSelector(destination.selector);
        const sourceBox = await sourceElement.boundingBox();
        const destinationBox = await destinationElement.boundingBox();
        console.log(`Drag and dropping ${this.selector} to ${destination.selector} ...`);
        await this.page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
        await this.page.mouse.down();
        await this.page.mouse.move(destinationBox.x + destinationBox.width / 2, destinationBox.y + destinationBox.height / 2);
        await this.page.mouse.up();
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

    async clearText() {
        console.log(`Clearing the text value for ${this.selector} ...`);
        await this.click();
        await this.page.keyboard.down("Control");
        await this.page.keyboard.press("A");
        await this.page.keyboard.up("Control");
        await this.page.keyboard.press("Backspace");
    }

    async takeScreenshot() {
        console.log(`Taking the screenshot for ${this.selector} ...`);
        const elementHandle = await this.wait();
        return await elementHandle.screenshot();
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

    async uploadFile(filePath, isAbsolutePath) {
        if (!isAbsolutePath) filePath = process.cwd() + filePath;
        console.log(`Uploading a file with path ${filePath}`);
        const elementHandle = await this.wait();
        await elementHandle.setInputFiles(filePath);
    }

    async downloadFile(filePath) {
        if (!path.isAbsolute(filePath)) filePath = process.cwd().replace(/\\/g, "/") + filePath;
        const [download] = await Promise.all([
            this.page.waitForEvent("download"),
            this.click(),
        ]);
        await download.saveAs(filePath);
    }
}