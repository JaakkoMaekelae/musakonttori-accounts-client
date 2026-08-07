# Architecture — @musakonttori/accounts-client

**Product:** Framework-agnostic SDK for the Musakonttori Accounts headless JWT identity service
**Consumers:** Ticketing, Market, Stageflow, Links, Promo (and any non-Next.js consumer)

> Ecosystem context: [MUSAKONTTORI_ARCHITECTURE.md](../../MUSAKONTTORI_ARCHITECTURE.md) ·
> Service: `musakonttori-accounts/docs/architecture.md` ·
> Recovery: [docs/disaster-recovery.md](./disaster-recovery.md)

---

## 1. Measured Stack

| Item | Value |
|------|-------|
| Build | tsup → `dist/` |
| Distribution | `github:JaakkoMaekelae/musakonttori-accounts-client#main` |
| Package manager | pnpm 11.18.0 |
| Scripts | `build`, `typecheck`, `lint` |

---

## 2. Public Interface

```ts
import { createAccountsClient } from "@musakonttori/accounts-client";

const accounts = createAccountsClient({
  apiUrl: process.env.ACCOUNTS_API_URL!,
  serviceName: "stageflow",
  privateKey: process.env.SERVICE_JWT_PRIVATE_KEY!,
});

const { token, user } = await accounts.login({ email, password });
const perms = await accounts.checkPermission(token, "stageflow");
```

The constructor takes the three things that define a caller: which Accounts instance, which service is
asking, and the private key that proves it. Everything after that is a method call — the SDK owns the
service-JWT minting (5 min TTL) and the two-header convention
(`Authorization: Bearer <service-jwt>`, `X-User-Token: Bearer <user-jwt>`).

---

## 3. Where It Sits

```
Any Node service / non-Next app
  └─ @musakonttori/accounts-client
       └─ HTTPS → musakonttori-accounts
            └─ Prisma → PostgreSQL
```

For Next.js App Router products, `@musakonttori/accounts-next` wraps this contract with server helpers
and session plumbing. Products should use one or the other, not reimplement the header protocol.

---

## 4. Contract Ownership

The Accounts **service** owns the contract; this SDK follows it. When the endpoint table in
`musakonttori-accounts/README.md` changes, the sequence is: service change → SDK change → consumer
upgrade. Reversing that order breaks consumers at runtime with errors that look like auth failures
rather than version mismatches.

---

## 5. Blast Radius

Installed from a moving `#main` branch by multiple products, so a merge here is a production change in
each of them at their next install. The mitigations are the same as for the Next adapter: pin consumers
to tags, and verify against a real consumer's auth suite rather than only building locally.

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-08-07 | Engineering | Initial measured architecture |
