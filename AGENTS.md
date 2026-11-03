# Ennis Sales Request Hub

Keep project work inside this directory.

## Stack

- SvelteKit 3, Svelte 5 runes, TypeScript, npm, and the Vercel adapter.
- MongoDB via Mongoose. Keep models and database code in `src/lib/server`; use the Node runtime.
- Database connection lives in `src/lib/server/db.ts`, using private `MONGODB_URI` and optional `MONGODB_DB_NAME` from `.env` (or Vercel environment variables). Never invent or commit credentials. The server hook connects when configured; builds and unconfigured previews skip connection. Await `connectDatabase()` before model operations outside the hook-managed request lifecycle. Reuse the default Mongoose connection; do not disconnect after each request.

## Components

- Always use components from `sveltewind/components`, including form controls and layout primitives.
- Custom components must follow Sveltewind architecture: typed `$props`, snippets for children, native attribute forwarding, `class`, `theme` defaulting to the shared theme, `variants`, and `$derived(theme.resolve(...))`. Support element binding, visibility, and transitions where applicable. Compose Sveltewind primitives.
- Read https://sveltewind.com/getting-started/usage, https://sveltewind.com/getting-started/theming and installed component source before creating custom components.
- Shared theme: `src/lib/theme.ts`. Tailwind source directive and palette CSS: `src/routes/layout.css`.
- Use clear labels, large controls, and a simple recipient experience.

## Product rules

- For the MVP, creators are identified by a persistent HttpOnly browser cookie; MongoDB stores its SHA-256 hash as creatorId. Scope all creator queries and mutations to that ID. Clearing cookies or switching browsers loses access; login and recovery links are not implemented. Recipients follow emailed links without accounts.
- Creators choose response visibility: creator-only (plus each recipient's own response), or everyone with the link. Explain visibility before submission.
- Recipients can revise only their own response while the request is open via a separate edit token. Store token hashes, never plaintext edit tokens, in MongoDB.
- Participation is voluntary. No required invite list, participation tracking, or automatic reminders.
- Shared attachments and Questions & Answers belong to requests. Recipients ask; only creators answer.
- Before enabling writes, enforce ownership, visibility, edit tokens, and open/closed status on the server. Never expose private answers or edit tokens through public loaders.
- Request creation, draft autosave, final save, and creator attachment uploads/downloads persist in MongoDB. Recipient links expose project details and attachments using hashed tokens. Recipient responses persist with a hashed edit token in an HttpOnly cookie for same-browser revisions. Pricing UOM is chosen on the request and locked on publishing; recipients cannot override it. Do not reintroduce sample requests.
- Starting a request is a POST operation: delete only this creator's untouched blank drafts, then create a new draft before opening the editor. Preserve any draft with activity, text, questions, a date, changed visibility, attachments, or a share token. Never delete another creator's drafts.
- Attachments are stored in MongoDB for this MVP: 1 MB per file, 3 MB total, at most 10 files per request. Normal queries must not return file bytes. Update these limits/storage together if requirements grow.

## Validation

Run `npm test`, `npm run check`, `npm run lint`, and `npm run build` after meaningful changes.

## Commit suggestions

- Before finishing a task, review the project's uncommitted changes, including staged, unstaged, and relevant untracked files, and provide a suggested commit message based on that review.
- Every suggested commit message must start with exactly one of these prefixes: `fix: `, `feat: `, or `refactor: `.
- Use `fix: ` for corrections, `feat: ` for new functionality, and `refactor: ` for restructuring or maintenance without a behavior change.
- Keep the message concise and describe the actual changes. Suggest only; do not create a commit unless requested.
