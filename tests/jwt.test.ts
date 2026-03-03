import { describe, expect, it } from "vitest";
import {
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
});
