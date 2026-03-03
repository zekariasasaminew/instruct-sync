import { findPack } from "../registry.js";
import { parseSource, fetchFile } from "../github.js";
import { writeInstructions, defaultTarget } from "../writer.js";
import { readLockfile, addEntry } from "../lockfile.js";

export async function add(nameOrSource: string): Promise<void> {
  const name = nameOrSource.startsWith("github:")
    ? nameOrSource.split("/").pop()!.replace(/\.md$/, "").replace(/^github:/, "")
    : nameOrSource;

  const existing = readLockfile().packs[name];
  if (existing) {
    console.log(`"${name}" is already installed at ${existing.target}. Run: instruct-sync update`);
    return;
  }

  let source: string;

  if (nameOrSource.startsWith("github:")) {
    source = nameOrSource;
  } else {
    const pack = await findPack(nameOrSource);
    source = pack.source;
  }

  const parsed = parseSource(source);
  console.log(`Fetching ${source}...`);
  const file = await fetchFile(parsed);

  const target = defaultTarget(name);

  writeInstructions(file.content, target);

  addEntry(name, {
    source,
    ref: parsed.ref,
    sha: file.sha,
    target,
    installedAt: new Date().toISOString(),
  });

  console.log(`✓ Installed "${name}" → ${target}`);
}
