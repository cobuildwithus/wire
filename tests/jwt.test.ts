import { describe, expect, it } from "vitest";
import {
  DEFAULT_CLI_JWT_AUDIENCE,
  DEFAULT_CLI_JWT_ISSUER,
  DEFAULT_DEV_CLI_JWT_PUBLIC_KEY,
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
        scope: "tools:read offline_access",
      })
    ).toEqual({
      sub: "0xabc",
      sid: "sid_1",
      agent_key: "default",
      scope: "tools:read offline_access",
    });
  });

  it("parses base claim payloads", () => {
    expect(
      parseCliJwtClaims({
        sub: "0xabc",
        sid: "sid_1",
        agent_key: "default",
        scope: "tools:read offline_access",
      })
    ).toEqual({
      sub: "0xabc",
      sid: "sid_1",
      agentKey: "default",
      scope: "tools:read offline_access",
    });
  });

  it("parses verified claim payloads", () => {
    expect(
      parseCliJwtVerifiedClaims({
        sub: "0xabc",
        sid: "sid_1",
        agent_key: "default",
        scope: "tools:read offline_access",
        iat: 1,
        exp: 2,
        iss: "issuer",
        aud: "audience",
      })
    ).toMatchObject({
      sub: "0xabc",
      sid: "sid_1",
      agentKey: "default",
      scope: "tools:read offline_access",
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
      scope: "tools:read offline_access",
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
});
