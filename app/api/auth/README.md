# SAML Authentication

This directory contains the Next.js API route handlers that implement SAML 2.0 Single Sign-On (SSO) for Cardinal Sites.
The application acts as a **Service Provider (SP)** and delegates authentication to an external **Identity Provider (
IdP)**.

---

## Architecture Overview

```
Browser ──GET /api/auth/login──► SP (this app)
                                      │
                                      │ AuthnRequest (redirect)
                                      ▼
                               IdP (SAML SSO)
                                      │
                                      │ SAMLResponse POST
                                      ▼
Browser ──POST /api/auth/callback──► SP
                                      │
                                      │ Decrypt assertion → extract profile
                                      │ Issue JWT cookie
                                      ▼
                               Redirect to original destination
```

Session state is stored **client-side** as a signed JWT in an `httpOnly` cookie. No server-side session store is
required.

---

## Endpoints

### `GET /api/auth/login`

**File:** `login/route.tsx`

Initiates the SAML authentication flow by redirecting the browser to the IdP's SSO URL.

| Parameter     | Source       | Description                                                                       |
|---------------|--------------|-----------------------------------------------------------------------------------|
| `destination` | Query string | Page to return to after login. Falls back to the HTTP `Referer` header, then `/`. |

**Flow:**

1. Loads the SAML config from environment variables (`getSamlConfig()`).
2. Validates that the issuer (`SAML_ENTITY_ID`) and `SAML_ENTRY_POINT` are set, or responds `500`. (The log message
   names the issuer `SAML_ISSUER`, but the variable is `SAML_ENTITY_ID`.)
3. Generates a SAML `AuthnRequest` via `passport-saml`, encoding `destination` as `RelayState`.
4. Issues a redirect to the IdP login URL.

Only paths on this site are accepted as `destination` (or `Referer`), so the login can't be used to send users off
site. Responds `501` if the optional SAML packages aren't installed.

---

### `POST /api/auth/callback`

**File:** `callback/route.tsx`

Receives the SAML response posted by the IdP after the user authenticates.

**Flow:**

1. Reads `SAMLResponse` (base64) and `RelayState` from the `multipart/form-data` body.
2. Validates the response (`validateSamlResponse`): exactly one assertion, signed by the IdP certificate, within its
   time conditions and issued for this SP's audience. Encrypted assertions are decrypted with the SP private key
   (`manuallyDecryptSAMLResponse`) before their signature is checked.
3. Parses the validated assertion to extract the user profile (`extractProfileFromDecryptedXML`).
4. Signs a JWT containing the profile and writes it as an `httpOnly` cookie (`auth_token`).
5. Redirects to `RelayState` when it is a path on this site (normalising `/user/login` → `/user`), otherwise `/`.
6. On any failure, redirects to `/internal/admin`.

> **Note:** Standard `passport-saml` assertion decryption has known issues with certain IdP configurations. A custom
> decryption path using `xml-encryption` is used instead (`src/lib/auth/manual-saml-decrypt.ts`).

---

### `GET /api/auth/logout`

**File:** `logout/route.tsx`

Ends the user's session by deleting the JWT cookie.

| Parameter     | Source       | Description                                                  |
|---------------|--------------|--------------------------------------------------------------|
| `destination` | Query string | Page to redirect to after logout. Defaults to `/user/login`. |

**Flow:**

1. Deletes the `auth_token` cookie.
2. Redirects to `destination`.

> This is SP-initiated logout only. IdP-side session termination (SAML SLO) is **not** implemented.

---

### `GET /api/auth/metadata`

**File:** `metadata/route.tsx`

Returns the SP's SAML metadata XML, used to register this application with the IdP.

**Response:** `application/xml` — standard SAML SP metadata including entity ID, ACS URL, and signing certificate.

The signing certificate is loaded from the `SAML_SIGNING_CERT` environment variable. Responds `501` if the optional
SAML packages aren't installed.

---

### `GET /api/auth/user`

**File:** `user/route.tsx`

Returns the currently authenticated user's profile from the JWT cookie.

**Responses:**

| Status | Body                        | Condition                             |
|--------|-----------------------------|---------------------------------------|
| `200`  | `JWTPayload` JSON           | Valid JWT cookie present              |
| `401`  | `{"error": "Unauthorized"}` | Cookie missing or JWT invalid/expired |

---

## Configuration

### Optional Dependencies

SAML support is opt-in. The packages it needs are declared in `optionalDependencies` so sites that
serve only anonymous traffic don't have to carry them:

| Package           | Used by                                |
|-------------------|----------------------------------------|
| `passport-saml`   | `login/route.tsx`, `metadata/route.tsx` (AuthnRequest + SP metadata) |
| `xml-encryption`  | `src/lib/auth/manual-saml-decrypt.ts` (assertion decryption) |
| `@xmldom/xmldom`  | `src/lib/auth/manual-saml-decrypt.ts` (XML parsing) |

They are loaded lazily through `src/lib/auth/optional-saml.ts` and listed in
`serverExternalPackages` (next.config.ts), so the application builds and runs without them. When
they are missing, `/api/auth/login` and `/api/auth/metadata` respond `501` and the rest of the site
is unaffected.

> `jose` is **not** optional. `proxy.tsx` verifies the session JWT in the proxy/middleware on every
> matched request, so it is always required.

### Environment Variables

| Variable            | Required  | Description                                                                    |
|---------------------|-----------|--------------------------------------------------------------------------------|
| `VAULT_ROLE_ID`     | For Vault | Vault AppRole role ID                                                          |
| `VAULT_SECRET_ID`   | For Vault | Vault AppRole secret ID                                                        |
| `VAULT_PATH`        | For Vault | Vault path to read secrets from                                                |
| `JWT_SECRET`        | For auth  | Secret key for signing/verifying JWT session cookies. Auth is disabled without it. |
| `SAML_ENTRY_POINT`  | For auth  | IdP SSO URL (e.g. `https://login.stanford.edu/idp/profile/SAML2/Redirect/SSO`) |
| `SAML_ENTITY_ID`    | For auth  | SP entity ID, sent as the issuer and checked as the assertion audience          |
| `SAML_IDP_CERT`     | For auth  | IdP signing certificate. May hold several PEM blocks for a certificate rollover. |
| `SAML_PRIVATE_KEY`  | For auth  | SP private key, used to decrypt assertions                                     |
| `SAML_SIGNING_CERT` | For auth  | SP certificate published in the SAML metadata                                  |

Any of these can be stored in Vault. Vault values are loaded into the Next.js `env` config **at build time** (see the
root README), so after rotating a certificate or key, redeploy. Certificates pasted with literal `\n` escapes or odd
wrapping are normalized by `parseCertificates()`.

### SAML Configuration (`src/lib/auth/saml-config.ts`)

The `getSamlConfig()` function assembles the `passport-saml` `SamlConfig` object from environment variables on each
call. It isn't cached.

| Field                | Value                                                 |
|----------------------|-------------------------------------------------------|
| `entryPoint`         | `SAML_ENTRY_POINT`                                    |
| `issuer`, `audience` | `SAML_ENTITY_ID`                                      |
| `cert`               | `SAML_IDP_CERT`, parsed into one entry per certificate |
| `privateKey`, `decryptionPvk` | `SAML_PRIVATE_KEY`                           |

| Field                | Value                                                 |
|----------------------|-------------------------------------------------------|
| `signatureAlgorithm` | `sha256`                                              |
| `digestAlgorithm`    | `sha256`                                              |
| `identifierFormat`   | `urn:oasis:names:tc:SAML:2.0:nameid-format:transient` |
| `callbackUrl`        | `{origin}/api/auth/callback`                          |

---

## JWT Session

**Library:** `jose`

| Property     | Value                 |
|--------------|-----------------------|
| Algorithm    | `HS256`               |
| Cookie name  | `auth_token`          |
| Expiry       | `1d`                  |
| `httpOnly`   | `true`                |
| `secure`     | `true` in production  |
| `sameSite`   | `lax`                 |
| Issuer claim | `cardinal-sites-saml` |

### User Profile (`UserProfile`)

The JWT payload includes the following claims extracted from SAML attributes:

| Claim                    | SAML Attribute           | Type       |
|--------------------------|--------------------------|------------|
| `uid`                    | `uid`                    | `string`   |
| `mail`                   | `mail`                   | `string`   |
| `displayName`            | `displayName`            | `string`   |
| `eduPersonPrincipalName` | `eduPersonPrincipalName` | `string`   |
| `eduPersonAffiliation`   | `eduPersonAffiliation`   | `string[]` |

---

## Manual SAML Decryption (`src/lib/auth/manual-saml-decrypt.ts`)

Encrypted SAML assertions (`saml2:EncryptedAssertion`) are decrypted using the `xml-encryption` library directly rather
than relying on `passport-saml`'s built-in decryption, which has compatibility issues with some IdP assertion formats.

**`validateSamlResponse(encodedResponse, samlConfig)`**

- Mirrors `passport-saml`'s `validatePostResponseAsync`, using the decryption helper below.
- Requires a valid IdP signature on the response or on its single (decrypted) assertion.
- Checks the assertion's `NotBefore`/`NotOnOrAfter` conditions, subject confirmation and audience.
- Resolves with the verified `Assertion` XML, or throws.

**`manuallyDecryptSAMLResponse(encryptedXml, privateKeyPem)`**

- Decrypts an `EncryptedAssertion` using the SP private key and resolves with the plaintext XML.
- Does not authenticate the content; only call it through `validateSamlResponse`.

**`extractProfileFromDecryptedXML(assertionXml)`**

- Parses SAML `Attribute` elements by `FriendlyName` or `Name`.
- Returns a `UserProfile` object populated from the attribute map.

---

## Related Files

| Path                                             | Purpose                                           |
|--------------------------------------------------|---------------------------------------------------|
| `src/lib/auth/saml-config.ts`                    | Assembles `passport-saml` config from env vars    |
| `src/lib/auth/optional-saml.ts`                  | Lazy loader for the optional SAML packages        |
| `src/lib/auth/jwt-auth.ts`                       | JWT generation, verification, and cookie helpers  |
| `src/lib/auth/manual-saml-decrypt.ts`            | Custom XML decryption and profile extraction      |
| `src/components/elements/auth/login-button.tsx`  | UI component linking to `/api/auth/login`         |
| `src/components/elements/auth/logout-button.tsx` | UI component linking to `/api/auth/logout`        |
