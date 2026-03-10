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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

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

function shortenAddress(value: string | null): string | null {
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
  if (
    !reason.endsWith("challenge_window_ending_soon")
  ) {
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

function focusForProtocolNotification(
  reason: string,
  payload: ProtocolNotificationPayload | null
): ProtocolRouteFocus | null {
  const resource = payload?.resource ?? null;
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
    return resource?.disputeId || resource?.arbitrator ? "dispute" : null;
  }

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
    case "budget_success_resolution_disabled":
      return "success_assertion";
    case "mechanism_activated":
    case "mechanism_removed":
      return "mechanism";
    case "underwriter_slashed":
    case "underwriter_withdrawal_prep_required":
    case "underwriter_withdrawal_prep_complete":
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

  switch (reason) {
    case "budget_activated":
    case "budget_removed":
    case "budget_active":
    case "budget_succeeded":
    case "budget_failed":
    case "budget_expired":
    case "budget_success_resolution_disabled":
    case "underwriter_slashed":
    case "underwriter_withdrawal_prep_required":
    case "underwriter_withdrawal_prep_complete":
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

function shortenHex(value: string | null): string | null {
  if (!value) return null;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
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
          value: shortenHex(state.budgetTreasury) ?? state.budgetTreasury,
        }
      : null,
    state.itemId
      ? {
          label: "Item",
          value: shortenHex(state.itemId) ?? state.itemId,
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
          value: shortenHex(state.arbitrator) ?? state.arbitrator,
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
    switch (requestContext) {
      case "budget_request":
        return goalName
          ? `Budget challenge window ending soon in ${goalName}.`
          : "Budget challenge window ending soon.";
      case "budget_removal":
        return goalName
          ? `Budget removal challenge window ending soon in ${goalName}.`
          : "Budget removal challenge window ending soon.";
      case "mechanism_request":
        return goalName
          ? `Allocation mechanism challenge window ending soon in ${goalName}.`
          : "Allocation mechanism challenge window ending soon.";
      case "mechanism_removal":
        return goalName
          ? `Allocation mechanism removal challenge window ending soon in ${goalName}.`
          : "Allocation mechanism removal challenge window ending soon.";
    }
  }

  if (
    reason.endsWith("challenge_window_ending_soon")
  ) {
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
    switch (requestContext) {
      case "budget_request":
        return "The current challenge window for this budget request is ending soon.";
      case "budget_removal":
        return "The current challenge window for this budget removal request is ending soon.";
      case "mechanism_request":
        return "The current challenge window for this allocation mechanism request is ending soon.";
      case "mechanism_removal":
        return "The current challenge window for this allocation mechanism removal request is ending soon.";
    }
  }

  if (
    reason.endsWith("challenge_window_ending_soon")
  ) {
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
    case "underwriter_withdrawal_prep_complete":
      return goalName ? `Withdrawal prep complete in ${goalName}.` : "Withdrawal prep complete.";
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
    case "underwriter_withdrawal_prep_complete":
      return "Your withdrawal is prepared. You can now withdraw stake from this resolved goal.";
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
    normalizeHexAddress(args.actorWalletAddress) ?? payload?.actor?.walletAddress ?? null;

  return {
    title: buildTitle(args.reason, goalName, role, payload),
    excerpt: buildExcerpt(args.reason, actorWalletAddress, role, payload),
    appPath: buildProtocolNotificationAppPath(payload, args.reason),
    actorName: shortenAddress(actorWalletAddress),
  };
}
