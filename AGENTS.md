<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Development & Git Workflow Rules

1. **Always Pull Main First**: Before creating any new branch for a feature, bugfix, or phase, always checkout `main` and run `git pull origin main` to ensure the branch starts from the latest upstream state.
2. **Issue-Driven Development**: Every new branch must have a corresponding GitHub issue created first (e.g. using `gh issue create`).
3. **PR & Issue Linking**: When raising a Pull Request for a branch, always link and reference the corresponding GitHub issue in the PR description (e.g., `Closes #<issue_number>` or `Resolves #<issue_number>`).
