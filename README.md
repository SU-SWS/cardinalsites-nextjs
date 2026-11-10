# Cardinal Sites — Decoupled Next.js Frontend

Cardinal Sites is a decoupled (headless) front-end application for Stanford University websites. It is built
with [Next.js](https://nextjs.org/) and acts as the presentation layer for one or more Drupal CMS instances. Drupal
manages all content; this application fetches that content over GraphQL, renders it into React components, and serves
it as a statically cached site with on-demand cache invalidation.

This repository is also the template for the Lagunita site front ends (`csp-nextjs`, `press-nextjs`, `summer-nextjs`,
`sulgryphon-nextjs`). For connecting a front end to a Drupal site on Acquia and a Vercel project, see
[`docs/decoupled-frontend.md`](https://github.com/SU-SWS/ace-stanfordlagunita/blob/4.x/docs/decoupled-frontend.md) in
`ace-stanfordlagunita`.

**Key technology choices:**

| Concern            | Solution                                                               |
|--------------------|------------------------------------------------------------------------|
| Framework          | Next.js 16 (App Router, React 19, Cache Components)                    |
| CMS                | Drupal 11 (via GraphQL)                                                |
| Styling            | Tailwind CSS v4 + [Decanter](https://decanter.stanford.edu) design system |
| Search             | Algolia (React InstantSearch), with a basic site search fallback      |
| Authentication     | SAML 2.0 SSO → JWT session cookie (optional)                           |
| Secrets management | HashiCorp Vault (AppRole auth), read at build time                     |
| Hosting            | Vercel                                                                 |
| Package manager    | Yarn 4                                                                 |

---

## Architecture Overview

```
  Drupal CMS
  ├── GraphQL endpoint (/graphql)    ← Page data, menus, config pages, views (POST, Basic Auth)
  └── Next module                    → GET /api/revalidate?secret=…&path=…  (cache purge on save)
                                     → /preview?secret=…&slug=…            (editor preview iframe)

  Next.js (this app)
  ├── app/(site)/[[...slug]]         ← All public Drupal-content pages
  ├── app/(site)/internal/[[...slug]]← SAML-protected Drupal pages
  ├── app/(site)/user                ← Authenticated user profile + login pages
  ├── app/(site)/search              ← Algolia-powered search page
  ├── app/(site)/gallery             ← Image gallery pages (also a modal via app/@modal)
  ├── app/preview/[[...slug]]        ← Editor preview of draft content (uncached)
  ├── app/api/auth/*                 ← SAML SSO + JWT endpoints
  ├── app/api/revalidate             ← Cache invalidation webhook
  ├── app/system/cache-clear         ← Manual cache clearing UI
  └── proxy.tsx (middleware)         ← Preview secret check on /preview, Basic Auth on /system,
                                       JWT gate on /internal and /user

  HashiCorp Vault
  └── Stores secrets that vault-envars.ts loads into the Next.js env config at build time
```

### Request lifecycle (public page)

1. Browser requests `/some/path`.
2. Next.js serves the **statically cached** page (built or previously warmed).
3. If the cache is cold, the page function calls `getEntityFromPath("/some/path")`, which queries the Drupal GraphQL
   API.
4. The response is cached indefinitely under the tag `paths:/some/path`.
5. When an editor saves content in Drupal, the Drupal Next module calls `/api/revalidate?secret=…&path=/some/path`,
   which calls `revalidateTag("paths:/some/path")` and evicts only that entry.

### Request lifecycle (protected page)

1. Browser requests `/internal/some/page` or `/user`.
2. The middleware (`proxy.tsx`) intercepts the request, reads the `auth_token` JWT cookie and verifies it.
3. If the token is missing or invalid, the browser is redirected to `/api/auth/login?destination=/internal/some/page`.
4. The SAML flow completes at `/api/auth/callback`, which issues a new JWT cookie and redirects back to the original
   destination.
5. On subsequent requests, the middleware injects `x-user-id`, `x-user-email`, and `x-user-name` headers so downstream
   page components can read the authenticated user's identity without re-verifying the token.

### Request lifecycle (editor preview)

1. Drupal loads `/preview?secret=…&slug=/some/path` in an iframe.
2. `proxy.tsx` checks `secret` against `DRUPAL_PREVIEW_SECRET` and that `slug` is a safe relative path, then redirects
   to `/preview/some/path?secret=…`.
3. The preview page fetches the latest revision with the `DRUPAL_BASIC_AUTH_ADMIN` credentials and renders it,
   uncached, with an editor banner.

Preview fails closed: if `DRUPAL_PREVIEW_SECRET` isn't set, or the secret or slug is wrong, the response is the 404
page. Every preview response is sent with `noindex`, `no-store` and `no-referrer` headers, because the URL carries the
secret.

---

## Directory Structure

```
nextCardinalsites/
├── app/                        # Next.js App Router pages and API routes
│   ├── (site)/                 # Route group for public site pages (loads analytics; preview sits outside it)
│   │   ├── [[...slug]]/        # Catch-all: renders every public Drupal content page
│   │   ├── gallery/            # Image gallery pages
│   │   ├── internal/           # SAML-protected content pages (mirrors [[...slug]])
│   │   ├── search/             # Algolia search page
│   │   ├── user/               # Authenticated user profile + login pages
│   │   └── layout.tsx          # Adds user analytics to public routes
│   ├── @modal/                 # Parallel route for the gallery lightbox modal
│   ├── api/
│   │   ├── auth/               # SAML SSO endpoints (see app/api/auth/README.md)
│   │   └── revalidate/         # On-demand cache invalidation webhook (+ /page)
│   ├── preview/                # Editor preview pages
│   ├── system/cache-clear/     # Admin UI for manual cache clearing (Basic Auth)
│   ├── layout.tsx              # Root layout: fonts, metadata, <GlobalPage> header/footer
│   ├── error.tsx               # Error page (shows the DRUPAL_* error digest)
│   ├── not-found.tsx           # 404 page
│   └── sitemap.ts              # Auto-generated sitemap.xml
│
├── src/
│   ├── components/
│   │   ├── algolia/            # Algolia InstantSearch components
│   │   ├── config-pages/       # Renders Drupal config-page entity types
│   │   ├── elements/           # Primitive UI elements (buttons, headers, auth buttons…)
│   │   ├── global/             # Site-wide header, footer, navigation
│   │   ├── images/             # Image components with blur placeholder support
│   │   ├── layouts/            # Page layout wrappers (interior, global)
│   │   ├── menu/               # Navigation menu rendering
│   │   ├── nodes/              # Node page, card, and list-item renderers (per content type)
│   │   ├── paragraphs/         # Paragraph component renderers (Banner, Card, WYSIWYG…)
│   │   ├── patterns/           # Shared design patterns (hero banner, image card)
│   │   ├── search/             # Site search fallback (non-Algolia)
│   │   ├── tools/              # Developer/admin utility components
│   │   └── views/              # Drupal Views list renderers (per content type)
│   │
│   ├── lib/
│   │   ├── auth/               # SAML config, JWT helpers, manual XML decryption
│   │   ├── gql/                # GraphQL queries, generated types, data fetchers (see src/lib/gql/README.md)
│   │   │   ├── *.drupal.gql    # Hand-authored query/fragment definitions
│   │   │   ├── __generated__/  # Auto-generated — DO NOT EDIT
│   │   │   ├── gql-client.ts   # Fetch-based GraphQL client (auth headers, timeouts, typed errors)
│   │   │   ├── gql-queries.ts  # Cached server-side data fetching helpers
│   │   │   └── gql-views.ts    # View/listing page fetchers
│   │   ├── @types/             # Custom type declarations (Drupal, xml-encryption)
│   │   └── utils/              # Shared utilities (security, image placeholder, text tools…)
│   │
│   ├── hooks/                  # Custom React hooks
│   └── styles/                 # Global CSS, Tailwind entry point, typography fonts
│
├── scripts/                    # validate-html.mjs and validate-a11y.mjs (run against the build output)
├── .githooks/pre-commit        # Prettier + ESLint on staged .tsx files (installed by `yarn install`)
├── proxy.tsx                   # Next.js middleware: preview secret, Basic Auth for /system, JWT gate
├── next.config.ts              # Next.js config: Vault env, cache, images, redirects, robots headers
├── vault-envars.ts             # Loads secrets from Vault at build time
├── vercel.json                 # Vercel build and install commands
├── codegen.ts                  # GraphQL codegen config
└── .env.example                # Template for all environment variables
```

### TypeScript path aliases

Avoid deep relative imports — use these aliases defined in `tsconfig.json`:

| Alias           | Resolves to        |
|-----------------|--------------------|
| `@components/*` | `src/components/*` |
| `@lib/*`        | `src/lib/*`        |
| `@hooks/*`      | `src/hooks/*`      |

---

## Getting Started

Use the Node.js version in `.nvmrc` (`nvm use`).

### Setup Local Environment Variables

1. Copy `.env.example` to `.env.local`.
2. The only necessary variable is `NEXT_PUBLIC_DRUPAL_BASE_URL`. Set this to your local Drupal installation URL.
3. To fetch anything that isn't public, and to preview drafts, also set `DRUPAL_BASIC_AUTH`,
   `DRUPAL_BASIC_AUTH_ADMIN`, `DRUPAL_PREVIEW_SECRET` and `DRUPAL_REVALIDATE_SECRET` (see below).

### Set Up the Drupal Environment (Optional)

You can configure your Drupal environment to use this app for previews and cache invalidation.

The quickest way is to run, in the Drupal codebase:

```bash
drush stanford-decoupled:connect-next http://localhost:3000
```

It creates the `nextjs` and `nextjsAdmin` API users and a Next site entity, then prints the `DRUPAL_PREVIEW_SECRET`,
`DRUPAL_REVALIDATE_SECRET`, `DRUPAL_BASIC_AUTH` and `DRUPAL_BASIC_AUTH_ADMIN` lines to paste into `.env.local`. It
sets **new passwords on both API users every time it runs**, so don't run it against a shared environment whose front
end uses the existing passwords.

To configure it by hand instead:

1. In the Drupal environment, go to `/admin/config/services/next/sites/add`.
2. Enter a label of your choice.
3. "Base URL" is `http://localhost:3000`.
4. "Preview URL" is `http://localhost:3000/preview`.
5. "Preview secret" can be any string. It must match `DRUPAL_PREVIEW_SECRET`.
6. "Revalidate URL" is `http://localhost:3000/api/revalidate`. Only needed to test cache invalidation.
7. "Revalidate secret" can be any string. It must match `DRUPAL_REVALIDATE_SECRET`. Only needed to test cache
   invalidation.
8. Create a read-only API user and a preview user that can view unpublished content, and set their credentials as
   `DRUPAL_BASIC_AUTH` and `DRUPAL_BASIC_AUTH_ADMIN` (`user:password`).
9. Turn on revalidation for the entity types the front end renders at `/admin/config/services/next/entity-types`.

### Start Development Server

```bash
# Install Dependencies (also installs the pre-commit hook)
yarn install
# Run dev server
yarn dev
# Or build and run a production server
yarn preview
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Fonts are loaded with [`next/font`](https://nextjs.org/docs/app/getting-started/fonts): Source Sans 3 from Google and the
Stanford wordmark font from a local file (`src/styles/typography/fonts.ts`).

### Linting and validation

This project uses both TypeScript checks and ESLint. These run in CI, but not on production builds, since the dev
dependencies are not installed there.

```bash
yarn lint             # ESLint + tsc
yarn validate:html    # html-validate against the prerendered pages (run `yarn build` first)
yarn validate:a11y    # axe-core in Chrome over Selenium against the prerendered pages (needs `yarn start` running)
```

`validate:a11y` reads `A11Y_BASE_URL` (default `http://localhost:3000`), `SELENIUM_URL` (default
`http://localhost:4444`) and `A11Y_REPORT` (default `a11y-report.json`).

`yarn install` sets `core.hooksPath` to `.githooks/`, whose pre-commit hook runs Prettier and `eslint --fix` on
staged `.tsx` files.

## API Connection

All content is fetched from Drupal's GraphQL endpoint by the client in
[`src/lib/gql/gql-client.ts`](src/lib/gql/gql-client.ts). It sends `DRUPAL_BASIC_AUTH`, or `DRUPAL_BASIC_AUTH_ADMIN`
in preview (falling back to `DRUPAL_BASIC_AUTH`), and adds any headers from `DRUPAL_REQUEST_HEADERS`.

Requests time out after 30 seconds (60 seconds in development and CI). Failures throw typed errors whose digest is
shown on the production error page, so the cause is visible in the 500 response body (for example
`curl -s <url> | grep DRUPAL_`):

| Digest               | Cause                                             |
|----------------------|---------------------------------------------------|
| `DRUPAL_TIMEOUT`     | Drupal didn't answer within the timeout           |
| `DRUPAL_UNREACHABLE` | Connection refused or DNS failure                 |
| `DRUPAL_HTTP_<code>` | Drupal returned an HTTP error (for example `403`) |
| `DRUPAL_GRAPHQL`     | Drupal returned GraphQL errors                    |

Preview requests (`/preview/...`) are never cached and every load requests fresh data from Drupal, so preview should
only be used by editors.

### GraphQL

The GraphQL endpoint `/graphql` accepts POST requests only. GraphQL lets us fetch every piece of information needed to
build a page in a single nested request, except views. Views are fetched separately so they can be invalidated on
their own and to avoid some errors that come from the first render in Drupal.

GraphQL types and document nodes are generated with `yarn graphql`. If a content type, field, vocabulary, paragraph
type, etc. is created, edited or deleted in Drupal, the queries in [`./src/lib/gql`](./src/lib/gql) need to be
updated. Most changes go in the `fragments-*.drupal.gql` files. Drupal provides fragments you can copy as a starting
point at `/admin/config/graphql_compose/fragments`. Once the fragments and/or queries have been modified, run
`yarn graphql` to rebuild the TypeScript types. See [`src/lib/gql/README.md`](src/lib/gql/README.md).

If a field is added in Drupal that is "required", that field must be populated for each entity. GraphQL is strict and
will throw an error if you include that field in a query but the data is null. To solve this, either populate the data
in Drupal or make the field optional.

## Cache

This project uses the [Next.js `"use cache"` directive](https://nextjs.org/docs/app/api-reference/directives/use-cache)
with Cache Components. This allows caching of fetched data, components, pages, and layouts. With some exceptions, all
data is cached indefinitely and invalidated when something changes in Drupal, such as a piece of content being saved.
The default cache life has been overridden to infinite in `next.config.ts`, so adding `"use cache"` to a component,
function, or page caches it forever. Some routes, such as the [sitemap.xml](app/sitemap.ts), set a shorter cache with
[`cacheLife()`](https://nextjs.org/docs/app/api-reference/functions/cacheLife). Use as long a cache life as possible to
keep cache reads and writes to a minimum.

`durableUseCacheEntries` is enabled, so cache entries are keyed on the cached function's code rather than the
deployment ID and carry over between deploys until that code changes. On-demand revalidation still expires them by
tag.

Every cached fetch is tagged `all-cache` plus more specific tags:

| Tag                                    | Data                                        |
|----------------------------------------|---------------------------------------------|
| `paths`, `paths:<path>`                | A page's entity data                        |
| `menus`, `menu:<name>`                 | Menus (the main menu is `menu:main`)        |
| `config-pages`                         | All config pages (fetched in one request)   |
| `views`, `views:<content type>`        | View listings (`views:all` for mixed views) |
| `taxonomy`, `taxonomy:<vocabulary>`    | Taxonomy terms for filters                  |
| `nodes`                                | The list of all nodes (static params)       |
| `redirects`                            | Redirects                                   |
| `paragraphs`, `paragraph:<id>`         | Gallery paragraphs                          |
| `images`                               | Image blur placeholders                     |

### Revalidation endpoints

The Drupal Next module only provides a single URL for on-demand invalidation, so `/api/revalidate` implements its own
logic:

- `GET /api/revalidate?secret=<secret>&path=/<path>` invalidates the tag `paths:/<path>`. A `/node/<nid>` path is
  resolved to its alias first. If the path is the home page's alias, `paths:/` is invalidated too.
- `GET /api/revalidate?secret=<secret>&path=/tags/<tag>/<tag>` invalidates each listed tag instead (for example
  `/tags/menu:main/config-pages`).
- `POST /api/revalidate` with the header `Authorization: Bearer <secret>` and a JSON body
  `{"paths": ["/a"], "tags": ["menus"]}` invalidates those paths and tags.
- `GET /api/revalidate/page?secret=<secret>&path=/<path>` calls `revalidatePath()`, invalidating every bit of cached
  data used to build that single page. It doesn't accept `/node/` paths or tags.

`<secret>` is `DRUPAL_REVALIDATE_SECRET`. A wrong or missing secret returns `403 Invalid token`.

### Layout

The layout consists of the global elements on all pages: the global header, footer, and the menu. Any site-wide
settings should also be used in the layout. The main menu has the cache tags `menus` and `menu:main`. The config pages
have the tag `config-pages`, since all config pages are fetched with a single request.

When a layout cache is invalidated, it has no impact on the route caches below. However, it will trigger every route to
be rebuilt upon the next request. This shouldn't impact Drupal, since the route caches are still available.

### Page

Page routes are cached separately from layouts. Invalidating a page's data (`paths:/foo/bar`) does not affect the
layout caches. Requests like list paragraphs or external fetches are cached separately and are only re-executed when
their own tags are invalidated.

Pages may contain list paragraphs. Those paragraphs have a separate fetch so they can be invalidated when content
changes in Drupal. Each view has a cache tag in the form `views:[content_type]` that correlates to the content type in
Drupal. When this tag is invalidated, any route that contains that list paragraph is rebuilt, but only the list
paragraph data is re-fetched from Drupal.

### Images/Files

Images are optimized on the hosting platform. Use the original image from the source so the derived images are at the
best resolution. Image style derivatives (URLs with an `?itok=` hash) are rendered without the optimizer. Optimized
images are cached on Vercel for 31 days (`minimumCacheTTL`). To limit billed transformations, `next.config.ts` allows
only a small set of widths and a single quality. See
[Next.js image docs](https://nextjs.org/docs/app/api-reference/components/image) and
[Vercel image caching](https://vercel.com/docs/image-optimization#caching).

Document files (pdf, txt, doc, xls, ppt, …) are proxied from Drupal's public files directory by a rewrite, so
`/files/<site>/<path>` on the front end serves `/sites/<site>/files/<path>` from Drupal and the user stays on the front
end domain. Their cache is managed by the Drupal hosting provider and/or Varnish/CDN.

### Troubleshooting Cache Issues

If you experience any issues during development, opening the browser's inspector tools and reloading the page will
usually bypass any cached data. If necessary, delete the `.next` directory and restart your local server.

Front-end cache issues can be very different from Drupal cache issues. Although both systems use cache tags, there is
no relationship between them. When a save action is performed in Drupal, a revalidation request is made to this
platform. Occasionally there can be a communication issue, or the Next.js cache doesn't invalidate the appropriate
areas. Ways to resolve it:

1. Resave the page that is outdated.
    - This makes a second request to the front end and attempts to revalidate it again.
2. Resave a menu item or a page within the menu.
    - This invalidates the menu on all pages.
    - If resaving a page within the menu, change some value in the menu area to trigger the invalidation. Changing a
      weight from 50 to 49 can be the easiest solution.
3. Resave the configuration page that is outdated.
    - Resaving a global message or site settings clears the cache for all config pages. This rebuilds all pages.
4. Use the `/system/cache-clear` page to clear the main menu, the global elements, or specific paths and tags.
5. Enable debugging in the "Next" module in Drupal.
    - `drush cset next.settings debug 1` adds watchdog logs. These can be streamed in Acquia logs or viewed in the UI
      if the dblog module is enabled. Errors in the logs indicate an issue that should be inspected more closely.
    - Remember to disable debugging once the issue is resolved.
6. Call the revalidation endpoints above directly. `/api/revalidate/page` is the last resort for a single page.

### Cache Documentation

- [Next.js caching documentation](https://nextjs.org/docs/app/getting-started/caching)
- [Next.js "use cache" directive](https://nextjs.org/docs/app/api-reference/directives/use-cache)
- [Vercel Edge Caching](https://vercel.com/docs/edge-network/caching)

## Routing

### Public content pages (`app/(site)/[[...slug]]`)

Every path that maps to a Drupal node is handled by the catch-all page at `app/(site)/[[...slug]]/page.tsx`. On each
request it:

1. Converts the URL segments into a path string (e.g. `["about", "team"]` → `/about/team`).
2. Calls `getEntityFromPath(path)`, which runs the Drupal `Route` GraphQL query.
3. If Drupal returns a redirect, Next.js `redirect()` is called.
4. If Drupal returns an entity, `<NodePage node={entity} />` renders the appropriate node component.
5. If nothing is found, `notFound()` triggers the `not-found.tsx` page.

Static pages are pre-built during `yarn build` using `generateStaticParams()`. The number of pages built is controlled
by the `BUILD_PAGES` environment variable (`0` = the home page only, `-1` = all, any positive number = the first N
pages). Keep it under about 500 to avoid putting heavy load on Drupal.

### Protected content pages (`app/(site)/internal/[[...slug]]`)

This mirrors the public catch-all but only renders nodes whose Drupal path starts with `/internal/`. The `proxy.tsx`
middleware enforces SAML authentication before any request reaches this route.

To put **more routes behind authentication**, add them to the `matcher` array in `proxy.tsx`. If the site has no
protected pages, remove `/internal/:path*` and `/user` from it.

```ts
export const config = {
  matcher: [
    "/preview/:path*",
    "/system/:path*",
    "/internal/:path*",
    "/user",
    "/my-new-protected-route/:path*",
  ],
}
```

### Special routes

| Route                  | Purpose                                                                          |
|------------------------|----------------------------------------------------------------------------------|
| `/search`              | Algolia-powered search; falls back to a basic site search                        |
| `/gallery/[...uuid]`   | Full-screen image gallery; also opens as a modal via the `@modal` parallel route |
| `/preview/[[...slug]]` | Editor preview of draft content; requires `?secret=` matching `DRUPAL_PREVIEW_SECRET` |
| `/user`                | Authenticated user profile page; shows name, email, and a logout button          |
| `/user/login`          | Public login landing page with a "Log In" button                                 |
| `/system/cache-clear`  | Admin UI for manual cache clearing; protected by HTTP Basic Auth                 |
| `/sitemap.xml`         | Generated by `app/sitemap.ts`; lists all published node paths                    |

### Built-in redirects and rewrites (`next.config.ts`)

| From                     | To                                                             |
|--------------------------|----------------------------------------------------------------|
| `/wp-:path*`             | `/not-found` (permanent) — catches stray WordPress paths       |
| `/node/:slug`            | Drupal's `/node/:slug` (permanent) — raw node IDs go to Drupal |
| `/saml/login`            | Drupal's `/user/login` (permanent)                             |
| `/files/:site/:path` (rewrite) | Drupal's `/sites/:site/files/:path`, for document files only |

---

## Middleware & Protected Routes

`proxy.tsx` is the Next.js middleware that runs on every request matching its `matcher` patterns. It handles three
types of access control:

### Preview secret (`/preview/*`)

Checks `?secret=` against `DRUPAL_PREVIEW_SECRET` with a constant-time comparison. Drupal's
`/preview?secret=…&slug=/path` link is redirected to `/preview/path?secret=…` after the slug is checked to be a plain
relative path. Anything invalid gets the 404 page.

### SAML JWT authentication (`/internal/*`, `/user`)

1. Reads the `auth_token` cookie.
2. Verifies the JWT signature and expiry using `verifyJWT()`.
3. If valid: injects user identity headers (`x-user-id`, `x-user-email`, `x-user-name`) and allows the request through.
   These overwrite any `x-user-*` headers sent by the client.
4. If invalid or missing: redirects to `/api/auth/login?destination=<original-path>` to start the SAML flow.

### HTTP Basic authentication (`/system/*`)

The `/system/cache-clear` route is protected by HTTP Basic Auth rather than SAML because it is a developer/admin tool
that should be accessible without a Stanford SSO account.

Credentials are set with the `CACHE_CLEAR_USERNAME` and `CACHE_CLEAR_PASSWORD` environment variables. If either is
unset, the page can't be opened.

---

## Authentication (SAML SSO)

This application supports SAML 2.0 Single Sign-On for protected routes. The implementation lives in `app/api/auth/` and
`src/lib/auth/`. The SAML packages are optional dependencies; without them the site builds and `/api/auth/login`
returns `501`.

For full details — including endpoint descriptions, environment variables, and the JWT session model — see
**[app/api/auth/README.md](app/api/auth/README.md)**.

**Quick summary of the flow:**

1. User hits a protected page → middleware redirects to `/api/auth/login`.
2. `/api/auth/login` redirects to the Stanford IdP (configurable via `SAML_ENTRY_POINT`).
3. After the user authenticates, the IdP POSTs a SAML response to `/api/auth/callback`.
4. The callback validates and decrypts the assertion, extracts the user profile, and issues a signed `auth_token` JWT
   cookie.
5. The user is redirected to their original destination.

---

## Secrets Management (HashiCorp Vault)

Secrets should be stored in [Vault](https://vault.stanford.edu), for the Lagunita sites at
`secret/data/projects/uit-webservices/decoupled-drupal/<site>`. When `VAULT_ROLE_ID`, `VAULT_SECRET_ID` and
`VAULT_PATH` are set, `vault-envars.ts` logs in with the AppRole, reads every key at `VAULT_PATH`, and `next.config.ts`
spreads them into the Next.js `env` config.

- **A variable that is already set (in Vercel or `.env.local`) wins.** The loader skips keys that already exist.
- **Vault is read at build time.** Next.js inlines `env` config values when the app is built, so after changing a
  value in Vault, redeploy.
- If the Vault login or read fails, the loader logs `[Vault] …` and the build continues without those values. Look
  for `[Vault] Secrets loaded successfully` in the build log.

---

## Search

Search is powered by [Algolia](https://www.algolia.com/) using the `react-instantsearch` library.

- `getAlgoliaCredential()` uses the `ALGOLIA_ID`, `ALGOLIA_INDEX` and `ALGOLIA_KEY` environment variables when all
  three are set. Otherwise it falls back to the Algolia fields on Drupal's Basic Site Settings config page (and logs a
  warning, since storing keys in the database is discouraged).
- If Algolia credentials are not configured, the search page renders a basic site search fallback.
- If the "hide site search" setting is on in Drupal, `/search` returns a 404.
- The Algolia UI components live in `src/components/algolia/` and `src/components/search/`.

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values. The only **required** variable to start the dev server is
`NEXT_PUBLIC_DRUPAL_BASE_URL`. Any of the secrets can be stored in Vault instead.

### Drupal connection

| Variable                      | Required    | Description                                                                     |
|-------------------------------|-------------|---------------------------------------------------------------------------------|
| `NEXT_PUBLIC_DRUPAL_BASE_URL` | ✅           | Base URL of the Drupal site (e.g. `https://example.stanford.edu`). Inlined at build time. |
| `DRUPAL_BASIC_AUTH`           | ✅           | `user:password` for standard read-only API requests                             |
| `DRUPAL_BASIC_AUTH_ADMIN`     | For preview | `user:password` for preview requests; can read unpublished content              |
| `DRUPAL_REVALIDATE_SECRET`    | Recommended | Shared secret for the cache revalidation webhook                                |
| `DRUPAL_PREVIEW_SECRET`       | For preview | Shared secret for the preview routes. Preview is disabled when unset.           |
| `DRUPAL_REQUEST_HEADERS`      | Optional    | JSON string of extra headers sent to Drupal (e.g. a WAF bypass token)           |

### Build & deployment

| Variable             | Required   | Description                                                                                      |
|----------------------|------------|--------------------------------------------------------------------------------------------------|
| `BUILD_PAGES`        | Optional   | Number of pages to pre-build (default `0`, the home page only; `-1` for all)                     |
| `NEXT_PUBLIC_DOMAIN` | Production | Canonical domain for `sitemap.xml`. While unset, every response gets `X-Robots-Tag: noindex`. Set it on production only, at launch. |
| `NEXT_PUBLIC_GTM`    | Optional   | Google Tag Manager container ID                                                                  |

### Search

| Variable        | Required | Description                                      |
|-----------------|----------|--------------------------------------------------|
| `ALGOLIA_ID`    | Optional | Algolia application ID (overrides Drupal config) |
| `ALGOLIA_INDEX` | Optional | Algolia index name                               |
| `ALGOLIA_KEY`   | Optional | Algolia search-only API key                      |

### Authentication & secrets

| Variable               | Required      | Description                                                                    |
|------------------------|---------------|--------------------------------------------------------------------------------|
| `VAULT_ROLE_ID`        | For Vault     | Vault AppRole role ID                                                          |
| `VAULT_SECRET_ID`      | For Vault     | Vault AppRole secret ID                                                        |
| `VAULT_PATH`           | For Vault     | Vault path to read secrets from                                                |
| `JWT_SECRET`           | For auth      | Secret key for signing/verifying JWT session cookies                           |
| `SAML_ENTRY_POINT`     | For auth      | IdP SSO URL (e.g. `https://login.stanford.edu/idp/profile/SAML2/Redirect/SSO`) |
| `SAML_ENTITY_ID`       | For auth      | SP entity ID, sent as the issuer and checked as the audience                   |
| `SAML_IDP_CERT`        | For auth      | IdP signing certificate(s)                                                     |
| `SAML_PRIVATE_KEY`     | For auth      | SP private key, used to decrypt assertions                                     |
| `SAML_SIGNING_CERT`    | For auth      | SP certificate published in the SAML metadata                                  |
| `CACHE_CLEAR_USERNAME` | For `/system` | Username for the `/system/cache-clear` Basic Auth                              |
| `CACHE_CLEAR_PASSWORD` | For `/system` | Password for the `/system/cache-clear` Basic Auth                              |

---

## Making Changes

### Adding or modifying a content type

1. **Update the GraphQL schema.** If a field was added or changed in Drupal, the `.gql` files in `src/lib/gql/` need to
   reflect the change. Most field additions can be made in:
    - `fragments-nodes.drupal.gql` — for fields on node types
    - `fragments-paragraphs.drupal.gql` — for fields on paragraph types
    - `fragments-fields.drupal.gql` — for reusable primitive field fragments

   Drupal provides copy-paste starter fragments at `/admin/config/graphql_compose/fragments`.

2. **Regenerate TypeScript types.** After editing any `.gql` file, run:
   ```bash
   yarn graphql
   ```
   This regenerates `src/lib/gql/__generated__/` — never edit those files by hand.

3. **Update or create a node renderer.** Node pages are rendered by components in `src/components/nodes/pages/`. The
   `<NodePage>` component (`node-page.tsx`) dispatches to the correct renderer based on the entity `__typename`. Add a
   new case there for new content types.

4. **Update card and list-item renderers** in `src/components/nodes/cards/` and `src/components/nodes/list-item/` if the
   content type needs to appear in listing pages.

### Adding a new paragraph type

1. Add the fields to `fragments-paragraphs.drupal.gql` and add the new fragment to the `FragmentParagraphUnion` union.
2. Run `yarn graphql`.
3. Create a new component in `src/components/paragraphs/`.
4. Register it with a new `case` on the paragraph's `__typename` in `src/components/paragraphs/paragraph.tsx`.

### Adding a new protected route

1. Add the path pattern to the `matcher` array in `proxy.tsx`.
2. Create the page under `app/(site)/`. If it should render Drupal content, follow the pattern of
   `app/(site)/internal/[[...slug]]/page.tsx`.
3. In the page component, read the injected user identity headers via `headers()` from `next/headers` if needed:
   ```ts
   import { headers } from "next/headers"
   const headersList = await headers()
   const userId = headersList.get("x-user-id")
   ```

### Modifying the global layout

The root layout is `app/layout.tsx`. It renders `<GlobalPage>` (`src/components/layouts/global-page.tsx`), which
wraps the header, footer, and back-to-top button; those components are in `src/components/global/`.
`app/(site)/layout.tsx` adds user analytics to public routes only, so preview pages never load them. The main navigation menu is fetched via `getMenu(MenuAvailable.Main)` and cached with
the `menu:main` tag.

### Adding a new Drupal Views listing

1. Write or update a view query in `src/lib/gql/view-queries.drupal.gql`.
2. Run `yarn graphql`.
3. Add a new dispatch case to `getViewPagedItems()` in `src/lib/gql/gql-views.ts`, and a cache tag in its `viewTags`
   map.
4. Create the React component in `src/components/views/`.

### Updating SAML certificates or other secrets

SAML certificates and other secrets are read from environment variables, which come from Vercel or from Vault at build
time. After rotating a value:

1. Update it in Vault (or in Vercel, if it's set there; a Vercel value takes precedence).
2. Redeploy the front end so the build picks up the new value.

`SAML_IDP_CERT` may hold more than one PEM certificate, which allows an IdP certificate rollover without downtime.

---

## CI / CD

GitHub Actions workflows in `.github/workflows/`:

- **`build_lint.yml`** (every push):
    - **Lint job:** runs `yarn lint` (ESLint + TypeScript type check) in a `node:24` container.
    - **Build job:** checks out `SU-SWS/ace-stanfordlagunita`, installs Drupal, appends the output of
      `drush stanford-decoupled:connect-next` to `.env.local`, builds the app against it with `BUILD_PAGES=100`, and then
      runs `yarn validate:html` and `yarn validate:a11y` (Chrome in a Selenium service container). This catches GraphQL
      schema drift and markup or accessibility regressions before deploy. Site repos copied from this template replace
      the install with `drush drupal:sync --site=<site>`, which needs the `SSH_KEY` and `KNOWN_HOSTS` repository
      secrets.
- **`update-dev-test-branches.yml`** (push to `1.x`): rebases the `dev` and `test` branches onto `1.x` and
  force-pushes them, so those Vercel branch deployments stay current. Both branches must exist.
- **`secret-scan.yml`** (pull requests, pushes and weekly): runs gitleaks with `.gitleaks.toml`. If it finds a real
  secret, rotate it, since it is already in the git history. Add false positives to `.gitleaksignore` with a comment.

TypeScript build errors are ignored outside CI (to avoid requiring dev dependencies in production) but are enforced in
CI via `CI=true`.

## Deploy on Vercel

1. Import the GitHub repo as a Vercel project with the **Next.js** framework preset and the repo root as the root
   directory.
2. Build and install commands come from `vercel.json` (`yarn build` and `yarn workspaces focus --production`). Don't
   override them in the UI.
3. Set the Node.js version to match `.nvmrc`, and the production branch to `1.x`.
4. Set the environment variables above. Use branch-specific values for `NEXT_PUBLIC_DRUPAL_BASE_URL` so `dev` and
   `test` point at the matching Drupal environments, and leave `NEXT_PUBLIC_DOMAIN` unset outside production.

The Vercel project and team names become part of each branch URL (`<project>-git-<branch>-<team>.vercel.app`), which
Drupal's dev and test environments are configured to call. Renaming either means updating the Drupal settings.

To learn more about Next.js, see the [Next.js Documentation](https://nextjs.org/docs).
