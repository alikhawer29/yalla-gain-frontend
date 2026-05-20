import fs from "fs";
import path from "path";

function walk(dir, files = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p, files);
    else if (p.endsWith(".jsx") || p.endsWith(".js")) files.push(p);
  }
  return files;
}

const dirs = ["src/Pages/Admin", "src/Components"];
let fixed = 0;

for (const dir of dirs) {
  for (const file of walk(dir)) {
    let content = fs.readFileSync(file, "utf8");
    if (!content.includes("t(") && !content.includes("t('")) continue;
    if (content.includes("useTranslation")) continue;

    if (!content.includes('from "react-i18next"')) {
      // Insert after the first complete import statement (handles multi-line imports)
      const importMatch = content.match(/^import[\s\S]*?;\s*\n/m);
      if (importMatch) {
        const insertAt = importMatch.index + importMatch[0].length;
        content =
          content.slice(0, insertAt) +
          'import { useTranslation } from "react-i18next";\n' +
          content.slice(insertAt);
      }
    }

    const patterns = [
      /(export\s+const\s+\w+\s*=\s*\([^)]*\)\s*=>\s*\{)/,
      /(export\s+function\s+\w+\s*\([^)]*\)\s*\{)/,
      /(const\s+\w+\s*=\s*\([^)]*\)\s*=>\s*\{)/,
    ];

    for (const re of patterns) {
      const m = content.match(re);
      if (m && !content.slice(m.index, m.index + 200).includes("useTranslation")) {
        content = content.replace(m[1], `${m[1]}\n  const { t } = useTranslation();`);
        break;
      }
    }

    fs.writeFileSync(file, content);
    fixed++;
    console.log("Fixed:", file);
  }
}

console.log(`Fixed ${fixed} files`);
