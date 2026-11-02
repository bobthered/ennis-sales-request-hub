# Ennis Sales Request Hub

Keep project work inside this directory.

## Stack

- SvelteKit 3, Svelte 5 runes, TypeScript, npm, and the Vercel adapter.
- MongoDB via Mongoose. Keep models and database code in `src/lib/server`; use the Node runtime.
- The user will provide the database connection script. Do not invent credentials or connect before it is supplied.

## Components

- Always use components from `sveltewind/components`, including form controls and layout primitives.
- Custom components must follow Sveltewind architecture: typed `$props`, snippets for children, native attribute forwarding, `class`, `theme` defaulting to the shared theme, `variants`, and `$derived(theme.resolve(...))`. Support element binding, visibility, and transitions where applicable. Compose Sveltewind primitives.
- Read https://sveltewind.com/getting-started/usage, https://sveltewind.com/getting-started/theming and installed component source before creating custom components.
- Shared theme: `src/lib/theme.ts`. Tailwind source directive and palette CSS: `src/routes/layout.css`.
- Use clear labels, large controls, and a simple recipient experience.

## Product rules

- Creators sign in and manage their own requests. Recipients follow emailed links without accounts.
- Creators choose response visibility: creator-only (plus each recipient's own response), or everyone with the link. Explain visibility before submission.
- Recipients can revise only their own response while the request is open via a separate edit token. Store token hashes, never plaintext edit tokens, in MongoDB.
- Participation is voluntary. No required invite list, participation tracking, or automatic reminders.
- Shared attachments and Questions & Answers belong to requests. Recipients ask; only creators answer.
- Before enabling writes, enforce ownership, visibility, edit tokens, and open/closed status on the server. Never expose private answers or edit tokens through public loaders.
- Current routes are sample previews, not authenticated or persistent functionality. Keep this explicit until backend work is complete.

## Validation

Run `npm run check`, `npm run lint`, and `npm run build` after meaningful changes.
