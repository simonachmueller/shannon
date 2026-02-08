# OpenCode Migration Progress (Local)

Last updated: 2026-02-08

## Current Status

- Working branch: `feat/opencode-backend-validation`
- Base integration branch: `feat/opencode-backend-bootstrap`
- Local changes in this branch harden AI backend selection and validation.

## Completed Iterations (already merged into `feat/opencode-backend-bootstrap`)

1. OpenCode backend bootstrap and runtime wiring.
2. OpenCode MCP bridge (`shannon-helper` + Playwright MCP mapping).
3. Backend metadata propagation into activity/query metrics.
4. Session-based OpenCode turn/cost derivation from session messages.
5. Runtime metadata persistence to `session.json` and report injection.
6. OpenCode provider error mapping to Temporal retry semantics.

## This Branch (`feat/opencode-backend-validation`)

### Included Changes

- Normalize `AI_BACKEND` in CLI to lowercase and validate allowed values:
  - `anthropic`
  - `opencode`
- Fail fast in CLI when unsupported backend value is provided.
- Add backend validation in runtime factory and throw explicit config error for invalid backend values.

### Files Changed

- `shannon`
- `src/ai/backend/factory.ts`

## Why this step

- Prevent silent fallback behavior from invalid backend settings.
- Make misconfiguration obvious before expensive workflow execution.
- Keep backend-selection behavior consistent between shell entrypoint and TS runtime.

## Next Steps

1. Run Docker validation with `AI_BACKEND=opencode` (no local tests due antivirus interference).
2. Confirm MCP tool calls work inside container (`save_deliverable`, `generate_totp`).
3. Confirm report metadata includes backend/model fields.
4. Iterate on any runtime/container issues in small follow-up PRs.

## Docker Validation Plan

```bash
./shannon stop CLEAN=true
AI_BACKEND=opencode REBUILD=true ./shannon start URL=https://example.com REPO=/target-repo PIPELINE_TESTING=true
./shannon logs
```

Recommended success signals:

- Workflow starts and agents run in Temporal.
- OpenCode backend starts without CLI/config errors.
- Deliverables are written via helper MCP tools.
- Final report includes backend/model runtime metadata.
