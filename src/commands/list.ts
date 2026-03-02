import { readLockfile } from "../lockfile.js";

export function list(): void {
  const lock = readLockfile();
  const entries = Object.entries(lock.packs);
  if (entries.length === 0) {
    console.log("No packs installed. Run: instruct-sync add <name>");
    return;
  }
  console.log(`${"Pack".padEnd(20)} ${"Ref".padEnd(20)} ${"Target"}`);
  console.log(`${"─".repeat(20)} ${"─".repeat(20)} ${"─".repeat(40)}`);
  for (const [name, entry] of entries) {
    console.log(`${name.padEnd(20)} ${entry.ref.padEnd(20)} ${entry.target}`);
  }
}
