# instruct-sync

> Share and sync GitHub Copilot instruction files across repos — install community packs or pull from any private GitHub repo, with version pinning and no local cloning required.

[![npm](https://img.shields.io/npm/v/instruct-sync)](https://www.npmjs.com/package/instruct-sync)
[![CI](https://github.com/zekariasasaminew/instruct-sync/actions/workflows/ci.yml/badge.svg)](https://github.com/zekariasasaminew/instruct-sync/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Install

```bash
npm install -g instruct-sync
# or use directly without installing
npx instruct-sync add react
```

## Usage

```bash
# Install a pack from the community registry
instruct-sync add react

# Install from any GitHub repo at a specific ref (public or private)
instruct-sync add github:owner/repo/path/to/file.md@v1.0.0

# Pin to a branch (always gets latest on update)
instruct-sync add github:owner/repo/path/to/file.md@main

# Pin to a commit SHA (never changes)
instruct-sync add github:owner/repo/path/to/file.md@a3f9c12

# Update all installed packs
instruct-sync update

# List installed packs
instruct-sync list

# Merge all installed packs into one .github/copilot-instructions.md
instruct-sync compose
```

## How it works

Running `instruct-sync add <pack>` will:
1. Look up the pack in the community registry (or parse the `github:` source directly)
2. Fetch the file content from GitHub via the API — no cloning required
3. Write it to `.github/instructions/<name>.instructions.md`
4. Record the source, ref, and SHA in `instruct-sync.json`

The `instruct-sync.json` lockfile pins exactly what you have installed. Running `instruct-sync update` compares the current SHA on GitHub against your locked SHA — if they differ it re-fetches, if they match it skips. Updates are always opt-in.

## Common scenarios

**File was deleted — restore it**

If you accidentally delete an instruction file, `instruct-sync list` will warn you:

```
react  HEAD  .github/instructions/react.instructions.md ⚠ file missing — run: instruct-sync update
```

Run `instruct-sync update` to restore all missing files. Even if the remote content hasn't changed (same SHA), it will re-write the file with `✓ restored`.

**Add a pack that's already installed**

```bash
instruct-sync add react
# "react" is already installed at .github/instructions/react.instructions.md. Run: instruct-sync update
```

Use `instruct-sync update` to pull the latest version, not `add`.

**Remove a pack**

There is no `remove` command yet. To remove a pack manually:
1. Delete the file (e.g. `.github/instructions/react.instructions.md`)
2. Remove the entry from `instruct-sync.json`

**Compose with missing files**

If some files are missing when you run `instruct-sync compose`, they are skipped and you get a clear count:

```
✓ Composed 2 of 3 pack(s) → .github/copilot-instructions.md (1 skipped — run: instruct-sync update)
```

Run `instruct-sync update` first to restore any missing files, then `compose` again.

**Upgrade instruct-sync itself**

```bash
npm install -g instruct-sync@latest
```

`npm install -g instruct-sync` without `@latest` will keep the cached version.


## Private repos

For private repos, set a GitHub token with read access:

```bash
$env:GITHUB_TOKEN = "ghp_your_token"
instruct-sync add github:your-org/private-repo/instructions/backend.md@main
```

Access is controlled entirely by GitHub — if the token doesn't have read access to the repo, the fetch fails.

## Community registry

5 seed packs are available out of the box:

| Pack | Description |
|------|-------------|
| `react` | React 18+ hooks, components, state, testing |
| `nextjs` | Next.js App Router, Server Components, Server Actions |
| `typescript` | Strict mode, type patterns, null handling |
| `python` | PEP 8, type hints, async, pytest |
| `go` | Project layout, error handling, interfaces, concurrency |

Packs are hosted at [instruct-sync-registry](https://github.com/zekariasasaminew/instruct-sync-registry). To add your own pack, open a PR there — add a `.md` file to `packs/` and an entry to `registry.json`.

## Lockfile

`instruct-sync.json` is created at your repo root:

```json
{
  "packs": {
    "react": {
      "source": "github:zekariasasaminew/instruct-sync-registry/packs/react.md",
      "ref": "HEAD",
      "sha": "abc123def456",
      "target": ".github/instructions/react.instructions.md",
      "installedAt": "2026-03-03T00:00:00Z"
    }
  }
}
```

Commit this file so your whole team stays on the same instruction versions.

## Contributing

Contributions welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
