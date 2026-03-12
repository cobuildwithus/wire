export const NOTIFICATION_KINDS = ["discussion", "payment", "protocol"] as const;
export const LIST_WALLET_NOTIFICATIONS_DEFAULT_LIMIT = 20;
export const LIST_WALLET_NOTIFICATIONS_LIMIT_MIN = 1;
export const LIST_WALLET_NOTIFICATIONS_LIMIT_MAX = 50;
export const LIST_WALLET_NOTIFICATIONS_CURSOR_MAX_LENGTH = 512;

export type NotificationKind = (typeof NOTIFICATION_KINDS)[number];

export type NotificationDtoValue =
  | string
  | boolean
  | null
  | NotificationDtoValue[]
  | { [key: string]: NotificationDtoValue };

type NotificationDtoRecord = { [key: string]: NotificationDtoValue };

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

export interface ProtocolNotificationActor extends NotificationDtoRecord {
  walletAddress: string | null;
}

export interface ProtocolNotificationResource extends NotificationDtoRecord {
  kind: string | null;
  goalTreasury: string | null;
  budgetTreasury: string | null;
  itemId: string | null;
  requestIndex: string | null;
  arbitrator: string | null;
  disputeId: string | null;
}

export interface ProtocolNotificationLabels extends NotificationDtoRecord {
  goalName: string | null;
  budgetName: string | null;
  mechanismName: string | null;
  reminderContextLabel: string | null;
}

export interface ProtocolNotificationSchedule extends NotificationDtoRecord {
  deliverAt: string | null;
  votingStartAt: string | null;
  votingEndAt: string | null;
  revealEndAt: string | null;
  challengeWindowEndAt: string | null;
  reassertGraceDeadline: string | null;
}

export interface ProtocolNotificationAmounts extends NotificationDtoRecord {
  allocatedStake: string | null;
  claimable: string | null;
  claimedAmount: string | null;
  snapshotWeight: string | null;
  snapshotVotes: string | null;
  slashWeight: string | null;
}

export interface ProtocolNotificationReward extends NotificationDtoRecord {
  bucket: string | null;
  bucketLabel: string | null;
}

export interface ProtocolNotificationPayload extends NotificationDtoRecord {
  role: ProtocolNotificationRole | null;
  resource: ProtocolNotificationResource | null;
  actor: ProtocolNotificationActor | null;
  labels: ProtocolNotificationLabels | null;
  schedule: ProtocolNotificationSchedule | null;
  amounts: ProtocolNotificationAmounts | null;
  reward: ProtocolNotificationReward | null;
}

export type ProtocolNotificationPresentation = {
  title: string;
  excerpt: string | null;
  appPath: string;
  actorName: string | null;
};

export type ProtocolRouteFocus =
  | "request"
  | "dispute"
  | "budget"
  | "mechanism"
  | "goal"
  | "success_assertion"
  | "underwriter"
  | "premium";

export type ProtocolRouteState = {
  focus: ProtocolRouteFocus | null;
  budgetTreasury: string | null;
  itemId: string | null;
  requestIndex: string | null;
  disputeId: string | null;
  arbitrator: string | null;
};

export type ProtocolRouteHint = {
  title: string;
  description: string;
  chips: Array<{ label: string; value: string }>;
  focusSectionId: "position-summary" | "funding-flow" | null;
};

export type WalletNotificationActor = {
  fid: number | null;
  walletAddress: string | null;
  name: string | null;
  username: string | null;
  avatarUrl: string | null;
};

export type WalletNotificationSummary = {
  title: string | null;
  excerpt: string | null;
};

export type WalletNotificationResource = {
  sourceType: string;
  sourceId: string;
  sourceHash: string | null;
  rootHash: string | null;
  targetHash: string | null;
  appPath: string | null;
};

export type PaymentNotificationPayload = {
  amount: string | null;
};

export type WalletNotificationPayload =
  | ProtocolNotificationPayload
  | PaymentNotificationPayload
  | null;

export type WalletNotificationItem = {
  id: string;
  kind: string;
  reason: string;
  eventAt: string | null;
  createdAt: string;
  isUnread: boolean;
  actor: WalletNotificationActor | null;
  summary: WalletNotificationSummary;
  resource: WalletNotificationResource;
  payload: WalletNotificationPayload;
};

export type WalletNotificationsUnreadState = {
  count: number;
  watermark: string;
};

export type ListWalletNotificationsInput = {
  limit: number;
  cursor?: string;
  unreadOnly: boolean;
  kinds?: NotificationKind[];
};

export type ListWalletNotificationsOutput = {
  subjectWalletAddress: string;
  items: WalletNotificationItem[];
  pageInfo: {
    limit: number;
    nextCursor: string | null;
    hasMore: boolean;
  };
  unread: WalletNotificationsUnreadState;
};

type RawSearchParams = Record<string, string | string[] | undefined>;

function isDtoRecord(value: NotificationDtoValue | undefined): value is NotificationDtoRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeHash(value: unknown): string | null {
  return typeof value === "string" && /^0x[0-9a-f]+$/i.test(value) ? value.toLowerCase() : null;
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

function normalizeIntegerString(value: unknown): string | null {
  const trimmed = trimNonEmptyString(value);
  return trimmed && /^[0-9]+$/.test(trimmed) ? trimmed : null;
}

function normalizeNotificationDtoValue(value: unknown): NotificationDtoValue | undefined {
  if (value === null) {
    return null;
  }
  if (typeof value === "string" || typeof value === "boolean") {
    return value;
  }
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : undefined;
  }
  if (typeof value === "bigint") {
    return value.toString();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (Array.isArray(value)) {
    return value.flatMap((entry) => {
      const normalized = normalizeNotificationDtoValue(entry);
      return normalized === undefined ? [] : [normalized];
    });
  }
  if (!value || typeof value !== "object") {
    return undefined;
  }
  const jsonValue = typeof (value as { toJSON?: () => unknown }).toJSON === "function"
    ? (value as { toJSON: () => unknown }).toJSON()
    : null;
  if (jsonValue !== null && jsonValue !== value) {
    return normalizeNotificationDtoValue(jsonValue);
  }

  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) {
    return undefined;
  }

  const record: NotificationDtoRecord = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    const normalized = normalizeNotificationDtoValue(entry);
    if (normalized !== undefined) {
      record[key] = normalized;
    }
  }
  return record;
}

function normalizeNotificationDtoRecord(value: unknown): NotificationDtoRecord | null {
  const normalized = normalizeNotificationDtoValue(value);
  return isDtoRecord(normalized) ? normalized : null;
}

function shortenIdentifier(value: string | null): string | null {
  if (!value) return null;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

export function isNotificationKind(value: string): value is NotificationKind {
  return NOTIFICATION_KINDS.includes(value as NotificationKind);
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

function parseActor(value: NotificationDtoValue | undefined): ProtocolNotificationActor | null {
  if (!isDtoRecord(value)) return null;

  return {
    ...value,
    walletAddress: normalizeHexAddress(value.walletAddress),
  };
}

function parseResource(value: NotificationDtoValue | undefined): ProtocolNotificationResource | null {
  if (!isDtoRecord(value)) return null;

  return {
    ...value,
    kind: trimNonEmptyString(value.kind),
    goalTreasury: normalizeHexAddress(value.goalTreasury),
    budgetTreasury: normalizeHexAddress(value.budgetTreasury),
    itemId: normalizeHash(value.itemId),
    requestIndex: normalizeIntegerString(value.requestIndex),
    arbitrator: normalizeHexAddress(value.arbitrator),
    disputeId: normalizeIntegerString(value.disputeId),
  };
}

function parseLabels(value: NotificationDtoValue | undefined): ProtocolNotificationLabels | null {
  if (!isDtoRecord(value)) return null;

  return {
    ...value,
    goalName: trimNonEmptyString(value.goalName),
    budgetName: trimNonEmptyString(value.budgetName),
    mechanismName: trimNonEmptyString(value.mechanismName),
    reminderContextLabel: trimNonEmptyString(value.reminderContextLabel),
  };
}

function parseSchedule(value: NotificationDtoValue | undefined): ProtocolNotificationSchedule | null {
  if (!isDtoRecord(value)) return null;

  return {
    ...value,
    deliverAt: trimNonEmptyString(value.deliverAt),
    votingStartAt: trimNonEmptyString(value.votingStartAt),
    votingEndAt: trimNonEmptyString(value.votingEndAt),
    revealEndAt: trimNonEmptyString(value.revealEndAt),
    challengeWindowEndAt: trimNonEmptyString(value.challengeWindowEndAt),
    reassertGraceDeadline: trimNonEmptyString(value.reassertGraceDeadline),
  };
}

function parseAmounts(value: NotificationDtoValue | undefined): ProtocolNotificationAmounts | null {
  if (!isDtoRecord(value)) return null;

  return {
    ...value,
    allocatedStake: trimNonEmptyString(value.allocatedStake),
    claimable: trimNonEmptyString(value.claimable),
    claimedAmount: trimNonEmptyString(value.claimedAmount),
    snapshotWeight: trimNonEmptyString(value.snapshotWeight),
    snapshotVotes: trimNonEmptyString(value.snapshotVotes),
    slashWeight: trimNonEmptyString(value.slashWeight),
  };
}

function parseReward(value: NotificationDtoValue | undefined): ProtocolNotificationReward | null {
  if (!isDtoRecord(value)) return null;

  return {
    ...value,
    bucket: trimNonEmptyString(value.bucket),
    bucketLabel: trimNonEmptyString(value.bucketLabel),
  };
}

export function parseProtocolNotificationPayload(value: unknown): ProtocolNotificationPayload | null {
  const normalized = normalizeNotificationDtoRecord(value);
  if (!normalized) return null;

  return {
    ...normalized,
    role: parseRole(normalized.role),
    resource: parseResource(normalized.resource),
    actor: parseActor(normalized.actor),
    labels: parseLabels(normalized.labels),
    schedule: parseSchedule(normalized.schedule),
    amounts: parseAmounts(normalized.amounts),
    reward: parseReward(normalized.reward),
  };
}

export function parsePaymentNotificationPayload(value: unknown): PaymentNotificationPayload | null {
  const normalized = normalizeNotificationDtoRecord(value);
  if (!normalized) return null;

  const amount = trimNonEmptyString(normalized.amount);
  return amount === null ? null : { amount };
}

export function normalizeWalletNotificationPayload(
  kind: string,
  value: unknown
): WalletNotificationPayload {
  if (kind === "protocol") {
    return parseProtocolNotificationPayload(value);
  }
  if (kind === "payment") {
    return parsePaymentNotificationPayload(value);
  }
  return null;
}

type SuccessAssertionScope = "goal" | "budget";

type SuccessAssertionState =
  | "registered"
  | "cleared"
  | "resolution_fail_closed"
  | "reassert_grace_activated"
  | "finalize_failed"
  | "disputed"
  | "resolved"
  | "settled"
  | "reassert_grace_ending_soon";

type ParsedSuccessAssertionReason = {
  scope: SuccessAssertionScope;
  normalizedState: SuccessAssertionState;
};

type RequestChallengeReminderContext =
  | "budget_request"
  | "budget_removal"
  | "mechanism_request"
  | "mechanism_removal";

const CHALLENGE_WINDOW_REMINDER_SUFFIX = "challenge_window_ending_soon";

const REQUEST_CHALLENGE_REMINDER_COPY: Record<
  RequestChallengeReminderContext,
  { title: string; excerpt: string }
> = {
  budget_request: {
    title: "Budget challenge window ending soon",
    excerpt: "The current challenge window for this budget request is ending soon.",
  },
  budget_removal: {
    title: "Budget removal challenge window ending soon",
    excerpt: "The current challenge window for this budget removal request is ending soon.",
  },
  mechanism_request: {
    title: "Allocation mechanism challenge window ending soon",
    excerpt: "The current challenge window for this allocation mechanism request is ending soon.",
  },
  mechanism_removal: {
    title: "Allocation mechanism removal challenge window ending soon",
    excerpt:
      "The current challenge window for this allocation mechanism removal request is ending soon.",
  },
};

function isChallengeWindowReminderReason(reason: string): boolean {
  return reason.endsWith(CHALLENGE_WINDOW_REMINDER_SUFFIX);
}

function normalizeSuccessAssertionState(rawState: string): SuccessAssertionState | null {
  switch (rawState) {
    case "registered":
      return "registered";
    case "cleared":
      return "cleared";
    case "resolution_fail_closed":
      return "resolution_fail_closed";
    case "reassert_grace_activated":
      return "reassert_grace_activated";
    case "finalize_failed":
      return "finalize_failed";
    case "disputed":
      return "disputed";
    case "resolved":
      return "resolved";
    case "settled":
      return "settled";
    case "reassert_grace_ending_soon":
      return "reassert_grace_ending_soon";
    default:
      return null;
  }
}

function parseSuccessAssertionReason(reason: string): ParsedSuccessAssertionReason | null {
  const match = /^(goal|budget)_success_assertion_(.+)$/.exec(reason);
  if (!match) return null;

  const scope = match[1] as SuccessAssertionScope;
  const rawState = match[2] ?? "";
  const normalizedState = normalizeSuccessAssertionState(rawState);
  if (!normalizedState) return null;

  return {
    scope,
    normalizedState,
  };
}

function reminderContextFromLabel(value: string | null): RequestChallengeReminderContext | null {
  if (!value) return null;

  const normalized = value.toLowerCase();
  if (normalized.includes("mechanism")) {
    return normalized.includes("removal") ? "mechanism_removal" : "mechanism_request";
  }
  if (normalized.includes("budget")) {
    return normalized.includes("removal") ? "budget_removal" : "budget_request";
  }
  return null;
}

function parseChallengeWindowReminderContext(
  reason: string,
  payload: ProtocolNotificationPayload | null
): RequestChallengeReminderContext | null {
  if (!isChallengeWindowReminderReason(reason)) {
    return null;
  }

  const normalizedReason = reason.toLowerCase();
  if (normalizedReason.includes("mechanism")) {
    return normalizedReason.includes("removal") ? "mechanism_removal" : "mechanism_request";
  }
  if (normalizedReason.includes("budget")) {
    return normalizedReason.includes("removal") ? "budget_removal" : "budget_request";
  }

  const labelContext = reminderContextFromLabel(payload?.labels?.reminderContextLabel ?? null);
  if (payload?.resource?.kind === "mechanism_request") {
    return labelContext === "mechanism_removal" ? labelContext : "mechanism_request";
  }
  if (payload?.resource?.kind === "budget_request") {
    return labelContext === "budget_removal" ? labelContext : "budget_request";
  }
  return labelContext;
}

function isJurorVoteDeadlineReminder(reason: string): boolean {
  return reason === "juror_vote_deadline_soon";
}

function isJurorRevealDeadlineReminder(reason: string): boolean {
  return reason === "juror_reveal_deadline_soon";
}

function isJurorRewardReason(reason: string): boolean {
  return reason === "juror_reward_claimable" || reason === "juror_reward_claimed";
}

type NotificationCopyContext = {
  goalName: string | null;
  actorLabel: string | null;
  payload: ProtocolNotificationPayload | null;
};

type StandardProtocolNotificationDescriptor = {
  focus:
    | ProtocolRouteFocus
    | ((payload: ProtocolNotificationPayload | null) => ProtocolRouteFocus | null);
  page: "events" | "allocate";
  title: (context: NotificationCopyContext) => string;
  excerpt: (context: NotificationCopyContext) => string | null;
};

type RoleAwareProtocolNotificationCopy = {
  title: (context: NotificationCopyContext) => string;
  excerpt: (context: NotificationCopyContext) => string | null;
};

type RoleAwareProtocolNotificationRole = "requester" | "proposer" | "challenger";

function withGoalName(
  goalName: string | null,
  withName: (goalName: string) => string,
  withoutName: string
): string {
  return goalName ? withName(goalName) : withoutName;
}

function withActorLabel(
  actorLabel: string | null,
  withActor: (actorLabel: string) => string,
  withoutActor: string
): string {
  return actorLabel ? withActor(actorLabel) : withoutActor;
}

function focusDisputeOrRequest(
  payload: ProtocolNotificationPayload | null
): ProtocolRouteFocus {
  const resource = payload?.resource ?? null;
  return resource?.disputeId || resource?.arbitrator ? "dispute" : "request";
}

const STANDARD_PROTOCOL_NOTIFICATION_DESCRIPTORS = {
  budget_proposed: {
    focus: "request",
    page: "events",
    title: ({ goalName }) =>
      withGoalName(goalName, (name) => `New budget proposed in ${name}.`, "New budget proposed."),
    excerpt: ({ actorLabel }) =>
      withActorLabel(
        actorLabel,
        (label) => `${label} opened a new budget request.`,
        "A new budget request entered governance."
      ),
  },
  budget_proposal_challenged: {
    focus: focusDisputeOrRequest,
    page: "events",
    title: ({ goalName }) =>
      withGoalName(
        goalName,
        (name) => `Budget proposal challenged in ${name}.`,
        "Budget proposal challenged."
      ),
    excerpt: ({ actorLabel }) =>
      withActorLabel(
        actorLabel,
        (label) => `${label} challenged a budget request.`,
        "A budget request moved into dispute."
      ),
  },
  budget_accepted: {
    focus: "request",
    page: "events",
    title: ({ goalName }) =>
      withGoalName(goalName, (name) => `Budget accepted in ${name}.`, "Budget accepted by governance."),
    excerpt: () => "The proposal cleared governance and is queued for activation.",
  },
  budget_activated: {
    focus: "budget",
    page: "allocate",
    title: ({ goalName }) =>
      withGoalName(goalName, (name) => `Budget activated in ${name}.`, "Budget activated."),
    excerpt: () => "The budget is now active for funding.",
  },
  budget_removal_requested: {
    focus: "request",
    page: "events",
    title: ({ goalName }) =>
      withGoalName(
        goalName,
        (name) => `Budget removal requested in ${name}.`,
        "Budget removal requested."
      ),
    excerpt: ({ actorLabel }) =>
      withActorLabel(
        actorLabel,
        (label) => `${label} requested budget removal.`,
        "A removal request was submitted for this budget."
      ),
  },
  budget_removal_challenged: {
    focus: focusDisputeOrRequest,
    page: "events",
    title: ({ goalName }) =>
      withGoalName(
        goalName,
        (name) => `Budget removal challenged in ${name}.`,
        "Budget removal challenged."
      ),
    excerpt: ({ actorLabel }) =>
      withActorLabel(
        actorLabel,
        (label) => `${label} challenged a budget removal request.`,
        "The removal request moved into dispute."
      ),
  },
  budget_removal_accepted: {
    focus: "request",
    page: "events",
    title: ({ goalName }) =>
      withGoalName(
        goalName,
        (name) => `Budget removal accepted in ${name}.`,
        "Budget removal accepted."
      ),
    excerpt: () => "The removal request cleared governance and is queued for final removal.",
  },
  budget_removed: {
    focus: "budget",
    page: "allocate",
    title: ({ goalName }) =>
      withGoalName(goalName, (name) => `Budget removed in ${name}.`, "Budget removed."),
    excerpt: () => "The budget was detached from active funding.",
  },
  budget_active: {
    focus: "budget",
    page: "allocate",
    title: ({ goalName }) =>
      withGoalName(goalName, (name) => `Budget in ${name} is now active.`, "Budget is now active."),
    excerpt: () => "This budget entered the active funding phase.",
  },
  budget_succeeded: {
    focus: "budget",
    page: "allocate",
    title: ({ goalName }) =>
      withGoalName(goalName, (name) => `Budget in ${name} succeeded.`, "Budget succeeded."),
    excerpt: () => "This budget reached a succeeded terminal state.",
  },
  budget_failed: {
    focus: "budget",
    page: "allocate",
    title: ({ goalName }) =>
      withGoalName(goalName, (name) => `Budget in ${name} failed.`, "Budget failed."),
    excerpt: () => "This budget reached a failed terminal state.",
  },
  budget_expired: {
    focus: "budget",
    page: "allocate",
    title: ({ goalName }) =>
      withGoalName(goalName, (name) => `Budget in ${name} expired.`, "Budget expired."),
    excerpt: () => "This budget reached an expired terminal state.",
  },
  goal_success_assertion_registered: {
    focus: "success_assertion",
    page: "events",
    title: ({ goalName }) =>
      withGoalName(
        goalName,
        (name) => `Goal success assertion registered in ${name}.`,
        "Goal success assertion registered."
      ),
    excerpt: () => "A goal success assertion was registered and is awaiting resolution.",
  },
  goal_success_assertion_cleared: {
    focus: "success_assertion",
    page: "events",
    title: ({ goalName }) =>
      withGoalName(
        goalName,
        (name) => `Goal success assertion cleared in ${name}.`,
        "Goal success assertion cleared."
      ),
    excerpt: () => "The pending goal success assertion was cleared.",
  },
  goal_success_assertion_resolution_fail_closed: {
    focus: "success_assertion",
    page: "events",
    title: ({ goalName }) =>
      withGoalName(
        goalName,
        (name) => `Goal success assertion failed closed in ${name}.`,
        "Goal success assertion failed closed."
      ),
    excerpt: () => "The goal success assertion closed without a successful resolution.",
  },
  goal_success_assertion_reassert_grace_activated: {
    focus: "success_assertion",
    page: "events",
    title: ({ goalName }) =>
      withGoalName(
        goalName,
        (name) => `Goal reassert grace activated in ${name}.`,
        "Goal reassert grace activated."
      ),
    excerpt: () => "A reassert grace window opened for the cleared goal assertion.",
  },
  budget_success_assertion_registered: {
    focus: "success_assertion",
    page: "allocate",
    title: ({ goalName }) =>
      withGoalName(
        goalName,
        (name) => `Budget success assertion registered in ${name}.`,
        "Budget success assertion registered."
      ),
    excerpt: () => "A budget success assertion was registered and is awaiting resolution.",
  },
  budget_success_assertion_cleared: {
    focus: "success_assertion",
    page: "allocate",
    title: ({ goalName }) =>
      withGoalName(
        goalName,
        (name) => `Budget success assertion cleared in ${name}.`,
        "Budget success assertion cleared."
      ),
    excerpt: () => "The pending budget success assertion was cleared.",
  },
  budget_success_assertion_resolution_fail_closed: {
    focus: "success_assertion",
    page: "allocate",
    title: ({ goalName }) =>
      withGoalName(
        goalName,
        (name) => `Budget success assertion failed closed in ${name}.`,
        "Budget success assertion failed closed."
      ),
    excerpt: () => "The budget success assertion closed without a successful resolution.",
  },
  budget_success_assertion_reassert_grace_activated: {
    focus: "success_assertion",
    page: "allocate",
    title: ({ goalName }) =>
      withGoalName(
        goalName,
        (name) => `Budget reassert grace activated in ${name}.`,
        "Budget reassert grace activated."
      ),
    excerpt: () => "A reassert grace window opened for the cleared budget assertion.",
  },
  budget_success_resolution_disabled: {
    focus: "success_assertion",
    page: "allocate",
    title: ({ goalName }) =>
      withGoalName(
        goalName,
        (name) => `Budget success resolution disabled in ${name}.`,
        "Budget success resolution disabled."
      ),
    excerpt: () => "Success assertions were disabled for this budget.",
  },
  underwriter_slashed: {
    focus: "underwriter",
    page: "allocate",
    title: ({ goalName }) =>
      withGoalName(
        goalName,
        (name) => `Underwriter slash applied in ${name}.`,
        "Underwriter slash applied."
      ),
    excerpt: () => "A slash was applied to your underwriting position.",
  },
  underwriter_withdrawal_prep_required: {
    focus: "underwriter",
    page: "allocate",
    title: ({ goalName }) =>
      withGoalName(
        goalName,
        (name) => `Withdrawal prep required in ${name}.`,
        "Withdrawal prep required."
      ),
    excerpt: () => "This goal is resolved. Prepare your withdrawal before withdrawing stake.",
  },
  underwriter_withdrawal_prep_complete: {
    focus: "underwriter",
    page: "allocate",
    title: ({ goalName }) =>
      withGoalName(
        goalName,
        (name) => `Withdrawal prep complete in ${name}.`,
        "Withdrawal prep complete."
      ),
    excerpt: () =>
      "Your withdrawal is prepared. You can now withdraw stake from this resolved goal.",
  },
  premium_claimable: {
    focus: "premium",
    page: "allocate",
    title: ({ goalName }) =>
      withGoalName(goalName, (name) => `Premium ready to claim in ${name}.`, "Premium ready to claim."),
    excerpt: () => "Premium is now claimable on this underwriting position.",
  },
  premium_claimed: {
    focus: "premium",
    page: "allocate",
    title: ({ goalName }) =>
      withGoalName(goalName, (name) => `Premium claimed in ${name}.`, "Premium claimed."),
    excerpt: () => "A premium claim was completed for this underwriting position.",
  },
  mechanism_proposed: {
    focus: "request",
    page: "allocate",
    title: ({ goalName }) =>
      withGoalName(
        goalName,
        (name) => `New allocation mechanism proposed in ${name}.`,
        "New allocation mechanism proposed."
      ),
    excerpt: ({ actorLabel }) =>
      withActorLabel(
        actorLabel,
        (label) => `${label} opened a new allocation mechanism request.`,
        "A new allocation mechanism request entered governance."
      ),
  },
  mechanism_challenged: {
    focus: focusDisputeOrRequest,
    page: "allocate",
    title: ({ goalName }) =>
      withGoalName(
        goalName,
        (name) => `Allocation mechanism request challenged in ${name}.`,
        "Allocation mechanism request challenged."
      ),
    excerpt: ({ actorLabel }) =>
      withActorLabel(
        actorLabel,
        (label) => `${label} challenged an allocation mechanism request.`,
        "An allocation mechanism request moved into dispute."
      ),
  },
  mechanism_accepted: {
    focus: "request",
    page: "allocate",
    title: ({ goalName }) =>
      withGoalName(
        goalName,
        (name) => `Allocation mechanism accepted in ${name}.`,
        "Allocation mechanism accepted by governance."
      ),
    excerpt: () => "The allocation mechanism request cleared governance and is queued for activation.",
  },
  mechanism_activated: {
    focus: "mechanism",
    page: "allocate",
    title: ({ goalName }) =>
      withGoalName(
        goalName,
        (name) => `Allocation mechanism activated in ${name}.`,
        "Allocation mechanism activated."
      ),
    excerpt: () => "The allocation mechanism is now active for allocations.",
  },
  mechanism_removal_requested: {
    focus: "request",
    page: "allocate",
    title: ({ goalName }) =>
      withGoalName(
        goalName,
        (name) => `Allocation mechanism removal requested in ${name}.`,
        "Allocation mechanism removal requested."
      ),
    excerpt: ({ actorLabel }) =>
      withActorLabel(
        actorLabel,
        (label) => `${label} requested allocation mechanism removal.`,
        "A removal request was submitted for this allocation mechanism."
      ),
  },
  mechanism_removal_accepted: {
    focus: "request",
    page: "allocate",
    title: ({ goalName }) =>
      withGoalName(
        goalName,
        (name) => `Allocation mechanism removal accepted in ${name}.`,
        "Allocation mechanism removal accepted."
      ),
    excerpt: () =>
      "The allocation mechanism removal request cleared governance and is queued for final removal.",
  },
  mechanism_removed: {
    focus: "mechanism",
    page: "allocate",
    title: ({ goalName }) =>
      withGoalName(
        goalName,
        (name) => `Allocation mechanism removed in ${name}.`,
        "Allocation mechanism removed."
      ),
    excerpt: () => "The allocation mechanism was detached from active allocation.",
  },
  goal_active: {
    focus: "goal",
    page: "events",
    title: ({ goalName }) =>
      withGoalName(goalName, (name) => `${name} is now active.`, "Goal is now active."),
    excerpt: () => "The goal has moved from funding into the active phase.",
  },
  goal_succeeded: {
    focus: "goal",
    page: "events",
    title: ({ goalName }) =>
      withGoalName(goalName, (name) => `${name} succeeded.`, "Goal succeeded."),
    excerpt: () => "The goal reached a succeeded terminal state.",
  },
  goal_expired: {
    focus: "goal",
    page: "events",
    title: ({ goalName }) =>
      withGoalName(goalName, (name) => `${name} expired.`, "Goal expired."),
    excerpt: () => "The goal reached an expired terminal state.",
  },
  juror_dispute_created: {
    focus: focusDisputeOrRequest,
    page: "events",
    title: ({ goalName }) =>
      withGoalName(goalName, (name) => `New juror dispute in ${name}.`, "New juror dispute."),
    excerpt: () => "A new dispute is waiting for juror attention.",
  },
  juror_voting_open: {
    focus: focusDisputeOrRequest,
    page: "events",
    title: ({ goalName }) =>
      withGoalName(goalName, (name) => `Juror voting opened in ${name}.`, "Juror voting is open."),
    excerpt: () => "Voting is now open on this dispute.",
  },
  juror_reveal_open: {
    focus: focusDisputeOrRequest,
    page: "events",
    title: ({ goalName }) =>
      withGoalName(goalName, (name) => `Juror reveal opened in ${name}.`, "Juror reveal is open."),
    excerpt: () => "Reveal is now open for your committed vote.",
  },
  juror_ruling_final: {
    focus: focusDisputeOrRequest,
    page: "events",
    title: ({ goalName }) =>
      withGoalName(goalName, (name) => `Juror ruling finalized in ${name}.`, "Juror ruling finalized."),
    excerpt: () => "The dispute finished with a final ruling.",
  },
  juror_slashable: {
    focus: focusDisputeOrRequest,
    page: "events",
    title: ({ goalName }) =>
      withGoalName(goalName, (name) => `Juror slash risk in ${name}.`, "Juror slash risk."),
    excerpt: () => "The dispute resolved in a way that may leave your juror stake slashable.",
  },
  juror_slashed: {
    focus: focusDisputeOrRequest,
    page: "events",
    title: ({ goalName }) =>
      withGoalName(goalName, (name) => `Juror slashed in ${name}.`, "Juror slashed."),
    excerpt: () => "A slash was applied to your juror stake.",
  },
} as const satisfies Record<string, StandardProtocolNotificationDescriptor>;

const ROLE_AWARE_PROTOCOL_NOTIFICATION_COPY = {
  requester: {
    budget_proposed: {
      title: ({ goalName }) =>
        withGoalName(goalName, (name) => `You proposed a new budget in ${name}.`, "You proposed a new budget."),
      excerpt: () => "Your budget request entered governance.",
    },
    budget_proposal_challenged: {
      title: ({ goalName }) =>
        withGoalName(goalName, (name) => `Your budget proposal was challenged in ${name}.`, "Your budget proposal was challenged."),
      excerpt: ({ actorLabel }) =>
        withActorLabel(actorLabel, (label) => `${label} challenged your budget proposal.`, "Your budget proposal moved into dispute."),
    },
    budget_accepted: {
      title: ({ goalName }) =>
        withGoalName(goalName, (name) => `Your budget proposal was accepted in ${name}.`, "Your budget proposal was accepted."),
      excerpt: () => "Governance accepted your proposal and queued it for activation.",
    },
    budget_activated: {
      title: ({ goalName }) =>
        withGoalName(goalName, (name) => `Your budget was activated in ${name}.`, "Your budget was activated."),
      excerpt: () => "Your budget is now active for funding.",
    },
    budget_removal_requested: {
      title: ({ goalName }) =>
        withGoalName(goalName, (name) => `You requested budget removal in ${name}.`, "You requested budget removal."),
      excerpt: () => "Your removal request entered governance.",
    },
    budget_removal_challenged: {
      title: ({ goalName }) =>
        withGoalName(goalName, (name) => `Your removal request was challenged in ${name}.`, "Your removal request was challenged."),
      excerpt: ({ actorLabel }) =>
        withActorLabel(actorLabel, (label) => `${label} challenged your removal request.`, "Your removal request moved into dispute."),
    },
    budget_removal_accepted: {
      title: ({ goalName }) =>
        withGoalName(goalName, (name) => `Your removal request was accepted in ${name}.`, "Your removal request was accepted."),
      excerpt: () => "Governance accepted your removal request and queued final removal.",
    },
    budget_removed: {
      title: ({ goalName }) =>
        withGoalName(goalName, (name) => `Your removal request completed in ${name}.`, "Your removal request completed."),
      excerpt: () => "Your removal request completed and the budget was detached from active funding.",
    },
    mechanism_proposed: {
      title: ({ goalName }) =>
        withGoalName(goalName, (name) => `You proposed a new allocation mechanism in ${name}.`, "You proposed a new allocation mechanism."),
      excerpt: () => "Your allocation mechanism request entered governance.",
    },
    mechanism_challenged: {
      title: ({ goalName }) =>
        withGoalName(goalName, (name) => `Your allocation mechanism request was challenged in ${name}.`, "Your allocation mechanism request was challenged."),
      excerpt: ({ actorLabel }) =>
        withActorLabel(actorLabel, (label) => `${label} challenged your allocation mechanism request.`, "Your allocation mechanism request moved into dispute."),
    },
    mechanism_accepted: {
      title: ({ goalName }) =>
        withGoalName(goalName, (name) => `Your allocation mechanism request was accepted in ${name}.`, "Your allocation mechanism request was accepted."),
      excerpt: () => "Governance accepted your allocation mechanism request and queued it for activation.",
    },
    mechanism_activated: {
      title: ({ goalName }) =>
        withGoalName(goalName, (name) => `Your allocation mechanism was activated in ${name}.`, "Your allocation mechanism was activated."),
      excerpt: () => "Your allocation mechanism is now active for allocations.",
    },
    mechanism_removal_requested: {
      title: ({ goalName }) =>
        withGoalName(goalName, (name) => `You requested allocation mechanism removal in ${name}.`, "You requested allocation mechanism removal."),
      excerpt: () => "Your allocation mechanism removal request entered governance.",
    },
    mechanism_removal_accepted: {
      title: ({ goalName }) =>
        withGoalName(goalName, (name) => `Your allocation mechanism removal request was accepted in ${name}.`, "Your allocation mechanism removal request was accepted."),
      excerpt: () => "Governance accepted your allocation mechanism removal request and queued final removal.",
    },
    mechanism_removed: {
      title: ({ goalName }) =>
        withGoalName(goalName, (name) => `Your removal request completed in ${name}.`, "Your removal request completed."),
      excerpt: () => "Your removal request completed and the allocation mechanism was detached from active allocation.",
    },
  },
  proposer: {
    budget_proposed: {
      title: ({ goalName }) =>
        withGoalName(goalName, (name) => `You proposed a new budget in ${name}.`, "You proposed a new budget."),
      excerpt: () => "Your budget request entered governance.",
    },
    budget_proposal_challenged: {
      title: ({ goalName }) =>
        withGoalName(goalName, (name) => `Your budget proposal was challenged in ${name}.`, "Your budget proposal was challenged."),
      excerpt: ({ actorLabel }) =>
        withActorLabel(actorLabel, (label) => `${label} challenged your budget proposal.`, "Your budget proposal moved into dispute."),
    },
    budget_accepted: {
      title: ({ goalName }) =>
        withGoalName(goalName, (name) => `Your budget proposal was accepted in ${name}.`, "Your budget proposal was accepted."),
      excerpt: () => "Governance accepted your proposal and queued it for activation.",
    },
    budget_activated: {
      title: ({ goalName }) =>
        withGoalName(goalName, (name) => `Your budget was activated in ${name}.`, "Your budget was activated."),
      excerpt: () => "Your budget is now active for funding.",
    },
    budget_removal_requested: {
      title: ({ goalName }) =>
        withGoalName(goalName, (name) => `Removal requested for your budget in ${name}.`, "Removal requested for your budget."),
      excerpt: ({ actorLabel }) =>
        withActorLabel(actorLabel, (label) => `${label} requested removal of your budget.`, "A removal request was submitted for your budget."),
    },
    budget_removal_challenged: {
      title: ({ goalName }) =>
        withGoalName(goalName, (name) => `Removal request challenged for your budget in ${name}.`, "Removal request challenged for your budget."),
      excerpt: ({ actorLabel }) =>
        withActorLabel(actorLabel, (label) => `${label} challenged a removal request for your budget.`, "A removal request for your budget moved into dispute."),
    },
    budget_removal_accepted: {
      title: ({ goalName }) =>
        withGoalName(goalName, (name) => `Removal accepted for your budget in ${name}.`, "Removal accepted for your budget."),
      excerpt: () => "The removal request for your budget cleared governance and is queued for final removal.",
    },
    budget_removed: {
      title: ({ goalName }) =>
        withGoalName(goalName, (name) => `Your budget was removed in ${name}.`, "Your budget was removed."),
      excerpt: () => "Your budget was detached from active funding.",
    },
    mechanism_proposed: {
      title: ({ goalName }) =>
        withGoalName(goalName, (name) => `You proposed a new allocation mechanism in ${name}.`, "You proposed a new allocation mechanism."),
      excerpt: () => "Your allocation mechanism request entered governance.",
    },
    mechanism_challenged: {
      title: ({ goalName }) =>
        withGoalName(goalName, (name) => `Your allocation mechanism request was challenged in ${name}.`, "Your allocation mechanism request was challenged."),
      excerpt: ({ actorLabel }) =>
        withActorLabel(actorLabel, (label) => `${label} challenged your allocation mechanism request.`, "Your allocation mechanism request moved into dispute."),
    },
    mechanism_accepted: {
      title: ({ goalName }) =>
        withGoalName(goalName, (name) => `Your allocation mechanism request was accepted in ${name}.`, "Your allocation mechanism request was accepted."),
      excerpt: () => "Governance accepted your allocation mechanism request and queued it for activation.",
    },
    mechanism_activated: {
      title: ({ goalName }) =>
        withGoalName(goalName, (name) => `Your allocation mechanism was activated in ${name}.`, "Your allocation mechanism was activated."),
      excerpt: () => "Your allocation mechanism is now active for allocations.",
    },
    mechanism_removal_requested: {
      title: ({ goalName }) =>
        withGoalName(goalName, (name) => `Removal requested for your allocation mechanism in ${name}.`, "Removal requested for your allocation mechanism."),
      excerpt: ({ actorLabel }) =>
        withActorLabel(actorLabel, (label) => `${label} requested removal of your allocation mechanism.`, "A removal request was submitted for your allocation mechanism."),
    },
    mechanism_removal_accepted: {
      title: ({ goalName }) =>
        withGoalName(goalName, (name) => `Removal accepted for your allocation mechanism in ${name}.`, "Removal accepted for your allocation mechanism."),
      excerpt: () => "The removal request for your allocation mechanism cleared governance and is queued for final removal.",
    },
    mechanism_removed: {
      title: ({ goalName }) =>
        withGoalName(goalName, (name) => `Your allocation mechanism was removed in ${name}.`, "Your allocation mechanism was removed."),
      excerpt: () => "Your allocation mechanism was detached from active allocation.",
    },
  },
  challenger: {
    budget_proposal_challenged: {
      title: ({ goalName }) =>
        withGoalName(goalName, (name) => `You challenged a budget proposal in ${name}.`, "You challenged a budget proposal."),
      excerpt: () => "The budget proposal is now in dispute.",
    },
    budget_removal_challenged: {
      title: ({ goalName }) =>
        withGoalName(goalName, (name) => `You challenged a budget removal request in ${name}.`, "You challenged a budget removal request."),
      excerpt: () => "The removal request is now in dispute.",
    },
    mechanism_challenged: {
      title: ({ goalName }) =>
        withGoalName(goalName, (name) => `You challenged an allocation mechanism request in ${name}.`, "You challenged an allocation mechanism request."),
      excerpt: () => "The allocation mechanism request is now in dispute.",
    },
  },
} as const satisfies Record<
  RoleAwareProtocolNotificationRole,
  Partial<Record<string, RoleAwareProtocolNotificationCopy>>
>;

function resolveRoleAwareProtocolNotificationCopy(
  role: ProtocolNotificationRole | null,
  reason: string
): RoleAwareProtocolNotificationCopy | null {
  if (role !== "requester" && role !== "proposer" && role !== "challenger") {
    return null;
  }

  return (
    (
      ROLE_AWARE_PROTOCOL_NOTIFICATION_COPY[role] as Partial<
        Record<string, RoleAwareProtocolNotificationCopy>
      >
    )[reason] ?? null
  );
}

function resolveStandardProtocolNotificationDescriptor(
  reason: string
): StandardProtocolNotificationDescriptor | null {
  return (
    STANDARD_PROTOCOL_NOTIFICATION_DESCRIPTORS[
      reason as keyof typeof STANDARD_PROTOCOL_NOTIFICATION_DESCRIPTORS
    ] ?? null
  );
}

function focusForProtocolNotification(
  reason: string,
  payload: ProtocolNotificationPayload | null
): ProtocolRouteFocus | null {
  if (parseSuccessAssertionReason(reason)) {
    return "success_assertion";
  }

  if (parseChallengeWindowReminderContext(reason, payload)) {
    return "request";
  }

  if (isJurorVoteDeadlineReminder(reason) || isJurorRevealDeadlineReminder(reason)) {
    return "dispute";
  }

  if (isJurorRewardReason(reason)) {
    const resource = payload?.resource ?? null;
    return resource?.disputeId || resource?.arbitrator ? "dispute" : null;
  }

  const descriptor = resolveStandardProtocolNotificationDescriptor(reason);
  if (!descriptor) {
    return null;
  }

  return typeof descriptor.focus === "function" ? descriptor.focus(payload) : descriptor.focus;
}

export function pageForProtocolNotification(
  reason: string,
  payload?: ProtocolNotificationPayload | null
): "events" | "allocate" {
  const successAssertionReason = parseSuccessAssertionReason(reason);
  if (successAssertionReason) {
    return successAssertionReason.scope === "budget" ? "allocate" : "events";
  }

  const requestChallengeReminderContext = parseChallengeWindowReminderContext(reason, payload ?? null);
  if (requestChallengeReminderContext) {
    return requestChallengeReminderContext.startsWith("mechanism") ? "allocate" : "events";
  }

  return resolveStandardProtocolNotificationDescriptor(reason)?.page ?? "events";
}

function takeFirst(value: string | string[] | undefined): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
  }
  if (Array.isArray(value)) {
    return takeFirst(value[0]);
  }
  return null;
}

function normalizeFocus(value: string | null): ProtocolRouteFocus | null {
  switch (value) {
    case "request":
    case "dispute":
    case "budget":
    case "mechanism":
    case "goal":
    case "success_assertion":
    case "underwriter":
    case "premium":
      return value;
    default:
      return null;
  }
}

function buildHintCopy(
  page: "events" | "allocate",
  focus: ProtocolRouteFocus
): Omit<ProtocolRouteHint, "chips"> {
  if (page === "events") {
    switch (focus) {
      case "request":
        return {
          title: "Focused governance request",
          description: "This notification points to a specific request cycle for this goal.",
          focusSectionId: null,
        };
      case "dispute":
        return {
          title: "Focused dispute context",
          description: "This notification references a challenged request or juror dispute.",
          focusSectionId: null,
        };
      case "success_assertion":
        return {
          title: "Focused success assertion update",
          description:
            "This notification references a goal-level success assertion lifecycle event.",
          focusSectionId: null,
        };
      case "goal":
      default:
        return {
          title: "Focused goal update",
          description: "This notification points to a goal-wide lifecycle transition.",
          focusSectionId: null,
        };
    }
  }

  switch (focus) {
    case "mechanism":
      return {
        title: "Focused allocation mechanism",
        description: "This notification points to an allocation mechanism lifecycle update.",
        focusSectionId: "funding-flow",
      };
    case "success_assertion":
      return {
        title: "Focused success assertion update",
        description: "This notification points to a budget success-assertion lifecycle update.",
        focusSectionId: "funding-flow",
      };
    case "underwriter":
      return {
        title: "Focused underwriter action",
        description: "This notification points to an underwriting action or slash event.",
        focusSectionId: "position-summary",
      };
    case "premium":
      return {
        title: "Focused premium activity",
        description:
          "This notification points to premium claim state for an underwriting position.",
        focusSectionId: "position-summary",
      };
    case "budget":
    default:
      return {
        title: "Focused budget context",
        description: "This notification points to a budget lifecycle update in the allocate view.",
        focusSectionId: "funding-flow",
      };
  }
}

export function resolveProtocolRouteState(searchParams: RawSearchParams): ProtocolRouteState {
  return {
    focus: normalizeFocus(takeFirst(searchParams.focus)),
    budgetTreasury: normalizeHexAddress(takeFirst(searchParams.budgetTreasury)),
    itemId: normalizeHash(takeFirst(searchParams.itemId)),
    requestIndex: normalizeIntegerString(takeFirst(searchParams.requestIndex)),
    disputeId: normalizeIntegerString(takeFirst(searchParams.disputeId)),
    arbitrator: normalizeHexAddress(takeFirst(searchParams.arbitrator)),
  };
}

export function buildProtocolRouteHint(
  page: "events" | "allocate",
  state: ProtocolRouteState
): ProtocolRouteHint | null {
  if (!state.focus) return null;

  const hint = buildHintCopy(page, state.focus);
  const chips = [
    state.budgetTreasury
      ? {
          label: "Budget",
          value: shortenIdentifier(state.budgetTreasury) ?? state.budgetTreasury,
        }
      : null,
    state.itemId
      ? {
          label: "Item",
          value: shortenIdentifier(state.itemId) ?? state.itemId,
        }
      : null,
    state.requestIndex
      ? {
          label: "Request",
          value: `#${state.requestIndex}`,
        }
      : null,
    state.disputeId
      ? {
          label: "Dispute",
          value: `#${state.disputeId}`,
        }
      : null,
    state.arbitrator
      ? {
          label: "Arbitrator",
          value: shortenIdentifier(state.arbitrator) ?? state.arbitrator,
        }
      : null,
  ].filter((value): value is { label: string; value: string } => value !== null);

  return {
    ...hint,
    chips,
  };
}

export function buildProtocolNotificationRouteState(
  payload: ProtocolNotificationPayload | null,
  reason?: string
): ProtocolRouteState {
  const resource = payload?.resource ?? null;

  return {
    focus: reason ? focusForProtocolNotification(reason, payload) : null,
    budgetTreasury: resource?.budgetTreasury ?? null,
    itemId: resource?.itemId ?? null,
    requestIndex: resource?.requestIndex ?? null,
    disputeId: resource?.disputeId ?? null,
    arbitrator: resource?.arbitrator ?? null,
  };
}

export function buildProtocolRouteSearchParams(state: ProtocolRouteState): URLSearchParams {
  const params = new URLSearchParams();
  if (state.budgetTreasury) params.set("budgetTreasury", state.budgetTreasury);
  if (state.itemId) params.set("itemId", state.itemId);
  if (state.requestIndex) params.set("requestIndex", state.requestIndex);
  if (state.disputeId) params.set("disputeId", state.disputeId);
  if (state.arbitrator) params.set("arbitrator", state.arbitrator);
  if (state.focus) params.set("focus", state.focus);
  return params;
}

export function buildProtocolNotificationAppPath(
  payload: ProtocolNotificationPayload | null,
  reason?: string
): string {
  const goalTreasury = payload?.resource?.goalTreasury ?? null;
  if (!goalTreasury) return "/notifications";

  const query = buildProtocolRouteSearchParams(
    buildProtocolNotificationRouteState(payload, reason)
  ).toString();
  const page = reason ? pageForProtocolNotification(reason, payload) : "events";
  const basePath = `/${goalTreasury}/${page}`;
  return query ? `${basePath}?${query}` : basePath;
}

export function buildDiscussionNotificationAppPath(
  sourceHash: string | null,
  rootHash: string | null
): string | null {
  const normalizedSourceHash = normalizeHash(sourceHash);
  const normalizedRootHash = normalizeHash(rootHash);
  if (!normalizedSourceHash) {
    return null;
  }
  if (!normalizedRootHash || normalizedSourceHash === normalizedRootHash) {
    return `/cast/${normalizedSourceHash}`;
  }
  return `/cast/${normalizedRootHash}?post=${normalizedSourceHash}`;
}

function roleAwareTitle(
  reason: string,
  goalName: string | null,
  role: ProtocolNotificationRole | null
): string | null {
  return (
    resolveRoleAwareProtocolNotificationCopy(role, reason)?.title({
      goalName,
      actorLabel: null,
      payload: null,
    }) ?? null
  );
}

function successAssertionScopeLabel(scope: SuccessAssertionScope): string {
  return scope === "goal" ? "Goal" : "Budget";
}

function successAssertionScopeNoun(scope: SuccessAssertionScope): string {
  return scope === "goal" ? "goal" : "budget";
}

function buildExtendedSuccessAssertionTitle(
  reason: string,
  goalName: string | null
): string | null {
  const parsed = parseSuccessAssertionReason(reason);
  if (!parsed) return null;

  const scopeLabel = successAssertionScopeLabel(parsed.scope);
  switch (parsed.normalizedState) {
    case "finalize_failed":
      return goalName
        ? `${scopeLabel} success assertion finalization failed in ${goalName}.`
        : `${scopeLabel} success assertion finalization failed.`;
    case "disputed":
      return goalName
        ? `${scopeLabel} success assertion disputed in ${goalName}.`
        : `${scopeLabel} success assertion disputed.`;
    case "resolved":
      return goalName
        ? `${scopeLabel} success assertion resolved in ${goalName}.`
        : `${scopeLabel} success assertion resolved.`;
    case "settled":
      return goalName
        ? `${scopeLabel} success assertion settled in ${goalName}.`
        : `${scopeLabel} success assertion settled.`;
    case "reassert_grace_ending_soon":
      return goalName
        ? `${scopeLabel} reassert grace ending soon in ${goalName}.`
        : `${scopeLabel} reassert grace ending soon.`;
    case "registered":
    case "cleared":
    case "resolution_fail_closed":
    case "reassert_grace_activated":
      return null;
  }

  return null;
}

function buildExtendedSuccessAssertionExcerpt(reason: string): string | null {
  const parsed = parseSuccessAssertionReason(reason);
  if (!parsed) return null;

  const scopeNoun = successAssertionScopeNoun(parsed.scope);
  switch (parsed.normalizedState) {
    case "finalize_failed":
      return `The ${scopeNoun} success assertion could not be finalized cleanly and needs follow-up.`;
    case "disputed":
      return `The ${scopeNoun} success assertion moved into dispute.`;
    case "resolved":
      return `The resolver marked this ${scopeNoun} success assertion as resolved.`;
    case "settled":
      return `The oracle settled this ${scopeNoun} success assertion.`;
    case "reassert_grace_ending_soon":
      return `The reassert grace window for this ${scopeNoun} success assertion is ending soon.`;
    case "registered":
    case "cleared":
    case "resolution_fail_closed":
    case "reassert_grace_activated":
      return null;
  }

  return null;
}

function formatRewardBucketLabel(value: string | null): string | null {
  if (!value) return null;

  const normalized = value.replace(/[_-]+/g, " ").trim();
  return normalized === "" ? null : normalized;
}

function rewardBucketLabel(payload: ProtocolNotificationPayload | null): string | null {
  return (
    formatRewardBucketLabel(payload?.reward?.bucketLabel ?? null) ??
    formatRewardBucketLabel(payload?.reward?.bucket ?? null)
  );
}

function buildJurorRewardTitle(
  reason: string,
  goalName: string | null,
  payload: ProtocolNotificationPayload | null
): string | null {
  if (!isJurorRewardReason(reason)) return null;

  const bucketLabel = rewardBucketLabel(payload);
  const subject = bucketLabel ? `Juror ${bucketLabel} reward` : "Juror reward";
  if (reason === "juror_reward_claimable") {
    return goalName ? `${subject} ready to claim in ${goalName}.` : `${subject} ready to claim.`;
  }
  return goalName ? `${subject} claimed in ${goalName}.` : `${subject} claimed.`;
}

function buildJurorRewardExcerpt(
  reason: string,
  payload: ProtocolNotificationPayload | null
): string | null {
  if (!isJurorRewardReason(reason)) return null;

  const bucketLabel = rewardBucketLabel(payload);
  if (reason === "juror_reward_claimable") {
    return bucketLabel
      ? `A juror reward is now claimable from the ${bucketLabel} bucket.`
      : "A juror reward is now claimable from this dispute.";
  }
  return bucketLabel
    ? `A juror reward claim was completed from the ${bucketLabel} bucket.`
    : "A juror reward claim was completed for this dispute.";
}

function buildReminderTitle(
  reason: string,
  goalName: string | null,
  payload: ProtocolNotificationPayload | null
): string | null {
  const requestContext = parseChallengeWindowReminderContext(reason, payload);
  if (requestContext) {
    const copy = REQUEST_CHALLENGE_REMINDER_COPY[requestContext];
    return goalName ? `${copy.title} in ${goalName}.` : `${copy.title}.`;
  }

  if (isChallengeWindowReminderReason(reason)) {
    return goalName ? `Challenge window ending soon in ${goalName}.` : "Challenge window ending soon.";
  }

  if (isJurorVoteDeadlineReminder(reason)) {
    return goalName ? `Juror vote deadline soon in ${goalName}.` : "Juror vote deadline soon.";
  }

  if (isJurorRevealDeadlineReminder(reason)) {
    return goalName ? `Juror reveal deadline soon in ${goalName}.` : "Juror reveal deadline soon.";
  }

  return null;
}

function buildReminderExcerpt(
  reason: string,
  payload: ProtocolNotificationPayload | null
): string | null {
  const requestContext = parseChallengeWindowReminderContext(reason, payload);
  if (requestContext) {
    return REQUEST_CHALLENGE_REMINDER_COPY[requestContext].excerpt;
  }

  if (isChallengeWindowReminderReason(reason)) {
    return "The current challenge window is ending soon.";
  }

  if (isJurorVoteDeadlineReminder(reason)) {
    return "Cast your vote before the voting window closes.";
  }

  if (isJurorRevealDeadlineReminder(reason)) {
    return "Reveal your vote before the reveal window closes.";
  }

  return null;
}

function buildTitle(
  reason: string,
  goalName: string | null,
  role: ProtocolNotificationRole | null,
  payload: ProtocolNotificationPayload | null
): string {
  const personalizedTitle = roleAwareTitle(reason, goalName, role);
  if (personalizedTitle) return personalizedTitle;

  const successAssertionTitle = buildExtendedSuccessAssertionTitle(reason, goalName);
  if (successAssertionTitle) return successAssertionTitle;

  const jurorRewardTitle = buildJurorRewardTitle(reason, goalName, payload);
  if (jurorRewardTitle) return jurorRewardTitle;

  const reminderTitle = buildReminderTitle(reason, goalName, payload);
  if (reminderTitle) return reminderTitle;

  const descriptor = resolveStandardProtocolNotificationDescriptor(reason);
  if (descriptor) {
    return descriptor.title({
      goalName,
      actorLabel: null,
      payload,
    });
  }

  return goalName ? `Protocol update for ${goalName}.` : "Protocol update.";
}

function roleAwareExcerpt(
  reason: string,
  actorWalletAddress: string | null,
  role: ProtocolNotificationRole | null
): string | null {
  const actorLabel = shortenIdentifier(actorWalletAddress);
  return (
    resolveRoleAwareProtocolNotificationCopy(role, reason)?.excerpt({
      goalName: null,
      actorLabel,
      payload: null,
    }) ?? null
  );
}

function buildExcerpt(
  reason: string,
  actorWalletAddress: string | null,
  role: ProtocolNotificationRole | null,
  payload: ProtocolNotificationPayload | null
): string | null {
  const personalizedExcerpt = roleAwareExcerpt(reason, actorWalletAddress, role);
  if (personalizedExcerpt) return personalizedExcerpt;

  const successAssertionExcerpt = buildExtendedSuccessAssertionExcerpt(reason);
  if (successAssertionExcerpt) return successAssertionExcerpt;

  const jurorRewardExcerpt = buildJurorRewardExcerpt(reason, payload);
  if (jurorRewardExcerpt) return jurorRewardExcerpt;

  const reminderExcerpt = buildReminderExcerpt(reason, payload);
  if (reminderExcerpt) return reminderExcerpt;

  const actorLabel = shortenIdentifier(actorWalletAddress);
  const descriptor = resolveStandardProtocolNotificationDescriptor(reason);
  if (descriptor) {
    return descriptor.excerpt({
      goalName: null,
      actorLabel,
      payload,
    });
  }

  return null;
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
    normalizeHexAddress(args.actorWalletAddress) ?? payload?.actor?.walletAddress ?? null;

  return {
    title: buildTitle(args.reason, goalName, role, payload),
    excerpt: buildExcerpt(args.reason, actorWalletAddress, role, payload),
    appPath: buildProtocolNotificationAppPath(payload, args.reason),
    actorName: shortenIdentifier(actorWalletAddress),
  };
}
