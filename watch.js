"use strict";

var execSync = require("child_process").execSync;

execSync("npm run build", {stdio: "inherit"});

require("./server/index.js");
