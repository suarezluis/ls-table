var prettierBytes = require("prettier-bytes");
const os = require("os");
const fs = require("fs");
const path = require("path");

import { table, TableUserConfig } from "table";

const main = () => {
  const pathInput = process.argv[2] || process.cwd();
  const relativePath = path.resolve(process.cwd(), pathInput);
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
    size: string;
    createdDate: string;
    createdTime: string;
  }

  let folders: Item[] = [];
  let files: Item[] = [];

  for (const item of rawRead) {
    const stats = fs.statSync(`${relativePath}/${item}`);
    const isFolder = stats?.isDirectory();
    const size = prettierBytes(stats.size);
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
      });
    } else {
      files.push({
        name: `📄 ${item}`,
        size,
        createdDate,
        createdTime,
      });
    }
  }

  const fullList = [...folders, ...files];

  const tableInput = fullList.map((item) => [
    item.name,
    item.size,
    item.createdDate + ", " + item.createdTime,
  ]);

  const tableHeader = ["Name", "Size", "Created"];

  const config: TableUserConfig = {
    singleLine: true,
    columns: [
      { alignment: "left", verticalAlignment: "middle" },
      { alignment: "right" },
    ],

    spanningCells: [{ col: 0, row: 0, colSpan: 3, rowSpan: 3 }],
  };

  const tableOutput = table(
    [
      [`📂 ${relativePath}`, "", ""],
      ["", "", ""],
      ["", "", ""],
      tableHeader,
      ["──────────────", "───────", "──────────────"],
      ...tableInput,
    ],
    config
  );

  console.log(tableOutput);
  console.log("Total items: ", fullList.length, "\n");
};

if (process.argv[3] == "--debug") {
  main();
}

export default main;
