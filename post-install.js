/**
 * Script to run after npm install
 *
 * Copy selected files to user's directory
 */

"use strict";

var gentlyCopy = require("gently-copy");

var filesToCopy = ["test-environment", "babel.config.js", "test-juggler.config.js", "jest-playwright.config.js", "jest.config.js", "jsconfig.json"];

if (process.env.DO_NOT_INSTALL_EXAMPLES !== "true") {
    filesToCopy.push("example");
}

// User's local directory
var userPath = process.env.INIT_CWD;

// Moving files to user's local directory
gentlyCopy(filesToCopy, userPath);