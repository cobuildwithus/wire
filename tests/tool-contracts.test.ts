import { describe, expect, it } from "vitest";
import {
  parseCliToolExecutionErrorResponse,
  parseCliToolExecutionRequest,
  parseCliToolExecutionSuccessResponse,
  parseCliToolMetadataParams,
  parseCliToolMetadataResponse,
  parseCliToolsAuthHeaders,
  parseCliToolsListResponse,
  serializeCliToolExecutionErrorResponse,
  serializeCliToolExecutionRequest,
  serializeCliToolExecutionSuccessResponse,
  serializeCliToolMetadataResponse,
  serializeCliToolsListResponse,
} from "../src/tool-contracts.js";

describe("tool contract surface", () => {
  const TOOL_METADATA = {
    name: "get-user",
    description: "Get a user by fname.",
    inputSchema: { type: "object" },
    outputSchema: { type: "object" },
    scopes: ["tools:read"],
    authPolicy: {
      requiredScopes: ["tools:read"],
      walletBinding: "none",
    },
    exposure: "bearer-only",
    sideEffects: "read",
    version: "1.0.0",
    deprecated: false,
    aliases: ["getUser"],
  } as const;

  it("parses strict request surfaces", () => {
    expect(parseCliToolsAuthHeaders({ authorization: "Bearer token", extra: "ok" })).toEqual({
      authorization: "Bearer token",
    });

    expect(
      parseCliToolExecutionRequest({
        name: "get-user",
        input: {
          fname: "alice",
        },
      })
    ).toEqual({
      name: "get-user",
      input: {
        fname: "alice",
      },
    });

    expect(parseCliToolExecutionRequest({ name: "get-user" })).toEqual({
      name: "get-user",
      input: {},
    });

    expect(parseCliToolMetadataParams({ name: "get-user" })).toEqual({
      name: "get-user",
    });
  });

  it("parses and serializes strict response envelopes", () => {
    expect(
      parseCliToolsListResponse({
        tools: [TOOL_METADATA],
      })
    ).toEqual({
      tools: [TOOL_METADATA],
    });
    expect(
      serializeCliToolsListResponse({
        tools: [TOOL_METADATA],
      })
    ).toEqual({
      tools: [TOOL_METADATA],
    });

    expect(
      parseCliToolMetadataResponse({
        tool: TOOL_METADATA,
      })
    ).toEqual({
      tool: TOOL_METADATA,
    });
    expect(
      serializeCliToolMetadataResponse({
        tool: TOOL_METADATA,
      })
    ).toEqual({
      tool: TOOL_METADATA,
    });

    expect(
      parseCliToolExecutionSuccessResponse({
        ok: true,
        name: "get-user",
        output: { fid: 1 },
      })
    ).toEqual({
      ok: true,
      name: "get-user",
      output: { fid: 1 },
    });
    expect(
      serializeCliToolExecutionSuccessResponse({
        ok: true,
        name: "get-user",
        output: { fid: 1 },
      })
    ).toEqual({
      ok: true,
      name: "get-user",
      output: { fid: 1 },
    });

    expect(
      parseCliToolExecutionErrorResponse({
        ok: false,
        name: "get-user",
        statusCode: 404,
        error: "Unknown tool",
      })
    ).toEqual({
      ok: false,
      name: "get-user",
      statusCode: 404,
      error: "Unknown tool",
    });
    expect(
      serializeCliToolExecutionErrorResponse({
        ok: false,
        name: "get-user",
        statusCode: 404,
        error: "Unknown tool",
      })
    ).toEqual({
      ok: false,
      name: "get-user",
      statusCode: 404,
      error: "Unknown tool",
    });

    expect(
      serializeCliToolExecutionRequest({
        name: "get-user",
        input: { fname: "alice" },
      })
    ).toEqual({
      name: "get-user",
      input: { fname: "alice" },
    });
  });

  it("rejects legacy or malformed tool envelopes", () => {
    expect(() =>
      parseCliToolsListResponse([{ name: "get-user" }])
    ).toThrow("Tool catalog response was not valid JSON.");

    expect(() =>
      parseCliToolExecutionSuccessResponse({
        result: { fid: 1 },
      })
    ).toThrow('Tool execution response includes unsupported field "result"');

    expect(() =>
      parseCliToolExecutionErrorResponse({
        ok: false,
        name: "get-user",
        statusCode: 200,
        error: "bad",
      })
    ).toThrow("statusCode must be an HTTP status code");

    expect(() =>
      parseCliToolExecutionRequest({
        name: "get-user",
        input: [],
      })
    ).toThrow("input must be an object");
  });
});
