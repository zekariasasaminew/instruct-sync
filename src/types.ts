export interface RegistryEntry {
  name: string;
  description: string;
  source: string;
  author: string;
  tags: string[];
}

export interface LockEntry {
  source: string;
  ref: string;
  sha: string;
  target: string;
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
