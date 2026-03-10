export type ProtocolNotificationRole =
  | "requester"
  | "challenger"
  | "proposer"
  | "budget_controller"
  | "goal_owner"
  | "goal_stakeholder"
  | "goal_underwriter"
  | "budget_underwriter"
  | "juror";

export type ProtocolNotificationResource = {
  kind: string | null;
  goalTreasury: string | null;
  budgetTreasury: string | null;
  itemId: string | null;
  requestIndex: string | null;
  arbitrator: string | null;
  disputeId: string | null;
};

export type ProtocolNotificationLabels = {
  goalName: string | null;
  budgetName: string | null;
  mechanismName: string | null;
};

export type ProtocolNotificationSchedule = {
  deliverAt: string | null;
  votingStartAt: string | null;
  votingEndAt: string | null;
  revealEndAt: string | null;
};

export type ProtocolNotificationAmounts = {
  allocatedStake: string | null;
  claimable: string | null;
  claimedAmount: string | null;
  snapshotWeight: string | null;
  snapshotVotes: string | null;
  slashWeight: string | null;
};

export type ProtocolNotificationPayload = {
  role: ProtocolNotificationRole | null;
  resource: ProtocolNotificationResource | null;
  actorWalletAddress: string | null;
  labels: ProtocolNotificationLabels | null;
  schedule: ProtocolNotificationSchedule | null;
  amounts: ProtocolNotificationAmounts | null;
};

export type ProtocolNotificationPresentation = {
  title: string;
  excerpt: string | null;
  appPath: string;
  actorName: string | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeHexAddress(value: unknown): string | null {
  return typeof value === "string" && /^0x[0-9a-fA-F]{40}$/i.test(value)
    ? value.toLowerCase()
    : null;
}

function trimNonEmptyString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function shortenAddress(value: string | null): string | null {
  if (!value) return null;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

function parseRole(value: unknown): ProtocolNotificationRole | null {
  switch (value) {
    case "requester":
    case "challenger":
    case "proposer":
    case "budget_controller":
    case "goal_owner":
    case "goal_stakeholder":
    case "goal_underwriter":
    case "budget_underwriter":
    case "juror":
      return value;
    default:
      return null;
  }
}

function parseResource(value: unknown): ProtocolNotificationResource | null {
  if (!isRecord(value)) return null;

  return {
    kind: trimNonEmptyString(value.kind),
    goalTreasury: normalizeHexAddress(value.goalTreasury),
    budgetTreasury: normalizeHexAddress(value.budgetTreasury),
    itemId: typeof value.itemId === "string" && /^0x[0-9a-f]+$/i.test(value.itemId)
      ? value.itemId.toLowerCase()
      : null,
    requestIndex: trimNonEmptyString(value.requestIndex),
    arbitrator: normalizeHexAddress(value.arbitrator),
    disputeId: trimNonEmptyString(value.disputeId),
  };
}

function parseLabels(value: unknown): ProtocolNotificationLabels | null {
  if (!isRecord(value)) return null;

  return {
    goalName: trimNonEmptyString(value.goalName),
    budgetName: trimNonEmptyString(value.budgetName),
    mechanismName: trimNonEmptyString(value.mechanismName),
  };
}

function parseSchedule(value: unknown): ProtocolNotificationSchedule | null {
  if (!isRecord(value)) return null;

  return {
    deliverAt: trimNonEmptyString(value.deliverAt),
    votingStartAt: trimNonEmptyString(value.votingStartAt),
    votingEndAt: trimNonEmptyString(value.votingEndAt),
    revealEndAt: trimNonEmptyString(value.revealEndAt),
  };
}

function parseAmounts(value: unknown): ProtocolNotificationAmounts | null {
  if (!isRecord(value)) return null;

  return {
    allocatedStake: trimNonEmptyString(value.allocatedStake),
    claimable: trimNonEmptyString(value.claimable),
    claimedAmount: trimNonEmptyString(value.claimedAmount),
    snapshotWeight: trimNonEmptyString(value.snapshotWeight),
    snapshotVotes: trimNonEmptyString(value.snapshotVotes),
    slashWeight: trimNonEmptyString(value.slashWeight),
  };
}

export function parseProtocolNotificationPayload(value: unknown): ProtocolNotificationPayload | null {
  if (!isRecord(value)) return null;

  const actor = isRecord(value.actor) ? value.actor : null;

  return {
    role: parseRole(value.role),
    resource: parseResource(value.resource),
    actorWalletAddress: normalizeHexAddress(actor?.walletAddress),
    labels: parseLabels(value.labels),
    schedule: parseSchedule(value.schedule),
    amounts: parseAmounts(value.amounts),
  };
}

function focusForProtocolNotification(
  reason: string,
  resource: ProtocolNotificationResource | null
): string | null {
  switch (reason) {
    case "budget_proposed":
    case "budget_accepted":
    case "budget_removal_requested":
    case "budget_removal_accepted":
    case "mechanism_proposed":
    case "mechanism_accepted":
    case "mechanism_removal_requested":
    case "mechanism_removal_accepted":
      return "request";
    case "budget_proposal_challenged":
    case "budget_removal_challenged":
    case "mechanism_challenged":
    case "juror_dispute_created":
    case "juror_voting_open":
    case "juror_reveal_open":
    case "juror_ruling_final":
    case "juror_slashable":
    case "juror_slashed":
      return resource?.disputeId || resource?.arbitrator ? "dispute" : "request";
    case "budget_activated":
    case "budget_removed":
    case "budget_active":
    case "budget_succeeded":
    case "budget_failed":
    case "budget_expired":
      return "budget";
    case "budget_success_assertion_registered":
    case "budget_success_assertion_cleared":
    case "budget_success_assertion_resolution_fail_closed":
    case "budget_success_assertion_reassert_grace_activated":
    case "budget_success_resolution_disabled":
    case "goal_success_assertion_registered":
    case "goal_success_assertion_cleared":
    case "goal_success_assertion_resolution_fail_closed":
    case "goal_success_assertion_reassert_grace_activated":
      return "success_assertion";
    case "mechanism_activated":
    case "mechanism_removed":
      return "mechanism";
    case "underwriter_slashed":
    case "underwriter_withdrawal_prep_required":
      return "underwriter";
    case "premium_claimable":
    case "premium_claimed":
      return "premium";
    case "goal_active":
    case "goal_succeeded":
    case "goal_expired":
      return "goal";
    default:
      return null;
  }
}

function pageForProtocolNotification(reason: string): "events" | "allocate" {
  switch (reason) {
    case "budget_activated":
    case "budget_removed":
    case "budget_active":
    case "budget_succeeded":
    case "budget_failed":
    case "budget_expired":
    case "budget_success_assertion_registered":
    case "budget_success_assertion_cleared":
    case "budget_success_assertion_resolution_fail_closed":
    case "budget_success_assertion_reassert_grace_activated":
    case "budget_success_resolution_disabled":
    case "underwriter_slashed":
    case "underwriter_withdrawal_prep_required":
    case "premium_claimable":
    case "premium_claimed":
    case "mechanism_proposed":
    case "mechanism_challenged":
    case "mechanism_accepted":
    case "mechanism_activated":
    case "mechanism_removal_requested":
    case "mechanism_removal_accepted":
    case "mechanism_removed":
      return "allocate";
    default:
      return "events";
  }
}

export function buildProtocolNotificationAppPath(
  payload: ProtocolNotificationPayload | null,
  reason?: string
): string {
  const resource = payload?.resource ?? null;
  const goalTreasury = resource?.goalTreasury;
  if (!goalTreasury) return "/notifications";

  const params = new URLSearchParams();
  if (resource?.budgetTreasury) params.set("budgetTreasury", resource.budgetTreasury);
  if (resource?.itemId) params.set("itemId", resource.itemId);
  if (resource?.requestIndex) params.set("requestIndex", resource.requestIndex);
  if (resource?.disputeId) params.set("disputeId", resource.disputeId);
  if (resource?.arbitrator) params.set("arbitrator", resource.arbitrator);

  const focus = reason ? focusForProtocolNotification(reason, resource) : null;
  if (focus) {
    params.set("focus", focus);
  }

  const query = params.toString();
  const page = reason ? pageForProtocolNotification(reason) : "events";
  const basePath = `/${goalTreasury}/${page}`;
  return query ? `${basePath}?${query}` : basePath;
}

function roleAwareTitle(
  reason: string,
  goalName: string | null,
  role: ProtocolNotificationRole | null
): string | null {
  if (role === "requester") {
    switch (reason) {
      case "budget_proposed":
        return goalName
          ? `You proposed a new budget in ${goalName}.`
          : "You proposed a new budget.";
      case "budget_proposal_challenged":
        return goalName
          ? `Your budget proposal was challenged in ${goalName}.`
          : "Your budget proposal was challenged.";
      case "budget_accepted":
        return goalName
          ? `Your budget proposal was accepted in ${goalName}.`
          : "Your budget proposal was accepted.";
      case "budget_activated":
        return goalName
          ? `Your budget was activated in ${goalName}.`
          : "Your budget was activated.";
      case "budget_removal_requested":
        return goalName
          ? `You requested budget removal in ${goalName}.`
          : "You requested budget removal.";
      case "budget_removal_challenged":
        return goalName
          ? `Your removal request was challenged in ${goalName}.`
          : "Your removal request was challenged.";
      case "budget_removal_accepted":
        return goalName
          ? `Your removal request was accepted in ${goalName}.`
          : "Your removal request was accepted.";
      case "budget_removed":
        return goalName
          ? `Your removal request completed in ${goalName}.`
          : "Your removal request completed.";
      case "mechanism_proposed":
        return goalName
          ? `You proposed a new allocation mechanism in ${goalName}.`
          : "You proposed a new allocation mechanism.";
      case "mechanism_challenged":
        return goalName
          ? `Your allocation mechanism request was challenged in ${goalName}.`
          : "Your allocation mechanism request was challenged.";
      case "mechanism_accepted":
        return goalName
          ? `Your allocation mechanism request was accepted in ${goalName}.`
          : "Your allocation mechanism request was accepted.";
      case "mechanism_activated":
        return goalName
          ? `Your allocation mechanism was activated in ${goalName}.`
          : "Your allocation mechanism was activated.";
      case "mechanism_removal_requested":
        return goalName
          ? `You requested allocation mechanism removal in ${goalName}.`
          : "You requested allocation mechanism removal.";
      case "mechanism_removal_accepted":
        return goalName
          ? `Your allocation mechanism removal request was accepted in ${goalName}.`
          : "Your allocation mechanism removal request was accepted.";
      case "mechanism_removed":
        return goalName
          ? `Your removal request completed in ${goalName}.`
          : "Your removal request completed.";
      default:
        return null;
    }
  }

  if (role === "proposer") {
    switch (reason) {
      case "budget_proposed":
        return goalName
          ? `You proposed a new budget in ${goalName}.`
          : "You proposed a new budget.";
      case "budget_proposal_challenged":
        return goalName
          ? `Your budget proposal was challenged in ${goalName}.`
          : "Your budget proposal was challenged.";
      case "budget_accepted":
        return goalName
          ? `Your budget proposal was accepted in ${goalName}.`
          : "Your budget proposal was accepted.";
      case "budget_activated":
        return goalName
          ? `Your budget was activated in ${goalName}.`
          : "Your budget was activated.";
      case "budget_removal_requested":
        return goalName
          ? `Removal requested for your budget in ${goalName}.`
          : "Removal requested for your budget.";
      case "budget_removal_challenged":
        return goalName
          ? `Removal request challenged for your budget in ${goalName}.`
          : "Removal request challenged for your budget.";
      case "budget_removal_accepted":
        return goalName
          ? `Removal accepted for your budget in ${goalName}.`
          : "Removal accepted for your budget.";
      case "budget_removed":
        return goalName ? `Your budget was removed in ${goalName}.` : "Your budget was removed.";
      case "mechanism_proposed":
        return goalName
          ? `You proposed a new allocation mechanism in ${goalName}.`
          : "You proposed a new allocation mechanism.";
      case "mechanism_challenged":
        return goalName
          ? `Your allocation mechanism request was challenged in ${goalName}.`
          : "Your allocation mechanism request was challenged.";
      case "mechanism_accepted":
        return goalName
          ? `Your allocation mechanism request was accepted in ${goalName}.`
          : "Your allocation mechanism request was accepted.";
      case "mechanism_activated":
        return goalName
          ? `Your allocation mechanism was activated in ${goalName}.`
          : "Your allocation mechanism was activated.";
      case "mechanism_removal_requested":
        return goalName
          ? `Removal requested for your allocation mechanism in ${goalName}.`
          : "Removal requested for your allocation mechanism.";
      case "mechanism_removal_accepted":
        return goalName
          ? `Removal accepted for your allocation mechanism in ${goalName}.`
          : "Removal accepted for your allocation mechanism.";
      case "mechanism_removed":
        return goalName
          ? `Your allocation mechanism was removed in ${goalName}.`
          : "Your allocation mechanism was removed.";
      default:
        return null;
    }
  }

  if (role === "challenger") {
    switch (reason) {
      case "budget_proposal_challenged":
        return goalName
          ? `You challenged a budget proposal in ${goalName}.`
          : "You challenged a budget proposal.";
      case "budget_removal_challenged":
        return goalName
          ? `You challenged a budget removal request in ${goalName}.`
          : "You challenged a budget removal request.";
      case "mechanism_challenged":
        return goalName
          ? `You challenged an allocation mechanism request in ${goalName}.`
          : "You challenged an allocation mechanism request.";
      default:
        return null;
    }
  }

  return null;
}

function buildTitle(
  reason: string,
  goalName: string | null,
  role: ProtocolNotificationRole | null
): string {
  const personalizedTitle = roleAwareTitle(reason, goalName, role);
  if (personalizedTitle) return personalizedTitle;

  switch (reason) {
    case "budget_proposed":
      return goalName ? `New budget proposed in ${goalName}.` : "New budget proposed.";
    case "budget_proposal_challenged":
      return goalName
        ? `Budget proposal challenged in ${goalName}.`
        : "Budget proposal challenged.";
    case "budget_accepted":
      return goalName ? `Budget accepted in ${goalName}.` : "Budget accepted by governance.";
    case "budget_activated":
      return goalName ? `Budget activated in ${goalName}.` : "Budget activated.";
    case "budget_removal_requested":
      return goalName ? `Budget removal requested in ${goalName}.` : "Budget removal requested.";
    case "budget_removal_challenged":
      return goalName
        ? `Budget removal challenged in ${goalName}.`
        : "Budget removal challenged.";
    case "budget_removal_accepted":
      return goalName ? `Budget removal accepted in ${goalName}.` : "Budget removal accepted.";
    case "budget_removed":
      return goalName ? `Budget removed in ${goalName}.` : "Budget removed.";
    case "budget_active":
      return goalName ? `Budget in ${goalName} is now active.` : "Budget is now active.";
    case "budget_succeeded":
      return goalName ? `Budget in ${goalName} succeeded.` : "Budget succeeded.";
    case "budget_failed":
      return goalName ? `Budget in ${goalName} failed.` : "Budget failed.";
    case "budget_expired":
      return goalName ? `Budget in ${goalName} expired.` : "Budget expired.";
    case "underwriter_slashed":
      return goalName ? `Underwriter slash applied in ${goalName}.` : "Underwriter slash applied.";
    case "underwriter_withdrawal_prep_required":
      return goalName ? `Withdrawal prep required in ${goalName}.` : "Withdrawal prep required.";
    case "premium_claimable":
      return goalName ? `Premium ready to claim in ${goalName}.` : "Premium ready to claim.";
    case "premium_claimed":
      return goalName ? `Premium claimed in ${goalName}.` : "Premium claimed.";
    case "mechanism_proposed":
      return goalName
        ? `New allocation mechanism proposed in ${goalName}.`
        : "New allocation mechanism proposed.";
    case "mechanism_challenged":
      return goalName
        ? `Allocation mechanism request challenged in ${goalName}.`
        : "Allocation mechanism request challenged.";
    case "mechanism_accepted":
      return goalName
        ? `Allocation mechanism accepted in ${goalName}.`
        : "Allocation mechanism accepted by governance.";
    case "mechanism_activated":
      return goalName
        ? `Allocation mechanism activated in ${goalName}.`
        : "Allocation mechanism activated.";
    case "mechanism_removal_requested":
      return goalName
        ? `Allocation mechanism removal requested in ${goalName}.`
        : "Allocation mechanism removal requested.";
    case "mechanism_removal_accepted":
      return goalName
        ? `Allocation mechanism removal accepted in ${goalName}.`
        : "Allocation mechanism removal accepted.";
    case "mechanism_removed":
      return goalName
        ? `Allocation mechanism removed in ${goalName}.`
        : "Allocation mechanism removed.";
    case "goal_active":
      return goalName ? `${goalName} is now active.` : "Goal is now active.";
    case "goal_succeeded":
      return goalName ? `${goalName} succeeded.` : "Goal succeeded.";
    case "goal_expired":
      return goalName ? `${goalName} expired.` : "Goal expired.";
    case "goal_success_assertion_registered":
      return goalName
        ? `Goal success assertion registered in ${goalName}.`
        : "Goal success assertion registered.";
    case "goal_success_assertion_cleared":
      return goalName
        ? `Goal success assertion cleared in ${goalName}.`
        : "Goal success assertion cleared.";
    case "goal_success_assertion_resolution_fail_closed":
      return goalName
        ? `Goal success assertion failed closed in ${goalName}.`
        : "Goal success assertion failed closed.";
    case "goal_success_assertion_reassert_grace_activated":
      return goalName
        ? `Goal reassert grace activated in ${goalName}.`
        : "Goal reassert grace activated.";
    case "budget_success_assertion_registered":
      return goalName
        ? `Budget success assertion registered in ${goalName}.`
        : "Budget success assertion registered.";
    case "budget_success_assertion_cleared":
      return goalName
        ? `Budget success assertion cleared in ${goalName}.`
        : "Budget success assertion cleared.";
    case "budget_success_assertion_resolution_fail_closed":
      return goalName
        ? `Budget success assertion failed closed in ${goalName}.`
        : "Budget success assertion failed closed.";
    case "budget_success_assertion_reassert_grace_activated":
      return goalName
        ? `Budget reassert grace activated in ${goalName}.`
        : "Budget reassert grace activated.";
    case "budget_success_resolution_disabled":
      return goalName
        ? `Budget success resolution disabled in ${goalName}.`
        : "Budget success resolution disabled.";
    case "juror_dispute_created":
      return goalName ? `New juror dispute in ${goalName}.` : "New juror dispute.";
    case "juror_voting_open":
      return goalName ? `Juror voting opened in ${goalName}.` : "Juror voting is open.";
    case "juror_reveal_open":
      return goalName ? `Juror reveal opened in ${goalName}.` : "Juror reveal is open.";
    case "juror_ruling_final":
      return goalName ? `Juror ruling finalized in ${goalName}.` : "Juror ruling finalized.";
    case "juror_slashable":
      return goalName ? `Juror slash risk in ${goalName}.` : "Juror slash risk.";
    case "juror_slashed":
      return goalName ? `Juror slashed in ${goalName}.` : "Juror slashed.";
    default:
      return goalName ? `Protocol update for ${goalName}.` : "Protocol update.";
  }
}

function roleAwareExcerpt(
  reason: string,
  actorWalletAddress: string | null,
  role: ProtocolNotificationRole | null
): string | null {
  const actorLabel = shortenAddress(actorWalletAddress);

  if (role === "requester") {
    switch (reason) {
      case "budget_proposed":
        return "Your budget request entered governance.";
      case "budget_proposal_challenged":
        return actorLabel
          ? `${actorLabel} challenged your budget proposal.`
          : "Your budget proposal moved into dispute.";
      case "budget_accepted":
        return "Governance accepted your proposal and queued it for activation.";
      case "budget_activated":
        return "Your budget is now active for funding.";
      case "budget_removal_requested":
        return "Your removal request entered governance.";
      case "budget_removal_challenged":
        return actorLabel
          ? `${actorLabel} challenged your removal request.`
          : "Your removal request moved into dispute.";
      case "budget_removal_accepted":
        return "Governance accepted your removal request and queued final removal.";
      case "budget_removed":
        return "Your removal request completed and the budget was detached from active funding.";
      case "mechanism_proposed":
        return "Your allocation mechanism request entered governance.";
      case "mechanism_challenged":
        return actorLabel
          ? `${actorLabel} challenged your allocation mechanism request.`
          : "Your allocation mechanism request moved into dispute.";
      case "mechanism_accepted":
        return "Governance accepted your allocation mechanism request and queued it for activation.";
      case "mechanism_activated":
        return "Your allocation mechanism is now active for allocations.";
      case "mechanism_removal_requested":
        return "Your allocation mechanism removal request entered governance.";
      case "mechanism_removal_accepted":
        return "Governance accepted your allocation mechanism removal request and queued final removal.";
      case "mechanism_removed":
        return "Your removal request completed and the allocation mechanism was detached from active allocation.";
      default:
        return null;
    }
  }

  if (role === "proposer") {
    switch (reason) {
      case "budget_proposed":
        return "Your budget request entered governance.";
      case "budget_proposal_challenged":
        return actorLabel
          ? `${actorLabel} challenged your budget proposal.`
          : "Your budget proposal moved into dispute.";
      case "budget_accepted":
        return "Governance accepted your proposal and queued it for activation.";
      case "budget_activated":
        return "Your budget is now active for funding.";
      case "budget_removal_requested":
        return actorLabel
          ? `${actorLabel} requested removal of your budget.`
          : "A removal request was submitted for your budget.";
      case "budget_removal_challenged":
        return actorLabel
          ? `${actorLabel} challenged a removal request for your budget.`
          : "A removal request for your budget moved into dispute.";
      case "budget_removal_accepted":
        return "The removal request for your budget cleared governance and is queued for final removal.";
      case "budget_removed":
        return "Your budget was detached from active funding.";
      case "mechanism_proposed":
        return "Your allocation mechanism request entered governance.";
      case "mechanism_challenged":
        return actorLabel
          ? `${actorLabel} challenged your allocation mechanism request.`
          : "Your allocation mechanism request moved into dispute.";
      case "mechanism_accepted":
        return "Governance accepted your allocation mechanism request and queued it for activation.";
      case "mechanism_activated":
        return "Your allocation mechanism is now active for allocations.";
      case "mechanism_removal_requested":
        return actorLabel
          ? `${actorLabel} requested removal of your allocation mechanism.`
          : "A removal request was submitted for your allocation mechanism.";
      case "mechanism_removal_accepted":
        return "The removal request for your allocation mechanism cleared governance and is queued for final removal.";
      case "mechanism_removed":
        return "Your allocation mechanism was detached from active allocation.";
      default:
        return null;
    }
  }

  if (role === "challenger") {
    switch (reason) {
      case "budget_proposal_challenged":
        return "The budget proposal is now in dispute.";
      case "budget_removal_challenged":
        return "The removal request is now in dispute.";
      case "mechanism_challenged":
        return "The allocation mechanism request is now in dispute.";
      default:
        return null;
    }
  }

  return null;
}

function buildExcerpt(
  reason: string,
  actorWalletAddress: string | null,
  role: ProtocolNotificationRole | null
): string | null {
  const personalizedExcerpt = roleAwareExcerpt(reason, actorWalletAddress, role);
  if (personalizedExcerpt) return personalizedExcerpt;

  const actorLabel = shortenAddress(actorWalletAddress);

  switch (reason) {
    case "budget_proposed":
      return actorLabel
        ? `${actorLabel} opened a new budget request.`
        : "A new budget request entered governance.";
    case "budget_proposal_challenged":
      return actorLabel
        ? `${actorLabel} challenged a budget request.`
        : "A budget request moved into dispute.";
    case "budget_accepted":
      return "The proposal cleared governance and is queued for activation.";
    case "budget_activated":
      return "The budget is now active for funding.";
    case "budget_removal_requested":
      return actorLabel
        ? `${actorLabel} requested budget removal.`
        : "A removal request was submitted for this budget.";
    case "budget_removal_challenged":
      return actorLabel
        ? `${actorLabel} challenged a budget removal request.`
        : "The removal request moved into dispute.";
    case "budget_removal_accepted":
      return "The removal request cleared governance and is queued for final removal.";
    case "budget_removed":
      return "The budget was detached from active funding.";
    case "budget_active":
      return "This budget entered the active funding phase.";
    case "budget_succeeded":
      return "This budget reached a succeeded terminal state.";
    case "budget_failed":
      return "This budget reached a failed terminal state.";
    case "budget_expired":
      return "This budget reached an expired terminal state.";
    case "underwriter_slashed":
      return "A slash was applied to your underwriting position.";
    case "underwriter_withdrawal_prep_required":
      return "This goal is resolved. Prepare your withdrawal before withdrawing stake.";
    case "premium_claimable":
      return "Premium is now claimable on this underwriting position.";
    case "premium_claimed":
      return "A premium claim was completed for this underwriting position.";
    case "mechanism_proposed":
      return actorLabel
        ? `${actorLabel} opened a new allocation mechanism request.`
        : "A new allocation mechanism request entered governance.";
    case "mechanism_challenged":
      return actorLabel
        ? `${actorLabel} challenged an allocation mechanism request.`
        : "An allocation mechanism request moved into dispute.";
    case "mechanism_accepted":
      return "The allocation mechanism request cleared governance and is queued for activation.";
    case "mechanism_activated":
      return "The allocation mechanism is now active for allocations.";
    case "mechanism_removal_requested":
      return actorLabel
        ? `${actorLabel} requested allocation mechanism removal.`
        : "A removal request was submitted for this allocation mechanism.";
    case "mechanism_removal_accepted":
      return "The allocation mechanism removal request cleared governance and is queued for final removal.";
    case "mechanism_removed":
      return "The allocation mechanism was detached from active allocation.";
    case "goal_active":
      return "The goal has moved from funding into the active phase.";
    case "goal_succeeded":
      return "The goal reached a succeeded terminal state.";
    case "goal_expired":
      return "The goal reached an expired terminal state.";
    case "goal_success_assertion_registered":
      return "A goal success assertion was registered and is awaiting resolution.";
    case "goal_success_assertion_cleared":
      return "The pending goal success assertion was cleared.";
    case "goal_success_assertion_resolution_fail_closed":
      return "The goal success assertion closed without a successful resolution.";
    case "goal_success_assertion_reassert_grace_activated":
      return "A reassert grace window opened for the cleared goal assertion.";
    case "budget_success_assertion_registered":
      return "A budget success assertion was registered and is awaiting resolution.";
    case "budget_success_assertion_cleared":
      return "The pending budget success assertion was cleared.";
    case "budget_success_assertion_resolution_fail_closed":
      return "The budget success assertion closed without a successful resolution.";
    case "budget_success_assertion_reassert_grace_activated":
      return "A reassert grace window opened for the cleared budget assertion.";
    case "budget_success_resolution_disabled":
      return "Success assertions were disabled for this budget.";
    case "juror_dispute_created":
      return "A new dispute is waiting for juror attention.";
    case "juror_voting_open":
      return "Voting is now open on this dispute.";
    case "juror_reveal_open":
      return "Reveal is now open for your committed vote.";
    case "juror_ruling_final":
      return "The dispute finished with a final ruling.";
    case "juror_slashable":
      return "The dispute resolved in a way that may leave your juror stake slashable.";
    case "juror_slashed":
      return "A slash was applied to your juror stake.";
    default:
      return null;
  }
}

export function buildProtocolNotificationPresentation(args: {
  reason: string;
  payload: unknown;
  actorWalletAddress: string | null;
}): ProtocolNotificationPresentation {
  const payload = parseProtocolNotificationPayload(args.payload);
  const goalName = payload?.labels?.goalName ?? null;
  const role = payload?.role ?? null;
  const actorWalletAddress =
    normalizeHexAddress(args.actorWalletAddress) ?? payload?.actorWalletAddress ?? null;

  return {
    title: buildTitle(args.reason, goalName, role),
    excerpt: buildExcerpt(args.reason, actorWalletAddress, role),
    appPath: buildProtocolNotificationAppPath(payload, args.reason),
    actorName: shortenAddress(actorWalletAddress),
  };
}
