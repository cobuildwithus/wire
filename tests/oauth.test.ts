import { describe, expect, it } from "vitest";
import {
  OAUTH_DEFAULT_SCOPE,
  OAUTH_WRITE_SCOPE,
  canWriteFromScope,
  createPkcePair,
  defaultCliScope,
  deriveS256CodeChallenge,
  hasScope,
  normalizeCliSessionLabel,
  normalizeScope,
  parseScopeString,
  parseCliAuthorizeQuery,
  validateCliAuthorizeRequest,
  validateCliRedirectUri,
  validatePkceCodeChallenge,
  validateScope,
  verifyPkceS256,
} from "../src/oauth.js";

describe("oauth contract", () => {
  it("normalizes scopes", () => {
    expect(normalizeScope("wallet:read  tools:read offline_access")).toBe(
      "offline_access tools:read wallet:read"
    );
    expect(parseScopeString(" tools:read   wallet:read ")).toEqual(["tools:read", "wallet:read"]);
    expect(validateScope("wallet:read tools:read offline_access")).toBe(
      "offline_access tools:read wallet:read"
    );
    expect(defaultCliScope()).toBe(OAUTH_DEFAULT_SCOPE);
    expect(hasScope(OAUTH_WRITE_SCOPE, "wallet:execute")).toBe(true);
    expect(canWriteFromScope(OAUTH_WRITE_SCOPE)).toBe(true);
  });

  it("validates redirect uri", () => {
    const redirect = validateCliRedirectUri("http://127.0.0.1:43111/auth/callback");
    expect(redirect).toBe("http://127.0.0.1:43111/auth/callback");
    expect(() => validateCliRedirectUri("https://127.0.0.1:43111/auth/callback")).toThrow(
      "redirect_uri must use http loopback transport"
    );
  });

  it("validates authorize request", () => {
    const parsed = validateCliAuthorizeRequest({
      responseType: "code",
      clientId: "buildbot_cli",
      redirectUri: "http://127.0.0.1:43111/auth/callback",
      scope: "tools:read wallet:read offline_access",
      codeChallenge: "a".repeat(43),
      codeChallengeMethod: "S256",
      state: "state1234",
      agentKey: "default",
      label: "my laptop",
      payerMode: "hosted",
    });

    expect(parsed.scope).toBe("offline_access tools:read wallet:read");
    expect(parsed.payerMode).toBe("hosted");
  });

  it("rejects invalid authorize payload fields", () => {
    expect(() =>
      validateCliAuthorizeRequest({
        responseType: "code",
        clientId: "buildbot_cli",
        redirectUri: "http://127.0.0.1:43111/auth/callback",
        scope: "tools:read wallet:read offline_access",
        codeChallenge: "a".repeat(43),
        codeChallengeMethod: "S256",
        state: "state1234",
        agentKey: "bad key",
      })
    ).toThrow("agent_key is invalid");

    expect(() =>
      validateCliAuthorizeRequest({
        responseType: "code",
        clientId: "buildbot_cli",
        redirectUri: "http://127.0.0.1:43111/auth/callback",
        scope: "tools:read wallet:read offline_access",
        codeChallenge: "a".repeat(43),
        codeChallengeMethod: "S256",
        state: "state1234",
        agentKey: "default",
        payerMode: "bad-mode",
      })
    ).toThrow("payer_mode is invalid");
  });

  it("parses authorize query", () => {
    const search = new URLSearchParams({
      response_type: "code",
      client_id: "buildbot_cli",
      redirect_uri: "http://127.0.0.1:43111/auth/callback",
      scope: "tools:read wallet:read offline_access",
      code_challenge: "a".repeat(43),
      code_challenge_method: "S256",
      state: "state1234",
      agent_key: "default",
    });

    const result = parseCliAuthorizeQuery(search);
    expect(result.ok).toBe(true);
  });

  it("handles missing and invalid authorize query payloads", () => {
    const missing = parseCliAuthorizeQuery(new URLSearchParams());
    expect(missing).toEqual({
      ok: false,
      error:
        "Missing required OAuth parameters. Start setup again from the CLI so all PKCE values are included.",
    });

    const invalid = parseCliAuthorizeQuery(
      new URLSearchParams({
        response_type: "code",
        client_id: "buildbot_cli",
        redirect_uri: "http://127.0.0.1:43111/auth/callback",
        scope: "tools:read wallet:read offline_access",
        code_challenge: "a".repeat(43),
        code_challenge_method: "S256",
        state: "short",
        agent_key: "default",
      })
    );
    expect(invalid).toEqual({
      ok: false,
      error: "state is invalid",
    });
  });

  it("supports PKCE pair generation and verification", async () => {
    const pair = await createPkcePair();
    expect(validatePkceCodeChallenge(pair.codeChallenge)).toBe(pair.codeChallenge);
    const expectedChallenge = await deriveS256CodeChallenge(pair.codeVerifier);
    expect(expectedChallenge).toBe(pair.codeChallenge);
    await expect(
      verifyPkceS256({
        codeVerifier: pair.codeVerifier,
        codeChallenge: pair.codeChallenge,
      })
    ).resolves.toBe(true);
  });

  it("normalizes optional session labels", () => {
    expect(normalizeCliSessionLabel("  my   workstation ")).toBe("my workstation");
    expect(normalizeCliSessionLabel("   ")).toBeUndefined();
    expect(() => normalizeCliSessionLabel("<script>")).toThrow("label contains unsupported characters");
  });
});
