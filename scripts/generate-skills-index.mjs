#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const baseDir = path.join(ROOT, "expert-dev-skills");
const outFile = path.join(ROOT, "SKILLS_INDEX.md");

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (entry.isFile() && entry.name === "SKILL.md") acc.push(full);
  }
  return acc;
}

function extractFrontmatter(content) {
  if (!content.startsWith("---")) return {};
  const end = content.indexOf("\n---", 3);
  if (end === -1) return {};
  const fm = content.slice(3, end).trim().split("\n");
  const obj = {};
  for (const line of fm) {
    const idx = line.indexOf(":");
    if (idx > 0) {
      const k = line.slice(0, idx).trim();
      const v = line.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
      obj[k] = v;
    }
  }
  return obj;
}

const files = walk(baseDir).sort();
const rows = files.map((file) => {
  const rel = path.relative(ROOT, file).replaceAll("\\", "/");
  const fm = extractFrontmatter(fs.readFileSync(file, "utf8"));
  return {
    name: fm.name || "unknown",
    description: fm.description || "",
    license: fm.license || "",
    path: rel
  };
});

const lines = [];
lines.push("# Skills Index");
lines.push("");
lines.push("| Name | Description | License | Path |");
lines.push("|---|---|---|---|");
for (const r of rows) {
  lines.push(`| ${r.name} | ${r.description.replaceAll("|","\\|")} | ${r.license} | \`${r.path}\` |`);
}
lines.push("");
lines.push(`Generated on ${new Date().toISOString()}.`);

fs.writeFileSync(outFile, lines.join("\n") + "\n", "utf8");
console.log(`Wrote ${path.relative(ROOT, outFile)} with ${rows.length} skills.`);
