#!/usr/bin/env node
import { add } from "./commands/add.js";
import { update } from "./commands/update.js";
import { installed } from "./commands/installed.js";
import { browse } from "./commands/browse.js";
import { remove } from "./commands/remove.js";
import { compose } from "./commands/compose.js";

const [, , cmd, ...args] = process.argv;

const USAGE = `
Usage: instruct-sync <command> [options]

Commands:
  list                                     Browse available packs in the registry
  installed                                Show packs installed in this repo
  add <name|github:owner/repo/path@ref>   Install a pack from the registry or GitHub
  update                                   Re-fetch all installed packs
  remove <name>                            Remove an installed pack
  compose                                  Merge all packs into .github/copilot-instructions.md

Examples:
  instruct-sync list
  instruct-sync add react
  instruct-sync add github:owner/repo/packs/react.md@v1.0.0
  instruct-sync installed
  instruct-sync update
  instruct-sync remove react
  instruct-sync compose
`.trim();

async function main(): Promise<void> {
  switch (cmd) {
    case "list":
      await browse();
      break;
    case "installed":
      installed();
      break;
    case "add": {
      const name = args[0];
      if (!name) { console.error("Usage: instruct-sync add <name|github:...>"); process.exit(1); }
      await add(name);
      break;
    }
    case "update":
      await update();
      break;
    case "remove": {
      const name = args[0];
      if (!name) { console.error("Usage: instruct-sync remove <name>"); process.exit(1); }
      remove(name);
      break;
    }
    case "compose":
      compose();
      break;
    default:
      console.log(USAGE);
      if (cmd) process.exit(1);
  }
}

main().catch((err) => { console.error(err instanceof Error ? err.message : err); process.exit(1); });
