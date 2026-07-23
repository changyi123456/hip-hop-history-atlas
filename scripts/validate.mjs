import vm from "node:vm";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const source = await readFile(path.join(root, "src", "app.js"), "utf8");
const marker = "//__VALIDATION_EXPORT__";
if (!source.includes(marker)) throw new Error("找不到資料驗證出口。 ");

const dataSource = source.slice(0, source.indexOf(marker));
const context = { console, URL, structuredClone };
vm.createContext(context);
vm.runInContext(`${dataSource}\nthis.__atlas = { DOMAINS, SOURCES, buildAtlas, validateAtlas };`, context);
const atlas = context.__atlas.buildAtlas();
const result = context.__atlas.validateAtlas(atlas);
if (!result.ok) {
  console.error(result.errors.join("\n"));
  process.exit(1);
}
console.log(JSON.stringify(result.stats, null, 2));
