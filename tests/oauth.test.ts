import { describe, expect, it } from "vitest";
import {
  CLI_OAUTH_DEFAULT_SCOPE,
  CLI_OAUTH_NOTIFICATIONS_READ_SCOPE,
  CLI_OAUTH_NOTIFICATIONS_WRITE_SCOPE,
  CLI_OAUTH_WRITE_SCOPE,
  createPkcePair,
  defaultCliScope,
  deriveS256CodeChallenge,
  hasAnyWriteCapability,
  hasScope,
  hasToolsWrite,
  hasWalletExecute,
  hasWriteToolCapability,
  normalizeCliSessionLabel,
  normalizeScope,
  parseCliOAuthAuthorizeCodeRequestBody,
  parseCliOAuthAuthorizeCodeResponse,
  parseCliOAuthAuthorizeQuery,
  parseCliOAuthErrorResponse,
  parseCliOAuthTokenRequestBody,
  parseCliOAuthTokenResponse,
  readCliOAuthErrorResponse,
  serializeCliOAuthAuthorizeCodeRequestBody,
  serializeCliOAuthAuthorizeCodeResponse,
  serializeCliOAuthErrorResponse,
  serializeCliOAuthTokenRequestBody,
  serializeCliOAuthTokenResponse,
  splitScope,
  validateCliOAuthAuthorizeRequest,
  validateCliRedirectUri,
  validatePkceCodeChallenge,
  validateScope,
  verifyPkceS256,
} from "../src/oauth.js";

describe("oauth contract", () => {
  it("normalizes scopes", () => {
    expect(normalizeScope("wallet:read  notifications:read  tools:read offline_access")).toBe(
      "notifications:read offline_access tools:read wallet:read"
    );
    expect(splitScope(" tools:read   wallet:read ")).toEqual(["tools:read", "wallet:read"]);
    expect(validateScope("wallet:read tools:read offline_access")).toBe(
      "offline_access tools:read wallet:read"
    );
    expect(validateScope("wallet:read notifications:read tools:read offline_access")).toBe(
      "notifications:read offline_access tools:read wallet:read"
    );
    expect(validateScope(CLI_OAUTH_WRITE_SCOPE)).toBe(CLI_OAUTH_WRITE_SCOPE);
    expect(validateScope(CLI_OAUTH_NOTIFICATIONS_WRITE_SCOPE)).toBe(CLI_OAUTH_NOTIFICATIONS_WRITE_SCOPE);
    expect(defaultCliScope()).toBe(CLI_OAUTH_DEFAULT_SCOPE);
    expect(hasScope(CLI_OAUTH_WRITE_SCOPE, "wallet:execute")).toBe(true);
    expect(hasScope(CLI_OAUTH_WRITE_SCOPE, "notifications:read")).toBe(false);
    expect(hasScope(CLI_OAUTH_NOTIFICATIONS_WRITE_SCOPE, "notifications:read")).toBe(true);
    expect(hasToolsWrite(CLI_OAUTH_WRITE_SCOPE)).toBe(true);
    expect(hasWalletExecute(CLI_OAUTH_WRITE_SCOPE)).toBe(true);
    expect(hasWriteToolCapability(CLI_OAUTH_WRITE_SCOPE)).toBe(true);
    expect(hasAnyWriteCapability("tools:write offline_access")).toBe(true);
    expect(() => validateScope("notifications:read tools:read offline_access")).toThrow(
      "scope must match one of the supported read/write bundles, with or without notifications:read"
    );
    expect(() => validateScope("wallet:read wallet:execute offline_access")).toThrow(
      "scope must match one of the supported read/write bundles, with or without notifications:read"
    );
  });

  it("validates redirect uri", () => {
    const redirect = validateCliRedirectUri("http://127.0.0.1:43111/auth/callback");
    expect(redirect).toBe("http://127.0.0.1:43111/auth/callback");
    expect(() => validateCliRedirectUri("https://127.0.0.1:43111/auth/callback")).toThrow(
      "redirect_uri must use http loopback transport"
    );
  });

  it("validates authorize request", () => {
    const parsed = validateCliOAuthAuthorizeRequest({
      responseType: "code",
      clientId: "cli",
      redirectUri: "http://127.0.0.1:43111/auth/callback",
      scope: CLI_OAUTH_NOTIFICATIONS_READ_SCOPE,
      codeChallenge: "a".repeat(43),
      codeChallengeMethod: "S256",
      state: "state1234",
      agentKey: "default",
      label: "my laptop",
      walletMode: "hosted",
    });

    expect(parsed.scope).toBe("notifications:read offline_access tools:read wallet:read");
    expect(parsed.walletMode).toBe("hosted");

    const writeParsed = validateCliOAuthAuthorizeRequest({
      responseType: "code",
      clientId: "cli",
      redirectUri: "http://127.0.0.1:43111/auth/callback",
      scope: CLI_OAUTH_NOTIFICATIONS_WRITE_SCOPE,
      codeChallenge: "a".repeat(43),
      codeChallengeMethod: "S256",
      state: "state1234",
      agentKey: "default",
    });

    expect(writeParsed.scope).toBe(CLI_OAUTH_NOTIFICATIONS_WRITE_SCOPE);
  });

  it("rejects invalid authorize payload fields", () => {
    expect(() =>
      validateCliOAuthAuthorizeRequest({
        responseType: "code",
        clientId: "cli",
        redirectUri: "http://127.0.0.1:43111/auth/callback",
        scope: CLI_OAUTH_NOTIFICATIONS_READ_SCOPE,
        codeChallenge: "a".repeat(43),
        codeChallengeMethod: "S256",
        state: "state1234",
        agentKey: "bad key",
      })
    ).toThrow("agent_key is invalid");

    expect(() =>
      validateCliOAuthAuthorizeRequest({
        responseType: "code",
        clientId: "cli",
        redirectUri: "http://127.0.0.1:43111/auth/callback",
        scope: CLI_OAUTH_NOTIFICATIONS_READ_SCOPE,
        codeChallenge: "a".repeat(43),
        codeChallengeMethod: "S256",
        state: "state1234",
        agentKey: "default",
        walletMode: "bad-mode",
      })
    ).toThrow("wallet_mode is invalid");
  });

  it("parses authorize query", () => {
    const search = new URLSearchParams({
      response_type: "code",
      client_id: "cli",
      redirect_uri: "http://127.0.0.1:43111/auth/callback",
      scope: CLI_OAUTH_NOTIFICATIONS_READ_SCOPE,
      code_challenge: "a".repeat(43),
      code_challenge_method: "S256",
      state: "state1234",
      agent_key: "default",
      wallet_mode: "hosted",
    });

    const result = parseCliOAuthAuthorizeQuery(search);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.walletMode).toBe("hosted");
    }
  });

  it("handles missing and invalid authorize query payloads", () => {
    const missing = parseCliOAuthAuthorizeQuery(new URLSearchParams());
    expect(missing).toEqual({
      ok: false,
      error:
        "Missing required OAuth parameters. Start setup again from the CLI so all PKCE values are included.",
    });

    const invalid = parseCliOAuthAuthorizeQuery(
      new URLSearchParams({
        response_type: "code",
        client_id: "cli",
        redirect_uri: "http://127.0.0.1:43111/auth/callback",
        scope: CLI_OAUTH_NOTIFICATIONS_READ_SCOPE,
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
    expect(() => validatePkceCodeChallenge(`${pair.codeChallenge}a`)).toThrow(
      "code_challenge must be a valid base64url PKCE challenge"
    );
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

  it("parses and serializes oauth authorize-code request/response bodies", () => {
    const parsedRequest = parseCliOAuthAuthorizeCodeRequestBody({
      client_id: "cli",
      redirect_uri: "http://127.0.0.1:43111/auth/callback",
      scope: "wallet:read tools:read offline_access",
      code_challenge: "a".repeat(43),
      code_challenge_method: "S256",
      state: "state1234",
      agent_key: "default",
      label: "  my laptop  ",
    });

    expect(parsedRequest).toEqual({
      clientId: "cli",
      redirectUri: "http://127.0.0.1:43111/auth/callback",
      scope: "offline_access tools:read wallet:read",
      codeChallenge: "a".repeat(43),
      codeChallengeMethod: "S256",
      state: "state1234",
      agentKey: "default",
      label: "my laptop",
    });

    expect(serializeCliOAuthAuthorizeCodeRequestBody(parsedRequest)).toEqual({
      client_id: "cli",
      redirect_uri: "http://127.0.0.1:43111/auth/callback",
      scope: "offline_access tools:read wallet:read",
      code_challenge: "a".repeat(43),
      code_challenge_method: "S256",
      state: "state1234",
      agent_key: "default",
      label: "my laptop",
    });

    const parsedResponse = parseCliOAuthAuthorizeCodeResponse({
      code: "auth-code-1",
      state: "state1234",
      redirect_uri: "http://127.0.0.1:43111/auth/callback",
      expires_in: 60,
    });

    expect(parsedResponse).toEqual({
      code: "auth-code-1",
      state: "state1234",
      redirectUri: "http://127.0.0.1:43111/auth/callback",
      expiresIn: 60,
    });
    expect(serializeCliOAuthAuthorizeCodeResponse(parsedResponse)).toEqual({
      code: "auth-code-1",
      state: "state1234",
      redirect_uri: "http://127.0.0.1:43111/auth/callback",
      expires_in: 60,
    });
  });

  it("parses and serializes oauth token success/error payloads", () => {
    const parsedRequest = parseCliOAuthTokenRequestBody({
      grant_type: "authorization_code",
      client_id: "cli",
      code: "auth-code-1",
      redirect_uri: "http://127.0.0.1:43111/auth/callback",
      code_verifier: "a".repeat(43),
    });

    expect(parsedRequest).toEqual({
      grantType: "authorization_code",
      clientId: "cli",
      code: "auth-code-1",
      redirectUri: "http://127.0.0.1:43111/auth/callback",
      codeVerifier: "a".repeat(43),
    });
    expect(serializeCliOAuthTokenRequestBody(parsedRequest)).toEqual({
      grant_type: "authorization_code",
      client_id: "cli",
      code: "auth-code-1",
      redirect_uri: "http://127.0.0.1:43111/auth/callback",
      code_verifier: "a".repeat(43),
    });

    const parsedSuccess = parseCliOAuthTokenResponse({
      token_type: "Bearer",
      access_token: "access",
      expires_in: 600,
      refresh_token: "refresh",
      scope: CLI_OAUTH_WRITE_SCOPE,
      session_id: "session-1",
      can_write: true,
    });

    expect(parsedSuccess).toEqual({
      tokenType: "Bearer",
      accessToken: "access",
      expiresIn: 600,
      refreshToken: "refresh",
      scope: CLI_OAUTH_WRITE_SCOPE,
      sessionId: "session-1",
      canWrite: true,
    });
    expect(
      serializeCliOAuthTokenResponse({
        accessToken: "access",
        expiresIn: 600,
        refreshToken: "refresh",
        scope: CLI_OAUTH_WRITE_SCOPE,
        sessionId: "session-1",
      })
    ).toEqual({
      token_type: "Bearer",
      access_token: "access",
      expires_in: 600,
      refresh_token: "refresh",
      scope: CLI_OAUTH_WRITE_SCOPE,
      session_id: "session-1",
      can_write: true,
    });

    const parsedError = parseCliOAuthErrorResponse({
      error: "invalid_grant",
      error_description: "Refresh token is invalid or expired",
    });

    expect(parsedError).toEqual({
      error: "invalid_grant",
      errorDescription: "Refresh token is invalid or expired",
    });
    expect(serializeCliOAuthErrorResponse(parsedError)).toEqual({
      error: "invalid_grant",
      error_description: "Refresh token is invalid or expired",
    });
    expect(readCliOAuthErrorResponse({ nope: true })).toBeNull();
  });

  it("rejects malformed strict oauth payloads", () => {
    expect(() =>
      parseCliOAuthAuthorizeCodeRequestBody({
        client_id: "cli",
        redirect_uri: "http://127.0.0.1:43111/auth/callback",
        scope: CLI_OAUTH_DEFAULT_SCOPE,
        code_challenge: "a".repeat(43),
        code_challenge_method: "S256",
        state: "state1234",
        agent_key: "default",
        extra: true,
      })
    ).toThrow('OAuth authorize request includes unsupported field "extra"');

    expect(() =>
      parseCliOAuthAuthorizeCodeResponse({
        code: "auth-code-1",
        redirect_uri: "http://127.0.0.1:43111/auth/callback",
        expires_in: 60,
      })
    ).toThrow("OAuth authorize response did not include state.");

    expect(() =>
      parseCliOAuthTokenResponse({
        token_type: "Bearer",
        access_token: "access",
        expires_in: 600,
        refresh_token: "refresh",
        scope: CLI_OAUTH_DEFAULT_SCOPE,
        can_write: false,
      })
    ).toThrow("OAuth token response did not include session_id.");
  });
});
