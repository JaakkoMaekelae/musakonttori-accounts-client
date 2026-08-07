# @musakonttori/accounts-client

Client SDK for Musakonttori Accounts — the headless JWT identity service.

**Documentation:** [Architecture](docs/architecture.md) · [Disaster recovery](docs/disaster-recovery.md) ·
[Accounts service](../musakonttori-accounts/README.md) ·
[Ecosystem architecture](../MUSAKONTTORI_ARCHITECTURE.md)

## Installation

```bash
pnpm add github:JaakkoMaekelae/musakonttori-accounts-client#main
```

For Next.js App Router applications, prefer `@musakonttori/accounts-next`, which wraps this contract
with server helpers and session plumbing.

## Usage

```ts
import { createAccountsClient } from "@musakonttori/accounts-client";

const accounts = createAccountsClient({
  apiUrl: process.env.ACCOUNTS_API_URL!,
  serviceName: "stageflow",
  privateKey: process.env.SERVICE_JWT_PRIVATE_KEY!,
});

const { token, user } = await accounts.login({ email: "a@b.com", password: "secret" });

const perms = await accounts.checkPermission(token, "stageflow");

const me = await accounts.getMe(token);
```

The SDK mints the 5-minute service JWT and sets both headers
(`Authorization: Bearer <service-jwt>`, `X-User-Token: Bearer <user-jwt>`) — callers never assemble the
header protocol themselves.

## API

| Method | Description |
|--------|-------------|
| `login(input)` | Sign in with email + password |
| `register(input)` | Register a new user |
| `refreshToken(token)` | Refresh a user JWT |
| `getMe(token)` | Fetch the user profile + memberships |
| `getWorkspaces(token)` | List the user's workspaces |
| `checkPermission(token, product, opts?)` | Check access to a product |
| `listPermissions(token, product)` | List workspace rights for a product |
| `getWorkspaceMembers(token, id)` | Fetch workspace members |
| `createWorkspace(token, input)` | Create a workspace |
| `updateWorkspace(token, slug, input)` | Update a workspace |
| `inviteToWorkspace(token, slug, input)` | Invite a user to a workspace |

## Requirements

- `SERVICE_JWT_PRIVATE_KEY` environment variable (RS256 PEM)
- The service registered in the Accounts database (`Service` table) — see
  [the integration guide](../musakonttori-accounts/README.md#integration-guide)

## Development

```bash
pnpm build       # tsup → dist/
pnpm typecheck   # tsc --noEmit
pnpm lint
```

## Release Discipline

Consumers install this package from the `#main` branch, so **a merge here becomes a production change
in every consuming product at its next install**. Verify against a real consumer's auth suite before
merging, and revert rather than fixing forward if something breaks. Pinning consumers to tags is the
recorded follow-up — see [docs/disaster-recovery.md](docs/disaster-recovery.md).
