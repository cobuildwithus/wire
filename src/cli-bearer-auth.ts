import { parseBearerToken } from "./parse-bearer-token.js";
import {
  deriveCliVerifiedPrincipal,
  type CliJwtVerifiedClaims,
  type CliVerifiedPrincipal,
} from "./jwt.js";

export type CliBearerSessionLookup = Pick<
  CliVerifiedPrincipal,
  "sessionId" | "ownerAddress" | "agentKey"
>;

export type CliBearerActiveSession = {
  scope: string;
};

export type CliBearerVerifyToken = (
  rawToken: string
) => Promise<CliJwtVerifiedClaims | null>;

export type CliBearerReadActiveSession = (
  principal: CliBearerSessionLookup
) => Promise<CliBearerActiveSession | null>;

export type CliBearerAuthFailureCode =
  | "missing_token"
  | "invalid_token"
  | "inactive_session"
  | "scope_required";

export type CliBearerAuthSuccess = {
  ok: true;
  principal: CliVerifiedPrincipal;
};

export type CliBearerAuthFailure = {
  ok: false;
  code: CliBearerAuthFailureCode;
  requiredScope?: string;
};

export type CliBearerAuthResult = CliBearerAuthSuccess | CliBearerAuthFailure;

type VerifyCliBearerAuthParams = {
  authorization?: unknown;
  rawToken?: string;
  verifyAccessToken: CliBearerVerifyToken;
  readActiveSession: CliBearerReadActiveSession;
  requiredScopes?: readonly string[];
};

function resolveBearerToken(params: VerifyCliBearerAuthParams): string | null {
  if (typeof params.rawToken === "string") {
    const trimmed = params.rawToken.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  return parseBearerToken(params.authorization);
}

export async function verifyCliBearerAuth(
  params: VerifyCliBearerAuthParams
): Promise<CliBearerAuthResult> {
  const rawToken = resolveBearerToken(params);
  if (!rawToken) {
    return {
      ok: false,
      code: "missing_token",
    };
  }

  const claims = await params.verifyAccessToken(rawToken);
  if (!claims) {
    return {
      ok: false,
      code: "invalid_token",
    };
  }

  const principal = deriveCliVerifiedPrincipal(claims);
  if (!principal) {
    return {
      ok: false,
      code: "invalid_token",
    };
  }

  const session = await params.readActiveSession({
    sessionId: principal.sessionId,
    ownerAddress: principal.ownerAddress,
    agentKey: principal.agentKey,
  });
  if (!session || session.scope.trim() !== principal.scope) {
    return {
      ok: false,
      code: "inactive_session",
    };
  }

  for (const requiredScope of params.requiredScopes ?? []) {
    if (!principal.scopes.includes(requiredScope)) {
      return {
        ok: false,
        code: "scope_required",
        requiredScope,
      };
    }
  }

  return {
    ok: true,
    principal,
  };
}
