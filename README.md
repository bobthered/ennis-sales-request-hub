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

Sveltewind follows its [installation](https://sveltewind.com/getting-started/installation) and [theming](https://sveltewind.com/getting-started/theming) documentation. `src/routes/layout.css` scans the installed components and imports palette CSS. `src/lib/theme.ts` initializes the shared Classic theme. `src/app.html` selects the blue palette and light mode. Components use `sveltewind/components`; custom compositions follow the same theme/variant architecture.

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

Use `demo` for request IDs and share tokens, and `demo-edit` for the edit token. Other values return 404. Sample creator workspace: `/requests/demo`. Sample recipient link: `/r/demo`.

## Backend status

These are route and UI scaffolds. Forms do not save; no authentication, email, file storage, or database connection has been implemented. All sample content is public and fictitious. The disabled actions and preview notice make this explicit.

Starter Mongoose models live under `src/lib/server/models`: requests, responses, and questions. They do not initiate database connections. The user's connection script will be integrated later; it may require adapting model registration to its connection instance. File metadata is modeled, but binary files need a storage provider. Authentication, authorization, request validation, token issuance/verification, and visibility filtering must be implemented server-side before enabling data access or writes.

The creator chooses response visibility. Recipients can revise their own answers while a request is open. Participation is optional. Everyone with the link sees shared questions and creator answers.

## Checks

```powershell
npm.cmd run check
npm.cmd run lint
npm.cmd run build
```

Type checking, formatting, all 12 preview routes, and invalid-link 404 checks passed. Client and server compilation passed. The final Vercel packaging step currently fails on this Windows machine with `EPERM` when creating `index.func` as a symbolic link, including outside the sandbox. Local development and app preview work; full Vercel packaging still needs verification in an environment that permits symlinks. No OS permissions were changed.

`@lucide/svelte` is installed explicitly because Sveltewind's published components import it without declaring it as a runtime dependency.

The initial npm audit reported seven low/moderate entries in build-tool dependency chains (deepmerge and glob/minimatch, including affected parent packages). npm's proposed fixes downgrade SvelteKit/Vercel to incompatible major versions, so no forced downgrade was applied. Review upstream updates before production deployment.
