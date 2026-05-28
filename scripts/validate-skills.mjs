#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const skillsDir = path.join(ROOT, "expert-dev-skills");

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (entry.isFile() && entry.name === "SKILL.md") acc.push(full);
  }
  return acc;
}

function parseFrontmatter(content) {
  if (!content.startsWith("---")) return null;
  const end = content.indexOf("\n---", 3);
  if (end === -1) return null;
  return content.slice(3, end).trim();
}

function hasKey(frontmatter, key) {
  const re = new RegExp(`^${key}:`, "m");
  return re.test(frontmatter);
}

const required = ["name", "description", "license"];
const files = walk(skillsDir);

if (files.length === 0) {
  console.error("No SKILL.md files found under expert-dev-skills/");
  process.exit(1);
}

let failed = false;

for (const file of files) {
  const rel = path.relative(ROOT, file);
  const content = fs.readFileSync(file, "utf8");
  const fm = parseFrontmatter(content);
  if (!fm) {
    console.error(`❌ ${rel}: missing or invalid frontmatter block`);
    failed = true;
    continue;
  }

  const missing = required.filter((k) => !hasKey(fm, k));
  if (missing.length) {
    console.error(`❌ ${rel}: missing keys -> ${missing.join(", ")}`);
    failed = true;
  } else {
    console.log(`✅ ${rel}`);
  }
}

if (failed) process.exit(1);
console.log("All SKILL.md files passed schema checks.");
