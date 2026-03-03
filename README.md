# instruct-sync

> Install and sync AI instruction files for GitHub Copilot, Cursor, Claude Code, Windsurf, and Cline — from a community registry or any private GitHub repo, with version pinning and no local cloning required.

[![npm](https://img.shields.io/npm/v/instruct-sync)](https://www.npmjs.com/package/instruct-sync)
[![CI](https://github.com/zekariasasaminew/instruct-sync/actions/workflows/ci.yml/badge.svg)](https://github.com/zekariasasaminew/instruct-sync/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## What it does

Every AI coding tool has its own instruction file format and location:

| Tool | File | Location |
|---|---|---|
| GitHub Copilot | `*.instructions.md` | `.github/instructions/` |
| Cursor | `*.mdc` | `.cursor/rules/` |
| Claude Code | `*.md` | `.claude/rules/` |
| Windsurf | `*.md` | `.windsurf/rules/` |
| All tools | `AGENTS.md` | repo root |

`instruct-sync` lets you install community instruction packs once — it automatically writes them to the right place for every tool you're using. Think of it as **npm for AI instruction files**.

## Install

```bash
npm install -g instruct-sync
# or use without installing
npx instruct-sync add react
```

## Quick start

```bash
# Browse available packs
instruct-sync list

# Install a pack — auto-detects Cursor, Claude, Windsurf and installs for each
instruct-sync add react

# See what's installed in this repo
instruct-sync installed

# Update all installed packs to latest
instruct-sync update
```

## Commands

### `instruct-sync list`

Browse available packs in the community registry.

```
Pack                 Tool         Description
──────────────────── ──────────── ────────────────────────────────────────────────────
react                copilot      React 18+ best practices: hooks, component patterns
react                cursor       React 18+ best practices: hooks, component patterns
react                claude       React 18+ best practices: hooks, component patterns
react                windsurf     React 18+ best practices: hooks, component patterns
agents               agents       Cross-tool AGENTS.md for all AI agents
...
```

### `instruct-sync installed`

Show packs installed in this repo with their targets and status.

```
Pack                     Tool         Target
──────────────────────── ──────────── ────────────────────────────────────────────────────
react                    copilot      .github/instructions/react.instructions.md
react                    cursor       .cursor/rules/react.mdc ⚠ file missing — run: instruct-sync update
```

### `instruct-sync add <name>`

Install a pack from the registry. By default, auto-detects which tools you're using and installs for all of them.

```bash
instruct-sync add react
# ✓ Installed "react" → .github/instructions/react.instructions.md (copilot)
# ✓ Installed "react" → .cursor/rules/react.mdc (cursor)
```

**Install for a specific tool only:**
```bash
instruct-sync add react --tool cursor
```

**Install from any GitHub repo (public or private):**
```bash
instruct-sync add github:owner/repo/path/to/file.md@v1.0.0
instruct-sync add github:owner/repo/path/to/file.md@main
instruct-sync add github:owner/repo/path/to/file.md@a3f9c12
```

**Override the install path:**
```bash
instruct-sync add github:owner/repo/my-rules.md@main --target AGENTS.md
```

### `instruct-sync update`

Re-fetch all installed packs. Skips packs where the remote SHA hasn't changed, unless the file is missing (restores it).

```
Updating "react@copilot"...
  ✓ already up to date
Updating "react@cursor"...
  ✓ restored
```

### `instruct-sync remove <name>`

Remove a pack — deletes the file from disk and removes it from the lockfile.

```bash
instruct-sync remove react              # removes all tool variants
instruct-sync remove react --tool cursor  # removes cursor variant only
```

### `instruct-sync compose [--output <file>]`

Merge all installed pack files into a single output file (useful for tools that use one combined file).

```bash
instruct-sync compose                          # → .github/copilot-instructions.md
instruct-sync compose --output CLAUDE.md       # → CLAUDE.md
instruct-sync compose --output AGENTS.md       # → AGENTS.md
```

## Tool auto-detection

When you run `instruct-sync add <pack>`, it checks which AI tools are present in your repo:

| Signal | Tool detected |
|--------|--------------|
| `.cursor/` directory | Cursor |
| `CLAUDE.md` or `.claude/` | Claude Code |
| `.windsurf/` or `.windsurfrules` | Windsurf |
| `.clinerules` | Cline |
| (always) | Copilot |

If none of the optional signals are found, only the Copilot variant is installed and a hint is shown:
```
✓ Installed "react" → .github/instructions/react.instructions.md (copilot)
  Hint: Run with --tool cursor|claude|windsurf to install for other tools
```

## Community registry

6 packs are available out of the box, each with copilot, cursor, claude, and windsurf variants:

| Pack | Description |
|------|-------------|
| `react` | React 18+ hooks, components, state, testing |
| `nextjs` | Next.js App Router, Server Components, Server Actions |
| `typescript` | Strict mode, type patterns, null handling |
| `python` | PEP 8, type hints, async, pytest |
| `go` | Project layout, error handling, interfaces, concurrency |
| `agents` | Cross-tool AGENTS.md for all AI agents |

Packs are hosted at [instruct-sync-registry](https://github.com/zekariasasaminew/instruct-sync-registry). To contribute a pack, open a PR there — add a `.md` file to `packs/` and an entry to `registry.json`.

## Private repos

Set a GitHub token with read access:

```bash
# PowerShell
$env:GITHUB_TOKEN = "ghp_your_token"

# bash/zsh
export GITHUB_TOKEN="ghp_your_token"

instruct-sync add github:your-org/private-repo/instructions/backend.md@main
```

## Lockfile

`instruct-sync.json` is created at your repo root. Commit it so your team stays on the same versions.

```json
{
  "packs": {
    "react@copilot": {
      "source": "github:zekariasasaminew/instruct-sync-registry/packs/react.md",
      "ref": "HEAD",
      "sha": "abc123def456",
      "target": ".github/instructions/react.instructions.md",
      "tool": "copilot",
      "installedAt": "2026-03-03T00:00:00Z"
    },
    "react@cursor": {
      "source": "github:zekariasasaminew/instruct-sync-registry/packs/react.md",
      "ref": "HEAD",
      "sha": "abc123def456",
      "target": ".cursor/rules/react.mdc",
      "tool": "cursor",
      "installedAt": "2026-03-03T00:00:00Z"
    }
  }
}
```

## Troubleshooting

**File was deleted — restore it**

```
react  copilot  .github/instructions/react.instructions.md ⚠ file missing — run: instruct-sync update
```

Run `instruct-sync update` to restore it. Even if the remote hasn't changed, it will re-write the file.

**Pack already installed**

```bash
instruct-sync add react
# "react" is already installed for: copilot. Run: instruct-sync update
```

**Upgrade instruct-sync itself**

```bash
npm install -g instruct-sync@latest
```

`npm install -g instruct-sync` without `@latest` keeps the cached version.

**Compose with missing files**

```
✓ Composed 2 of 3 pack(s) → .github/copilot-instructions.md (1 skipped — run: instruct-sync update)
```

Run `instruct-sync update` first to restore missing files, then run `compose` again.

## Contributing

Contributions welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
