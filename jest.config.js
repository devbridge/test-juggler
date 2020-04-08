module.exports = {
    globalSetup: "./test-environment/setup.js",
    globalTeardown: "./test-environment/teardown.js",
    testEnvironment: "./test-environment/environment.js",
    setupFilesAfterEnv: ["./test-environment/jest.setup.js"],
    transformIgnorePatterns: ["node_modules/(?!(test-juggler)/)"],
    verbose: true,
    "reporters": [
        "default",
        ["jest-junit", { outputDirectory: "junit-report" }]
    ],
    testTimeout: 60000
};