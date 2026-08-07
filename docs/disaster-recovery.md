# Disaster Recovery Plan — @musakonttori/accounts-client

**Product:** Client SDK for the Musakonttori Accounts headless JWT identity service
**Criticality:** Tier 1 by blast radius — a broken release propagates to every product that installs it
**Distribution:** GitHub (`github:JaakkoMaekelae/musakonttori-accounts-client#main`) — consumed by
products at install time, built with tsup

> Read together with [MUSAKONTTORI_DISASTER_RECOVERY_STANDARD.md](../../MUSAKONTTORI_DISASTER_RECOVERY_STANDARD.md)
> and [musakonttori-accounts/docs/disaster-recovery.md](../../musakonttori-accounts/docs/disaster-recovery.md).

---

## 1. Recovery Objectives

| Metric | Target | Rationale |
|--------|--------|-----------|
| **RPO** | 0 — all source is in git | A library has no runtime state. Everything is reproducible from a commit. |
| **RTO** | 4 hours | The library itself has no uptime. What can break is a *bad release* reaching products, or products being unable to install it. Both are fixed by a commit. |

---

## 2. Disaster Scenarios

### 2.1 Bad Release Propagates to Products

**Impact:** This library is installed from the `#main` branch, so **every product picks up whatever is on
main at its next install or deploy**. A broken commit on main can therefore break the authentication
layer of multiple products at once, without any of them changing their own code.

**Detection:** several products failing at build or at auth simultaneously · type errors appearing in
products that did not change · CI failures across repos after a merge here.

**Recovery procedure:**
1. Revert the offending commit on `main` immediately. Fixing forward takes longer and every minute
   spreads the breakage to another deploying product.
2. Verify the revert builds: `pnpm build && pnpm typecheck`.
3. Notify every consuming product — they may need to redeploy to pick up the revert, or clear a cached
   install.
4. Products already deployed with the bad version roll back their own deployment.
5. Only then work on the correct fix, on a branch.

**Prevention worth adopting:** pin consumers to a tag or commit SHA rather than `#main`. Installing a
moving branch means an untested commit here is a production change everywhere. Until that changes, treat
every merge to main as a multi-product production deploy.

---

### 2.2 GitHub Unavailable

**Impact:** Products cannot install the dependency. Existing deployments are unaffected; new builds fail.

**Recovery procedure:**
1. Confirm at https://www.githubstatus.com.
2. Existing lockfiles plus a warm package-manager store let most builds proceed — verify before assuming
   a total block.
3. If a deploy is urgent, vendor the built `dist/` into the consuming product temporarily, and record a
   task to remove it once GitHub returns. Temporary vendoring that is never removed becomes a
   maintenance trap.

---

### 2.3 Breaking Change in the Accounts API Contract

**Impact:** The SDK and the Accounts service drift apart. Calls fail at runtime with confusing errors
rather than at build time.

**Detection:** products failing on `login`, `checkPermission` or token refresh while Accounts is healthy ·
schema mismatch errors.

**Recovery procedure:**
1. Determine which side changed. The Accounts service is the contract owner.
2. Roll back whichever side moved first, then re-sequence: service change → SDK change → product upgrade.
3. Verify against the endpoint table in `musakonttori-accounts/README.md`.

---

### 2.4 Source Loss

**Impact:** Negligible while git history exists in more than one place.

**Recovery:** clone from GitHub; if GitHub itself is lost, any developer's local clone or any consuming
product's `node_modules` copy contains a working build. Rebuild from the newest clone.

---

## 3. Backup Strategy

| Asset | Method | Retention | Recovery |
|-------|--------|-----------|----------|
| Source code | GitHub + developer clones | Full history | `git clone` |
| Built `dist/` | Reproducible via `pnpm build` | — | Rebuild |
| Release history | Git tags and commits | Full history | `git checkout <tag>` |

---

## 4. Detailed Procedures

### 4.1 Emergency revert

```bash
git revert <bad-commit>
pnpm build && pnpm typecheck
# push to main, then tell every consuming product to redeploy
```

### 4.2 Verifying a release before it reaches products

```bash
pnpm build
pnpm typecheck
pnpm lint
# then install the branch into one product and run that product's auth tests
```
One real consumer test is worth more than any amount of local verification here.

---

## 5. Communication

Consumers of this library are internal products, not customers. Notify product owners in `#incidents`
and name the affected products explicitly — "the accounts client is broken" is not actionable; "Links,
Stageflow and Promo will fail on their next deploy" is.

---

## 6. Testing Schedule

| Drill | Frequency | Success criteria |
|-------|-----------|------------------|
| Emergency revert rehearsal | Annually | Revert to redeploy across consumers in under 4 h |
| Contract check against Accounts API | Every Accounts API change | SDK matches the documented endpoints |
| Clean-clone build | Quarterly | Builds with no undocumented steps |

---

## 7. Recovery Checklist

- [ ] Revert on `main` first — do not fix forward
- [ ] Verify the build after the revert
- [ ] List every consuming product and tell their owners
- [ ] Confirm each product either redeployed or rolled back
- [ ] Fix properly on a branch, with a consumer test
- [ ] Consider pinning consumers to tags as the follow-up action

---

## 8. Dependencies

| Dependency | Status page | Impact |
|------------|-------------|--------|
| GitHub | https://www.githubstatus.com | Products cannot install |
| Accounts service | Internal | SDK is useless without it |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-08-07 | Engineering | Initial plan |
