import { describe, it, expect, vi } from "vitest";

const mockRegistry = vi.hoisted(() => ({ fetchRegistry: vi.fn() }));
vi.mock("../src/registry.js", () => mockRegistry);

describe("browse", () => {
  it("prints packs from registry", async () => {
    mockRegistry.fetchRegistry.mockResolvedValue([
      { name: "react", description: "React rules", tags: ["react", "frontend"], source: "s", author: "a" },
      { name: "typescript", description: "TS rules", tags: ["typescript"], source: "s", author: "a" },
    ]);
    const { browse } = await import("../src/commands/browse.js");
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    await browse();
    const output = spy.mock.calls.map((c) => c[0]).join("\n");
    expect(output).toContain("react");
    expect(output).toContain("typescript");
    expect(output).toContain("2 packs available");
    spy.mockRestore();
  });

  it("prints empty message when registry has no packs", async () => {
    mockRegistry.fetchRegistry.mockResolvedValue([]);
    const { browse } = await import("../src/commands/browse.js");
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    await browse();
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("No packs"));
    spy.mockRestore();
  });
});
