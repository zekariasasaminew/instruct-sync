import { fetchRegistry } from "../registry.js";

export async function browse(): Promise<void> {
  let packs;
  try {
    packs = await fetchRegistry();
  } catch (err) {
    throw new Error(`Could not reach registry: ${err instanceof Error ? err.message : err}`);
  }

  if (packs.length === 0) {
    console.log("No packs in registry.");
    return;
  }

  console.log(`${"Pack".padEnd(20)} ${"Tool".padEnd(12)} ${"Description"}`);
  console.log(`${"─".repeat(20)} ${"─".repeat(12)} ${"─".repeat(40)}`);
  for (const pack of packs) {
    if (pack.targets) {
      // v2: one row per tool
      for (const tool of Object.keys(pack.targets)) {
        console.log(`${pack.name.padEnd(20)} ${tool.padEnd(12)} ${pack.description}`);
      }
    } else {
      const tool = pack.tool ?? "copilot";
      console.log(`${pack.name.padEnd(20)} ${String(tool).padEnd(12)} ${pack.description}`);
    }
  }
  console.log(`\n${packs.length} pack(s) available. Run: instruct-sync add <name>`);
}
