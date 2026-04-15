# Cardinal Sites — Decoupled Next.js Frontend

Cardinal Sites is a decoupled (headless) front-end application for Stanford University websites. It is built with [Next.js](https://nextjs.org/) and acts as the presentation layer for one or more Drupal CMS instances. Drupal manages all content; this application fetches that content via GraphQL and JSON API, renders it into React components, and serves it as a statically cached site with on-demand cache invalidation.

**Key technology choices:**

| Concern | Solution |
|---------|---------|
| Framework | Next.js 16 (App Router, React 19) |
| CMS | Drupal (via GraphQL + JSON API) |
| Styling | Tailwind CSS + [Decanter](https://decanter.stanford.edu) design system |
| Search | Algolia (React InstantSearch) |
| Authentication | SAML 2.0 SSO → JWT session cookie |
| Secrets management | HashiCorp Vault (AppRole auth) |
| Hosting | Vercel |
| Package manager | Yarn 4 |

---

## Architecture Overview

```
  Drupal CMS
  ├── GraphQL endpoint (/graphql)    ← Full page data, menus, config
  ├── JSON API (/jsonapi)            ← Simple lookups
  └── Revalidation webhook           → GET /api/revalidate

  Next.js (this app)
  ├── app/[[...slug]]                ← All public Drupal-content pages
  ├── app/internal/[[...slug]]       ← SAML-protected Drupal pages
  ├── app/user                       ← Authenticated user profile page
  ├── app/search                     ← Algolia-powered search page
  ├── app/api/auth/*                 ← SAML SSO + JWT endpoints
  ├── app/api/revalidate             ← Cache invalidation webhook
  ├── app/api/draft                  ← Drupal Draft Mode entry point
  └── proxy.tsx (middleware)         ← JWT gate on /internal, /user, /system

  HashiCorp Vault
  └── Stores SAML certificates and other secrets fetched at runtime
```

### Request lifecycle (public page)

1. Browser requests `/some/path`.
2. Next.js serves the **statically cached** page (built or previously warmed).
3. If the cache is cold, the page function calls `getEntityFromPath("/some/path")` which queries the Drupal GraphQL API.
4. The response is cached indefinitely under the tag `paths:/some/path`.
5. When an editor saves content in Drupal, the Next.js Drupal module calls `/api/revalidate?secret=…&path=/some/path`, which calls `revalidateTag("paths:/some/path")` and evicts only that entry.

### Request lifecycle (protected page)

1. Browser requests `/internal/some/page` or `/user`.
2. The middleware (`proxy.tsx`) intercepts the request, reads the `auth_token` JWT cookie and verifies it.
3. If the token is missing or invalid, the browser is redirected to `/api/auth/login?destination=/internal/some/page`.
4. The SAML flow completes at `/api/auth/callback`, which issues a new JWT cookie and redirects back to the original destination.
5. On subsequent requests, the middleware injects `x-user-id`, `x-user-email`, and `x-user-name` headers so downstream page components can read the authenticated user's identity without re-verifying the token.

---

## Directory Structure

```
nextCardinalSites/
├── app/                        # Next.js App Router pages and API routes
│   ├── [[...slug]]/            # Catch-all: renders every public Drupal content page
│   ├── @modal/                 # Parallel route for lightbox modals (gallery, AV media)
│   ├── api/
│   │   ├── auth/               # SAML SSO endpoints (see app/api/auth/README.md)
│   │   ├── draft/              # Drupal Draft Mode activation
│   │   └── revalidate/         # On-demand cache invalidation webhook
│   ├── av-media/               # Audio/video media pages
│   ├── gallery/                # Image gallery pages
│   ├── internal/               # SAML-protected content pages (mirrors [[...slug]])
│   ├── preview/                # Draft Mode preview pages
│   ├── search/                 # Algolia search page
│   ├── system/cache-clear/     # Admin UI for manual cache clearing (Basic Auth)
│   ├── user/                   # Authenticated user profile + login pages
│   ├── layout.tsx              # Root layout: fonts, metadata, global header/footer
│   ├── not-found.tsx           # 404 page
│   └── sitemap.tsx             # Auto-generated sitemap.xml
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
│   │   ├── patterns/           # Storybook design patterns
│   │   ├── search/             # Site search fallback (non-Algolia)
│   │   ├── tools/              # Developer/admin utility components
│   │   └── views/              # Drupal Views list renderers (per content type)
│   │
│   ├── lib/
│   │   ├── auth/               # SAML config, JWT helpers, manual XML decryption
│   │   ├── gql/                # GraphQL queries, generated types, data fetchers
│   │   │   ├── *.drupal.gql    # Hand-authored query/fragment definitions
│   │   │   ├── __generated__/  # Auto-generated — DO NOT EDIT
│   │   │   ├── gql-client.tsx  # GraphQLClient factory (with auth header logic)
│   │   │   ├── gql-queries.ts  # Cached server-side data fetching helpers
│   │   │   └── gql-views.tsx   # View/listing page fetchers
│   │   ├── @types/             # Custom type declarations (Drupal, xml-encryption)
│   │   └── utils/              # Shared utilities (Vault, image placeholder, text tools…)
│   │
│   ├── hooks/                  # Custom React hooks
│   └── styles/                 # Global CSS, Tailwind entry point, typography fonts
│
├── proxy.tsx                   # Next.js middleware: JWT auth gate + Basic Auth for /system
├── next.config.ts              # Next.js config: cache, images, redirects, robots headers
├── tailwind.config.ts          # Tailwind theme extensions
├── codegen.ts                  # GraphQL codegen config
└── .env.example                # Template for all required environment variables
```

### TypeScript path aliases

Avoid deep relative imports — use these aliases defined in `tsconfig.json`:

| Alias | Resolves to |
|-------|-------------|
| `@components/*` | `src/components/*` |
| `@lib/*` | `src/lib/*` |
| `@hooks/*` | `src/hooks/*` |

---

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Setup Local Environment Variables:
1. copy .env.example to .env.local
2. The only necessary variable is the `NEXT_PUBLIC_DRUPAL_BASE_URL`. Set this to your local drupal installation url.
  
### Set Up Drupal Environment (Optional)
You can configure your Drupal environment to use this as a "preview".

1. In the Drupal environment, go to `/admin/config/services/next/sites/add` page.
2. Enter a label of your choice.
3. "Base URL" will be `http://localhost:3000`.
4. "Preview URL" will be `http://localhost:3000/api/draft`.
5. "Preview Secret" can be any string of your choice. This should match the `DRUPAL_PREVIEW_SECRET` environment variable.
6. "Revalidate URL" `http://localhost:3000/api/revalidate`. Only necessary to test cache invalidations in preview mode.
7. "Revalidate secret" will be any string of your choice. This should match `DRUPAL_REVALIDATE_SECRET` environment variable. . Only necessary to test cache invalidations in preview mode.
8. To test authenticated "Draft Mode" navigate to `/admin/config/services/consumer`. At least 1 "Consumer" should already exist.
   1. Edit the consumer
   2. The "Client ID" can be any string of your choice. It should match the `DRUPAL_DRAFT_CLIENT` environment variable.
   3. The "New Secret" can be any string of your choice. It should match the `DRUPAL_DRAFT_SECRET` environment variable.
   4. Choose an appropriate "User", like any "Site Manager"
   5. For "Scopes" select "Site Manager" and "Decoupled Site User"

### Start Development Server:

```bash
# Install Dependencies
yarn install
# Run dev server
yarn dev
# Or run preview server
yarn preview
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

### Storybook

Story book is a great way to edit components without the need for any Drupal connection. All stories and setup are saved in the [./.storybook directory](./.storybook).
```bash
yarn storybook
```
This will open a new browser window to [http://localhost:6006](http://localhost:6006). 

View more [Storybook documentation](https://storybook.js.org/).

### Linting

This project uses both typescript checks and ESLinting. These are run on CI services, but not on production environments since the dev dependencies are not installed on production.

```bash
yarn lint
```

## API Connection

This project makes use of both JSON API and GraphQL API endpoints from the Drupal environment. When a user is in "Draft 
Mode", the APIs will use the `DRUPAL_DRAFT_CLIENT` & `DRUPAL_DRAFT_SECRET` environment variables to fetch an OAuth token.
This token allows either API to fetch authenticated only data. But while in "draft mode", the pages will be built at
request time. "Draft mode" should only be used for previewing content when a user is editing. "Draft mode" is only enabled
when a user hits the [/api/draft](./app/api/draft/route.tsx) route from the Drupal environment. It establishes a cookie
that is then used for subsequent page requests. Note that while in "draft mode", every page load will request fresh data
from the CMS system. This can have negative performance impacts on both platforms.

[Draft mode documenation](https://nextjs.org/docs/app/building-your-application/configuring/draft-mode)

### JSON API

The JSON API is used for data points that are more simple and don't require very complex data such as paragraph entities. 
Things like the config pages and the main menu are fetched from JSON API. These APIs also use GET methods. This way they 
can be easily cached by Drupal/Varnish/CDN services and result in faster data transfer.

JSON API functions are found in the [./src/lib/drupal directory](src/lib/@types/drupal). 

### GraphQL

GraphQL endpoint `/graphql` accepts POST methods only. GraphQL allows us to create very nested queries using unions. We 
can easily fetch every single piece of information in a single request to build out the entire page, except views. Views
are fetched separately to allow us to make them more dynamic in the future and also to avoid some unwanted errors that 
come from the first render in Drupal.

GraphQL types and fetch methods are generated automatically using `yarn graphql`. If a content type, field, vocabulary, 
paragraph type, etc. are created/edited/deleted in the Drupal environment, the queries in [./src/lib/gql](./src/lib/gql) 
will need to be updated. Most of the changes can be implemented in the [fragments.drupal.gql](./src/lib/gql/fragments.drupal.gql) 
file. To make it easy, Drupal provides fragments you can copy as a starting point. Navigate to `/admin/config/graphql_compose/fragments`
to view those fragments. Once the fragments and/or queries have been modified, simply run `yarn graphql` to rebuild the
typescript types and fetcher queries.

If a field is added in the Drupal environment that is "required", that field must be populated for each entity. GraphQL
is strict and will throw an error if you include that field in a query, but the data is null. To solve this, either
populate the data in Drupal or make the field optional.

## Cache

This project uses [Next.JS "use cache" directive](https://nextjs.org/docs/app/api-reference/directives/use-cache).
This allows the caching of data that is fetched, components, pages, and layouts. With some exceptions, we want to cache 
all data indefinitely. Then invalidating that cache upon some action performed in the Drupal application, such as a
piece of content is updated. The default cache behavior of Next.JS has been overridden to infinite cache. Simply adding
`"use cache"` on a component, function, or page will then cache it forever. Some pages, such as the [sitemap.xml](app/sitemap.tsx),
can set their cache to be shorter by using the [cacheLife()](https://nextjs.org/docs/app/api-reference/functions/cacheLife)
function. It's recommended to use a long of cache life as needed to keep cache read/writes to a minimum.

In the layout and pages we set `"use cache"` at the top of the file. This caches the page and layout build indefinitely.
Layouts and page caches are treated separately and can be invalidated independently of each other, while also allowing
specific parts of each to be invalidated. A route handler is provided that allows the CMS system to invalidate 
appropriate areas of the site. Making a `GET` request to `/api/revalidate?secret=[secret]&path=/[path]` with the correct
parameters will accomplish this invalidation. Passing a path in the form `/tags/foo:bar` will invalidate the cache tags
for `foo:bar` using the [revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag) function. The
reason for this is the Next.js Drupal module only provides a single API url for on demand invalidation. So we have to 
implement our own logic.

### Layout

The layout consists of the global elements on all pages. This consists of the global header, footer, and the menu. Any
site wide settings should also be used in the layout. The main menu in the header has cache tags: `menus` & `menu:main`.
The config pages have the cache tag `config-pages` since all config pages are fetched with a single request.

When a layout cache is invalidated, it has no impact on the route caches below. However, it will trigger every route to
be rebuilt upon the next request. This shouldn't impact the CMS system since the route caches are still available.

### Page

Page routes are cache separately from Layouts. When invalidating a route or any fetch requests on the route, the layout
caches will not be impacted. Using the route handler, if we invalidate the path `/foo/bar` using the [revalidatePath](https://nextjs.org/docs/app/api-reference/functions/revalidatePath)
function, it will invalidate any cache data that was used to build that single page and no other pages. Requests
like list paragraphs, or external fetches will be re-executed when the page is requested.

Pages may contain list paragraphs. Those paragraphs have a separate `fetch` so they can be invalidated when a content
changes in the CMS. Each view contains a cache tag in the form `views:[content_type]` that correlates to the content
type in the Drupal CMS. When this cache tag is invalidated, any route that contains that list paragraph will be rebuilt,
but only the list paragraph data will be re-fetched from the CMS.

### Images/Files

Images are optimized on the hosting platform. It is recommended to use the original image from the source so that the
derived images will be at the best resolution quality. [Next.js](https://nextjs.org/docs/pages/api-reference/components/image)
provides extensive documentation about image optimization. Optimized images will then be cached on the hosting provider
and stored for 31 days, unless triggered to be cleared out. [Vercel](https://vercel.com/docs/image-optimization#caching)
has documentation explaining how their cache is handled.

Files, pdf, txt, etc., assets are referenced directly from the CMS. Their cache is managed by the Drupal hosting provider
and/or Varnish/CDN/Etc.

### Troubleshooting Cache Issues

If you experience any issues during development, most times opening the browser's inspector tools and reloading the page
will bypass any cached data. If necessary, delete the `.next` directory and restart your local server.

Cache issues on the front end can be very different from Drupal related cache issues. Although both systems use a form
of cache tags, there are no relationship between the two caching systems. When a save action is performed in Drupal, a
revalidation request is made to this platform. Occasionally there can be a communication issue or perhaps the Next.JS
cache refuses to invalidate the appropriate areas. Here are some ways to attempt to resolve the issue:

1. Resave the page that is outdated.
   - This will make a second request to the FE and attempt to revalidate it again.
2. Resave a menu item or a page within the menu.
   - This will invalidate the menu on all pages.
   - If resaving a page within the menu, make sure to change some value in the menu area to trigger the invalidation. 
   Changing a weight from 50 to 49 can be the easiest solution.
3. Resave the configuration page that is outdated.
   - Resaving a global message or site settings will clear cache for all config pages. This will rebuild all pages.
4. Enable debugging in the "Next" module in Drupal.
   - `drush cset next.settings debug 1` will add watchdog logs. These can be streamed in Acquia logs or viewed in the UI
   if the dblog module is enabled. Errors in the logs will indicate some issue that should be inspected more closely.
   - Remember to disable the debug once the issue is resolved.

If all of the above fails, there are two quick fixes that can help in a pinch.

1. As stated above making a `GET` request to `/api/revalidate?secret=[secret]&path=/[path/tags]` with the correct
   parameters will perform a cache invalidation. This will invalidate just a piece of the page(s).
2. As a last resort, making a `GET` request to `/api/revalidate/page?secret=[secret]&path=/[path]` will invalidate every
   bit of cached data for that specific path. The system will then refetch the menu, config pages, and the page data to
   rebuild that one page. This approach will not invalidate cache on any other page and it does not support cache tags.
   It is very specific to only that single path.

### Cache Documentation
- [Next.JS cache documentation](https://nextjs.org/docs/app/building-your-application/caching)
- [Next.JS "use cache" directive](https://nextjs.org/docs/app/api-reference/directives/use-cache)
- [Vercel Edge Caching](https://vercel.com/docs/edge-network/caching)

## Routing

### Public content pages (`app/[[...slug]]`)

Every path that maps to a Drupal node is handled by the catch-all page at `app/[[...slug]]/page.tsx`. On each request it:

1. Converts the URL segments into a path string (e.g. `["about", "team"]` → `/about/team`).
2. Calls `getEntityFromPath(path)` which runs the Drupal `Route` GraphQL query.
3. If Drupal returns a redirect, Next.js `redirect()` is called.
4. If Drupal returns an entity, `<NodePage node={entity} />` renders the appropriate node component.
5. If nothing is found, `notFound()` triggers the `not-found.tsx` page.

Static pages are pre-built during `yarn build` using `generateStaticParams()`. The number of pages built is controlled by the `BUILD_PAGES` environment variable (`0` = none, `-1` = all, any positive number = first N pages).

### Protected content pages (`app/internal/[[...slug]]`)

This mirrors the public catch-all but only renders nodes whose Drupal path starts with `/internal/`. The `proxy.tsx` middleware enforces SAML authentication before any request reaches this route.

To put **more routes behind authentication**, add them to the `matcher` array in `proxy.tsx`:

```ts
export const config = {
  matcher: ["/internal/:path*", "/user", "/system/:path*", "/my-new-protected-route/:path*"],
}
```

### Special routes

| Route | Purpose |
|-------|---------|
| `/search` | Algolia-powered search; falls back to a basic site search |
| `/gallery/[...uuid]` | Full-screen image gallery; also opens as a modal via the `@modal` parallel route |
| `/av-media/[...slug]` | Audio/video media pages; also opens as a modal |
| `/preview/[[...slug]]` | Draft Mode content preview; requires a valid Drupal preview cookie |
| `/user` | Authenticated user profile page; shows name, email, and a logout button |
| `/user/login` | Public login landing page with a "Log In" button |
| `/system/cache-clear` | Admin UI for manual cache clearing; protected by HTTP Basic Auth |
| `/sitemap.xml` | Auto-generated from `app/sitemap.tsx`; lists all published node paths |

### Built-in redirects (`next.config.ts`)

| From | To |
|------|----|
| `/wp-:path*` | `/not-found` (permanent) — catches stray WordPress paths |
| `/node/:slug` | Drupal's `/node/:slug` (permanent) — raw node IDs go to Drupal |
| `/saml/login` | Drupal's `/user/login` (permanent) |

---

## Middleware & Protected Routes

`proxy.tsx` is the Next.js middleware that runs on every request matching its `matcher` patterns. It handles two types of authentication:

### SAML JWT authentication (`/internal/*`, `/user`)

1. Reads the `auth_token` cookie.
2. Verifies the JWT signature and expiry using `verifyJWT()`.
3. If valid: injects user identity headers (`x-user-id`, `x-user-email`, `x-user-name`) and allows the request through.
4. If invalid or missing: redirects to `/api/auth/login?destination=<original-path>` to start the SAML flow.

### HTTP Basic authentication (`/system/*`)

The `/system/cache-clear` route is protected by HTTP Basic Auth rather than SAML because it is a developer/admin tool that should be accessible without a Stanford SSO account.

Credentials are set via `CACHE_CLEAR_USERNAME` and `CACHE_CLEAR_PASSWORD` environment variables.

---

## Authentication (SAML SSO)

This application supports SAML 2.0 Single Sign-On for protected routes. The implementation lives in `app/api/auth/` and `src/lib/auth/`.

For full details — including endpoint descriptions, environment variables, and the JWT session model — see **[app/api/auth/README.md](app/api/auth/README.md)**.

**Quick summary of the flow:**
1. User hits a protected page → middleware redirects to `/api/auth/login`.
2. `/api/auth/login` redirects to the Stanford IdP (configurable via `SAML_ENTRY_POINT`).
3. After the user authenticates, the IdP POSTs a SAML response to `/api/auth/callback`.
4. The callback decrypts the assertion, extracts the user profile, and issues a signed `auth_token` JWT cookie.
5. The user is redirected to their original destination.

---

## Secrets Management (HashiCorp Vault)

Sensitive credentials (SAML certificates, private keys) are stored in HashiCorp Vault and fetched at runtime by `src/lib/utils/vault.tsx`. Vault access uses AppRole authentication.

```ts
import { fetchFromVault } from "@lib/utils/vault"

// Fetch a specific key from a Vault secret path
const cert = await fetchFromVault<string>(
  process.env.VAULT_SAML_IDP_CERT_PATH as string,
  process.env.VAULT_SAML_IDP_CERT_KEY as string
)

// Fetch all keys from a path (returns a Map<string, string>)
const secrets = await fetchFromVault(process.env.VAULT_SECRET_PATH as string)
```

`fetchFromVault` is wrapped in `"use cache"` with the `vault` cache tag. All Vault responses are cached indefinitely. To force a re-fetch (e.g. after rotating a certificate), revalidate the `vault` cache tag:

```
GET /api/revalidate?secret=<secret>&path=/tags/vault
```

---

## Search

Search is powered by [Algolia](https://www.algolia.com/) using the `react-instantsearch` library.

- The Algolia app ID, index name, and search-only API key are stored as Drupal config-page fields and fetched via `getAlgoliaCredential()`.
- If Algolia credentials are not configured, the search page renders a basic site search fallback.
- The Algolia UI components live in `src/components/algolia/` and `src/components/search/`.

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values. The only **required** variable to start the dev server is `NEXT_PUBLIC_DRUPAL_BASE_URL`.

### Drupal connection

| Variable                      | Required | Description |
|-------------------------------|----------|-------------|
| `NEXT_PUBLIC_DRUPAL_BASE_URL` | ✅ | Base URL of the Drupal site (e.g. `https://example.stanford.edu`) |
| `DRUPAL_BASIC_AUTH`           | ✅ | `user:password` for standard read-only API requests |
| `DRUPAL_BASIC_AUTH_ADMIN`     | ✅ | `user:password` for preview/draft authenticated requests |
| `DRUPAL_REVALIDATE_SECRET`    | Recommended | Shared secret for cache revalidation webhook |
| `DRUPAL_PREVIEW_SECRET`       | Recommended | Shared secret for Draft Mode activation |
| `DRUPAL_DRAFT_CLIENT`         | Optional | OAuth client ID for draft mode token requests |
| `DRUPAL_DRAFT_SECRET`         | Optional | OAuth client secret for draft mode token requests |
| `DRUPAL_REQUEST_HEADERS`      | Optional | JSON string of extra headers sent to Drupal (e.g. WAF bypass token) |

### Build & deployment

| Variable | Required | Description |
|----------|----------|-------------|
| `BUILD_PAGES` | Optional | Number of pages to pre-build (default `0`; use `-1` for all) |
| `NEXT_PUBLIC_DOMAIN` | Production | Canonical domain — enables search indexing and `sitemap.xml` |
| `NEXT_PUBLIC_GTM` | Optional | Google Tag Manager container ID |

### Authentication & secrets

| Variable | Required | Description |
|----------|----------|-------------|
| `SAML_ENTRY_POINT` | For auth | IdP SSO URL (e.g. `https://login.stanford.edu/idp/profile/SAML2/Redirect/SSO`) |
| `SAML_ISSUER` | For auth | SP entity ID sent in SAML AuthnRequests |
| `JWT_SECRET` | For auth | Secret key for signing/verifying JWT session cookies |
| `VAULT_ENDPOINT` | For auth | HashiCorp Vault server URL |
| `VAULT_APPROLE` | For auth | Vault AppRole role ID |
| `VAULT_SECRET` | For auth | Vault AppRole secret ID |
| `VAULT_SAML_IDP_CERT_PATH` | For auth | Vault path to the IdP signing certificate |
| `VAULT_SAML_IDP_CERT_KEY` | For auth | Key name within that Vault secret |
| `VAULT_SAML_SP_PRIVATE_KEY_PATH` | For auth | Vault path to the SP private key |
| `VAULT_SAML_SP_PRIVATE_KEY_KEY` | For auth | Key name within that Vault secret |
| `VAULT_SAML_SIGNING_KEY_PATH` | For auth | Vault path to the SP signing certificate |
| `VAULT_SAML_SIGNING_KEY_KEY` | For auth | Key name within that Vault secret |
| `CACHE_CLEAR_USERNAME` | For `/system` | Username for the `/system/cache-clear` Basic Auth |
| `CACHE_CLEAR_PASSWORD` | For `/system` | Password for the `/system/cache-clear` Basic Auth |

---

## Making Changes

### Adding or modifying a content type

1. **Update the GraphQL schema.** If a field was added or changed in Drupal, the `.gql` files in `src/lib/gql/` need to reflect the change. Most field additions can be made in:
   - `fragments-nodes.drupal.gql` — for fields on node types
   - `fragments-paragraphs.drupal.gql` — for fields on paragraph types
   - `fragments-fields.drupal.gql` — for reusable primitive field fragments

   Drupal provides copy-paste starter fragments at `/admin/config/graphql_compose/fragments`.

2. **Regenerate TypeScript types.** After editing any `.gql` file, run:
   ```bash
   yarn graphql
   ```
   This regenerates `src/lib/gql/__generated__/` — never edit those files by hand.

3. **Update or create a node renderer.** Node pages are rendered by components in `src/components/nodes/pages/`. The `<NodePage>` component dispatches to the correct renderer based on the entity `__typename`. Add a new case there for new content types.

4. **Update card and list-item renderers** in `src/components/nodes/cards/` and `src/components/nodes/list-item/` if the content type needs to appear in listing pages.

### Adding a new paragraph type

1. Add the fields to `fragments-paragraphs.drupal.gql` and add the new fragment to the `FragmentParagraphUnion` union.
2. Run `yarn graphql`.
3. Create a new component in `src/components/paragraphs/`. The paragraph dispatcher will automatically route to it once it is registered.

### Adding a new protected route

1. Add the path pattern to the `matcher` array in `proxy.tsx`.
2. Create the page under `app/`. If it should render Drupal content, follow the pattern of `app/internal/[[...slug]]/page.tsx`.
3. In the page component, read the injected user identity headers via `headers()` from `next/headers` if needed:
   ```ts
   import { headers } from "next/headers"
   const headersList = await headers()
   const userId = headersList.get("x-user-id")
   ```

### Modifying the global layout

The root layout is `app/layout.tsx`. It renders `<GlobalPage>` which wraps the header, footer, and navigation. Global header/footer components are in `src/components/global/`. The main navigation menu is fetched via `getMenu(MenuAvailable.Main)` and cached with the `menu:main` tag.

### Adding a new Drupal Views listing

1. Write or update a view query in `src/lib/gql/view-queries.drupal.gql`.
2. Run `yarn graphql`.
3. Add a new dispatch case to `getViewPagedItems()` in `src/lib/gql/gql-views.tsx`.
4. Create the React component in `src/components/views/`.

### Updating SAML certificates

SAML certificates are stored in Vault and cached under the `vault` tag. After rotating a certificate in Vault:

1. Revalidate the Vault cache:
   ```
   GET /api/revalidate?secret=<DRUPAL_REVALIDATE_SECRET>&path=/tags/vault
   ```
2. Revalidate the SAML config cache:
   ```
   GET /api/revalidate?secret=<DRUPAL_REVALIDATE_SECRET>&path=/tags/saml
   ```

---

## CI / CD

The GitHub Actions workflow in `.github/workflows/build_lint.yml` runs on every push:

- **Lint job**: runs `yarn lint` (ESLint + TypeScript type check) against a Node 20 container.
- **Build job**: provisions a full Drupal environment, installs Drupal, then builds the Next.js app against it (`BUILD_PAGES=100`) to catch any data-shape regressions.

TypeScript build errors are suppressed locally (to avoid requiring dev dependencies in production) but are enforced in CI via `CI=true`.

---



To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
