"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var prettierBytes = require("prettier-bytes");
var os = require("os");
var fs = require("fs");
var path = require("path");
var table_1 = require("table");
var main = function () {
    var pathInput = process.argv[2] || process.cwd();
    var relativePath = path.resolve(process.cwd(), pathInput);
    var rawRead;
    try {
        rawRead = fs.readdirSync(relativePath);
    }
    catch (e) {
        if (typeof e === "string") {
            console.error(e);
        }
        else {
            var error = e;
            console.error(error.name, error.message);
        }
        process.exit(1);
    }
    var folders = [];
    var files = [];
    for (var _i = 0, rawRead_1 = rawRead; _i < rawRead_1.length; _i++) {
        var item = rawRead_1[_i];
        var stats = fs.statSync("".concat(relativePath, "/").concat(item));
        var isFolder = stats === null || stats === void 0 ? void 0 : stats.isDirectory();
        var size = prettierBytes(stats.size);
        if (isFolder) {
            folders.push({
                name: "\uD83D\uDCC1 ".concat(item),
                size: size
            });
        }
        else {
            files.push({
                name: "\uD83D\uDCC4 ".concat(item),
                size: size
            });
        }
    }
    var fullList = __spreadArray(__spreadArray([], folders, true), files, true);
    var tableInput = fullList.map(function (item) { return [item.name, item.size]; });
    var tableHeader = ["Name", "Size"];
    var config = {
        singleLine: true,
        columns: [
            { alignment: "left", verticalAlignment: "middle" },
            { alignment: "right" },
        ]
    };
    var tableOutput = (0, table_1.table)(__spreadArray([tableHeader, ["──────────────", "───────"]], tableInput, true), config);
    console.log("\n\u001B[32m\uD83D\uDCC2 ".concat(relativePath, "\u001B[0m\n"));
    console.log(tableOutput);
    console.log("Total items: ", fullList.length, "\n");
};
if (process.argv[3] == "--debug") {
    main();
}
exports["default"] = main;
