import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = await readFile(path.join(root, "index.html"), "utf8");

test("standalone output has no remote runtime assets", () => {
  assert.doesNotMatch(html, /<script[^>]+src=/i);
  assert.doesNotMatch(html, /<link[^>]+stylesheet/i);
});

test("atlas contains bilingual, theme, graph, and accessibility wiring", () => {
  for (const token of ["atlas-theme", "atlas-locale", "graphCanvas", "semanticSelect", "216", "Hip-Hop Histories Atlas", "先聽故事", "真實現場", "street-scene", "subway-red", "NOW SPINNING", "state.spin"]) {
    assert.match(html, new RegExp(token));
  }
});

test("portable filename matches Pages output", async () => {
  const portable = await readFile(path.join(root, "嘻哈歷史脈絡知識圖譜.html"), "utf8");
  assert.equal(portable, html);
});
