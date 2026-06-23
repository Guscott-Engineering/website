#!/usr/bin/env node
"use strict";

/*
 * build.js — zero-dependency static include expander.
 *
 * Reads template.html and replaces each `<!-- include: path -->` line with the
 * contents of the referenced partial (from sections/), writing the assembled
 * index.html at the repo root. No npm install required — only fs/path.
 *
 * Run:  node build.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const TEMPLATE = path.join(ROOT, "template.html");
const OUTPUT = path.join(ROOT, "index.html");

// A line whose only non-whitespace content is an include directive.
// Group 1 = leading indentation, group 2 = the partial path.
const INCLUDE_RE = /^([ \t]*)<!--\s*include:\s*(.+?)\s*-->[ \t]*$/;

function fail(msg) {
  console.error("build.js: " + msg);
  process.exit(1);
}

function readPartial(relPath, lineNo) {
  // Resolve relative to the repo root and refuse anything that escapes it.
  const resolved = path.resolve(ROOT, relPath);
  if (resolved !== ROOT && !resolved.startsWith(ROOT + path.sep)) {
    fail(`include on line ${lineNo} escapes repo root: "${relPath}"`);
  }
  if (!fs.existsSync(resolved)) {
    fail(`include on line ${lineNo} not found: "${relPath}"`);
  }
  // Normalize line endings and strip a single trailing newline so re-joining
  // doesn't introduce blank-line drift between partials.
  return fs
    .readFileSync(resolved, "utf8")
    .replace(/\r\n/g, "\n")
    .replace(/\n$/, "");
}

function build() {
  if (!fs.existsSync(TEMPLATE)) fail(`template not found: ${TEMPLATE}`);

  const template = fs.readFileSync(TEMPLATE, "utf8").replace(/\r\n/g, "\n");
  let includeCount = 0;

  const out = template.split("\n").map(function (line, i) {
    const m = line.match(INCLUDE_RE);
    if (!m) return line;
    includeCount++;
    const indent = m[1];
    // Re-indent every non-empty line of the partial to the marker's indent so
    // the assembled HTML keeps the original section indentation; blank lines
    // stay blank.
    return readPartial(m[2], i + 1)
      .split("\n")
      .map(function (l) {
        return l.length ? indent + l : l;
      })
      .join("\n");
  });

  let result = out.join("\n");
  if (!result.endsWith("\n")) result += "\n";

  fs.writeFileSync(OUTPUT, result);
  console.log(`build.js: wrote index.html (${includeCount} includes expanded)`);
}

build();
