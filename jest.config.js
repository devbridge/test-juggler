module.exports = {
    //globalSetup: "./test-environment/setup.js",
    //globalTeardown: "./test-environment/teardown.js",
    //testEnvironment: "./test-environment/environment.js",
    preset: "jest-playwright-preset",
    testEnvironmentOptions: {
        "jest-playwright": {
            // Options...
            browsers: ["chromium", "firefox", "webkit"],
        },
    },
    //setupFilesAfterEnv: ["./test-environment/jest.setup.js"],
    transformIgnorePatterns: ["node_modules/(?!(test-juggler)/)"],
    verbose: true,
    "reporters": [
        "default",
        ["jest-junit", { outputDirectory: "junit-report" }]
    ],
    testTimeout: 60000
};