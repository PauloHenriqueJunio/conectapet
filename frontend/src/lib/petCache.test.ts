import { afterEach, describe, expect, it, vi } from "vitest";
import { Pet } from "@/types/api";

const apiFetchMock = vi.fn();
vi.mock("./api", () => ({
  apiFetch: (...args: unknown[]) => apiFetchMock(...args),
}));

const { prefetchPet, getCachedPet } = await import("./petCache");

const pet = { id: "abc", name: "Luna" } as Pet;

describe("petCache", () => {
  afterEach(() => {
    apiFetchMock.mockReset();
  });

  it("returns null for a pet that was never prefetched", () => {
    expect(getCachedPet("never-fetched")).toBeNull();
  });

  it("caches the pet once the prefetch resolves", async () => {
    apiFetchMock.mockResolvedValueOnce(pet);

    prefetchPet("abc");
    await vi.waitFor(() => {
      expect(getCachedPet("abc")).toEqual(pet);
    });
  });

  it("does not throw or cache anything when the prefetch fails", async () => {
    apiFetchMock.mockRejectedValueOnce(new Error("network error"));

    prefetchPet("failing-id");
    await vi.waitFor(() => {
      expect(apiFetchMock).toHaveBeenCalledWith("/pets/failing-id");
    });
    expect(getCachedPet("failing-id")).toBeNull();
  });

  it("does not call the API twice for an id that is already cached", () => {
    prefetchPet("abc");
    expect(apiFetchMock).not.toHaveBeenCalled();
  });
});
