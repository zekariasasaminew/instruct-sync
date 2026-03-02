import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

export function writeInstructions(content: string, target: string, cwd = process.cwd()): void {
  const absPath = resolve(cwd, target);
  mkdirSync(dirname(absPath), { recursive: true });
  writeFileSync(absPath, content, "utf8");
}

export function defaultTarget(name: string): string {
  return `.github/instructions/${name}.instructions.md`;
}
