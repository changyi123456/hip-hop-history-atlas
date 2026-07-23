import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const [template, css, javascript] = await Promise.all([
  readFile(path.join(root, "src", "template.html"), "utf8"),
  readFile(path.join(root, "src", "styles.css"), "utf8"),
  readFile(path.join(root, "src", "app.js"), "utf8"),
]);

const html = template
  .replace("/*__ATLAS_CSS__*/", css)
  .replace("/*__ATLAS_JS__*/", javascript.replaceAll("</script", "<\\/script"));

if (/https?:\/\//.test(html.match(/<script>[\s\S]*<\/script>/)?.[0] ?? "")) {
  console.warn("提醒：JavaScript 中含來源網址；未載入任何遠端程式或樣式。 ");
}
if (/<script[^>]+src=|<link[^>]+stylesheet/i.test(html)) {
  throw new Error("離線檔不得含外部 script 或 stylesheet。 ");
}

const output = path.join(root, "output");
await mkdir(output, { recursive: true });
await Promise.all([
  writeFile(path.join(root, "index.html"), html, "utf8"),
  writeFile(path.join(root, "嘻哈歷史脈絡知識圖譜.html"), html, "utf8"),
  writeFile(path.join(output, "hip-hop-histories-atlas.html"), html, "utf8"),
]);

console.log(`Built ${html.length.toLocaleString()} bytes`);
