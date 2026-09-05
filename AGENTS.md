# AGENTS.md — @musakonttori/accounts-client

## What this is

Framework-agnostinen SDK `musakonttori-accounts`-identiteettipalveluun. Hoitaa service-JWT:n
allekirjoituksen (5 min) ja kahden headerin protokollan
(`Authorization: Bearer <service-jwt>` + `X-User-Token: Bearer <user-jwt>`).

Kirjasto, ei sovellus. Next.js-tuotteet käyttävät `@musakonttori/accounts-next`-adapteria tämän päällä.

## Global standards (MANDATORY)

Lue ennen koodausta: **vain** `../MUSAKONTTORI_AGENT_QUICKREF.md` (tiivis pakollisten sääntöjen quickref).

Isot standardit luetaan ON-DEMAND, vain kun tehtävä koskee aluetta — tiedostolista quickrefin lopussa.

## Commands

```bash
pnpm build        # tsup → dist/
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint . --cache
```

## Key conventions

- **Kontraktin omistaa palvelu**, ei tämä SDK. Muutosjärjestys: Accounts → SDK → kuluttajat
- Endpointit: ks. `../musakonttori-accounts/README.md`
- **Blast radius**: asennetaan `#main`-branchista useaan tuotteeseen — merge = tuotantomuutos
  jokaisessa kuluttajassa. Rikkoutuessa revert ensin
- **Avaimet**: `SERVICE_JWT_PRIVATE_KEY` on tuotekohtainen, ei koskaan jaettu kahden palvelun
  kesken — Accounts valitsee verifiointiavaimen tokenin `iss`-claimin perusteella
- Älä logita tokeneita tai avaimia

## Ennen pushia — KAIKKI pakollisia

- [ ] `pnpm typecheck` → 0 errors
- [ ] `pnpm lint` → puhdas
- [ ] `pnpm build` → menee läpi
- [ ] Yhden kuluttajatuotteen auth-testit ajettu tätä versiota vasten

## TypeScript — 0 virhettä (PAKOLLINEN)

> Koko ohje: `../MUSAKONTTORI_AI_STANDARDS.md` § 9.

**Tyyppivirheellinen koodi ei ole keskeneräistä, se on rikki.** Tämä ohjaa koodin
kirjoittamista, ei vain pushia.

- Tehtävä ei ole valmis ennen kuin `pnpm typecheck` (`tsc --noEmit`) antaa **0 errors**
  koko projektissa — ei vain muutetuissa tiedostoissa
- Korjaa koodi tai tyyppi. Älä vaienna virhettä
- **Kielletty**: `@ts-ignore`, `@ts-nocheck`, `as any` / `as unknown as X` virheen kiertämiseen,
  `!` non-null-assertio vaientamiseen, `strict`-asetusten löysentäminen,
  `eslint-disable @typescript-eslint/no-explicit-any` tyyppidriftin peittämiseen
- **Ainoa sallittu poikkeus**: `@ts-expect-error` + perustelu kommentissa, vain kun kolmannen
  osapuolen tyypit ovat väärin. Se hajoaa itsestään kun upstream korjaantuu — `@ts-ignore` ei
- SDK:n julkiset tyypit ovat kontrakti: niiden löysentäminen `any`:llä siirtää virheet kuluttajien
  ajoaikaan
- Jos muutoksesi paljastavat vanhoja tyyppivirheitä: korjaa tai raportoi ne. Älä piilota
- Älä raportoi työtä valmiiksi ajamatta typecheckiä JA buildia

### Build kuuluu samaan tarkistukseen

- `pnpm build` pitää mennä läpi ennen kuin tehtävä on valmis — typecheck yksin ei riitä
- Buildi löytää sen mitä `tsc --noEmit` ei näe: Next.js route- ja PageProps-tyypit,
  `generateMetadata` / `generateStaticParams` -signatuurit, server/client-rajan rikkomukset,
  puuttuvat `"use client"` -direktiivit, dynaamiset importit ja build-aikaiset env-tarkistukset
- Järjestys: `pnpm db:generate` → `pnpm typecheck` → `pnpm test` → `pnpm build`
- Buildin kaatuessa **älä** lisää `typescript.ignoreBuildErrors`- tai `eslint.ignoreDuringBuilds`
  -lippua äläkä poista tiedostoa buildista — korjaa syy
- Jos buildi vaatii env-muuttujia joita ei ole: `SKIP_ENV_VALIDATION=1 pnpm build` ja mainitse se
  raportissa. Buildin ohittaminen kokonaan ei ole vaihtoehto

### Pushia ei saa tehdä `--no-verify`-lipulla — koskaan

`git push --no-verify` (ja `git commit --no-verify`) on kielletty poikkeuksetta.
Ei "vain tämän kerran", ei "hookki on rikki", ei "kiire". Jos pre-push-hookki
epäonnistuu:

1. Lue virhe. Se on todellinen — hookki ei valehtele
2. Korjaa syy: aja `pnpm db:generate` → `pnpm typecheck` → `pnpm test` → `pnpm build`
   käsin ja korjaa jokainen virhe
3. Jos hookki itse on rikki (väärä komento, puuttuva riippuvuus) — korjaa hookki,
   älä ohita sitä
4. Vasta kun kaikki neljä menevät läpi puhtaasti, pushaa ilman lippuja

`--no-verify` ei koskaan ole oikea vastaus epäonnistuneeseen tarkistukseen — se ei
korjaa virhettä, se vain piilottaa sen seuraavalle, joka pullaa reposta.

### NEVER use --no-verify or force push

`git commit --no-verify`, `git push --no-verify`, and `git push --force*` are FORBIDDEN. No exceptions. If hooks fail, fix the root cause — never bypass them.

## i18n — Tekstit kieliavaimina (PAKOLLINEN)

- Kaikki käyttöliittymätekstit kieliavaimina i18n-käännöksinä — ei kovakoodattuja literaaleja.
- Ei kieliin sidottuja merkkijonoja komponenteissa: JSX-teksti, `placeholder`, `title`, `aria-label`, `alt`, `label`, `description`.
- Next.js-projekteissa `next-intl`: avaimet `messages/{locale}.json`, muoto `"page.section.key"`. Oletuskieli `fi`, toinen `en`.
- Jaetut kirjastokomponentit: tekstit propseina tai kuluttajan `Intl`-kontekstista, ei kirjaston sisältä.

### Git stash on kielletty

`git stash` (ja `pop` / `apply` / `drop` / `push` / `clear`) on kielletty poikkeuksetta.
Stash piilottaa työhakemiston muutokset → menetettyä työtä ja ristiriitoja.
Keskeytä työ commitilla (WIP-branch) tai jätä muutokset paikalleen — ei stashia.
