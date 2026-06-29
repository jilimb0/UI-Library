# Governance

This document describes how the UI Construction Library project is governed.

## Maintainers

The project is maintained by a core team of maintainers who are responsible for:

- Reviewing and merging pull requests
- Cutting releases and publishing packages
- Enforcing the code of conduct
- Setting the project roadmap and priorities

### Current maintainers

- [@jilimb0](https://github.com/jilimb0) — Project lead, architecture, core components

## Decision-making

Decisions are made by lazy consensus:

1. **Proposal**: Open a GitHub Discussion or issue describing the change.
2. **Discussion**: Maintainers and community discuss for a minimum of 3 business days.
3. **Consensus**: If no objections are raised, the proposal is accepted.
4. **Objections**: If someone raises a blocking objection, the proposal is refined or escalated to the project lead.

For urgent security fixes, maintainers may bypass this process and merge immediately. A post-mortem is shared within 5 business days.

## RFC process

Substantial changes (new packages, breaking API changes, architectural decisions) require an RFC:

1. Create a markdown document in `docs/adr/` following the ADR template.
2. Submit as a pull request.
3. Discussion period: minimum 5 business days.
4. A maintainer merges or rejects the RFC.

## Contribution ladder

| Role | Rights | How to attain |
|------|--------|---------------|
| Contributor | Submit PRs, open issues, participate in discussions | Sign CLA, make one accepted contribution |
| Maintainer | Merge PRs, manage issues, vote on decisions | Consistent contributions over 6+ months, nominated by existing maintainer |

## Code of conduct enforcement

All community spaces follow the [Code of Conduct](.github/CODE_OF_CONDUCT.md). Reports should be sent to conduct@ui-library.com.

## Subproject ownership

Each package has a designated owner listed in `docs/ownership/PACKAGE_OWNERSHIP.md`. Package owners are responsible for reviewing changes to their package and maintaining its quality gates.
