import { describe, it, expect, vi, beforeEach } from "vitest";

vi.stubGlobal("fetch", vi.fn());

const mockPacks = [
  { name: "react", description: "React hooks", source: "github:org/repo/packs/react.md", author: "org", tags: ["react"] },
  { name: "nextjs", description: "Next.js", source: "github:org/repo/packs/nextjs.md", author: "org", tags: ["next"] },
];

beforeEach(() => {
  vi.mocked(fetch).mockResolvedValue({
    ok: true,
    json: async () => ({ packs: mockPacks }),
  } as Response);
});

describe("fetchRegistry", () => {
  it("returns list of packs", async () => {
    const { fetchRegistry } = await import("../src/registry.js");
    const packs = await fetchRegistry();
    expect(packs).toHaveLength(2);
    expect(packs[0]?.name).toBe("react");
  });
});

describe("findPack", () => {
  it("finds a pack by name", async () => {
    const { findPack } = await import("../src/registry.js");
    const pack = await findPack("nextjs");
    expect(pack.source).toBe("github:org/repo/packs/nextjs.md");
  });

  it("throws when pack not found", async () => {
    const { findPack } = await import("../src/registry.js");
    await expect(findPack("unknown")).rejects.toThrow('Pack "unknown" not found');
  });

  it("throws when registry fetch fails", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 503 } as Response);
    const { findPack } = await import("../src/registry.js");
    await expect(findPack("react")).rejects.toThrow("Failed to fetch registry");
  });
});
