type JsonRecord = Record<string, unknown>;

export type CliToolsAuthHeaders = {
  authorization: string;
};

export type CliToolExecutionRequest = {
  name: string;
  input: Record<string, unknown>;
};

export type CliToolMetadataParams = {
  name: string;
};

export type CliToolAuthPolicy = {
  requiredScopes: readonly string[];
  walletBinding: "none" | "subject-wallet";
};

export type CliToolExposure = "chat-safe" | "bearer-only";
export type CliToolSideEffects = "none" | "read" | "network-read" | "network-write";

export type CliToolMetadata = {
  name: string;
  description: string;
  inputSchema: JsonRecord;
  outputSchema?: JsonRecord;
  scopes: readonly string[];
  authPolicy: CliToolAuthPolicy;
  exposure: CliToolExposure;
  sideEffects: CliToolSideEffects;
  version: string;
  deprecated: boolean;
  aliases?: readonly string[];
};

export type CliToolsListResponse = {
  tools: CliToolMetadata[];
};

export type CliToolMetadataResponse = {
  tool: CliToolMetadata;
};

export type CliToolExecutionSuccessResponse = {
  ok: true;
  name: string;
  output: unknown;
};

export type CliToolExecutionErrorResponse = {
  ok: false;
  name: string;
  statusCode: number;
  error: string;
};

export const cliToolsAuthHeadersJsonSchema = {
  type: "object",
  required: ["authorization"],
  properties: {
    authorization: { type: "string", minLength: 1 },
  },
} as const;

export const cliToolExecutionRequestBodyJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["name"],
  properties: {
    name: { type: "string", minLength: 1, maxLength: 128 },
    input: {
      type: "object",
      additionalProperties: true,
    },
  },
} as const;

export const cliToolMetadataParamsJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["name"],
  properties: {
    name: { type: "string", minLength: 1, maxLength: 128 },
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

function parseRequiredString(record: JsonRecord, key: string, maxLength: number): string {
  const value = record[key];
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${key} is required`);
  }

  const trimmed = value.trim();
  if (trimmed.length > maxLength) {
    throw new Error(`${key} must be at most ${maxLength} characters`);
  }

  return trimmed;
}

function parseOptionalStringArray(record: JsonRecord, key: string): string[] | undefined {
  const value = record[key];
  if (value === undefined) {
    return undefined;
  }
  if (!Array.isArray(value)) {
    throw new Error(`${key} must be an array of strings`);
  }

  return value.map((entry) => {
    if (typeof entry !== "string" || !entry.trim()) {
      throw new Error(`${key} must be an array of strings`);
    }
    return entry.trim();
  });
}

function parseRequiredStringArray(record: JsonRecord, key: string): string[] {
  const parsed = parseOptionalStringArray(record, key);
  if (!parsed) {
    throw new Error(`${key} is required`);
  }
  return parsed;
}

function parseBoolean(record: JsonRecord, key: string): boolean {
  if (typeof record[key] !== "boolean") {
    throw new Error(`${key} must be a boolean`);
  }
  return record[key] as boolean;
}

function parseJsonObject(record: JsonRecord, key: string): JsonRecord {
  return asJsonRecord(record[key], `${key} must be an object`);
}

function parseOptionalJsonObject(record: JsonRecord, key: string): JsonRecord | undefined {
  const value = record[key];
  if (value === undefined) {
    return undefined;
  }
  return asJsonRecord(value, `${key} must be an object`);
}

function parseStatusCode(record: JsonRecord, key: string): number {
  const value = record[key];
  if (typeof value !== "number" || !Number.isInteger(value) || value < 400 || value > 599) {
    throw new Error(`${key} must be an HTTP status code`);
  }
  return value;
}

function parseToolAuthPolicy(input: unknown): CliToolAuthPolicy {
  const record = asJsonRecord(input, "authPolicy must be an object");
  assertKnownKeys(record, ["requiredScopes", "walletBinding"], "authPolicy");

  const walletBinding = parseRequiredString(record, "walletBinding", 64);
  if (walletBinding !== "none" && walletBinding !== "subject-wallet") {
    throw new Error("walletBinding is invalid");
  }

  return {
    requiredScopes: parseRequiredStringArray(record, "requiredScopes"),
    walletBinding,
  };
}

function parseToolMetadata(input: unknown): CliToolMetadata {
  const record = asJsonRecord(input, "tool metadata must be an object");
  assertKnownKeys(record, [
    "name",
    "description",
    "inputSchema",
    "outputSchema",
    "scopes",
    "authPolicy",
    "exposure",
    "sideEffects",
    "version",
    "deprecated",
    "aliases",
  ], "tool metadata");

  const exposure = parseRequiredString(record, "exposure", 64);
  if (exposure !== "chat-safe" && exposure !== "bearer-only") {
    throw new Error("exposure is invalid");
  }

  const sideEffects = parseRequiredString(record, "sideEffects", 64);
  if (
    sideEffects !== "none" &&
    sideEffects !== "read" &&
    sideEffects !== "network-read" &&
    sideEffects !== "network-write"
  ) {
    throw new Error("sideEffects is invalid");
  }

  const aliases = parseOptionalStringArray(record, "aliases");
  const outputSchema = parseOptionalJsonObject(record, "outputSchema");

  return {
    name: parseRequiredString(record, "name", 128),
    description: parseRequiredString(record, "description", 4096),
    inputSchema: parseJsonObject(record, "inputSchema"),
    ...(outputSchema ? { outputSchema } : {}),
    scopes: parseRequiredStringArray(record, "scopes"),
    authPolicy: parseToolAuthPolicy(record.authPolicy),
    exposure,
    sideEffects,
    version: parseRequiredString(record, "version", 128),
    deprecated: parseBoolean(record, "deprecated"),
    ...(aliases ? { aliases } : {}),
  };
}

export function parseCliToolsAuthHeaders(input: unknown): CliToolsAuthHeaders {
  const record = asJsonRecord(input, "Tool headers must be an object.");
  return {
    authorization: parseRequiredString(record, "authorization", 8192),
  };
}

export function parseCliToolExecutionRequest(input: unknown): CliToolExecutionRequest {
  const record = asJsonRecord(input, "Tool execution request must be a JSON object.");
  assertKnownKeys(record, ["name", "input"], "Tool execution request");

  const inputRecord = record.input === undefined ? {} : asJsonRecord(record.input, "input must be an object");

  return {
    name: parseRequiredString(record, "name", 128),
    input: inputRecord,
  };
}

export function serializeCliToolExecutionRequest(
  input: CliToolExecutionRequest
): Record<string, unknown> {
  return {
    name: input.name,
    input: input.input,
  };
}

export function parseCliToolMetadataParams(input: unknown): CliToolMetadataParams {
  const record = asJsonRecord(input, "Tool metadata params must be a JSON object.");
  assertKnownKeys(record, ["name"], "Tool metadata params");

  return {
    name: parseRequiredString(record, "name", 128),
  };
}

export function parseCliToolsListResponse(input: unknown): CliToolsListResponse {
  const record = asJsonRecord(input, "Tool catalog response was not valid JSON.");
  assertKnownKeys(record, ["tools"], "Tool catalog response");

  if (!Array.isArray(record.tools)) {
    throw new Error("tools is required");
  }

  return {
    tools: record.tools.map((tool) => parseToolMetadata(tool)),
  };
}

export function serializeCliToolsListResponse(
  input: CliToolsListResponse
): Record<string, unknown> {
  return {
    tools: input.tools,
  };
}

export function parseCliToolMetadataResponse(input: unknown): CliToolMetadataResponse {
  const record = asJsonRecord(input, "Tool metadata response was not valid JSON.");
  assertKnownKeys(record, ["tool"], "Tool metadata response");

  return {
    tool: parseToolMetadata(record.tool),
  };
}

export function serializeCliToolMetadataResponse(
  input: CliToolMetadataResponse
): Record<string, unknown> {
  return {
    tool: input.tool,
  };
}

export function parseCliToolExecutionSuccessResponse(
  input: unknown
): CliToolExecutionSuccessResponse {
  const record = asJsonRecord(input, "Tool execution response was not valid JSON.");
  assertKnownKeys(record, ["ok", "name", "output"], "Tool execution response");

  if (record.ok !== true) {
    throw new Error("Tool execution response did not include ok=true.");
  }

  return {
    ok: true,
    name: parseRequiredString(record, "name", 128),
    output: record.output,
  };
}

export function serializeCliToolExecutionSuccessResponse(
  input: CliToolExecutionSuccessResponse
): Record<string, unknown> {
  return {
    ok: true,
    name: input.name,
    output: input.output,
  };
}

export function parseCliToolExecutionErrorResponse(
  input: unknown
): CliToolExecutionErrorResponse {
  const record = asJsonRecord(input, "Tool execution error response was not valid JSON.");
  assertKnownKeys(record, ["ok", "name", "statusCode", "error"], "Tool execution error response");

  if (record.ok !== false) {
    throw new Error("Tool execution error response did not include ok=false.");
  }

  return {
    ok: false,
    name: parseRequiredString(record, "name", 128),
    statusCode: parseStatusCode(record, "statusCode"),
    error: parseRequiredString(record, "error", 4096),
  };
}

export function serializeCliToolExecutionErrorResponse(
  input: CliToolExecutionErrorResponse
): Record<string, unknown> {
  return {
    ok: false,
    name: input.name,
    statusCode: input.statusCode,
    error: input.error,
  };
}
