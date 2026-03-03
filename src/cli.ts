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
  add <name|github:owner/repo/path@ref>   Install a pack (auto-detects your tools)
  update                                   Re-fetch all installed packs
  remove <name> [--tool <tool>]            Remove an installed pack
  compose [--output <file>]                Merge all packs into one file

Flags:
  --tool cursor|claude|windsurf|cline      Install/remove for a specific tool only
  --target <path>                          Override default install path (add)
  --output <path>                          Override output file (compose)

Examples:
  instruct-sync list
  instruct-sync add react
  instruct-sync add react --tool cursor
  instruct-sync add github:owner/repo/packs/react.md@v1.0.0 --target AGENTS.md
  instruct-sync installed
  instruct-sync update
  instruct-sync remove react
  instruct-sync remove react --tool cursor
  instruct-sync compose --output CLAUDE.md
`.trim();

function parseFlags(rawArgs: string[]): { positional: string[]; flags: Record<string, string> } {
  const positional: string[] = [];
  const flags: Record<string, string> = {};
  for (let i = 0; i < rawArgs.length; i++) {
    const arg = rawArgs[i]!;
    if (arg.startsWith("--") && i + 1 < rawArgs.length) {
      flags[arg.slice(2)] = rawArgs[++i]!;
    } else {
      positional.push(arg);
    }
  }
  return { positional, flags };
}

async function main(): Promise<void> {
  const { positional, flags } = parseFlags(args);

  switch (cmd) {
    case "list":
      await browse();
      break;
    case "installed":
      installed();
      break;
    case "add": {
      const name = positional[0];
      if (!name) { console.error("Usage: instruct-sync add <name|github:...>"); process.exit(1); }
      await add(name, { tool: flags.tool, target: flags.target });
      break;
    }
    case "update":
      await update();
      break;
    case "remove": {
      const name = positional[0];
      if (!name) { console.error("Usage: instruct-sync remove <name>"); process.exit(1); }
      remove(name, { tool: flags.tool });
      break;
    }
    case "compose":
      compose({ output: flags.output });
      break;
    default:
      console.log(USAGE);
      if (cmd) process.exit(1);
  }
}

main().catch((err) => { console.error(err instanceof Error ? err.message : err); process.exit(1); });
