#!/usr/bin/env node
// Copies the skill into an agent's skills directory.
// Usage: npx @vstlmkh/summarizing-meetings [--dir <skills-dir>] [--force]

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const SKILL_NAME = "summarizing-meetings";
const SKILL_FILES = ["SKILL.md", "references", "evals"];

function parseArgs(argv) {
  const args = { dir: path.join(os.homedir(), ".claude", "skills"), force: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--dir") args.dir = argv[++i];
    else if (arg === "--force" || arg === "-f") args.force = true;
    else if (arg === "--help" || arg === "-h") args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!args.dir) throw new Error("--dir needs a path");
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(`Usage: npx @vstlmkh/${SKILL_NAME} [--dir <skills-dir>] [--force]

Installs the skill into <skills-dir>/${SKILL_NAME}.
Default <skills-dir>: ~/.claude/skills (Claude Code).`);
    return;
  }

  const source = path.resolve(__dirname, "..");
  const target = path.join(path.resolve(args.dir), SKILL_NAME);

  if (fs.existsSync(target) || isSymlink(target)) {
    if (!args.force) {
      console.error(`${target} already exists. Re-run with --force to replace it.`);
      process.exit(1);
    }
    fs.rmSync(target, { recursive: true, force: true });
  }

  fs.mkdirSync(target, { recursive: true });
  for (const entry of SKILL_FILES) {
    fs.cpSync(path.join(source, entry), path.join(target, entry), { recursive: true });
  }
  console.log(`Installed ${SKILL_NAME} to ${target}`);
}

function isSymlink(p) {
  try {
    return fs.lstatSync(p).isSymbolicLink();
  } catch {
    return false;
  }
}

try {
  main();
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
