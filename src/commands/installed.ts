import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { readLockfile } from "../lockfile.js";

export function installed(): void {
  const lock = readLockfile();
  const entries = Object.entries(lock.packs);
  if (entries.length === 0) {
    console.log("No packs installed. Run: instruct-sync add <name>");
    return;
  }
  console.log(`${"Pack".padEnd(24)} ${"Tool".padEnd(12)} ${"Target"}`);
  console.log(`${"─".repeat(24)} ${"─".repeat(12)} ${"─".repeat(40)}`);
  for (const [key, entry] of entries) {
    const tool = entry.tool ?? (key.includes("@") ? key.split("@")[1] : "copilot");
    const name = key.includes("@") ? key.split("@")[0] : key;
    const exists = existsSync(resolve(process.cwd(), entry.target));
    const status = exists ? "" : " ⚠ file missing — run: instruct-sync update";
    console.log(`${name.padEnd(24)} ${tool.padEnd(12)} ${entry.target}${status}`);
  }
}
