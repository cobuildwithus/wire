import {
  hasAnyWriteCapability,
  hasToolsWrite,
  hasWalletExecute,
  splitScope,
} from "./oauth.js";
import { parseEvmAddress, type EvmAddress } from "./evm.js";

export type CliJwtClaims = {
  sub: string;
  sid: string;
  agentKey: string;
  scope: string;
};

export type CliJwtVerifiedClaims = CliJwtClaims & {
  iat: number;
  exp: number;
  iss: string;
  aud: string | string[];
};

export type CliJwtPayloadClaims = {
  sub: string;
  sid: string;
  agent_key: string;
  scope: string;
};

export type CliAccessTokenClaims = CliJwtClaims;
export type VerifiedCliAccessTokenClaims = CliJwtVerifiedClaims;

export const DEFAULT_DEV_CLI_JWT_PUBLIC_KEY = [
  "-----BEGIN PUBLIC KEY-----",
  "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEJez1f0LBeC5VJfNUE7v3bEwk79JO",
  "itJMKsbBgPEGjEsgKKnjHceciarnRNwVlwSj7Xx7j8gIUKdB+grhzp5jNQ==",
  "-----END PUBLIC KEY-----",
].join("\n");

export const DEFAULT_CLI_JWT_ISSUER = "cobuild-chat-api";
export const DEFAULT_CLI_JWT_AUDIENCE = "cli";

export type CliScopeCapabilities = {
  hasToolsWrite: boolean;
  hasWalletExecute: boolean;
  hasAnyWriteScope: boolean;
};

export type CliVerifiedPrincipal = {
  sessionId: string;
  ownerAddress: EvmAddress;
  agentKey: string;
  scope: string;
  scopes: string[];
  hasToolsRead: boolean;
  hasToolsWrite: boolean;
  hasWalletExecute: boolean;
  hasAnyWriteScope: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function toCliJwtPayloadClaims(claims: CliJwtClaims): CliJwtPayloadClaims {
  return {
    sub: claims.sub,
    sid: claims.sid,
    agent_key: claims.agentKey,
    scope: claims.scope,
  };
}

export function parseCliJwtClaims(payload: unknown): CliJwtClaims | null {
  if (!isRecord(payload)) {
    return null;
  }

  if (
    typeof payload.sub !== "string" ||
    typeof payload.sid !== "string" ||
    typeof payload.agent_key !== "string" ||
    typeof payload.scope !== "string"
  ) {
    return null;
  }

  return {
    sub: payload.sub,
    sid: payload.sid,
    agentKey: payload.agent_key,
    scope: payload.scope,
  };
}

export const parseCliAccessTokenClaims = parseCliJwtClaims;

export function deriveCliScopeCapabilities(scope: string): CliScopeCapabilities {
  const toolsWrite = hasToolsWrite(scope);
  const walletExecute = hasWalletExecute(scope);

  return {
    hasToolsWrite: toolsWrite,
    hasWalletExecute: walletExecute,
    hasAnyWriteScope: hasAnyWriteCapability(scope),
  };
}

export function parseCliJwtVerifiedClaims(payload: unknown): CliJwtVerifiedClaims | null {
  const parsed = parseCliJwtClaims(payload);
  if (!parsed || !isRecord(payload)) {
    return null;
  }

  if (
    typeof payload.iat !== "number" ||
    typeof payload.exp !== "number" ||
    typeof payload.iss !== "string" ||
    (typeof payload.aud !== "string" && !Array.isArray(payload.aud))
  ) {
    return null;
  }

  if (Array.isArray(payload.aud) && payload.aud.some((entry) => typeof entry !== "string")) {
    return null;
  }

  return {
    ...parsed,
    iat: payload.iat,
    exp: payload.exp,
    iss: payload.iss,
    aud: payload.aud,
  };
}

export const parseVerifiedCliAccessTokenClaims = parseCliJwtVerifiedClaims;

export function deriveCliVerifiedPrincipal(
  claims: CliJwtVerifiedClaims
): CliVerifiedPrincipal | null {
  const ownerAddress = parseEvmAddress(claims.sub);
  if (!ownerAddress) {
    return null;
  }

  const sessionId = claims.sid.trim();
  const agentKey = claims.agentKey.trim();
  const scope = claims.scope.trim();

  if (!sessionId || !agentKey || !scope) {
    return null;
  }

  const scopes = splitScope(scope);
  if (scopes.length === 0) {
    return null;
  }

  return {
    sessionId,
    ownerAddress,
    agentKey,
    scope,
    scopes,
    hasToolsRead: scopes.includes("tools:read"),
    ...deriveCliScopeCapabilities(scope),
  };
}
