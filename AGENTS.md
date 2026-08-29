# Codex instructions — ShortBär Trading OS

Read `docs/PROJECT.md` first. It is the central technical project documentation.

The associated Notion page is the product workspace for ideas, bugs, open requirements, decisions and current product state. The current repository/code is the technical truth for what is actually implemented.

## Standard command

When the user writes **“Notion Sync durchführen”**:

1. Read this file and `docs/PROJECT.md`.
2. Read only the current Notion sections: `CURRENT STATE`, `INBOX`, `OPEN`, `WAITING FOR ME` and relevant `PRODUCT DECISIONS`.
3. Do not load the full historical changelog unless needed.
4. Verify each new request against the current code before changing anything.
5. Classify requests as bug, feature, improvement, question or user decision.
6. Implement only clearly defined changes; avoid unrelated refactors.
7. Run the relevant checks, normally `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.
8. Update `docs/PROJECT.md` only when durable technical truth changes.
9. Update Notion: clear processed Inbox items, update Open/Waiting/Current State, add a compact Changelog entry.
10. Report what changed, what was tested and what still needs a user decision.

## Guardrails

- Never invent trading rules, market data, event dates or signal logic.
- Put unresolved trading/product decisions into `WAITING FOR ME`.
- Do not add broker/order execution unless explicitly requested and specified.
- Preserve local user data and migrations when the data model changes.
- Do not store secrets, API keys or tokens in Git or Notion.
- Respect iOS/PWA platform limitations; do not claim unsupported behavior is guaranteed.
- `STATUS.md` and `UPDATES.md` are useful context but are not the central technical source of truth.
