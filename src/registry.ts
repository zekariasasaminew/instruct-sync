import type { RegistryEntry } from "./types.js";

const REGISTRY_URL =
  "https://raw.githubusercontent.com/zekariasasaminew/instruct-sync-registry/main/registry.json";

export async function fetchRegistry(): Promise<RegistryEntry[]> {
  const res = await fetch(REGISTRY_URL);
  if (!res.ok) throw new Error(`Failed to fetch registry: ${res.status}`);
  const data = (await res.json()) as { packs: RegistryEntry[] };
  return data.packs;
}

export async function findPack(name: string): Promise<RegistryEntry> {
  const packs = await fetchRegistry();
  const pack = packs.find((p) => p.name === name);
  if (!pack) throw new Error(`Pack "${name}" not found in registry. Run "instruct-sync list" to see available packs.`);
  return pack;
}
