# Contributing to instruct-sync

Contributions are welcome and appreciated!

## Adding a community pack

Open a PR to [instruct-sync-registry](https://github.com/zekariasasaminew/instruct-sync-registry):
1. Add your pack as `packs/<name>.md`
2. Add an entry to `registry.json`

## Development setup

```bash
git clone https://github.com/zekariasasaminew/instruct-sync.git
cd instruct-sync
npm install
npm test
```

## Guidelines

- Branch from `main`: `feat/*`, `fix/*`, `chore/*`
- One file per commit where possible
- Conventional commits: `feat:`, `fix:`, `chore:`, `test:`, `docs:`
- Write tests for all new logic in `tests/`
- Keep PRs focused — one logical change per PR

## Code style

- TypeScript strict mode — no `any`
- Named exports only
- Comments only when genuinely non-obvious
