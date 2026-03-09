# Wire Release And Consumer Bump

## Goal

Publish a new `@cobuild/wire` release with the refreshed Base implementation addresses and regenerated ABI surface, then move downstream consumers back onto that published version.

## Scope

- Release a new patch version of `@cobuild/wire`.
- Keep unrelated dirty work out of the release commit and publish flow.
- Update downstream `@cobuild/wire` consumers to the released version after publish.

## Constraints

- Preserve the refreshed ABI/address payload already verified locally.
- Do not ship local-link/file-spec consumer dependencies.
- Restore any temporarily hidden unrelated worktree changes after release.

## Done

- Verified the refreshed `wire` payload locally before release prep.
- Confirmed the repository is on `main`.
- Confirmed the release tooling requires a clean git tree before publish.
- Committed the refreshed Base address and ABI payload.
- Released `@cobuild/wire@0.1.6` and pushed tag `v0.1.6`.
- Waited for npm visibility, then updated downstream consumers to the published release.

## Now

- None.

## Next

- Keep downstream consumers on published semver-only `@cobuild/wire` specs for future ABI/address refreshes.
