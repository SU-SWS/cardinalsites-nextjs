# SAML Authentication

This directory contains the Next.js API route handlers that implement SAML 2.0 Single Sign-On (SSO) for Cardinal Sites. The application acts as a **Service Provider (SP)** and delegates authentication to an external **Identity Provider (IdP)**.

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

Session state is stored **client-side** as a signed JWT in an `httpOnly` cookie. No server-side session store is required.

---

## Endpoints

### `GET /api/auth/login`
**File:** `login/route.tsx`

Initiates the SAML authentication flow by redirecting the browser to the IdP's SSO URL.

| Parameter | Source | Description |
|-----------|--------|-------------|
| `destination` | Query string | Page to return to after login. Falls back to the HTTP `Referer` header, then `/`. |

**Flow:**
1. Loads SAML config (certificates fetched from Vault).
2. Validates that `SAML_ISSUER` and `SAML_ENTRY_POINT` are set.
3. Generates a SAML `AuthnRequest` via `passport-saml`, encoding `destination` as `RelayState`.
4. Issues a `302` redirect to the IdP login URL.

---

### `POST /api/auth/callback`
**File:** `callback/route.tsx`

Receives the SAML response posted by the IdP after the user authenticates.

**Flow:**
1. Reads `SAMLResponse` (base64) and `RelayState` from the `multipart/form-data` body.
2. Manually decrypts the encrypted SAML assertion using the SP private key (`manuallyDecryptSAMLResponse`).
3. Parses the decrypted XML to extract the user profile (`extractProfileFromDecryptedXML`).
4. Signs a JWT containing the profile and writes it as an `httpOnly` cookie (`auth_token`).
5. Redirects to `RelayState` (normalising `/user/login` → `/user`).
6. On any failure, redirects to `/internal/admin`.

> **Note:** Standard `passport-saml` assertion decryption has known issues with certain IdP configurations. A custom decryption path using `xml-encryption` is used instead (`src/lib/auth/manual-saml-decrypt.ts`).

---

### `GET /api/auth/logout`
**File:** `logout/route.tsx`

Ends the user's session by deleting the JWT cookie.

| Parameter | Source | Description |
|-----------|--------|-------------|
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

The signing certificate is fetched from Vault at request time using:
- `VAULT_SAML_SIGNING_KEY_PATH`
- `VAULT_SAML_SIGNING_KEY_KEY`

---

### `GET /api/auth/user`
**File:** `user/route.tsx`

Returns the currently authenticated user's profile from the JWT cookie.

**Responses:**

| Status | Body | Condition |
|--------|------|-----------|
| `200` | `JWTPayload` JSON | Valid JWT cookie present |
| `401` | `{"error": "Unauthorized"}` | Cookie missing or JWT invalid/expired |

---

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SAML_ENTRY_POINT` | ✅ | IdP SSO URL (e.g. `https://idp.example.com/sso`) |
| `SAML_ISSUER` | ✅ | SP entity ID sent in AuthnRequests |
| `JWT_SECRET` | ✅ | Secret key for signing/verifying JWTs |
| `VAULT_SAML_IDP_CERT_PATH` | ✅ | Vault path for the IdP signing certificate |
| `VAULT_SAML_IDP_CERT_KEY` | ✅ | Key name within the Vault secret |
| `VAULT_SAML_SP_PRIVATE_KEY_PATH` | ✅ | Vault path for the SP private key |
| `VAULT_SAML_SP_PRIVATE_KEY_KEY` | ✅ | Key name within the Vault secret |
| `VAULT_SAML_SIGNING_KEY_PATH` | ✅ | Vault path for the SP signing certificate (metadata) |
| `VAULT_SAML_SIGNING_KEY_KEY` | ✅ | Key name within the Vault secret |

### SAML Configuration (`src/lib/auth/saml-config.tsx`)

The `getSamlConfig()` function assembles the `passport-saml` `SamlConfig` object at runtime. Certificates are fetched from HashiCorp Vault on every call; results are cached under the `"saml"` Next.js cache tag.

| Field | Value |
|-------|-------|
| `signatureAlgorithm` | `sha256` |
| `digestAlgorithm` | `sha256` |
| `identifierFormat` | `urn:oasis:names:tc:SAML:2.0:nameid-format:transient` |
| `callbackUrl` | `{origin}/api/auth/callback` |

---

## JWT Session

**Library:** `jose`

| Property | Value |
|----------|-------|
| Algorithm | `HS256` |
| Cookie name | `auth_token` |
| Expiry | `1d` |
| `httpOnly` | `true` |
| `secure` | `true` in production |
| `sameSite` | `lax` |
| Issuer claim | `cardinal-sites-saml` |

### User Profile (`UserProfile`)

The JWT payload includes the following claims extracted from SAML attributes:

| Claim | SAML Attribute | Type |
|-------|---------------|------|
| `uid` | `uid` | `string` |
| `mail` | `mail` | `string` |
| `displayName` | `displayName` | `string` |
| `eduPersonPrincipalName` | `eduPersonPrincipalName` | `string` |
| `eduPersonAffiliation` | `eduPersonAffiliation` | `string[]` |

---

## Manual SAML Decryption (`src/lib/auth/manual-saml-decrypt.ts`)

Encrypted SAML assertions (`saml2:EncryptedAssertion`) are decrypted using the `xml-encryption` library directly rather than relying on `passport-saml`'s built-in decryption, which has compatibility issues with some IdP assertion formats.

**`manuallyDecryptSAMLResponse(encodedResponse, privateKeyPem)`**
- Decodes the base64 SAML response.
- If no `saml2:EncryptedAssertion` elements are found, returns the response unchanged (supports unencrypted assertions).
- Otherwise decrypts using the SP private key and resolves with the plaintext XML.

**`extractProfileFromDecryptedXML(decryptedXML)`**
- Parses SAML `saml2:Attribute` elements by `FriendlyName` or `Name`.
- Returns a `UserProfile` object populated from the attribute map.

---

## Related Files

| Path | Purpose |
|------|---------|
| `src/lib/auth/saml-config.tsx` | Assembles `passport-saml` config from env + Vault |
| `src/lib/auth/jwt-auth.ts` | JWT generation, verification, and cookie helpers |
| `src/lib/auth/manual-saml-decrypt.ts` | Custom XML decryption and profile extraction |
| `src/components/elements/auth/login-button.tsx` | UI component linking to `/api/auth/login` |
| `src/components/elements/auth/logout-button.tsx` | UI component linking to `/api/auth/logout` |
