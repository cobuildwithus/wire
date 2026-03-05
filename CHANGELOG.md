# Changelog

All notable changes to this project will be documented in this file.

## [0.1.4] - 2026-03-05

### Added
- add Base builder code helpers
- sync v1-core impl addresses and regenerate wire abis

### Changed
- sync new base goal factory addresses
- sync latest base deployment addresses
- prefer local cli and enforce published dep
- run husky hooks before commit-tree writes
- close abi expansion ledger entry

## [0.1.3] - 2026-03-04

### Added
- expand goalconfigured event args
- add cobuild swap contract and impl addresses
- add uppercase cobuild protocol aliases
- export cobuild token and revnet aliases
- refresh base impl addresses and regenerate protocol abis
- sync base impl addresses and regenerate protocol abis
- centralize wire ensure-published bin

### Changed
- Update index.md
- tmp
- repull cobuild swap impl ABI from basescan
- remove snake-case cobuild exports
- add active plan to satisfy release drift gate
- more cutover
- remove manual ABI fallbacks from protocol ABI exports
- Update AGENTS.md
- centralize protocol ABIs in wire with wagmi generation

## [0.1.2] - 2026-03-03

### Added
- add wallet parity contracts and farcaster executable calls

### Changed
- Update doc-inventory.md

## [0.1.1] - 2026-03-03

### Added
- establish shared wire contract package

### Changed
- add pnpm release helper scripts
- add tag-driven npm publish workflow

## 0.1.0

- Initial wire contract package scaffolding.
