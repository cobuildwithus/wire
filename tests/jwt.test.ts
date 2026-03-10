import { describe, expect, it } from "vitest";
import {
  DEFAULT_CLI_JWT_AUDIENCE,
  DEFAULT_CLI_JWT_ISSUER,
  DEFAULT_DEV_CLI_JWT_PUBLIC_KEY,
  deriveCliVerifiedPrincipal,
  deriveCliScopeCapabilities,
  parseCliJwtClaims,
  parseCliJwtVerifiedClaims,
  toCliJwtPayloadClaims,
} from "../src/jwt.js";

describe("jwt claim helpers", () => {
  it("maps wire payload keys", () => {
    expect(
      toCliJwtPayloadClaims({
        sub: "0xabc",
        sid: "sid_1",
        agentKey: "default",
        scope: "notifications:read tools:read offline_access",
      })
    ).toEqual({
      sub: "0xabc",
      sid: "sid_1",
      agent_key: "default",
      scope: "notifications:read tools:read offline_access",
    });
  });

  it("parses base claim payloads", () => {
    expect(
      parseCliJwtClaims({
        sub: "0xabc",
        sid: "sid_1",
        agent_key: "default",
        scope: "notifications:read tools:read offline_access",
      })
    ).toEqual({
      sub: "0xabc",
      sid: "sid_1",
      agentKey: "default",
      scope: "notifications:read tools:read offline_access",
    });
  });

  it("parses verified claim payloads", () => {
    expect(
      parseCliJwtVerifiedClaims({
        sub: "0xabc",
        sid: "sid_1",
        agent_key: "default",
        scope: "notifications:read tools:read offline_access",
        iat: 1,
        exp: 2,
        iss: "issuer",
        aud: "audience",
      })
    ).toMatchObject({
      sub: "0xabc",
      sid: "sid_1",
      agentKey: "default",
      scope: "notifications:read tools:read offline_access",
      iat: 1,
      exp: 2,
      iss: "issuer",
      aud: "audience",
    });
  });

  it("rejects invalid payloads", () => {
    expect(parseCliJwtClaims({})).toBeNull();
    expect(parseCliJwtVerifiedClaims({ sub: "0xabc" })).toBeNull();
    expect(parseCliJwtVerifiedClaims({
      sub: "0xabc",
      sid: "sid_1",
      agent_key: "default",
      scope: "notifications:read tools:read offline_access",
      iat: 1,
      exp: 2,
      iss: "issuer",
      aud: ["ok", 1],
    })).toBeNull();
  });

  it("exports canonical default CLI JWT values", () => {
    expect(DEFAULT_DEV_CLI_JWT_PUBLIC_KEY).toContain("BEGIN PUBLIC KEY");
    expect(DEFAULT_CLI_JWT_ISSUER).toBe("cobuild-chat-api");
    expect(DEFAULT_CLI_JWT_AUDIENCE).toBe("cli");
  });

  it("derives write capabilities from scope", () => {
    expect(deriveCliScopeCapabilities("tools:read wallet:read")).toEqual({
      hasToolsWrite: false,
      hasWalletExecute: false,
      hasAnyWriteScope: false,
    });
    expect(deriveCliScopeCapabilities("tools:write wallet:read")).toEqual({
      hasToolsWrite: true,
      hasWalletExecute: false,
      hasAnyWriteScope: true,
    });
    expect(deriveCliScopeCapabilities("wallet:execute")).toEqual({
      hasToolsWrite: false,
      hasWalletExecute: true,
      hasAnyWriteScope: true,
    });
  });

  it("derives a normalized principal from verified claims", () => {
    expect(
      deriveCliVerifiedPrincipal({
        sub: "0x00000000000000000000000000000000000000AA",
        sid: " 42 ",
        agentKey: " ops ",
        scope: "tools:read tools:write wallet:read",
        iat: 1,
        exp: 2,
        iss: "issuer",
        aud: "audience",
      })
    ).toEqual({
      sessionId: "42",
      ownerAddress: "0x00000000000000000000000000000000000000aa",
      agentKey: "ops",
      scope: "tools:read tools:write wallet:read",
      scopes: ["tools:read", "tools:write", "wallet:read"],
      hasToolsRead: true,
      hasToolsWrite: true,
      hasWalletExecute: false,
      hasAnyWriteScope: true,
    });
  });

  it("rejects verified principals with invalid normalized fields", () => {
    expect(
      deriveCliVerifiedPrincipal({
        sub: "bad-address",
        sid: "42",
        agentKey: "ops",
        scope: "tools:read",
        iat: 1,
        exp: 2,
        iss: "issuer",
        aud: "audience",
      })
    ).toBeNull();
    expect(
      deriveCliVerifiedPrincipal({
        sub: "0x0000000000000000000000000000000000000001",
        sid: "42",
        agentKey: "ops",
        scope: "   ",
        iat: 1,
        exp: 2,
        iss: "issuer",
        aud: "audience",
      })
    ).toBeNull();
  });
});
