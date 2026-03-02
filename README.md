# instruct-sync

> Share and sync GitHub Copilot instruction files across repos from a community registry — with version pinning and no local cloning required.

## Install

```bash
npm install -g instruct-sync
# or use directly
npx instruct-sync add react
```

## Usage

```bash
# Install a pack from the community registry
instruct-sync add react

# Install from any GitHub repo at a specific ref
instruct-sync add github:owner/repo/path/to/file.md@v1.0.0

# Update all installed packs
instruct-sync update

# List installed packs
instruct-sync list

# Merge multiple packs into one file
instruct-sync compose
```

## How it works

Running `instruct-sync add <pack>` will:
1. Fetch the pack content from GitHub via the API (no cloning)
2. Write it to `.github/copilot-instructions.md` (or a named file)
3. Record the source, ref, and SHA in `instruct-sync.json`

The `instruct-sync.json` lockfile lets teams pin pack versions and track where each instruction comes from.

## vs ai-rules-sync

| Feature | instruct-sync | ai-rules-sync |
|---------|---------------|---------------|
| Community registry | ✅ | ❌ |
| Version pinning | ✅ | ❌ |
| Works on Windows | ✅ | ⚠️ (symlinks need dev mode) |
| Fetch without cloning | ✅ | ❌ |
| Copilot-focused | ✅ | ❌ (15+ tools) |

## Community registry

Packs are hosted at [instruct-sync-registry](https://github.com/zekariasasaminew/instruct-sync-registry). To add a pack, open a PR there.

## Contributing

Contributions welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
