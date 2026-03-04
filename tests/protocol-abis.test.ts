import { describe, expect, it } from "vitest";

import * as generated from "../src/generated/abis.js";
import * as protocolAbis from "../src/protocol-abis.js";

describe("protocol ABI exports", () => {
  it("re-exports wagmi-generated ABIs", () => {
    expect(protocolAbis.cobuildSwapImplAbi).toBe(generated.cobuildSwapImplAbi);
    expect(protocolAbis.cobuildSwapImplAddress).toBe(generated.cobuildSwapImplAddress);
    expect(protocolAbis.cobuildSwapImplAddress).toBe("0x21a580054e7a5e833f38033f2d958e00e4c50f0f");
    expect(protocolAbis.goalFactoryAbi).toBe(generated.goalFactoryAbi);
    expect(protocolAbis.flowAbi).toBe(generated.flowAbi);
    expect(protocolAbis.goalTreasuryAbi).toBe(generated.goalTreasuryAbi);
    expect(protocolAbis.budgetTreasuryAbi).toBe(generated.budgetTreasuryAbi);
    expect(protocolAbis.premiumEscrowAbi).toBe(generated.premiumEscrowAbi);
    expect(protocolAbis.goalStakeVaultAbi).toBe(generated.goalStakeVaultAbi);
    expect(protocolAbis.budgetStakeLedgerAbi).toBe(generated.budgetStakeLedgerAbi);
    expect(protocolAbis.budgetTcrAbi).toBe(generated.budgetTcrAbi);
    expect(protocolAbis.budgetTcrFactoryAbi).toBe(generated.budgetTcrFactoryAbi);
    expect(protocolAbis.goalFlowAllocationLedgerPipelineAbi).toBe(
      generated.goalFlowAllocationLedgerPipelineAbi
    );
    expect(protocolAbis.goalRevnetSplitHookAbi).toBe(generated.goalRevnetSplitHookAbi);
  });

  it("does not expose fallback resolver API", () => {
    expect("resolveGeneratedOrFallbackAbi" in protocolAbis).toBe(false);
  });
});
