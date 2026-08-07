# @musakonttori/accounts-client

Client SDK for Musakonttori Accounts — headless JWT identity service.

## Asennus

```bash
pnpm add github:JaakkoMaekelae/musakonttori-accounts-client#main
```

## Käyttö

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

## API

| Metodi | Kuvaus |
|--------|--------|
| `login(input)` | Kirjaudu sähköpostilla + salasanalla |
| `register(input)` | Rekisteröi uusi käyttäjä |
| `refreshToken(token)` | Päivitä user-JWT |
| `getMe(token)` | Hae käyttäjäprofiili + jäsenyydet |
| `getWorkspaces(token)` | Hae käyttäjän workspace-lista |
| `checkPermission(token, product, opts?)` | Tarkista käyttöoikeus |
| `listPermissions(token, product)` | Listaa workspace-oikeudet |
| `getWorkspaceMembers(token, id)` | Hae workspacen jäsenet |
| `createWorkspace(token, input)` | Luo uusi workspace |
| `updateWorkspace(token, slug, input)` | Päivitä workspace |
| `inviteToWorkspace(token, slug, input)` | Kutsu käyttäjä workspaceen |

## Vaatimukset

- `SERVICE_JWT_PRIVATE_KEY` ympäristömuuttuja (RS256 PEM)
- Palvelu rekisteröity accounts-tietokantaan (`Service`-taulu)
