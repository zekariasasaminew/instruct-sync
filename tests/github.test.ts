import { describe, it, expect, vi } from "vitest";
import { parseSource } from "../src/github.js";

vi.mock("@octokit/rest", () => ({
  Octokit: vi.fn().mockImplementation(() => ({
    repos: {
      getContent: vi.fn().mockResolvedValue({
        data: { type: "file", content: Buffer.from("hello").toString("base64"), sha: "abc123" },
      }),
    },
  })),
}));

describe("parseSource", () => {
  it("parses github: source with ref", () => {
    const s = parseSource("github:owner/repo/path/to/file.md@v1.0.0");
    expect(s).toEqual({ owner: "owner", repo: "repo", path: "path/to/file.md", ref: "v1.0.0" });
  });

  it("defaults to HEAD when no ref", () => {
    const s = parseSource("github:owner/repo/packs/react.md");
    expect(s).toEqual({ owner: "owner", repo: "repo", path: "packs/react.md", ref: "HEAD" });
  });
});

describe("fetchFile", () => {
  it("fetches and decodes file content", async () => {
    const { fetchFile } = await import("../src/github.js");
    const result = await fetchFile({ owner: "owner", repo: "repo", path: "packs/react.md", ref: "main" });
    expect(result.content).toBe("hello");
    expect(result.sha).toBe("abc123");
  });
});
