import { describe, it, expect, beforeEach } from "vitest";
import { api, setFallbackMockUser } from "./api";

describe("Auth & User Session", () => {
  beforeEach(async () => {
    await api.logout();
  });

  it("returns null when no session is active", async () => {
    const user = await api.getMe();
    expect(user).toBeNull();
  });

  it("handles mock login and logout correctly", async () => {
    const mockUser = {
      id: "usr_mock_1",
      handle: "testdev",
      name: "Test Developer",
      email: "test@example.com",
      avatarUrl: "https://example.com/avatar.png",
      createdAt: "2026-11-01T00:00:00Z",
    };

    setFallbackMockUser(mockUser);
    const user = await api.getMe();
    expect(user).not.toBeNull();
    expect(user?.handle).toBe("testdev");

    await api.logout();
    const afterLogout = await api.getMe();
    expect(afterLogout).toBeNull();
  });
});
