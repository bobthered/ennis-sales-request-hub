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
| `/requests/new`                   | Create request form preview             |
| `/requests/[requestId]`           | Creator overview and shared attachments |
| `/requests/[requestId]/edit`      | Edit request form preview               |
| `/requests/[requestId]/responses` | Consolidated responses                  |
| `/requests/[requestId]/questions` | Creator Questions & Answers             |
| `/r/[token]`                      | Recipient details and response form     |
| `/r/[token]/questions`            | Shared Questions & Answers              |
| `/r/[token]/submitted`            | Submission confirmation preview         |
| `/r/[token]/edit/[editToken]`     | Personal response correction preview    |

## Backend status

These are route and UI scaffolds. Forms do not save; authentication, email, and file storage are not implemented. Sample requests have been removed. The request list starts empty; detail and recipient routes return 404 until real request loading is implemented. The disabled actions and preview notice make this explicit.

Starter Mongoose models live under `src/lib/server/models`: requests, responses, and questions. They use the default connection managed by `src/lib/server/db.ts`. File metadata is modeled, but binary files need a storage provider. Authentication, authorization, request validation, token issuance/verification, and visibility filtering must be implemented server-side before enabling data access or writes.

## MongoDB connection

Add `MONGODB_URI` to your local `.env`, including the database name in the URI, then restart the dev server. `.env` is ignored by Git; `.env.example` documents the variable without credentials. Set the same private variable in Vercel for each deployment environment that needs the database.

`src/env.ts` declares the private runtime variable. The server hook awaits `connectDatabase()` before resolving requests when it is configured. The helper reuses the default Mongoose connection and shares an in-flight connection attempt across concurrent requests. Failed attempts are cleared for retry. The pool is capped at 10 connections per server instance, with a five-second server-selection timeout. Driver errors and the URI are not exposed to the browser.

Builds and previews without a configured URI do not connect. A configured but unavailable database returns a generic 503 response. Connecting does not enable CRUD or populate the empty request list. For background tasks or future server functions outside the request hook, await `connectDatabase()` before using a model. Do not disconnect after each operation.

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
