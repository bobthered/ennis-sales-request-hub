# Ennis Sales Request Hub

An MVP foundation for sharing sales requests and collecting branch responses.

## Local development

Requires Node 22.17 or newer within Node 22 and npm. From this folder:

```powershell
npm.cmd install
npm.cmd run dev -- --open
```

## Stack

SvelteKit 3, Svelte 5, TypeScript, Tailwind CSS 4, Sveltewind, and MongoDB/Mongoose. Vercel's adapter is configured in `vite.config.ts` for Node 22. Nothing has been deployed.

Sveltewind follows its [installation](https://sveltewind.com/getting-started/installation) and [theming](https://sveltewind.com/getting-started/theming) documentation. `src/routes/layout.css` scans the installed components and imports palette CSS. `src/lib/theme.ts` initializes the shared Classic theme. Components use `sveltewind/components`; custom compositions follow the same theme/variant architecture.

The header's cog opens appearance settings with Dark, Light, and OS choices. OS is the initial default. The head script in `src/app.html` reads the `ennis-theme` localStorage key before rendering, applies `data-theme` and native control color scheme, and follows live OS changes when OS is selected. Explicit choices persist across reloads and synchronize between tabs. If storage is unavailable, the choice still works for the current page. Tailwind's dark variant follows `data-theme`, so explicit Light overrides a dark OS preference.

## Initial routes

| Route                             | Purpose                                 |
| --------------------------------- | --------------------------------------- |
| `/`                               | Introduction and preview entry points   |
| `/login`                          | Creator sign-in placeholder             |
| `/requests`                       | Creator request list                    |
| `/requests/new`                   | Start a persistent draft via POST       |
| `/requests/[requestId]`           | Creator overview and shared attachments |
| `/requests/[requestId]/edit`      | Edit request form preview               |
| `/requests/[requestId]/responses` | Consolidated responses                  |
| `/requests/[requestId]/questions` | Creator Questions & Answers             |
| `/r/[token]`                      | Recipient details and response form     |
| `/r/[token]/questions`            | Shared Questions & Answers              |
| `/r/[token]/submitted`            | Submission confirmation preview         |
| `/r/[token]/edit/[editToken]`     | Personal response correction preview    |

## Draft workflow

Create a request posts to `/requests/new`. The server removes only the current browser owner's untouched blank drafts, creates a new MongoDB document, and redirects to its editor. GET requests and link preloads never create or delete records. Drafts with any recorded edit, content, questions, date, changed visibility, attachments, or share token are preserved. Cleanup does not use an inactivity timeout.

The editor autosaves changes and allows files to be attached before final save. Save request requires a title and description and changes the status to open. My Requests lists this browser's records. A persistent HttpOnly cookie identifies the creator; MongoDB stores a hash, not the cookie's raw token. There is no login or cross-device recovery yet. Clearing cookies loses access to the browser's requests.

Files are stored directly in MongoDB for this MVP, limited to 1 MB each, 3 MB total and 10 files per request. Uploads update the attachment and activity marker atomically; ordinary queries exclude bytes. Creator downloads require the owner cookie and are served as attachments. Larger file storage can be added later.

The overview can generate a recipient link to view details and download attachments. Share links stay available on the overview and repeated generation keeps the same link. Only the token hash is stored. Recipients can submit and revise responses from the same browser. Creators choose the pricing UOM (M by default) before publishing; all responses use that unit. Q&A posting and closing requests remain unimplemented. Creators can delete their own requests, including their embedded attachments. The sample requests are removed. No live application data was used by the automated integration tests.

## Tests

`npm test` runs integration tests against a temporary local MongoDB using mongodb-memory-server. The first run downloads a MongoDB binary and needs network access. Tests never read `.env` or connect to the application's database.

## MongoDB connection

Add `MONGODB_URI` to your local `.env`, and set `MONGODB_DB_NAME` to the desired database name, then restart the dev server. `.env` is ignored by Git; `.env.example` documents the variable without credentials. Set the same private variable in Vercel for each deployment environment that needs the database.

`src/env.ts` declares the private runtime variable. The server hook awaits `connectDatabase()` before resolving requests when it is configured. The helper reuses the default Mongoose connection and shares an in-flight connection attempt across concurrent requests. Failed attempts are cleared for retry. The pool is capped at 10 connections per server instance, with a five-second server-selection timeout. Driver errors and the URI are not exposed to the browser.

Builds and previews without a configured URI do not connect. A configured but unavailable database returns a generic 503 response. The draft workflow uses this connection for creator-owned documents. For background tasks or future server functions outside the request hook, await `connectDatabase()` before using a model. Do not disconnect after each operation.

The creator chooses response visibility. Recipients can revise their own answers while a request is open. Participation is optional. Everyone with the link sees shared questions and creator answers.

## Checks

```powershell
npm.cmd run check
npm.cmd run lint
npm.cmd run build
```

Initial scaffold checks covered type checking, formatting, preview routes, and invalid-link handling. Sample routes have since been retired. Client and server compilation passed. The final Vercel packaging step currently fails on this Windows machine with `EPERM` when creating `index.func` as a symbolic link, including outside the sandbox. Local development and app preview work; full Vercel packaging still needs verification in an environment that permits symlinks. No OS permissions were changed.

`@lucide/svelte` is installed explicitly because Sveltewind's published components import it without declaring it as a runtime dependency.

The initial npm audit reported seven low/moderate entries in build-tool dependency chains (deepmerge and glob/minimatch, including affected parent packages). npm's proposed fixes downgrade SvelteKit/Vercel to incompatible major versions, so no forced downgrade was applied. Review upstream updates before production deployment.
