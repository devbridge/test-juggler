module.exports = {

    // Describe which browsers we want to run

    browsers: ["chromium"],
    exitOnPageError: false,
    launchOptions: {
        // If we want to run browsers in headless mode or not,
        headless: true,

        // If we want to have opened devtools from start
        devtools: false,
    },
    contextOptions:
    {
        acceptDownloads: true
    }
};