const LOOPBACK_HOSTS = new Set(["127.0.0.1", "localhost", "::1", "[::1]"]);
const AGENT_KEY_PATTERN = /^[A-Za-z0-9._-]{1,64}$/;
const PKCE_VERIFIER_PATTERN = /^[A-Za-z0-9._~-]{43,128}$/;
const PKCE_CHALLENGE_PATTERN = /^[A-Za-z0-9_-]{43}$/;
const STATE_PATTERN = /^[A-Za-z0-9._~-]{8,512}$/;
const LABEL_PATTERN = /^[A-Za-z0-9 ._()-]{1,128}$/;

export const CLI_OAUTH_PUBLIC_CLIENT_ID = "cli";
export const CLI_OAUTH_RESPONSE_TYPE = "code";
export const CLI_OAUTH_REDIRECT_PATH = "/auth/callback";

export const CLI_OAUTH_SUPPORTED_SCOPES = [
  "tools:read",
  "tools:write",
  "notifications:read",
  "wallet:read",
  "wallet:execute",
  "offline_access",
] as const;

export const CLI_OAUTH_REQUIRED_SCOPES = ["offline_access"] as const;

export type CliOAuthScope = (typeof CLI_OAUTH_SUPPORTED_SCOPES)[number];

export const CLI_OAUTH_DEFAULT_SCOPES = [
  "offline_access",
  "tools:read",
  "wallet:read",
] as const satisfies readonly CliOAuthScope[];

export const CLI_OAUTH_WRITE_SCOPES = [
  "offline_access",
  "tools:read",
  "tools:write",
  "wallet:execute",
  "wallet:read",
] as const satisfies readonly CliOAuthScope[];

export const CLI_OAUTH_NOTIFICATIONS_READ_SCOPES = [
  "notifications:read",
  "offline_access",
  "tools:read",
  "wallet:read",
] as const satisfies readonly CliOAuthScope[];

export const CLI_OAUTH_NOTIFICATIONS_WRITE_SCOPES = [
  "notifications:read",
  "offline_access",
  "tools:read",
  "tools:write",
  "wallet:execute",
  "wallet:read",
] as const satisfies readonly CliOAuthScope[];

export const CLI_SETUP_WALLET_MODES = ["hosted", "local-generate", "local-key", "skip"] as const;

export const CLI_OAUTH_DEFAULT_SCOPE = CLI_OAUTH_DEFAULT_SCOPES.join(" ");
export const CLI_OAUTH_WRITE_SCOPE = CLI_OAUTH_WRITE_SCOPES.join(" ");
export const CLI_OAUTH_NOTIFICATIONS_READ_SCOPE = CLI_OAUTH_NOTIFICATIONS_READ_SCOPES.join(" ");
export const CLI_OAUTH_NOTIFICATIONS_WRITE_SCOPE = CLI_OAUTH_NOTIFICATIONS_WRITE_SCOPES.join(" ");

const supportedScopeSet = new Set<string>(CLI_OAUTH_SUPPORTED_SCOPES);
const allowedScopeBundles = new Set<string>([
  normalizeScope(CLI_OAUTH_DEFAULT_SCOPE),
  normalizeScope(CLI_OAUTH_WRITE_SCOPE),
  normalizeScope(CLI_OAUTH_NOTIFICATIONS_READ_SCOPE),
  normalizeScope(CLI_OAUTH_NOTIFICATIONS_WRITE_SCOPE),
]);
export type CliSetupWalletModeHint = (typeof CLI_SETUP_WALLET_MODES)[number];

type SearchParamReader = Pick<URLSearchParams, "get">;

export type CliOAuthAuthorizeRequest = {
  responseType: typeof CLI_OAUTH_RESPONSE_TYPE;
  clientId: string;
  redirectUri: string;
  scope: string;
  scopes: string[];
  codeChallenge: string;
  codeChallengeMethod: "S256";
  state: string;
  agentKey: string;
  label?: string;
  walletMode?: CliSetupWalletModeHint;
};

export type CliOAuthAuthorizeParseResult =
  | { ok: true; value: CliOAuthAuthorizeRequest }
  | { ok: false; error: string };

export function splitScope(scope: string): string[] {
  return scope
    .split(/\s+/)
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

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

  for (const required of CLI_OAUTH_REQUIRED_SCOPES) {
    if (!parsed.includes(required)) {
      throw new Error(`scope must include ${required}`);
    }
  }

  const normalized = parsed.sort().join(" ");
  if (!allowedScopeBundles.has(normalized)) {
    throw new Error(
      "scope must match one of the supported read/write bundles, with or without notifications:read"
    );
  }

  return normalized;
}

export function hasScope(scope: string, required: string): boolean {
  return splitScope(scope).includes(required);
}

export function hasToolsWrite(scope: string): boolean {
  return hasScope(scope, "tools:write");
}

export function hasWalletExecute(scope: string): boolean {
  return hasScope(scope, "wallet:execute");
}

export function hasWriteToolCapability(scope: string): boolean {
  return hasToolsWrite(scope) && hasWalletExecute(scope);
}

export function hasAnyWriteCapability(scope: string): boolean {
  return hasToolsWrite(scope) || hasWalletExecute(scope);
}

export function defaultCliScope(): string {
  return CLI_OAUTH_DEFAULT_SCOPE;
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
  if (parsed.pathname !== CLI_OAUTH_REDIRECT_PATH) {
    throw new Error(`redirect_uri path must be ${CLI_OAUTH_REDIRECT_PATH}`);
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
  const normalizedScope = validateScope(scope);
  return { normalizedScope, scopes: splitScope(normalizedScope) };
}

export function validateCliOAuthAuthorizeRequest(input: {
  responseType: string;
  clientId: string;
  redirectUri: string;
  scope: string;
  codeChallenge: string;
  codeChallengeMethod: string;
  state: string;
  agentKey: string;
  label?: string;
  walletMode?: string;
}): CliOAuthAuthorizeRequest {
  if (input.responseType !== CLI_OAUTH_RESPONSE_TYPE) {
    throw new Error("response_type must be code");
  }
  if (input.clientId !== CLI_OAUTH_PUBLIC_CLIENT_ID) {
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
  const walletMode = input.walletMode?.trim();
  if (walletMode && !CLI_SETUP_WALLET_MODES.includes(walletMode as CliSetupWalletModeHint)) {
    throw new Error("wallet_mode is invalid");
  }

  return {
    responseType: CLI_OAUTH_RESPONSE_TYPE,
    clientId: CLI_OAUTH_PUBLIC_CLIENT_ID,
    redirectUri,
    scope: normalizedScope,
    scopes,
    codeChallenge,
    codeChallengeMethod: "S256",
    state,
    agentKey,
    ...(label ? { label } : {}),
    ...(walletMode ? { walletMode: walletMode as CliSetupWalletModeHint } : {}),
  };
}

export function parseCliOAuthAuthorizeQuery(
  searchParams: SearchParamReader
): CliOAuthAuthorizeParseResult {
  const responseType = searchParams.get("response_type");
  const clientId = searchParams.get("client_id");
  const redirectUri = searchParams.get("redirect_uri");
  const scope = searchParams.get("scope");
  const codeChallenge = searchParams.get("code_challenge");
  const codeChallengeMethod = searchParams.get("code_challenge_method");
  const state = searchParams.get("state");
  const agentKey = searchParams.get("agent_key");
  const label = searchParams.get("label") ?? undefined;
  const walletMode = searchParams.get("wallet_mode") ?? undefined;

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
    const value = validateCliOAuthAuthorizeRequest({
      responseType,
      clientId,
      redirectUri,
      scope,
      codeChallenge,
      codeChallengeMethod,
      state,
      agentKey,
      ...(label ? { label } : {}),
      ...(walletMode ? { walletMode } : {}),
    });
    return { ok: true, value };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Invalid OAuth authorization request",
    };
  }
}

type JsonRecord = Record<string, unknown>;

export type CliOAuthAuthorizeCodeRequestBody = {
  clientId: string;
  redirectUri: string;
  scope: string;
  codeChallenge: string;
  codeChallengeMethod: "S256";
  state: string;
  agentKey: string;
  label?: string;
};

export type CliOAuthAuthorizeCodeResponse = {
  code: string;
  state: string;
  redirectUri: string;
  expiresIn: number;
};

export type CliOAuthTokenRequestBody = {
  grantType: string;
  clientId: string;
  code?: string;
  redirectUri?: string;
  codeVerifier?: string;
  refreshToken?: string;
};

export type CliOAuthTokenResponse = {
  tokenType: "Bearer";
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  scope: string;
  sessionId: string;
  canWrite: boolean;
};

export type CliOAuthErrorResponse = {
  error: string;
  errorDescription: string;
};

export const cliOAuthAuthorizeCodeRequestBodyJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "client_id",
    "redirect_uri",
    "scope",
    "code_challenge",
    "code_challenge_method",
    "state",
    "agent_key",
  ],
  properties: {
    client_id: { type: "string", minLength: 1, maxLength: 64 },
    redirect_uri: { type: "string", minLength: 1, maxLength: 2048 },
    scope: { type: "string", minLength: 1, maxLength: 1024 },
    code_challenge: { type: "string", minLength: 43, maxLength: 128 },
    code_challenge_method: { type: "string", minLength: 1, maxLength: 16 },
    state: { type: "string", minLength: 8, maxLength: 512 },
    agent_key: { type: "string", minLength: 1, maxLength: 64, pattern: "^[A-Za-z0-9._-]+$" },
    label: { type: "string", minLength: 1, maxLength: 128, pattern: "^[A-Za-z0-9 ._()\\-]+$" },
  },
} as const;

export const cliOAuthTokenRequestBodyJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["grant_type", "client_id"],
  properties: {
    grant_type: { type: "string", minLength: 1, maxLength: 64 },
    client_id: { type: "string", minLength: 1, maxLength: 64 },
    code: { type: "string", minLength: 1, maxLength: 512 },
    redirect_uri: { type: "string", minLength: 1, maxLength: 2048 },
    code_verifier: { type: "string", minLength: 43, maxLength: 128 },
    refresh_token: { type: "string", minLength: 1, maxLength: 1024 },
  },
} as const;

function asJsonRecord(input: unknown, errorMessage: string): JsonRecord {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new Error(errorMessage);
  }

  return input as JsonRecord;
}

function assertKnownKeys(record: JsonRecord, allowedKeys: readonly string[], label: string): void {
  const allowed = new Set(allowedKeys);
  for (const key of Object.keys(record)) {
    if (!allowed.has(key)) {
      throw new Error(`${label} includes unsupported field "${key}"`);
    }
  }
}

function parseRequiredStringField(
  record: JsonRecord,
  key: string,
  options: {
    maxLength: number;
    requiredMessage: string;
  }
): string {
  const value = record[key];
  if (typeof value !== "string") {
    throw new Error(options.requiredMessage);
  }

  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(options.requiredMessage);
  }
  if (trimmed.length > options.maxLength) {
    throw new Error(`${key} must be at most ${options.maxLength} characters`);
  }

  return trimmed;
}

function parseOptionalStringField(
  record: JsonRecord,
  key: string,
  options: {
    maxLength: number;
  }
): string | undefined {
  const value = record[key];
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== "string") {
    throw new Error(`${key} must be a string`);
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  if (trimmed.length > options.maxLength) {
    throw new Error(`${key} must be at most ${options.maxLength} characters`);
  }

  return trimmed;
}

function parseRequiredBooleanField(record: JsonRecord, key: string): boolean {
  if (typeof record[key] !== "boolean") {
    throw new Error(`${key} must be a boolean`);
  }

  return record[key] as boolean;
}

function parseIntegerField(
  value: unknown,
  key: string,
  options: {
    allowZero?: boolean;
  } = {}
): number {
  if (typeof value !== "number" || !Number.isInteger(value)) {
    throw new Error(`${key} must be an integer`);
  }
  if (options.allowZero ? value < 0 : value <= 0) {
    throw new Error(`${key} must be ${options.allowZero ? "zero or greater" : "greater than zero"}`);
  }

  return value;
}

export function parseCliOAuthAuthorizeCodeRequestBody(
  input: unknown
): CliOAuthAuthorizeCodeRequestBody {
  const record = asJsonRecord(input, "OAuth authorize request must be a JSON object.");
  assertKnownKeys(record, [
    "client_id",
    "redirect_uri",
    "scope",
    "code_challenge",
    "code_challenge_method",
    "state",
    "agent_key",
    "label",
  ], "OAuth authorize request");

  const clientId = parseRequiredStringField(record, "client_id", {
    maxLength: 64,
    requiredMessage: "client_id is required",
  });
  const redirectUri = validateCliRedirectUri(
    parseRequiredStringField(record, "redirect_uri", {
      maxLength: 2048,
      requiredMessage: "redirect_uri is required",
    })
  );
  const scope = validateScope(
    parseRequiredStringField(record, "scope", {
      maxLength: 1024,
      requiredMessage: "scope is required",
    })
  );
  const codeChallenge = validatePkceCodeChallenge(
    parseRequiredStringField(record, "code_challenge", {
      maxLength: 128,
      requiredMessage: "code_challenge is required",
    })
  );
  const codeChallengeMethod = parseRequiredStringField(record, "code_challenge_method", {
    maxLength: 16,
    requiredMessage: "code_challenge_method is required",
  });
  if (codeChallengeMethod !== "S256") {
    throw new Error("code_challenge_method must be S256");
  }

  const state = parseRequiredStringField(record, "state", {
    maxLength: 512,
    requiredMessage: "state is required",
  });
  if (!STATE_PATTERN.test(state)) {
    throw new Error("state is invalid");
  }

  const agentKey = parseRequiredStringField(record, "agent_key", {
    maxLength: 64,
    requiredMessage: "agent_key is required",
  });
  if (!AGENT_KEY_PATTERN.test(agentKey)) {
    throw new Error("agent_key contains unsupported characters");
  }

  const label = normalizeCliSessionLabel(
    parseOptionalStringField(record, "label", {
      maxLength: 128,
    })
  );

  return {
    clientId,
    redirectUri,
    scope,
    codeChallenge,
    codeChallengeMethod: "S256",
    state,
    agentKey,
    ...(label ? { label } : {}),
  };
}

export function serializeCliOAuthAuthorizeCodeRequestBody(
  input: Pick<
    CliOAuthAuthorizeCodeRequestBody,
    "clientId" | "redirectUri" | "scope" | "codeChallenge" | "codeChallengeMethod" | "state" | "agentKey" | "label"
  >
): Record<string, unknown> {
  return {
    client_id: input.clientId,
    redirect_uri: input.redirectUri,
    scope: input.scope,
    code_challenge: input.codeChallenge,
    code_challenge_method: input.codeChallengeMethod,
    state: input.state,
    agent_key: input.agentKey,
    ...(input.label ? { label: input.label } : {}),
  };
}

export function parseCliOAuthAuthorizeCodeResponse(
  input: unknown
): CliOAuthAuthorizeCodeResponse {
  const record = asJsonRecord(input, "OAuth authorize response was not valid JSON.");
  assertKnownKeys(record, ["code", "state", "redirect_uri", "expires_in"], "OAuth authorize response");

  return {
    code: parseRequiredStringField(record, "code", {
      maxLength: 512,
      requiredMessage: "OAuth authorize response did not include code.",
    }),
    state: parseRequiredStringField(record, "state", {
      maxLength: 512,
      requiredMessage: "OAuth authorize response did not include state.",
    }),
    redirectUri: validateCliRedirectUri(
      parseRequiredStringField(record, "redirect_uri", {
        maxLength: 2048,
        requiredMessage: "OAuth authorize response did not include redirect_uri.",
      })
    ),
    expiresIn: parseIntegerField(record.expires_in, "expires_in", { allowZero: true }),
  };
}

export function serializeCliOAuthAuthorizeCodeResponse(
  input: CliOAuthAuthorizeCodeResponse
): Record<string, unknown> {
  return {
    code: input.code,
    state: input.state,
    redirect_uri: input.redirectUri,
    expires_in: input.expiresIn,
  };
}

export function parseCliOAuthTokenRequestBody(input: unknown): CliOAuthTokenRequestBody {
  const record = asJsonRecord(input, "OAuth token request must be a JSON object.");
  assertKnownKeys(record, [
    "grant_type",
    "client_id",
    "code",
    "redirect_uri",
    "code_verifier",
    "refresh_token",
  ], "OAuth token request");

  const grantType = parseRequiredStringField(record, "grant_type", {
    maxLength: 64,
    requiredMessage: "grant_type is required",
  });
  const clientId = parseRequiredStringField(record, "client_id", {
    maxLength: 64,
    requiredMessage: "client_id is required",
  });
  const code = parseOptionalStringField(record, "code", {
    maxLength: 512,
  });
  const redirectUriRaw = parseOptionalStringField(record, "redirect_uri", {
    maxLength: 2048,
  });
  const codeVerifierRaw = parseOptionalStringField(record, "code_verifier", {
    maxLength: 128,
  });
  const refreshToken = parseOptionalStringField(record, "refresh_token", {
    maxLength: 1024,
  });

  return {
    grantType,
    clientId,
    ...(code ? { code } : {}),
    ...(redirectUriRaw ? { redirectUri: validateCliRedirectUri(redirectUriRaw) } : {}),
    ...(codeVerifierRaw ? { codeVerifier: validatePkceCodeVerifier(codeVerifierRaw) } : {}),
    ...(refreshToken ? { refreshToken } : {}),
  };
}

export function serializeCliOAuthTokenRequestBody(
  input: CliOAuthTokenRequestBody
): Record<string, unknown> {
  return {
    grant_type: input.grantType,
    client_id: input.clientId,
    ...(input.code ? { code: input.code } : {}),
    ...(input.redirectUri ? { redirect_uri: input.redirectUri } : {}),
    ...(input.codeVerifier ? { code_verifier: input.codeVerifier } : {}),
    ...(input.refreshToken ? { refresh_token: input.refreshToken } : {}),
  };
}

export function parseCliOAuthTokenResponse(input: unknown): CliOAuthTokenResponse {
  const record = asJsonRecord(input, "OAuth token response was not valid JSON.");
  assertKnownKeys(record, [
    "token_type",
    "access_token",
    "expires_in",
    "refresh_token",
    "scope",
    "session_id",
    "can_write",
  ], "OAuth token response");

  const tokenType = parseRequiredStringField(record, "token_type", {
    maxLength: 32,
    requiredMessage: "OAuth token response did not include token_type.",
  });
  if (tokenType !== "Bearer") {
    throw new Error("OAuth token response did not include token_type Bearer.");
  }

  return {
    tokenType: "Bearer",
    accessToken: parseRequiredStringField(record, "access_token", {
      maxLength: 8192,
      requiredMessage: "OAuth token response did not include access_token.",
    }),
    expiresIn: parseIntegerField(record.expires_in, "expires_in"),
    refreshToken: parseRequiredStringField(record, "refresh_token", {
      maxLength: 8192,
      requiredMessage: "OAuth token response did not include refresh_token.",
    }),
    scope: parseRequiredStringField(record, "scope", {
      maxLength: 1024,
      requiredMessage: "OAuth token response did not include scope.",
    }),
    sessionId: parseRequiredStringField(record, "session_id", {
      maxLength: 256,
      requiredMessage: "OAuth token response did not include session_id.",
    }),
    canWrite: parseRequiredBooleanField(record, "can_write"),
  };
}

export function serializeCliOAuthTokenResponse(input: {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  scope: string;
  sessionId: string;
  canWrite?: boolean;
}): Record<string, unknown> {
  return {
    token_type: "Bearer",
    access_token: input.accessToken,
    expires_in: input.expiresIn,
    refresh_token: input.refreshToken,
    scope: input.scope,
    session_id: input.sessionId,
    can_write: input.canWrite ?? hasAnyWriteCapability(input.scope),
  };
}

export function parseCliOAuthErrorResponse(input: unknown): CliOAuthErrorResponse {
  const record = asJsonRecord(input, "OAuth error response was not valid JSON.");
  assertKnownKeys(record, ["error", "error_description"], "OAuth error response");

  return {
    error: parseRequiredStringField(record, "error", {
      maxLength: 256,
      requiredMessage: "OAuth error response did not include error.",
    }),
    errorDescription: parseRequiredStringField(record, "error_description", {
      maxLength: 2048,
      requiredMessage: "OAuth error response did not include error_description.",
    }),
  };
}

export function readCliOAuthErrorResponse(input: unknown): CliOAuthErrorResponse | null {
  try {
    return parseCliOAuthErrorResponse(input);
  } catch {
    return null;
  }
}

export function serializeCliOAuthErrorResponse(
  input: CliOAuthErrorResponse
): Record<string, unknown> {
  return {
    error: input.error,
    error_description: input.errorDescription,
  };
}
