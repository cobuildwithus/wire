import { describe, expect, it } from "vitest";
import {
  buildProtocolNotificationAppPath,
  buildProtocolNotificationPresentation,
  parseProtocolNotificationPayload,
} from "../src/protocol-notifications.js";

describe("protocol notification presenter", () => {
  const goalTreasury = "0x00000000000000000000000000000000000000bb";
  const budgetTreasury = "0x00000000000000000000000000000000000000cc";
  const arbitrator = "0x00000000000000000000000000000000000000dd";
  const actorWalletAddress = "0x00000000000000000000000000000000000000aa";
  const itemId =
    "0x1111111111111111111111111111111111111111111111111111111111111111";

  function basePayload(
    role: string | null,
    goalName = "Alpha"
  ): Record<string, unknown> {
    return {
      role,
      labels: { goalName },
      resource: { goalTreasury },
    };
  }

  function expectedPresentationAppPath(
    reason: string,
    payload: Record<string, unknown>
  ): string {
    return buildProtocolNotificationAppPath(
      parseProtocolNotificationPayload(payload),
      reason
    );
  }

  it("parses the structured payload contract", () => {
    expect(
      parseProtocolNotificationPayload({
        role: "proposer",
        resource: {
          kind: "budget_request",
          goalTreasury: goalTreasury.toUpperCase(),
          budgetTreasury,
          itemId,
          requestIndex: "3",
          arbitrator,
          disputeId: "9",
        },
        actor: {
          walletAddress: actorWalletAddress.toUpperCase(),
        },
        labels: {
          goalName: " Alpha ",
          budgetName: " Budget A ",
        },
        schedule: {
          deliverAt: "10",
        },
        amounts: {
          claimable: "11",
        },
      })
    ).toEqual({
      role: "proposer",
      resource: {
        kind: "budget_request",
        goalTreasury,
        budgetTreasury,
        itemId,
        requestIndex: "3",
        arbitrator,
        disputeId: "9",
      },
      actorWalletAddress,
      labels: {
        goalName: "Alpha",
        budgetName: "Budget A",
        mechanismName: null,
      },
      schedule: {
        deliverAt: "10",
        votingStartAt: null,
        votingEndAt: null,
        revealEndAt: null,
      },
      amounts: {
        allocatedStake: null,
        claimable: "11",
        claimedAmount: null,
        snapshotWeight: null,
        snapshotVotes: null,
        slashWeight: null,
      },
    });
  });

  it("builds a scoped dispute app path from structured resource refs", () => {
    const payload = parseProtocolNotificationPayload({
      resource: {
        goalTreasury,
        budgetTreasury,
        itemId,
        requestIndex: "2",
        disputeId: "7",
        arbitrator,
      },
    });

    expect(buildProtocolNotificationAppPath(payload, "budget_proposal_challenged")).toBe(
      `/${goalTreasury}/events?budgetTreasury=${budgetTreasury}&itemId=${itemId}&requestIndex=2&disputeId=7&arbitrator=${arbitrator}&focus=dispute`
    );
  });

  it("routes budget lifecycle notifications to the allocate surface", () => {
    const payload = parseProtocolNotificationPayload({
      resource: {
        goalTreasury,
        budgetTreasury,
      },
    });

    expect(buildProtocolNotificationAppPath(payload, "budget_succeeded")).toBe(
      `/${goalTreasury}/allocate?budgetTreasury=${budgetTreasury}&focus=budget`
    );
  });

  it("keeps focus query params even when only goal-level refs exist", () => {
    const payload = parseProtocolNotificationPayload({
      resource: {
        goalTreasury,
      },
    });

    expect(buildProtocolNotificationAppPath(payload, "goal_success_assertion_registered")).toBe(
      `/${goalTreasury}/events?focus=success_assertion`
    );
  });

  it("keeps goal-level focus when only the goal treasury is available", () => {
    expect(
      buildProtocolNotificationAppPath(
        parseProtocolNotificationPayload({
          resource: { goalTreasury },
        }),
        "goal_expired"
      )
    ).toBe(`/${goalTreasury}/events?focus=goal`);
    expect(buildProtocolNotificationAppPath(null, "goal_expired")).toBe("/notifications");
  });

  it("falls back to the payload actor when the row actor is missing", () => {
    const payload = {
      role: "requester",
      actor: { walletAddress: actorWalletAddress },
      labels: { goalName: "Alpha" },
      resource: { goalTreasury },
    };

    expect(
      buildProtocolNotificationPresentation({
        reason: "budget_removal_challenged",
        actorWalletAddress: null,
        payload,
      })
    ).toEqual({
      title: "Your removal request was challenged in Alpha.",
      excerpt: "0x0000...00aa challenged your removal request.",
      appPath: expectedPresentationAppPath("budget_removal_challenged", payload),
      actorName: "0x0000...00aa",
    });
  });

  it("uses stakeholder-safe withdrawal prep copy", () => {
    expect(
      buildProtocolNotificationPresentation({
        reason: "underwriter_withdrawal_prep_required",
        actorWalletAddress: null,
        payload: {
          role: "goal_stakeholder",
          labels: { goalName: "Alpha" },
          resource: { goalTreasury },
        },
      })
    ).toEqual({
      title: "Withdrawal prep required in Alpha.",
      excerpt: "This goal is resolved. Prepare your withdrawal before withdrawing stake.",
      appPath: `/${goalTreasury}/allocate?focus=underwriter`,
      actorName: null,
    });
  });

  it("renders budget success assertion notifications with allocate paths", () => {
    expect(
      buildProtocolNotificationPresentation({
        reason: "budget_success_assertion_registered",
        actorWalletAddress: null,
        payload: {
          role: "budget_controller",
          labels: { goalName: "Alpha" },
          resource: {
            goalTreasury,
            budgetTreasury,
          },
        },
      })
    ).toEqual({
      title: "Budget success assertion registered in Alpha.",
      excerpt: "A budget success assertion was registered and is awaiting resolution.",
      appPath: `/${goalTreasury}/allocate?budgetTreasury=${budgetTreasury}&focus=success_assertion`,
      actorName: null,
    });
  });

  it.each([
    [
      "requester",
      "budget_accepted",
      "Your budget proposal was accepted.",
      "Governance accepted your proposal and queued it for activation.",
    ],
    [
      "proposer",
      "budget_removed",
      "Your budget was removed.",
      "Your budget was detached from active funding.",
    ],
    [
      "challenger",
      "budget_removal_challenged",
      "You challenged a budget removal request.",
      "The removal request is now in dispute.",
    ],
  ])("falls back cleanly without goal labels for %s on %s", (role, reason, title, excerpt) => {
    expect(
      buildProtocolNotificationPresentation({
        reason,
        actorWalletAddress: null,
        payload: {
          role,
          labels: { goalName: "   " },
          resource: { goalTreasury: "not-an-address" },
        },
      })
    ).toEqual({
      title,
      excerpt,
      appPath: "/notifications",
      actorName: null,
    });
  });

  it.each([
    [
      "budget_proposed",
      "You proposed a new budget in Alpha.",
      "Your budget request entered governance.",
      actorWalletAddress,
      "Alpha",
    ],
    [
      "budget_proposal_challenged",
      "Your budget proposal was challenged.",
      "Your budget proposal moved into dispute.",
      null,
      "   ",
    ],
    [
      "budget_activated",
      "Your budget was activated in Alpha.",
      "Your budget is now active for funding.",
      actorWalletAddress,
      "Alpha",
    ],
    [
      "budget_removal_requested",
      "You requested budget removal in Alpha.",
      "Your removal request entered governance.",
      actorWalletAddress,
      "Alpha",
    ],
    [
      "budget_removal_accepted",
      "Your removal request was accepted.",
      "Governance accepted your removal request and queued final removal.",
      actorWalletAddress,
      "   ",
    ],
    [
      "mechanism_proposed",
      "You proposed a new allocation mechanism in Alpha.",
      "Your allocation mechanism request entered governance.",
      actorWalletAddress,
      "Alpha",
    ],
    [
      "mechanism_challenged",
      "Your allocation mechanism request was challenged.",
      "Your allocation mechanism request moved into dispute.",
      null,
      "   ",
    ],
    [
      "mechanism_accepted",
      "Your allocation mechanism request was accepted.",
      "Governance accepted your allocation mechanism request and queued it for activation.",
      null,
      "   ",
    ],
    [
      "mechanism_activated",
      "Your allocation mechanism was activated in Alpha.",
      "Your allocation mechanism is now active for allocations.",
      actorWalletAddress,
      "Alpha",
    ],
    [
      "mechanism_removal_requested",
      "You requested allocation mechanism removal in Alpha.",
      "Your allocation mechanism removal request entered governance.",
      actorWalletAddress,
      "Alpha",
    ],
    [
      "mechanism_removal_accepted",
      "Your allocation mechanism removal request was accepted.",
      "Governance accepted your allocation mechanism removal request and queued final removal.",
      null,
      "   ",
    ],
  ])(
    "builds requester-specific copy for %s",
    (reason, title, excerpt, roleActorWalletAddress, goalName) => {
      const payload = {
        role: "requester",
        labels: { goalName },
        resource: { goalTreasury: goalName.trim() ? goalTreasury : "not-an-address" },
      };

      expect(
        buildProtocolNotificationPresentation({
          reason,
          actorWalletAddress: roleActorWalletAddress,
          payload,
        })
      ).toEqual({
        title,
        excerpt,
        appPath: goalName.trim()
          ? expectedPresentationAppPath(reason, payload)
          : "/notifications",
        actorName: roleActorWalletAddress ? "0x0000...00aa" : null,
      });
    }
  );

  it.each([
    [
      "budget_proposal_challenged",
      "Your budget proposal was challenged.",
      "Your budget proposal moved into dispute.",
      null,
      "   ",
    ],
    [
      "budget_accepted",
      "Your budget proposal was accepted in Alpha.",
      "Governance accepted your proposal and queued it for activation.",
      actorWalletAddress,
      "Alpha",
    ],
    [
      "budget_activated",
      "Your budget was activated in Alpha.",
      "Your budget is now active for funding.",
      actorWalletAddress,
      "Alpha",
    ],
    [
      "budget_removal_challenged",
      "Removal request challenged for your budget.",
      "A removal request for your budget moved into dispute.",
      null,
      "   ",
    ],
    [
      "budget_removal_accepted",
      "Removal accepted for your budget.",
      "The removal request for your budget cleared governance and is queued for final removal.",
      actorWalletAddress,
      "   ",
    ],
    [
      "mechanism_proposed",
      "You proposed a new allocation mechanism in Alpha.",
      "Your allocation mechanism request entered governance.",
      actorWalletAddress,
      "Alpha",
    ],
    [
      "mechanism_challenged",
      "Your allocation mechanism request was challenged in Alpha.",
      "0x0000...00aa challenged your allocation mechanism request.",
      actorWalletAddress,
      "Alpha",
    ],
    [
      "mechanism_accepted",
      "Your allocation mechanism request was accepted.",
      "Governance accepted your allocation mechanism request and queued it for activation.",
      null,
      "   ",
    ],
    [
      "mechanism_activated",
      "Your allocation mechanism was activated in Alpha.",
      "Your allocation mechanism is now active for allocations.",
      actorWalletAddress,
      "Alpha",
    ],
    [
      "mechanism_removed",
      "Your allocation mechanism was removed.",
      "Your allocation mechanism was detached from active allocation.",
      null,
      "   ",
    ],
    [
      "mechanism_removal_requested",
      "Removal requested for your allocation mechanism in Alpha.",
      "A removal request was submitted for your allocation mechanism.",
      null,
      "Alpha",
    ],
    [
      "mechanism_removal_accepted",
      "Removal accepted for your allocation mechanism.",
      "The removal request for your allocation mechanism cleared governance and is queued for final removal.",
      null,
      "   ",
    ],
  ])(
    "builds proposer-specific copy for %s",
    (reason, title, excerpt, roleActorWalletAddress, goalName) => {
      const payload = {
        role: "proposer",
        labels: { goalName },
        resource: { goalTreasury: goalName.trim() ? goalTreasury : "not-an-address" },
      };

      expect(
        buildProtocolNotificationPresentation({
          reason,
          actorWalletAddress: roleActorWalletAddress,
          payload,
        })
      ).toEqual({
        title,
        excerpt,
        appPath: goalName.trim()
          ? expectedPresentationAppPath(reason, payload)
          : "/notifications",
        actorName: roleActorWalletAddress ? "0x0000...00aa" : null,
      });
    }
  );

  it("builds proposer-specific challenge copy with an actor label", () => {
    const payload = {
      role: "proposer",
      labels: { goalName: "Alpha" },
      resource: { goalTreasury },
    };

    expect(
      buildProtocolNotificationPresentation({
        reason: "budget_proposal_challenged",
        actorWalletAddress,
        payload,
      })
    ).toEqual({
      title: "Your budget proposal was challenged in Alpha.",
      excerpt: "0x0000...00aa challenged your budget proposal.",
      appPath: expectedPresentationAppPath("budget_proposal_challenged", payload),
      actorName: "0x0000...00aa",
    });
  });

  it("builds proposer-specific removal-request copy without an actor label", () => {
    const payload = {
      role: "proposer",
      labels: { goalName: "Alpha" },
      resource: { goalTreasury },
    };

    expect(
      buildProtocolNotificationPresentation({
        reason: "budget_removal_requested",
        actorWalletAddress: null,
        payload,
      })
    ).toEqual({
      title: "Removal requested for your budget in Alpha.",
      excerpt: "A removal request was submitted for your budget.",
      appPath: expectedPresentationAppPath("budget_removal_requested", payload),
      actorName: null,
    });
  });

  it("builds proposer-specific removal challenge copy with an actor label", () => {
    const payload = {
      role: "proposer",
      labels: { goalName: "Alpha" },
      resource: { goalTreasury },
    };

    expect(
      buildProtocolNotificationPresentation({
        reason: "budget_removal_challenged",
        actorWalletAddress,
        payload,
      })
    ).toEqual({
      title: "Removal request challenged for your budget in Alpha.",
      excerpt: "0x0000...00aa challenged a removal request for your budget.",
      appPath: expectedPresentationAppPath("budget_removal_challenged", payload),
      actorName: "0x0000...00aa",
    });
  });

  it("falls back to generic copy for challenger roles on non-dispute reasons", () => {
    const payload = {
      role: "challenger",
      labels: { goalName: "Alpha" },
      resource: { goalTreasury },
    };

    expect(
      buildProtocolNotificationPresentation({
        reason: "budget_accepted",
        actorWalletAddress,
        payload,
      })
    ).toEqual({
      title: "Budget accepted in Alpha.",
      excerpt: "The proposal cleared governance and is queued for activation.",
      appPath: expectedPresentationAppPath("budget_accepted", payload),
      actorName: "0x0000...00aa",
    });
  });

  it.each(["requester", "proposer"])(
    "falls back to generic copy for %s roles on non-request reasons",
    (role) => {
      const payload = {
        role,
        labels: { goalName: "Alpha" },
        resource: { goalTreasury },
      };

      expect(
        buildProtocolNotificationPresentation({
          reason: "goal_active",
          actorWalletAddress,
          payload,
        })
      ).toEqual({
        title: "Alpha is now active.",
        excerpt: "The goal has moved from funding into the active phase.",
        appPath: expectedPresentationAppPath("goal_active", payload),
        actorName: "0x0000...00aa",
      });
    }
  );

  it.each(["goal_owner", "goal_stakeholder", "goal_underwriter", "budget_underwriter", "juror"])(
    "parses %s as a recognized role and falls back to generic copy",
    (role) => {
      const payload = {
        role,
        labels: { goalName: "Alpha" },
        resource: { goalTreasury },
      };

      expect(
        buildProtocolNotificationPresentation({
          reason: "budget_activated",
          actorWalletAddress: null,
          payload,
        })
      ).toEqual({
        title: "Budget activated in Alpha.",
        excerpt: "The budget is now active for funding.",
        appPath: expectedPresentationAppPath("budget_activated", payload),
        actorName: null,
      });
    }
  );

  it("renders requester completion copy for removed budgets", () => {
    const payload = {
      role: "requester",
      labels: { goalName: "Alpha" },
      resource: { goalTreasury, budgetTreasury },
    };

    expect(
      buildProtocolNotificationPresentation({
        reason: "budget_removed",
        actorWalletAddress: null,
        payload,
      })
    ).toEqual({
      title: "Your removal request completed in Alpha.",
      excerpt: "Your removal request completed and the budget was detached from active funding.",
      appPath: expectedPresentationAppPath("budget_removed", payload),
      actorName: null,
    });
  });

  it("builds juror copy for phase-open notifications", () => {
    const payload = {
      labels: { goalName: "Alpha" },
      resource: { goalTreasury },
    };

    expect(
      buildProtocolNotificationPresentation({
        reason: "juror_voting_open",
        actorWalletAddress: null,
        payload,
      })
    ).toEqual({
      title: "Juror voting opened in Alpha.",
      excerpt: "Voting is now open on this dispute.",
      appPath: expectedPresentationAppPath("juror_voting_open", payload),
      actorName: null,
    });
  });

  it("builds underwriter slash copy", () => {
    const payload = {
      labels: { goalName: "Alpha" },
      resource: { goalTreasury },
    };

    expect(
      buildProtocolNotificationPresentation({
        reason: "underwriter_slashed",
        actorWalletAddress: null,
        payload,
      })
    ).toEqual({
      title: "Underwriter slash applied in Alpha.",
      excerpt: "A slash was applied to your underwriting position.",
      appPath: expectedPresentationAppPath("underwriter_slashed", payload),
      actorName: null,
    });
  });

  it.each([
    [
      "budget_proposal_challenged",
      "Budget proposal challenged in Alpha.",
      "A budget request moved into dispute.",
    ],
    ["budget_accepted", "Budget accepted in Alpha.", "The proposal cleared governance and is queued for activation."],
    ["budget_activated", "Budget activated in Alpha.", "The budget is now active for funding."],
    [
      "budget_removal_requested",
      "Budget removal requested in Alpha.",
      "A removal request was submitted for this budget.",
    ],
    ["budget_removal_challenged", "Budget removal challenged in Alpha.", "The removal request moved into dispute."],
    [
      "budget_removal_accepted",
      "Budget removal accepted in Alpha.",
      "The removal request cleared governance and is queued for final removal.",
    ],
    ["budget_removed", "Budget removed in Alpha.", "The budget was detached from active funding."],
    ["budget_active", "Budget in Alpha is now active.", "This budget entered the active funding phase."],
    ["budget_succeeded", "Budget in Alpha succeeded.", "This budget reached a succeeded terminal state."],
    ["budget_failed", "Budget in Alpha failed.", "This budget reached a failed terminal state."],
    ["budget_expired", "Budget in Alpha expired.", "This budget reached an expired terminal state."],
    [
      "mechanism_proposed",
      "New allocation mechanism proposed in Alpha.",
      "A new allocation mechanism request entered governance.",
    ],
    [
      "mechanism_challenged",
      "Allocation mechanism request challenged in Alpha.",
      "An allocation mechanism request moved into dispute.",
    ],
    [
      "mechanism_accepted",
      "Allocation mechanism accepted in Alpha.",
      "The allocation mechanism request cleared governance and is queued for activation.",
    ],
    [
      "mechanism_activated",
      "Allocation mechanism activated in Alpha.",
      "The allocation mechanism is now active for allocations.",
    ],
    [
      "mechanism_removal_requested",
      "Allocation mechanism removal requested in Alpha.",
      "A removal request was submitted for this allocation mechanism.",
    ],
    [
      "mechanism_removal_accepted",
      "Allocation mechanism removal accepted in Alpha.",
      "The allocation mechanism removal request cleared governance and is queued for final removal.",
    ],
    [
      "mechanism_removed",
      "Allocation mechanism removed in Alpha.",
      "The allocation mechanism was detached from active allocation.",
    ],
    ["goal_active", "Alpha is now active.", "The goal has moved from funding into the active phase."],
    ["goal_succeeded", "Alpha succeeded.", "The goal reached a succeeded terminal state."],
    ["goal_expired", "Alpha expired.", "The goal reached an expired terminal state."],
    ["juror_dispute_created", "New juror dispute in Alpha.", "A new dispute is waiting for juror attention."],
    ["juror_ruling_final", "Juror ruling finalized in Alpha.", "The dispute finished with a final ruling."],
    ["juror_slashable", "Juror slash risk in Alpha.", "The dispute resolved in a way that may leave your juror stake slashable."],
    ["juror_slashed", "Juror slashed in Alpha.", "A slash was applied to your juror stake."],
  ])("builds generic titled copy for %s", (reason, title, excerpt) => {
    const payload = {
      labels: { goalName: "Alpha" },
      resource: { goalTreasury },
    };

    expect(
      buildProtocolNotificationPresentation({
        reason,
        actorWalletAddress: null,
        payload,
      })
    ).toEqual({
      title,
      excerpt,
      appPath: expectedPresentationAppPath(reason, payload),
      actorName: null,
    });
  });

  it("falls back to generic request copy when payload role is unknown", () => {
    const payload = {
      role: "someone_else",
      labels: { goalName: "Alpha" },
      resource: { goalTreasury },
    };

    expect(
      buildProtocolNotificationPresentation({
        reason: "budget_proposed",
        actorWalletAddress,
        payload,
      })
    ).toEqual({
      title: "New budget proposed in Alpha.",
      excerpt: "0x0000...00aa opened a new budget request.",
      appPath: expectedPresentationAppPath("budget_proposed", payload),
      actorName: "0x0000...00aa",
    });
  });

  it("falls back to generic updates for unknown reasons while keeping the goal path", () => {
    expect(
      buildProtocolNotificationPresentation({
        reason: "something_new",
        actorWalletAddress: null,
        payload: {
          labels: { goalName: "Alpha" },
          resource: { goalTreasury },
        },
      })
    ).toEqual({
      title: "Protocol update for Alpha.",
      excerpt: null,
      appPath: `/${goalTreasury}/events`,
      actorName: null,
    });
  });

  it.each([
    [
      "requester",
      "budget_proposed",
      "You proposed a new budget in Alpha.",
      "Your budget request entered governance.",
    ],
    [
      "requester",
      "budget_accepted",
      "Your budget proposal was accepted in Alpha.",
      "Governance accepted your proposal and queued it for activation.",
    ],
    [
      "requester",
      "budget_removed",
      "Your removal request completed in Alpha.",
      "Your removal request completed and the budget was detached from active funding.",
    ],
    [
      "requester",
      "mechanism_removed",
      "Your removal request completed in Alpha.",
      "Your removal request completed and the allocation mechanism was detached from active allocation.",
    ],
    [
      "proposer",
      "budget_removed",
      "Your budget was removed in Alpha.",
      "Your budget was detached from active funding.",
    ],
    [
      "proposer",
      "mechanism_removed",
      "Your allocation mechanism was removed in Alpha.",
      "Your allocation mechanism was detached from active allocation.",
    ],
  ])("builds personalized completion copy for %s on %s", (role, reason, title, excerpt) => {
    const payload = basePayload(role);

    expect(
      buildProtocolNotificationPresentation({
        reason,
        actorWalletAddress: null,
        payload,
      })
    ).toEqual({
      title,
      excerpt,
      appPath: expectedPresentationAppPath(reason, payload),
      actorName: null,
    });
  });

  it.each([
    [
      "requester",
      "budget_proposal_challenged",
      "Your budget proposal was challenged in Alpha.",
      "0x0000...00aa challenged your budget proposal.",
    ],
    [
      "requester",
      "budget_removal_challenged",
      "Your removal request was challenged in Alpha.",
      "0x0000...00aa challenged your removal request.",
    ],
    [
      "requester",
      "mechanism_challenged",
      "Your allocation mechanism request was challenged in Alpha.",
      "0x0000...00aa challenged your allocation mechanism request.",
    ],
    [
      "proposer",
      "budget_proposal_challenged",
      "Your budget proposal was challenged in Alpha.",
      "0x0000...00aa challenged your budget proposal.",
    ],
    [
      "proposer",
      "budget_removal_requested",
      "Removal requested for your budget in Alpha.",
      "0x0000...00aa requested removal of your budget.",
    ],
    [
      "proposer",
      "budget_removal_challenged",
      "Removal request challenged for your budget in Alpha.",
      "0x0000...00aa challenged a removal request for your budget.",
    ],
    [
      "proposer",
      "mechanism_challenged",
      "Your allocation mechanism request was challenged in Alpha.",
      "0x0000...00aa challenged your allocation mechanism request.",
    ],
    [
      "proposer",
      "mechanism_removal_requested",
      "Removal requested for your allocation mechanism in Alpha.",
      "0x0000...00aa requested removal of your allocation mechanism.",
    ],
  ])("uses actor-specific excerpt copy for %s on %s", (role, reason, title, excerpt) => {
    const payload = basePayload(role);

    expect(
      buildProtocolNotificationPresentation({
        reason,
        actorWalletAddress,
        payload,
      })
    ).toEqual({
      title,
      excerpt,
      appPath: expectedPresentationAppPath(reason, payload),
      actorName: "0x0000...00aa",
    });
  });

  it.each([
    [
      "challenger",
      "budget_proposal_challenged",
      "You challenged a budget proposal in Alpha.",
      "The budget proposal is now in dispute.",
    ],
    [
      "challenger",
      "budget_removal_challenged",
      "You challenged a budget removal request in Alpha.",
      "The removal request is now in dispute.",
    ],
    [
      "challenger",
      "mechanism_challenged",
      "You challenged an allocation mechanism request in Alpha.",
      "The allocation mechanism request is now in dispute.",
    ],
  ])("builds challenger copy for %s", (role, reason, title, excerpt) => {
    const payload = basePayload(role);

    expect(
      buildProtocolNotificationPresentation({
        reason,
        actorWalletAddress,
        payload,
      })
    ).toEqual({
      title,
      excerpt,
      appPath: expectedPresentationAppPath(reason, payload),
      actorName: "0x0000...00aa",
    });
  });

  it.each([
    [
      "budget_proposed",
      "New budget proposed in Alpha.",
      "A new budget request entered governance.",
    ],
    [
      "budget_accepted",
      "Budget accepted in Alpha.",
      "The proposal cleared governance and is queued for activation.",
    ],
    [
      "budget_activated",
      "Budget activated in Alpha.",
      "The budget is now active for funding.",
    ],
    [
      "budget_removal_requested",
      "Budget removal requested in Alpha.",
      "A removal request was submitted for this budget.",
    ],
    [
      "budget_removed",
      "Budget removed in Alpha.",
      "The budget was detached from active funding.",
    ],
    [
      "budget_active",
      "Budget in Alpha is now active.",
      "This budget entered the active funding phase.",
    ],
    [
      "budget_succeeded",
      "Budget in Alpha succeeded.",
      "This budget reached a succeeded terminal state.",
    ],
    [
      "budget_failed",
      "Budget in Alpha failed.",
      "This budget reached a failed terminal state.",
    ],
    [
      "budget_expired",
      "Budget in Alpha expired.",
      "This budget reached an expired terminal state.",
    ],
    [
      "underwriter_slashed",
      "Underwriter slash applied in Alpha.",
      "A slash was applied to your underwriting position.",
    ],
    [
      "mechanism_proposed",
      "New allocation mechanism proposed in Alpha.",
      "A new allocation mechanism request entered governance.",
    ],
    [
      "mechanism_accepted",
      "Allocation mechanism accepted in Alpha.",
      "The allocation mechanism request cleared governance and is queued for activation.",
    ],
    [
      "mechanism_activated",
      "Allocation mechanism activated in Alpha.",
      "The allocation mechanism is now active for allocations.",
    ],
    [
      "mechanism_removal_requested",
      "Allocation mechanism removal requested in Alpha.",
      "A removal request was submitted for this allocation mechanism.",
    ],
    [
      "mechanism_removed",
      "Allocation mechanism removed in Alpha.",
      "The allocation mechanism was detached from active allocation.",
    ],
    [
      "goal_active",
      "Alpha is now active.",
      "The goal has moved from funding into the active phase.",
    ],
    [
      "goal_succeeded",
      "Alpha succeeded.",
      "The goal reached a succeeded terminal state.",
    ],
    [
      "goal_expired",
      "Alpha expired.",
      "The goal reached an expired terminal state.",
    ],
    [
      "juror_dispute_created",
      "New juror dispute in Alpha.",
      "A new dispute is waiting for juror attention.",
    ],
    [
      "juror_voting_open",
      "Juror voting opened in Alpha.",
      "Voting is now open on this dispute.",
    ],
    [
      "juror_reveal_open",
      "Juror reveal opened in Alpha.",
      "Reveal is now open for your committed vote.",
    ],
    [
      "juror_ruling_final",
      "Juror ruling finalized in Alpha.",
      "The dispute finished with a final ruling.",
    ],
    [
      "juror_slashable",
      "Juror slash risk in Alpha.",
      "The dispute resolved in a way that may leave your juror stake slashable.",
    ],
    [
      "juror_slashed",
      "Juror slashed in Alpha.",
      "A slash was applied to your juror stake.",
    ],
  ])("builds generic protocol copy for %s", (reason, title, excerpt) => {
    const payload = basePayload(null);

    expect(
      buildProtocolNotificationPresentation({
        reason,
        actorWalletAddress: null,
        payload,
      })
    ).toEqual({
      title,
      excerpt,
      appPath: expectedPresentationAppPath(reason, payload),
      actorName: null,
    });
  });

  it.each([
    "goal_owner",
    "goal_stakeholder",
    "goal_underwriter",
    "budget_underwriter",
    "juror",
  ])("treats %s as a recognized fallback role", (role) => {
    const payload = basePayload(role);

    expect(
      buildProtocolNotificationPresentation({
        reason: "budget_activated",
        actorWalletAddress: null,
        payload,
      })
    ).toEqual({
      title: "Budget activated in Alpha.",
      excerpt: "The budget is now active for funding.",
      appPath: expectedPresentationAppPath("budget_activated", payload),
      actorName: null,
    });
  });
});
