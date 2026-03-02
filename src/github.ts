import { Octokit } from "@octokit/rest";
import type { FetchedFile, GitHubSource } from "./types.js";

const octokit = new Octokit({ auth: process.env["GITHUB_TOKEN"] });

export function parseSource(source: string): GitHubSource {
  // github:owner/repo/path/to/file.md@ref
  const withoutScheme = source.replace(/^github:/, "");
  const atIdx = withoutScheme.lastIndexOf("@");
  const ref = atIdx === -1 ? "HEAD" : withoutScheme.slice(atIdx + 1);
  const withoutRef = atIdx === -1 ? withoutScheme : withoutScheme.slice(0, atIdx);
  const slashIdx = withoutRef.indexOf("/");
  const owner = withoutRef.slice(0, slashIdx);
  const rest = withoutRef.slice(slashIdx + 1);
  const nextSlash = rest.indexOf("/");
  const repo = rest.slice(0, nextSlash);
  const path = rest.slice(nextSlash + 1);
  return { owner, repo, path, ref };
}

export async function fetchFile(source: GitHubSource): Promise<FetchedFile> {
  const { owner, repo, path, ref } = source;
  const res = await octokit.repos.getContent({ owner, repo, path, ref });
  const data = res.data;
  if (Array.isArray(data) || data.type !== "file") {
    throw new Error(`Expected a file at ${owner}/${repo}/${path}`);
  }
  const content = Buffer.from(data.content, "base64").toString("utf8");
  return { content, sha: data.sha };
}
