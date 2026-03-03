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

  console.log(`${"Pack".padEnd(20)} ${"Tags".padEnd(30)} ${"Description"}`);
  console.log(`${"─".repeat(20)} ${"─".repeat(30)} ${"─".repeat(40)}`);
  for (const pack of packs) {
    const tags = (pack.tags ?? []).join(", ");
    console.log(`${pack.name.padEnd(20)} ${tags.padEnd(30)} ${pack.description}`);
  }
  console.log(`\n${packs.length} pack(s) available. Run: instruct-sync add <name>`);
}
