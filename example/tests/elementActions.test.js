import { Element } from "test-juggler";
const fs = require("fs").promises;
const fsExtra = require("fs-extra");

describe("Element Actions", () => {
    const sliceToClick = new Element("[seriesName='seriesx2'] path");
    const localPath = process.cwd().replace(/\\/g, "/");

    beforeEach(async () => {
        console.log("Running test: " + jasmine["currentTest"].fullName);
    });

    afterAll(async () => {
        const tempFileDir = process.cwd() + "/example/testFiles/temp";
        await fsExtra.emptyDir(tempFileDir);
    });

    it("should get element selector", async () => {
        //Arrange
        const element = new Element("some.selector");

        //Act and Assert
        expect(element.selector).toMatch("some.selector");
    });

    it("should get child element by XPath selector", async () => {
        //Arrange
        await page.goto("http://the-internet.herokuapp.com/");

        //Act
        const element = new Element("//div[@id='content']");
        const childElement = element.newChildElement("//h1");

        //Assert
        await expect(childElement.isVisible()).resolves.toBeTruthy();
    });

    it("should wait for an element", async () => {
        //Arrange
        await page.goto("http://the-internet.herokuapp.com/dynamic_loading/2");
        const startButton = new Element("div#start>button");
        const elementToLoad = new Element("div#finish");

        //Act
        await startButton.click();
        await elementToLoad.wait();

        //Assert
        await expect(elementToLoad.exists()).resolves.toBeTruthy();
    });

    it("should wait for element to be visible", async () => {
        //Arrange
        await page.goto("http://the-internet.herokuapp.com/dynamic_loading/1");
        const startButton = new Element("div#start>button");
        const elementToLoad = new Element("div#finish");

        //Act
        await startButton.click();
        await elementToLoad.waitUntilVisible();

        //Assert
        await expect(elementToLoad.isVisible()).resolves.toBeTruthy();
    });

    it("should wait for element to be invisible", async () => {
        //Arrange
        await page.goto("http://the-internet.herokuapp.com/dynamic_loading/1");
        const startButton = new Element("div#start>button");
        const loader = new Element("div#loading");
        const elementToLoad = new Element("div#finish");

        //Act
        await startButton.click();
        await loader.waitUntilInvisible();

        //Assert
        await expect(loader.isVisible()).resolves.toBeFalsy();
        await expect(elementToLoad.isVisible()).resolves.toBeTruthy();
    });

    it("should click an element", async () => {
        //Arrange
        await page.goto("http://the-internet.herokuapp.com/add_remove_elements/");
        const addElementButton = new Element("button[onclick='addElement()']");
        const deleteButton = new Element("button[onclick='deleteElement()']");

        //Act
        await addElementButton.click();

        //Assert
        await expect(deleteButton.exists()).resolves.toBeTruthy();
    });

    it("should double click an element", async () => {
        //Arrange
        await page.goto("https://demoqa.com/buttons");
        const doubleClickButton = new Element("#doubleClickBtn");
        const doubleClickMessage = new Element("#doubleClickMessage");

        //Act
        await doubleClickButton.doubleClick();

        //Assert
        await expect(doubleClickMessage.exists()).resolves.toBeTruthy();
        expect(await doubleClickMessage.text()).toEqual("You have done a double click");
    });

    it("should right click an element", async () => {
        //Arrange
        await page.goto("https://demoqa.com/buttons");
        const rightClickButton = new Element("#rightClickBtn");
        const rightClickMessage = new Element("#rightClickMessage");

        //Act
        await rightClickButton.rightClick();

        //Assert
        await expect(rightClickMessage.exists()).resolves.toBeTruthy();
        expect(await rightClickMessage.text()).toEqual("You have done a right click");
    });

    it("should check if element exist", async () => {
        //Arrange
        await page.goto("http://the-internet.herokuapp.com/");
        const headerText = new Element(".heading");

        //Act
        const elementExists = await headerText.exists();

        //Assert
        expect(elementExists).toBeTruthy();
    });

    it("should check if element is visible", async () => {
        //Arrange
        await page.goto("http://the-internet.herokuapp.com/");
        const headerText = new Element(".heading");

        //Act
        const elementIsVisible = await headerText.isVisible();

        //Assert
        expect(elementIsVisible).toBeTruthy();
    });

    //TODO: Unxit when issue is resolved in Puppeteer: https://github.com/puppeteer/puppeteer/issues/4562
    xit("should Drag and Drop one element on to another", async () => {
        //Arrange
        await page.goto("http://the-internet.herokuapp.com/drag_and_drop");
        const firstBox = new Element("#column-a");
        const secondBox = new Element("#column-b");
        const firstBoxInitialHeader = await firstBox.text();
        console.log("First box initial header is: " + firstBoxInitialHeader);
        const secondBoxInitialHeader = await secondBox.text();
        console.log("Second box initial header is: " + secondBoxInitialHeader);

        //Act
        await firstBox.dragAndDrop(secondBox);

        //Assert
        const firstBoxResultHeader = await firstBox.text();
        console.log("First box header after drag and drop is: " + firstBoxInitialHeader);
        const secondBoxResultHeader = await secondBox.text();
        console.log("Second box header after drag and drop is: " + secondBoxInitialHeader);

        expect(firstBoxResultHeader).toMatch(secondBoxInitialHeader);
        expect(secondBoxResultHeader).toMatch(firstBoxInitialHeader);
    });

    it("should get inner text of an element", async () => {
        //Arrange
        await page.goto("http://the-internet.herokuapp.com/");
        const headerText = new Element(".heading");

        //Act
        const actualText = await headerText.text();

        //Assert
        expect(actualText).toMatch("Welcome to the-internet");
    });

    it("should get value of style attribute text-align of an element", async () => {
        //Arrange
        await page.goto("http://the-internet.herokuapp.com/inputs");
        const element = new Element("#page-footer > div > div");

        //Act
        const actualTextAlignValue = await element.getStyleAttributeValue("text-align");

        //Assert
        expect(actualTextAlignValue).toMatch("center");
    });

    it("should hover on an element", async () => {
        //Arrange
        await page.goto("https://demoqa.com/tool-tips" );
        const button = new Element("#toolTipButton");
        const tooltip = new Element("#buttonToolTip");

        //Act
        await button.hover();

        //Assert
        await expect(tooltip.isVisible()).resolves.toBeTruthy();
    });

    it("should get DOM element", async () => {
        //Arrange
        await page.goto("http://the-internet.herokuapp.com/");
        const headerText = new Element(".heading");

        //Act
        const headerTextDomElement = await headerText.wait();

        //Assert
        await expect(headerTextDomElement.evaluate(domElement => domElement.textContent)).resolves.toMatch("Welcome to the-internet");
    });

    it("should get element's value", async () => {
        //Arrange
        await page.goto("http://the-internet.herokuapp.com/inputs");
        const inputElement = new Element("input[type=number]");
        const inputNumber = "123";

        //Act
        await page.type(inputElement.selector, inputNumber);

        //Assert
        expect(await inputElement.value()).toEqual(inputNumber);
    });

    it("should get element's attribute value", async () => {
        //Arrange, Act
        await page.goto("http://the-internet.herokuapp.com/login");
        const formElement = new Element("#login");
        const attributeName = "action";

        //Assert
        expect(await formElement.getAttributeValue(attributeName)).toEqual("/authenticate");
    });

    it.each`
    action                                                  | selectedAttr  | pieClickedAttr    | description
    ${async () => { sliceToClick.hover(150); }}             | ${null}       | ${null}           | ${"hover"}
    ${async () => { sliceToClick.click(null, 85); }}        | ${"true"}     | ${"true"}         | ${"left-click"}
    ${async () => { sliceToClick.rightClick(100, 90); }}    | ${"true"}     | ${null}           | ${"right-click"}
    `("should $description element with offset", async ({ action, selectedAttr, pieClickedAttr }) => {
    //Arrange
    const toolTip = new Element(".apexcharts-tooltip.apexcharts-active");
    await page.goto("https://apexcharts.com/samples/react/pie/simple-donut.html");
    await page.waitForSelector(`${sliceToClick.selector}[stroke-width='2']`);

    //Act
    await action();

    //Assert
    expect(await toolTip.isVisible()).toBe(true);
    expect(await toolTip.text()).toContain("series-2: 55");
    expect(await sliceToClick.getAttributeValue("selected")).toEqual(selectedAttr);
    expect(await sliceToClick.getAttributeValue("data:pieClicked")).toEqual(pieClickedAttr);

});

    it("should type element's text value", async () => {
        //Arrange
        await page.goto("http://the-internet.herokuapp.com/inputs");
        const inputElement = new Element("input[type=number]");
        const inputNumber = "456";

        //Act
        await inputElement.enterText(inputNumber);

        //Assert
        expect(await inputElement.value()).toEqual(inputNumber);
    });

    it("should clear element's text value", async () => {
        //Arrange
        await page.goto("http://the-internet.herokuapp.com/inputs");
        const inputElement = new Element("input[type=number]");
        const inputNumber = "456";
        await inputElement.enterText(inputNumber);

        //Act
        await inputElement.clearText();

        //Assert
        expect(await inputElement.value()).toEqual("");
    });

    xit("should cover element", async () => {
        //TODO: Test should be added and unxit`ed when DTAF-78 is implemented.
    });

    it("should get coordinates of element", async () => {
        //Arrange
        const expectedXCoordinate = 640; //width: default viewport 1280px / 2
        const expectedYCoordinate = 25; //height: top bar 50px / 2
        const rectangleCanvas = new Element(".top-bar__network._fixed");
        await page.goto("https://stackoverflow.com/users/login");

        //Act
        const coordinates = await rectangleCanvas.getCoordinates();

        //Assert
        expect(coordinates.x).toEqual(expectedXCoordinate);
        expect(coordinates.y).toEqual(expectedYCoordinate);
    });

    it("should upload a file when an absolute path is provided", async () => {
        //Arrange
        const filePath = process.cwd() + "/example/testFiles/Dummy.txt";
        const remotePath = "C:\\fakepath\\Dummy.txt";
        const uploadElement = new Element("#uploadFile");
        const resultElement = new Element("#uploadedFilePath");
        await page.goto("https://demoqa.com/upload-download");

        //Act
        await uploadElement.uploadFile(filePath, true);

        //Assert
        expect(await resultElement.text()).toEqual(remotePath);
    });

    it("should upload a file when a relative path is provided", async () => {
        //Arrange
        const filePath = "/example/testFiles/Dummy.txt";
        const remotePath = "C:\\fakepath\\Dummy.txt";
        const uploadElement = new Element("#uploadFile");
        const resultElement = new Element("#uploadedFilePath");
        await page.goto("https://demoqa.com/upload-download");

        //Act
        await uploadElement.uploadFile(filePath, false);

        //Assert
        expect(await resultElement.text()).toEqual(remotePath);
    });

    //TODO: un-skip when the local web server is implemented for the test pages
    it.jestPlaywrightSkip({ browsers: ["webkit"] }, "should download a file when an absolute path is provided", async () => {
        //Arrange
        const filePath = localPath + "/example/examplePages/files/example.zip";
        const resultFilePath = localPath + "/example/testFiles/temp/example.zip";
        const downloadElement = new Element("#downloadLink");
        await page.goto(`file:///${localPath}/example/examplePages/download.html`);

        //Act
        await downloadElement.downloadFile(resultFilePath);

        //Assert
        expect(await fs.readFile(filePath)).toEqual(await fs.readFile(resultFilePath));
    });

    //TODO: un-skip when the local web server is implemented for the test pages
    it.jestPlaywrightSkip({ browsers: ["webkit"] }, "should download a file when an relative path is provided", async () => {
        //Arrange
        const filePath = localPath + "/example/examplePages/files/example.zip";
        const resultFilePath = "/example/testFiles/temp/example.zip";
        const downloadElement = new Element("#downloadLink");
        await page.goto(`file:///${localPath}/example/examplePages/download.html`);

        //Act
        await downloadElement.downloadFile(resultFilePath);

        //Assert
        expect(await fs.readFile(filePath)).toEqual(await fs.readFile(localPath + resultFilePath));
    });
});
