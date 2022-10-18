"use strict";
const os = require("os");
const fs = require("fs");
const path = require("path");
import { table, TableUserConfig } from "table";

const main = () => {
  const pathInput = process.argv[2] || process.cwd();
  const relativePath = path.resolve(__dirname, pathInput);
  let rawRead: string[];
  try {
    rawRead = fs.readdirSync(relativePath);
  } catch (e) {
    if (typeof e === "string") {
      console.error(e);
    } else {
      const error = e as Error;
      console.error(error.name, error.message);
    }
    process.exit(1);
  }
  interface Item {
    name: string;
    size: number;
    createdDate: string;
    createdTime: string;
    updatedTime: string;
    updatedDate: string;
  }

  let folders: Item[] = [];
  let files: Item[] = [];

  for (const item of rawRead) {
    const stats = fs.statSync(`${relativePath}/${item}`);
    const isFolder = stats?.isDirectory();
    const size = stats.size;
    const createdDate = stats.birthtime.toLocaleTimeString();
    const createdTime = stats.birthtime.toLocaleTimeString();
    const updatedTime = stats.mtime.toLocaleTimeString();
    const updatedDate = stats.mtime.toLocaleDateString();

    if (isFolder) {
      folders.push({
        name: `📁 ${item}`,
        size,
        createdDate,
        createdTime,
        updatedTime,
        updatedDate,
      });
    } else {
      files.push({
        name: `📄 ${item}`,
        size,
        createdDate,
        createdTime,
        updatedTime,
        updatedDate,
      });
    }
  }

  const fullList = [...folders, ...files];

  const tableInput = fullList.map((item) => [
    item.name,
    item.size,
    item.createdDate + ", " + item.createdTime,
    item.updatedDate + ", " + item.updatedTime,
  ]);

  const tableHeader = ["Name", "Size", "Created", "Updated"];

  const config: TableUserConfig = {
    singleLine: true,
    columns: [{ alignment: "left", verticalAlignment: "middle" }],

    spanningCells: [{ col: 0, row: 0, colSpan: 4, rowSpan: 3 }],
  };

  const tableOutput = table(
    [
      [relativePath, "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
      tableHeader,
      ["────", "----", "", ""],
      ...tableInput,
    ],
    config
  );

  console.log(tableOutput);
  console.log("Total items: ", fullList.length, "\n");
};

export default main;
