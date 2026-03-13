import { describe, expect, it, vi } from "vitest";

const { duplicatedEvent, uniqueEvent } = vi.hoisted(() => {
  const duplicatedEvent = {
    anonymous: false,
    inputs: [],
    name: "BudgetTreasuryCallFailed",
    type: "event",
  } as const;

  return {
    duplicatedEvent,
    uniqueEvent: {
      ...duplicatedEvent,
      name: "BudgetTreasuryCallRetried",
    } as const,
  };
});

vi.mock("../src/generated/abis.js", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../src/generated/abis.js")>();

  return {
    ...actual,
    budgetTcrAbi: [duplicatedEvent, duplicatedEvent] as const,
    managedBudgetControllerAbi: [
      duplicatedEvent,
      duplicatedEvent,
      uniqueEvent,
    ] as const,
  };
});

import * as protocolAbis from "../src/protocol-abis.js";

describe("protocol ABI dedupe branch", () => {
  it("dedupes duplicated generated ABI entries when exporting public ABIs", () => {
    expect(protocolAbis.budgetTcrAbi).toEqual([duplicatedEvent]);
    expect(protocolAbis.managedBudgetControllerAbi).toEqual([
      duplicatedEvent,
      uniqueEvent,
    ]);
  });
});
