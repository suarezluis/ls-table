"use strict";
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
exports.__esModule = true;
var os = require("os");
var fs = require("fs");
var path = require("path");
var table_1 = require("table");
var main = function () {
  var pathInput = process.argv[2] || process.cwd();
  var relativePath = path.resolve(__dirname, pathInput);
  var rawRead;
  try {
    rawRead = fs.readdirSync(relativePath);
  } catch (e) {
    if (typeof e === "string") {
      console.error(e);
    } else {
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
    var isFolder =
      stats === null || stats === void 0 ? void 0 : stats.isDirectory();
    var size = stats.size;
    var createdDate = stats.birthtime.toLocaleTimeString();
    var createdTime = stats.birthtime.toLocaleTimeString();
    var updatedTime = stats.mtime.toLocaleTimeString();
    var updatedDate = stats.mtime.toLocaleDateString();
    if (isFolder) {
      folders.push({
        name: "\uD83D\uDCC1 ".concat(item),
        size: size,
        createdDate: createdDate,
        createdTime: createdTime,
        updatedTime: updatedTime,
        updatedDate: updatedDate,
      });
    } else {
      files.push({
        name: "\uD83D\uDCC4 ".concat(item),
        size: size,
        createdDate: createdDate,
        createdTime: createdTime,
        updatedTime: updatedTime,
        updatedDate: updatedDate,
      });
    }
  }
  var fullList = __spreadArray(__spreadArray([], folders, true), files, true);
  var tableInput = fullList.map(function (item) {
    return [
      item.name,
      item.size,
      item.createdDate + ", " + item.createdTime,
      item.updatedDate + ", " + item.updatedTime,
    ];
  });
  var tableHeader = ["Name", "Size", "Created", "Updated"];
  var config = {
    singleLine: true,
    columns: [{ alignment: "left", verticalAlignment: "middle" }],
    spanningCells: [{ col: 0, row: 0, colSpan: 4, rowSpan: 3 }],
  };
  var tableOutput = (0, table_1.table)(
    __spreadArray(
      [
        [relativePath, "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        tableHeader,
        ["────", "----", "", ""],
      ],
      tableInput,
      true
    ),
    config
  );
  console.log(tableOutput);
  console.log("Total items: ", fullList.length, "\n");
};

exports["default"] = main;
