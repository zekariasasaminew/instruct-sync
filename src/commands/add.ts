import { findPack, getToolTarget } from "../registry.js";
import { parseSource, fetchFile } from "../github.js";
import { writeInstructions, defaultTarget } from "../writer.js";
import { readLockfile, addEntry } from "../lockfile.js";
import { detectTools } from "../detect.js";
import type { ToolName } from "../types.js";

export async function add(nameOrSource: string, flags: { tool?: string; target?: string } = {}): Promise<void> {
  const isDirect = nameOrSource.startsWith("github:");

  if (isDirect) {
    await addDirect(nameOrSource, flags);
    return;
  }

  const pack = await findPack(nameOrSource);

  // Determine which tools to install for
  let tools: ToolName[];
  if (flags.tool) {
    tools = [flags.tool as ToolName];
  } else if (pack.targets) {
    // v2 pack: auto-detect which tools are present in cwd
    const detected = detectTools();
    tools = (Object.keys(pack.targets) as ToolName[]).filter((t) => detected.includes(t));
    if (tools.length === 0) tools = ["copilot"]; // fallback
  } else {
    // v1/cross-tool pack: use pack.tool if specified, otherwise copilot
    tools = [((pack.tool as ToolName) ?? "copilot")];
  }

  const installed: string[] = [];
  const skipped: string[] = [];

  for (const tool of tools) {
    const lockKey = `${nameOrSource}@${tool}`;
    const existing = readLockfile().packs[lockKey] ?? readLockfile().packs[nameOrSource];
    if (existing) {
      skipped.push(tool);
      continue;
    }

    const toolTarget = getToolTarget(pack, tool);
    if (!toolTarget) continue;

    const source = toolTarget.source;
    const target = flags.target ?? (toolTarget.target || defaultTarget(nameOrSource));

    const parsed = parseSource(source);
    console.log(`Fetching ${source}...`);
    const file = await fetchFile(parsed);

    writeInstructions(file.content, target);
    addEntry(lockKey, { source, ref: parsed.ref, sha: file.sha, target, tool, installedAt: new Date().toISOString() });
    installed.push(`✓ Installed "${nameOrSource}" → ${target} (${tool})`);
  }

  if (installed.length === 0 && skipped.length > 0) {
    console.log(`"${nameOrSource}" is already installed for: ${skipped.join(", ")}. Run: instruct-sync update`);
    return;
  }

  for (const line of installed) console.log(line);
  if (skipped.length > 0) console.log(`  Skipped (already installed): ${skipped.join(", ")}`);

  // Hint: show available tool variants that weren't installed
  if (installed.length > 0 && !flags.tool && pack.targets) {
    const notInstalled = (Object.keys(pack.targets) as ToolName[]).filter((t) => !tools.includes(t));
    if (notInstalled.length > 0) {
      console.log(`  Hint: ${notInstalled.join(", ")} variants also available. Run: instruct-sync add ${nameOrSource} --tool <tool>`);
    }
  } else if (installed.length > 0 && !flags.tool && !pack.targets && pack.tool !== "agents") {
    console.log(`  Hint: Run with --tool cursor|claude|windsurf to install for other tools`);
  }
}

async function addDirect(source: string, flags: { tool?: string; target?: string }): Promise<void> {
  const name = source.split("/").pop()!
    .replace(/@[^@]*$/, "")  // strip @ref (e.g. @HEAD, @v1.0.0)
    .replace(/\.md$/, "")
    .replace(/^github:/, "");
  const tool = (flags.tool as ToolName) ?? "copilot";
  const lockKey = `${name}@${tool}`;

  const existing = readLockfile().packs[lockKey] ?? readLockfile().packs[name];
  if (existing) {
    console.log(`"${name}" is already installed at ${existing.target}. Run: instruct-sync update`);
    return;
  }

  const parsed = parseSource(source);
  console.log(`Fetching ${source}...`);
  const file = await fetchFile(parsed);

  const target = flags.target ?? defaultTarget(name);
  writeInstructions(file.content, target);
  addEntry(lockKey, { source, ref: parsed.ref, sha: file.sha, target, tool, installedAt: new Date().toISOString() });
  console.log(`✓ Installed "${name}" → ${target} (${tool})`);
}
