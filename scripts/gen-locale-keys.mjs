import fs from "fs";

const slugify = (text) =>
  String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "_")
    .replace(/^_|_$/g, "");

const th = fs.readFileSync("src/Config/TableHeaders.jsx", "utf8");
const ts = fs.readFileSync("src/Config/TableStatus.jsx", "utf8");
const titles = [...th.matchAll(/title:\s*["']([^"']+)["']/g)].map((m) => m[1]);
const texts = [...ts.matchAll(/text:\s*["']([^"']+)["']/g)].map((m) => m[1]);

const table = {};
titles.forEach((t) => {
  table[slugify(t)] = t;
});
const status = {};
texts.forEach((t) => {
  status[slugify(t)] = t;
});

fs.writeFileSync("scripts/generated-keys.json", JSON.stringify({ table, status }, null, 2));
console.log("table keys:", Object.keys(table).length, "status keys:", Object.keys(status).length);
