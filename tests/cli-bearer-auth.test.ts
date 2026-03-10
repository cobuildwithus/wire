import { describe, expect, it, vi } from "vitest";
import { verifyCliBearerAuth } from "../src/cli-bearer-auth.js";

describe("verifyCliBearerAuth", () => {
  it("rejects missing bearer tokens", async () => {
    const verifyAccessToken = vi.fn();
    const readActiveSession = vi.fn();

    await expect(
      verifyCliBearerAuth({
        authorization: null,
        verifyAccessToken,
        readActiveSession,
      })
    ).resolves.toEqual({
      ok: false,
      code: "missing_token",
    });
    expect(verifyAccessToken).not.toHaveBeenCalled();
    expect(readActiveSession).not.toHaveBeenCalled();
  });

  it("rejects invalid verified claims", async () => {
    const verifyAccessToken = vi.fn().mockResolvedValue(null);
    const readActiveSession = vi.fn();

    await expect(
      verifyCliBearerAuth({
        rawToken: "bad-token",
        verifyAccessToken,
        readActiveSession,
      })
    ).resolves.toEqual({
      ok: false,
      code: "invalid_token",
    });
    expect(verifyAccessToken).toHaveBeenCalledWith("bad-token");
    expect(readActiveSession).not.toHaveBeenCalled();
  });

  it("rejects principals with invalid normalized fields", async () => {
    const verifyAccessToken = vi.fn().mockResolvedValue({
      sub: "bad-address",
      sid: "42",
      agentKey: "ops",
      scope: "tools:read offline_access",
      iat: 1,
      exp: 2,
      iss: "issuer",
      aud: "audience",
    });
    const readActiveSession = vi.fn();

    await expect(
      verifyCliBearerAuth({
        rawToken: "bad-principal",
        verifyAccessToken,
        readActiveSession,
      })
    ).resolves.toEqual({
      ok: false,
      code: "invalid_token",
    });
    expect(readActiveSession).not.toHaveBeenCalled();
  });

  it("rejects missing or scope-mismatched backing sessions", async () => {
    const verifyAccessToken = vi.fn().mockResolvedValue({
      sub: "0x0000000000000000000000000000000000000001",
      sid: "42",
      agentKey: "ops",
      scope: "tools:read wallet:read offline_access",
      iat: 1,
      exp: 2,
      iss: "issuer",
      aud: "audience",
    });
    const readActiveSession = vi
      .fn()
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ scope: "tools:read offline_access" });

    await expect(
      verifyCliBearerAuth({
        rawToken: "missing-session",
        verifyAccessToken,
        readActiveSession,
      })
    ).resolves.toEqual({
      ok: false,
      code: "inactive_session",
    });

    await expect(
      verifyCliBearerAuth({
        rawToken: "scope-mismatch",
        verifyAccessToken,
        readActiveSession,
      })
    ).resolves.toEqual({
      ok: false,
      code: "inactive_session",
    });
  });

  it("rejects missing required scopes", async () => {
    const verifyAccessToken = vi.fn().mockResolvedValue({
      sub: "0x0000000000000000000000000000000000000001",
      sid: "42",
      agentKey: "ops",
      scope: "tools:read wallet:read offline_access",
      iat: 1,
      exp: 2,
      iss: "issuer",
      aud: "audience",
    });
    const readActiveSession = vi.fn().mockResolvedValue({
      scope: "tools:read wallet:read offline_access",
    });

    await expect(
      verifyCliBearerAuth({
        rawToken: "read-only",
        verifyAccessToken,
        readActiveSession,
        requiredScopes: ["wallet:execute"],
      })
    ).resolves.toEqual({
      ok: false,
      code: "scope_required",
      requiredScope: "wallet:execute",
    });
  });

  it("returns the normalized principal when token and session are valid", async () => {
    const verifyAccessToken = vi.fn().mockResolvedValue({
      sub: "0x00000000000000000000000000000000000000AA",
      sid: " 42 ",
      agentKey: " ops ",
      scope: "tools:read tools:write wallet:execute offline_access",
      iat: 1,
      exp: 2,
      iss: "issuer",
      aud: "audience",
    });
    const readActiveSession = vi.fn().mockResolvedValue({
      scope: "tools:read tools:write wallet:execute offline_access",
    });

    await expect(
      verifyCliBearerAuth({
        authorization: "Bearer good-token",
        verifyAccessToken,
        readActiveSession,
        requiredScopes: ["wallet:execute"],
      })
    ).resolves.toEqual({
      ok: true,
      principal: {
        sessionId: "42",
        ownerAddress: "0x00000000000000000000000000000000000000aa",
        agentKey: "ops",
        scope: "tools:read tools:write wallet:execute offline_access",
        scopes: ["tools:read", "tools:write", "wallet:execute", "offline_access"],
        hasToolsRead: true,
        hasToolsWrite: true,
        hasWalletExecute: true,
        hasAnyWriteScope: true,
      },
    });
    expect(readActiveSession).toHaveBeenCalledWith({
      sessionId: "42",
      ownerAddress: "0x00000000000000000000000000000000000000aa",
      agentKey: "ops",
    });
  });
});
