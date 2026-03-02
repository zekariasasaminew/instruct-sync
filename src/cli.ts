#!/usr/bin/env node
import { add } from "./commands/add.js";
import { update } from "./commands/update.js";
import { list } from "./commands/list.js";
import { compose } from "./commands/compose.js";

const [, , cmd, ...args] = process.argv;

const USAGE = `
Usage: instruct-sync <command> [options]

Commands:
  add <name|github:owner/repo/path@ref>   Install a pack from the registry or GitHub
  update                                   Re-fetch all installed packs
  list                                     Show installed packs
  compose                                  Merge all packs into .github/copilot-instructions.md

Examples:
  instruct-sync add react
  instruct-sync add github:owner/repo/packs/react.md@v1.0.0
  instruct-sync update
  instruct-sync list
  instruct-sync compose
`.trim();

async function main(): Promise<void> {
  switch (cmd) {
    case "add": {
      const name = args[0];
      if (!name) { console.error("Usage: instruct-sync add <name|github:...>"); process.exit(1); }
      await add(name);
      break;
    }
    case "update":
      await update();
      break;
    case "list":
      list();
      break;
    case "compose":
      compose();
      break;
    default:
      console.log(USAGE);
      if (cmd) process.exit(1);
  }
}

main().catch((err) => { console.error(err instanceof Error ? err.message : err); process.exit(1); });
