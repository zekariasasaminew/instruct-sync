import { readLockfile } from "../lockfile.js";
import { parseSource, fetchFile } from "../github.js";
import { writeInstructions } from "../writer.js";
import { addEntry } from "../lockfile.js";

export async function update(): Promise<void> {
  const lock = readLockfile();
  const names = Object.keys(lock.packs);
  if (names.length === 0) {
    console.log("No packs installed.");
    return;
  }
  for (const name of names) {
    const entry = lock.packs[name]!;
    const parsed = parseSource(entry.source);
    parsed.ref = entry.ref;
    console.log(`Updating "${name}"...`);
    const file = await fetchFile(parsed);
    if (file.sha === entry.sha) {
      console.log(`  already up to date`);
    } else {
      writeInstructions(file.content, entry.target);
      addEntry(name, { ...entry, sha: file.sha, installedAt: new Date().toISOString() });
      console.log(`  ✓ updated`);
    }
  }
}
