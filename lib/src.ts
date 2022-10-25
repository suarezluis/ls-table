var prettierBytes = require("prettier-bytes");
const os = require("os");
const fs = require("fs");
const path = require("path");

import { table, TableUserConfig } from "table";
import * as chalk from "chalk";

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
  }

  let folders: Item[] = [];
  let files: Item[] = [];

  for (const item of rawRead) {
    const stats = fs.statSync(`${relativePath}/${item}`);
    const isFolder = stats?.isDirectory();
    const size = prettierBytes(stats.size);

    if (isFolder) {
      folders.push({
        name: `📁 ${item}`,
        size,
      });
    } else {
      files.push({
        name: `📄 ${item}`,
        size,
      });
    }
  }

  const fullList = [...folders, ...files];

  const tableInput = fullList.map((item) => [item.name, item.size]);

  const tableHeader = ["Name", "Size"];

  const config: TableUserConfig = {
    singleLine: true,
    columns: [
      { alignment: "left", verticalAlignment: "middle" },
      { alignment: "right" },
    ],
  };

  const tableOutput = table(
    [tableHeader, ["──────────────", "───────"], ...tableInput],
    config
  );

  console.log(chalk.green.bold(`📂 ${relativePath}\n`));

  console.log(tableOutput);
  console.log("Total items: ", fullList.length, "\n");
};

if (process.argv[3] == "--debug") {
  main();
}

export default main;
