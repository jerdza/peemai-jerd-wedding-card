#!/usr/bin/env node
/**
 * Publish a card or RSVP version to the live root file.
 *
 * Usage:
 *   node scripts/publish-version.js card v1.10
 *   node scripts/publish-version.js rsvp v1.04
 *
 * Rewrites ../assets/ -> assets/ for the root entry file.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const kind = (process.argv[2] || "").toLowerCase();
const version = (process.argv[3] || "").replace(/^v/i, "");

if (!["card", "rsvp"].includes(kind) || !/^\d+\.\d+$/.test(version)) {
  console.error("Usage: node scripts/publish-version.js <card|rsvp> <vX.XX>");
  process.exit(1);
}

const sourceName = kind === "card" ? `index-v${version}.html` : `rsvp-v${version}.html`;
const sourcePath = path.join(root, kind, sourceName);
const targetPath = path.join(root, kind === "card" ? "index.html" : "rsvp.html");

if (!fs.existsSync(sourcePath)) {
  console.error(`Source not found: ${path.relative(root, sourcePath)}`);
  process.exit(1);
}

const html = fs.readFileSync(sourcePath, "utf8").split("../assets/").join("assets/");
fs.writeFileSync(targetPath, html, "utf8");
console.log(`Published ${kind}/${sourceName} -> ${path.basename(targetPath)}`);
if (kind === "rsvp") {
  console.log("Next: copy rsvp.html to wedding-line-bot/public/rsvp.html and restore LINE-only gate.");
}
