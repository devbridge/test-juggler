module.exports = {
    projects: [
        {
            displayName: "default-tests",
            globalSetup: "./test-environment/setup.js",
            globalTeardown: "./test-environment/teardown.js",
            testEnvironment: "./test-environment/environment.js",
            setupFilesAfterEnv: ["./test-environment/jest.setup.js"],
            transformIgnorePatterns: ["node_modules/(?!(test-juggler)/)"],
            verbose: true,
            testTimeout: 60000
        },
        {
            displayName: "serial-tests",
            runner: "jest-serial-runner",
            testMatch: ["**/?(*.)+(serial-test).[jt]s?(x)"],
            globalSetup: "./test-environment/setup.js",
            globalTeardown: "./test-environment/teardown.js",
            testEnvironment: "./test-environment/environment.js",
            setupFilesAfterEnv: ["./test-environment/jest.setup.js"],
            transformIgnorePatterns: ["node_modules/(?!(test-juggler)/)"],
            verbose: true,
            testTimeout: 60000
        }
    ],
    reporters: ["default", ["jest-junit", { outputDirectory: "junit-report" }]]
};
