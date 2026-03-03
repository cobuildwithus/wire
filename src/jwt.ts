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
