const LOOPBACK_HOSTS = new Set(["127.0.0.1", "localhost", "::1", "[::1]"]);
const AGENT_KEY_PATTERN = /^[A-Za-z0-9._-]{1,64}$/;
const PKCE_VERIFIER_PATTERN = /^[A-Za-z0-9._~-]{43,128}$/;
const PKCE_CHALLENGE_PATTERN = /^[A-Za-z0-9_-]{43,128}$/;
const STATE_PATTERN = /^[A-Za-z0-9._~-]{8,512}$/;
const LABEL_PATTERN = /^[A-Za-z0-9 ._()-]{1,128}$/;

export const OAUTH_PUBLIC_CLIENT_ID = "buildbot_cli";
export const OAUTH_CLIENT_ID = OAUTH_PUBLIC_CLIENT_ID;
export const OAUTH_RESPONSE_TYPE = "code";
export const OAUTH_REDIRECT_PATH = "/auth/callback";

export const OAUTH_SUPPORTED_SCOPES = [
  "tools:read",
  "tools:write",
  "wallet:read",
  "wallet:execute",
  "offline_access",
] as const;

export const OAUTH_REQUIRED_SCOPES = ["offline_access"] as const;

export const OAUTH_DEFAULT_SCOPE = ["tools:read", "wallet:read", "offline_access"].join(" ");

export const OAUTH_WRITE_SCOPE = [
  "tools:read",
  "tools:write",
  "wallet:read",
  "wallet:execute",
  "offline_access",
].join(" ");

export const CLI_SETUP_PAYER_MODES = ["hosted", "local-generate", "local-key", "skip"] as const;

export const CLI_OAUTH_PUBLIC_CLIENT_ID = OAUTH_PUBLIC_CLIENT_ID;
export const CLI_OAUTH_RESPONSE_TYPE = OAUTH_RESPONSE_TYPE;
export const CLI_OAUTH_REDIRECT_PATH = OAUTH_REDIRECT_PATH;
export const CLI_OAUTH_SUPPORTED_SCOPES = OAUTH_SUPPORTED_SCOPES;
export const CLI_OAUTH_REQUIRED_SCOPES = OAUTH_REQUIRED_SCOPES;

const supportedScopeSet = new Set<string>(OAUTH_SUPPORTED_SCOPES);

export type CliOAuthScope = (typeof OAUTH_SUPPORTED_SCOPES)[number];
export type CliSetupPayerModeHint = (typeof CLI_SETUP_PAYER_MODES)[number];

type SearchParamReader = Pick<URLSearchParams, "get">;

export type CliAuthorizeRequest = {
  responseType: "code";
  clientId: string;
  redirectUri: string;
  scope: string;
  scopes: string[];
  codeChallenge: string;
  codeChallengeMethod: "S256";
  state: string;
  agentKey: string;
  label?: string;
  payerMode?: CliSetupPayerModeHint;
};

export type CliAuthorizeParseResult =
  | { ok: true; value: CliAuthorizeRequest }
  | { ok: false; error: string };

export type CliOauthAuthorizeRequest = CliAuthorizeRequest;
export type CliOauthAuthorizeParseResult = CliAuthorizeParseResult;

export function splitScope(scope: string): string[] {
  return scope
    .split(/\s+/)
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

export const parseScopeString = splitScope;

export function normalizeScope(scope: string): string {
  return Array.from(new Set(splitScope(scope))).sort().join(" ");
}

export function validateScope(scope: string): string {
  const parsed = Array.from(new Set(splitScope(scope)));
  if (parsed.length === 0) {
    throw new Error("scope must include at least one entry");
  }

  for (const value of parsed) {
    if (!supportedScopeSet.has(value)) {
      throw new Error(`Unsupported scope: ${value}`);
    }
  }

  for (const required of OAUTH_REQUIRED_SCOPES) {
    if (!parsed.includes(required)) {
      throw new Error(`scope must include ${required}`);
    }
  }

  return parsed.sort().join(" ");
}

export function hasScope(scope: string, required: string): boolean {
  return splitScope(scope).includes(required);
}

export function canWriteFromScope(scope: string): boolean {
  const parsed = splitScope(scope);
  return parsed.includes("tools:write") && parsed.includes("wallet:execute");
}

export function defaultCliScope(): string {
  return OAUTH_DEFAULT_SCOPE;
}

export function validatePkceCodeChallenge(value: string): string {
  const trimmed = value.trim();
  if (!PKCE_CHALLENGE_PATTERN.test(trimmed)) {
    throw new Error("code_challenge must be a valid base64url PKCE challenge");
  }
  return trimmed;
}

export function validatePkceCodeVerifier(value: string): string {
  const trimmed = value.trim();
  if (!PKCE_VERIFIER_PATTERN.test(trimmed)) {
    throw new Error("code_verifier must meet PKCE RFC7636 requirements");
  }
  return trimmed;
}

function toBase64Url(bytes: Uint8Array): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes).toString("base64url");
  }

  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function randomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  globalThis.crypto.getRandomValues(bytes);
  return bytes;
}

export async function deriveS256CodeChallenge(codeVerifier: string): Promise<string> {
  const verifier = validatePkceCodeVerifier(codeVerifier);
  const bytes = new TextEncoder().encode(verifier);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return toBase64Url(new Uint8Array(digest));
}

export async function verifyPkceS256(params: {
  codeVerifier: string;
  codeChallenge: string;
}): Promise<boolean> {
  const expectedChallenge = await deriveS256CodeChallenge(params.codeVerifier);
  return expectedChallenge === params.codeChallenge;
}

export function createPkceVerifier(): string {
  const verifier = toBase64Url(randomBytes(32));
  return validatePkceCodeVerifier(verifier);
}

export async function createPkcePair(): Promise<{ codeVerifier: string; codeChallenge: string }> {
  const codeVerifier = createPkceVerifier();
  const codeChallenge = await deriveS256CodeChallenge(codeVerifier);
  return { codeVerifier, codeChallenge };
}

export function validateCliRedirectUri(rawRedirectUri: string): string {
  let parsed: URL;
  try {
    parsed = new URL(rawRedirectUri);
  } catch {
    throw new Error("redirect_uri must be an absolute URL");
  }

  if (parsed.protocol !== "http:") {
    throw new Error("redirect_uri must use http loopback transport");
  }
  if (parsed.username || parsed.password) {
    throw new Error("redirect_uri must not include credentials");
  }
  if (!LOOPBACK_HOSTS.has(parsed.hostname.toLowerCase())) {
    throw new Error("redirect_uri must use a loopback host");
  }
  if (!parsed.port) {
    throw new Error("redirect_uri must include an explicit port");
  }
  if (parsed.search || parsed.hash) {
    throw new Error("redirect_uri must not include query params or fragments");
  }
  if (parsed.pathname !== OAUTH_REDIRECT_PATH) {
    throw new Error(`redirect_uri path must be ${OAUTH_REDIRECT_PATH}`);
  }

  return parsed.toString();
}

export function normalizeCliSessionLabel(rawLabel: string | undefined): string | undefined {
  if (rawLabel === undefined) {
    return undefined;
  }

  const normalized = rawLabel.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return undefined;
  }
  if (!LABEL_PATTERN.test(normalized)) {
    throw new Error("label contains unsupported characters");
  }
  return normalized;
}

function parseScopeForAuthorize(scope: string): { normalizedScope: string; scopes: string[] } {
  const entries = Array.from(new Set(splitScope(scope))).sort();
  if (entries.length === 0) {
    throw new Error("scope is required");
  }
  for (const entry of entries) {
    if (!supportedScopeSet.has(entry)) {
      throw new Error(`Unsupported scope: ${entry}`);
    }
  }
  for (const required of OAUTH_REQUIRED_SCOPES) {
    if (!entries.includes(required)) {
      throw new Error(`scope must include ${required}`);
    }
  }
  return { normalizedScope: entries.join(" "), scopes: entries };
}

export function validateCliAuthorizeRequest(input: {
  responseType: string;
  clientId: string;
  redirectUri: string;
  scope: string;
  codeChallenge: string;
  codeChallengeMethod: string;
  state: string;
  agentKey: string;
  label?: string;
  payerMode?: string;
}): CliAuthorizeRequest {
  if (input.responseType !== OAUTH_RESPONSE_TYPE) {
    throw new Error("response_type must be code");
  }
  if (input.clientId !== OAUTH_PUBLIC_CLIENT_ID) {
    throw new Error("Unsupported client_id");
  }

  const redirectUri = validateCliRedirectUri(input.redirectUri.trim());
  const { normalizedScope, scopes } = parseScopeForAuthorize(input.scope.trim());
  const codeChallenge = validatePkceCodeChallenge(input.codeChallenge);

  if (input.codeChallengeMethod !== "S256") {
    throw new Error("code_challenge_method must be S256");
  }

  const state = input.state.trim();
  if (!STATE_PATTERN.test(state)) {
    throw new Error("state is invalid");
  }

  const agentKey = input.agentKey.trim();
  if (!AGENT_KEY_PATTERN.test(agentKey)) {
    throw new Error("agent_key is invalid");
  }

  const label = normalizeCliSessionLabel(input.label);
  const payerMode = input.payerMode?.trim();
  if (payerMode && !CLI_SETUP_PAYER_MODES.includes(payerMode as CliSetupPayerModeHint)) {
    throw new Error("payer_mode is invalid");
  }

  return {
    responseType: OAUTH_RESPONSE_TYPE,
    clientId: OAUTH_PUBLIC_CLIENT_ID,
    redirectUri,
    scope: normalizedScope,
    scopes,
    codeChallenge,
    codeChallengeMethod: "S256",
    state,
    agentKey,
    ...(label ? { label } : {}),
    ...(payerMode ? { payerMode: payerMode as CliSetupPayerModeHint } : {}),
  };
}

export const validateCliOauthAuthorizeRequest = validateCliAuthorizeRequest;

export function parseCliAuthorizeQuery(searchParams: SearchParamReader): CliAuthorizeParseResult {
  const responseType = searchParams.get("response_type");
  const clientId = searchParams.get("client_id");
  const redirectUri = searchParams.get("redirect_uri");
  const scope = searchParams.get("scope");
  const codeChallenge = searchParams.get("code_challenge");
  const codeChallengeMethod = searchParams.get("code_challenge_method");
  const state = searchParams.get("state");
  const agentKey = searchParams.get("agent_key");
  const label = searchParams.get("label") ?? undefined;
  const payerMode = searchParams.get("payer_mode") ?? undefined;

  if (
    !responseType ||
    !clientId ||
    !redirectUri ||
    !scope ||
    !codeChallenge ||
    !codeChallengeMethod ||
    !state ||
    !agentKey
  ) {
    return {
      ok: false,
      error:
        "Missing required OAuth parameters. Start setup again from the CLI so all PKCE values are included.",
    };
  }

  try {
    const value = validateCliAuthorizeRequest({
      responseType,
      clientId,
      redirectUri,
      scope,
      codeChallenge,
      codeChallengeMethod,
      state,
      agentKey,
      ...(label ? { label } : {}),
      ...(payerMode ? { payerMode } : {}),
    });
    return { ok: true, value };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Invalid OAuth authorization request",
    };
  }
}

export const parseCliOauthAuthorizeQuery = parseCliAuthorizeQuery;
