---
name: Duplicate/stale artifact directories can cause port conflicts
description: How to recognize and safely remove leftover pre-merge duplicate artifact directories in this workspace.
---

- After a task-agent merge integrating a new feature (e.g. TemperaMap) into an existing artifact, the OLD pre-merge artifact directory can be left behind as a duplicate (same artifact type/workflow name pattern, different top-level folder), still wired into workflows and `.replit-artifact/artifact.toml`.
- Symptom: a workflow fails with `EADDRINUSE` on startup even though only one workflow *should* be using that port — check `ps aux` for orphaned node processes and compare directory contents (`diff -rq`) between the suspected duplicate and the canonical directory. The stale one typically has older/pre-rename route files (e.g. non-prefixed route names that were later renamed with a feature prefix during integration).
- Fix: delete the stale duplicate directory entirely, then `kill -9` any lingering orphaned process still holding the port before restarting the real workflow — deleting the directory does not kill an already-running process.
**Why:** Found `artifacts-TEMPERAMAP/*` duplicating `artifacts/*` after a TemperaMap integration merge; it was the pre-integration version and blocked the real `artifacts/api-server` from binding port 8080.
