/**
 * Script to run after npm install
 *
 * Copy selected files to user's directory
 */

"use strict";

var gentlyCopy = require("gently-copy");

var filesToCopy = ["test-environment", "babel.config.js", "framework.config.js", "jest-puppeteer.config.js", "jest.config.js"];

if (process.env.DO_NOT_INSTALL_EXAMPLES !== "true") {
    filesToCopy.push("example");
}

// User's local directory
var userPath = process.env.INIT_CWD;

// Moving files to user's local directory
gentlyCopy(filesToCopy, userPath);