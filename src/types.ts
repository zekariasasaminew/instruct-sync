export type ToolName = "copilot" | "cursor" | "claude" | "windsurf" | "cline" | "agents";

export interface ToolTarget {
  source: string;
  target: string;
}

/** v1: single source/target. v2: per-tool targets map. */
export interface RegistryEntry {
  name: string;
  description: string;
  /** v1 only — single source for all tools */
  source?: string;
  /** v2 only — per-tool source+target */
  targets?: Partial<Record<ToolName, ToolTarget>>;
  /** if present, this pack is for one specific tool only */
  tool?: ToolName | "all";
  author: string;
  tags: string[];
}

export interface LockEntry {
  source: string;
  ref: string;
  sha: string;
  target: string;
  tool?: ToolName;
  installedAt: string;
}

export interface Lockfile {
  packs: Record<string, LockEntry>;
}

export interface FetchedFile {
  content: string;
  sha: string;
}

export interface GitHubSource {
  owner: string;
  repo: string;
  path: string;
  ref: string;
}
