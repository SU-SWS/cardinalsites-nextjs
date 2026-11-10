# AGENTS.md

## Project Overview

This is a Next.js application that serves as a frontend for a Drupal backend CMS. The application uses TailwindCSS for styling and communicates with Drupal via GraphQL to fetch content structured with Paragraph entities.

It is also the template for the Lagunita site front ends (`csp-nextjs`, `press-nextjs`, `summer-nextjs`, `sulgryphon-nextjs`). Read [README.md](README.md) for the full architecture; the Drupal, Acquia and Vercel side of the connection is documented in `docs/decoupled-frontend.md` in `SU-SWS/ace-stanfordlagunita`.

## Technology Stack

- **Frontend Framework**: Next.js (v16)
- **Styling**: TailwindCSS (v4)
- **Backend CMS**: Drupal (v11)
- **Data Layer**: GraphQL
- **Package Manager**: yarn

## Project Structure

```
[ROOT_DIRECTORY]/
├── src/
│   ├── components/        # React components
│   │    ├── nodes         # Drupal Nod displays: cards, list items, and page displays
│   │    ├── paragraphs    # Drupal Paragraph entity components
│   │    └── views         # Drupal View lists
│   ├── hooks              # Reusable React hooks
│   ├── lib                # Library
│   │    ├── gql           # Graphql queries and fetch functionality
│   │    ├── auth          # SAML config, JWT helpers
│   │    └── utils         # General reusable functions like string manipulations
├── app                    # Next.js Pages and API routes ((site) route group, preview, api, system)
├── proxy.tsx              # Middleware: preview secret, /system Basic Auth, JWT gate
├── next.config.ts         # Vault env, cache life, images, redirects, robots header
└── vault-envars.ts        # Loads Vault secrets at build time
```

## Architecture

### Frontend (Next.js)

**Routing Strategy**: App Router

**Rendering Strategy**:
- Cache Components with the `"use cache"` directive (`cacheComponents: true`)
- Default cache life: INFINITE; invalidated on demand by cache tag
- Pages are prerendered at build according to `BUILD_PAGES`

### Backend (Drupal)

**GraphQL Endpoint**: `[NEXT_PUBLIC_DRUPAL_BASE_URL]/graphql`

**Authentication**: HTTP Basic Auth as a Drupal API user (`DRUPAL_BASIC_AUTH`, or `DRUPAL_BASIC_AUTH_ADMIN` for preview). Visitors on protected routes use SAML SSO and a JWT cookie, which is separate from Drupal.

**Content Types**:
- stanford_course: A course includes information such as title, year, quarter, day(s) and time(s), etc.
- stanford_event: An event content type with integration with events-legacy.stanford.edu
- stanford_event_series: A collection of events. (Deprecated)
- stanford_media: A content type for podcasts or video episodes.
- stanford_news: General news content with a date field.
- stanford_opportunity: A content type for jobs, internships, fellowships, seminars, service opportunities, grants, funding options, and more.
- stanford_page: General use page with layout choices and a variety of paragraphs.
- stanford_person: Stanford Person type with bio and supporting information. Content-type for syncing with CAP data.
- stanford_policy: Provide an administrative policy structure with breadcrumbs.
- stanford_publication: Book/article/thesis/etc publication content type with author information.

**Paragraph Types**:
- stanford_banner: Wide image with overlay text of heading, superhead, wysiwyg, and link.
- stanford_card: General image card with a heading, superhead, wysiwyg and link.
- stanford_entity: List of teaser nodes, accompanied by a heading, wysiwyg and link.
- stanford_faq: List of Q&A style nested paragraphs, accompanied by a heading and wysiwyg.
- stanford_filtered_lists: List of nodes with taxonomy filter functionality, accompanied by a heading, wysiwyg and link.
- stanford_gallery: List of images with associated captions, accompanied by a heading, wysiwyg, and link.
- stanford_lists: List of nodes accompanied by a heading, wysiwyg and link.
- stanford_media_caption: A basic image or video with a caption wysiwyg.
- stanford_page_title_banner: Wide image used to display with the page h1 element.
- stanford_person_cta: Unused paragraph type, retained for BC.
- stanford_schedule: Unused paragraph type, retained for BC.
- stanford_spacer: Simple empty paragraph that adds space between paragraphs.
- stanford_stat_card: Statistical card that animates a number stat, accompanied by an image/icon, heading, superhead, wysiwyg, and link.
- stanford_wysiwyg: Simple WYSIWYG text area.

## Key Components

### Paragraph Components

Each Drupal paragraph type has a corresponding React component:

```
src/components/paragraphs/
├── [paragraph-type-1]
│   └─ [paragraph-type-1-paragraph].tsx
├── [paragraph-type-2]
│   └─ [paragraph-type-2-paragraph].tsx
└── paragraph.tsx  # Main paragraph dispatcher
```

**Paragraph Renderer Pattern**:
```typescript
// This component maps Drupal paragraph types to React components
src/components/paragraphs/paragraph.tsx
```

### GraphQL Queries

**Query Organization**:
- Location: `src/lib/gql/`
- Naming convention:
  - `fragments-[type].drupal.gql` (fields, nodes, paragraphs)
  - `[type]-query.drupal.gql` / `[type]-queries.drupal.gql` (route, entity, view), plus `menu.drupal.gql`

**Common Queries**:
- `Route`: Fetches any Drupal node, redirect, or other entity for the provided path url.
- `Menu`: Fetches the menu links for the desired menu.

**GraphQL Client**: a small fetch-based client in `src/lib/gql/gql-client.ts` (not graphql-request). It adds auth and `DRUPAL_REQUEST_HEADERS`, times out after 30s (60s in dev/CI), and throws typed errors with `DRUPAL_*` digests.

**GraphQL Compiler Command**: `yarn graphql` 

## Data Flow

1. **Page Request** → Next.js page component
2. **GraphQL Query** → Drupal GraphQL endpoint
3. **Data Processing** → Transform Drupal data structure
4. **Paragraph Rendering** → Map paragraph types to React components
5. **Component Render** → Display content with TailwindCSS styling

## Environment Variables

Required environment variables:

```bash
NEXT_PUBLIC_DRUPAL_BASE_URL=[Drupal site base URL]
DRUPAL_BASIC_AUTH=[Basic authentication credentials for authenticated user]
DRUPAL_BASIC_AUTH_ADMIN=[Basic authentication credentials for an content administrator for content previews]
```
Optional environment variables:
```bash
BUILD_PAGES=[Number of pages to build during `yarn build`]
NEXT_PUBLIC_GTM=[Google tag manager code]
NEXT_PUBLIC_DOMAIN=[Public domain for sitemap.xml urls]
DRUPAL_REVALIDATE_SECRET=[On demand revalidation token]
DRUPAL_PREVIEW_SECRET=[Drupal content preview token]
DRUPAL_REQUEST_HEADERS=[WAF bypass header json sting]
ALGOLIA_ID=[Algolia app ID]
ALGOLIA_INDEX=[Algolia index]
ALGOLIA_KEY=[Algolia search only key]
CACHE_CLEAR_USERNAME=[Admin cache management dashboard user name]
CACHE_CLEAR_PASSWORD=[Admin cache management dashboard password]
VAULT_ROLE_ID=[Vault AppRole role id; secrets at VAULT_PATH are loaded at build time]
VAULT_SECRET_ID=[Vault AppRole secret id]
VAULT_PATH=[Vault path to the site's secrets]
SAML_ENTRY_POINT=[SAML IDP entry url]
SAML_ENTITY_ID=[SP entity id, sent as issuer and checked as audience]
SAML_IDP_CERT=[IdP signing certificate(s)]
SAML_PRIVATE_KEY=[SP private key for decrypting assertions]
SAML_SIGNING_CERT=[SP certificate published in the SAML metadata]
JWT_SECRET=[JSON web token encryption key]
```

## Development Workflow

### Running Locally

```bash
# Install dependencies
yarn

# Run development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start

# Preview production build
yarn preview

# Compile GraphQL changes & generate typescript
yarn graphql

# Lint and typescript check
yarn lint

# Validate prerendered HTML and accessibility (after `yarn build`; a11y needs `yarn start` and Selenium)
yarn validate:html
yarn validate:a11y
```

### Adding New Content Types

1. Create GraphQL query in `src/lib/gql`
2. Define any additional TypeScript types in `src/lib/@types/drupal`
3. Create page component in `src/components/nodes/pages`
4. Add a `case` for the node's `__typename` in `src/components/nodes/pages/node-page.tsx`
5. Add card and list-item components in `src/components/nodes/cards` and `src/components/nodes/list-item` if needed

### Adding New Paragraph Types

1. Define paragraph type in Drupal
2. Update GraphQL query fragments
3. Create corresponding React component in `src/components/paragraphs/`
4. Add type definition to `src/lib/@types/drupal`
5. Register in Paragraph Renderer

## Styling Guidelines

**TailwindCSS Configuration**: `src/styles/index.css` (CSS-first `@theme`; there is no `tailwind.config.ts`)

**Custom Theme Extensions**:
- Colors:
  - Colors provided by decanter library
- Typography:
  - stanford font for wordmark
- Spacing:
  - Responsive spacing provided by decanter library
- Tailwind merge:
  - Whenever merging styles, make sure to use the custom merge function `src/lib/utils/className`
  - Example: `className={cn("text-black", {"text-blue": blueText}, props.className)}`

**Component Styling Pattern**: Utility-first

## Common Patterns

### Fetching Data

```typescript
// Example pattern for fetching content
graphqlClient().request<TypescriptType>(QueryDocument, {variables})
```

### Rendering Paragraphs

```jsx
// Example pattern for rendering paragraph entities
<Paragraph paragraph={paragraph} />
```

### Image Handling

**Strategy**: Next.js Image component

**Image Source**: `[DRUPAL_URL]/[PATH_TO_IMAGES]`

## Performance Considerations

- **Caching Strategy**:
  - All pages are cached indefinitely until triggered by on demand revalidation.
  - Some related content components revalidate after a shorter time due to unknown reference changes.
- **Image Optimization**: Uses default Next.JS image optimization configuration.
- **Revalidation**: On demand. Drupal sends `GET /api/revalidate?secret=…&path=…` (purges `paths:<path>`; `/tags/a/b` purges tags). Scripts can `POST` `{paths, tags}` with `Authorization: Bearer <DRUPAL_REVALIDATE_SECRET>`.

## Troubleshooting

### Common Issues

**GraphQL Query Failures**:
- Verify Drupal GraphQL module is enabled
- Check endpoint URL in environment variables
- Check authentication credentials match Drupal user credentials
- Ensure Drupal's `flood` table is not blocking requests

**Paragraph Rendering Issues**:
- Ensure paragraph type name matches exactly
- Check Paragraph Renderer has case for new type
- Verify paragraph component is exported correctly

**Styling Issues**:
- Run `yarn build` to rebuild TailwindCSS
- Check the `@source` directives in `src/styles/index.css`
- Verify class names are not dynamically constructed

## Testing

**Testing Framework**: No unit tests. CI (`build_lint.yml`) runs `yarn lint`, builds against a real Drupal, then runs `yarn validate:html` and `yarn validate:a11y` against the prerendered pages.

## Deployment

**Platform**: Vercel (primarily)

**Build Command**: `yarn build`, with `yarn workspaces focus --production` as the install command (both in `vercel.json`)

---

## Questions for AI Agents

When working with this codebase, AI agents should ask:

1. Which content type or paragraph type is being modified?
2. Is this a new feature or modification to existing functionality?
3. Should changes maintain the existing pattern or introduce a new pattern?
4. Are there specific accessibility or performance requirements?
5. Should new components be server or client components?

---

## Lessons Learned

- **Vault is read at build time.** `next.config.ts` spreads `vaultEnvVars()` into the Next.js `env` config, which is inlined when the app is built. After changing a secret in Vault, redeploy. A variable already set in Vercel or `.env.local` wins over Vault.
- **Preview fails closed with a 404.** A missing `DRUPAL_PREVIEW_SECRET`, a wrong secret, or an unsafe `slug` returns the 404 page, not a 403. Keep it that way so unpublished content can't be probed. Don't log or forward the preview URL: it carries the secret.
- **The preview entry point is `/preview?secret=&slug=`.** Some site front ends also keep a legacy `/api/draft` that redirects there, because Drupal still points at it. Don't remove that redirect from a site repo unless Drupal's preview URL is changed first.
- **`drush stanford-decoupled:connect-next` (`su-next-connect`) resets the `nextjs` and `nextjsAdmin` passwords every run.** CI uses it on a throwaway Drupal. Running it against a shared environment breaks that environment's front end until the new credentials are deployed.
- **`dev` and `test` are rebased onto `1.x` and force-pushed** on every push to `1.x` (`update-dev-test-branches.yml`). Their Vercel branch URLs are hard-coded in each Drupal site's settings.
- **Never set `NEXT_PUBLIC_DOMAIN` outside production.** While it's unset, every response gets `X-Robots-Tag: noindex`.
- **Read the error digest.** Drupal request failures surface as `DRUPAL_TIMEOUT`, `DRUPAL_UNREACHABLE`, `DRUPAL_HTTP_<code>` or `DRUPAL_GRAPHQL` on the error page, which tells you whether the problem is the network (for example an edge WAF block), auth, or the query.
- **Cache entries survive deploys** (`durableUseCacheEntries`). A deploy doesn't clear stale data; invalidate by tag instead (`/api/revalidate` or `/system/cache-clear`).
- **Every cached fetch is tagged `all-cache`** plus specific tags (`paths:<path>`, `menu:<name>`, `config-pages`, `views:<type>`, `taxonomy:<vocab>`). Tag new cached fetches the same way.
- **Never edit `src/lib/gql/__generated__/`.** Change the `.drupal.gql` files and run `yarn graphql`.
- **Commit hook:** `yarn install` sets `core.hooksPath` to `.githooks/`, which runs Prettier and `eslint --fix` on staged `.tsx` files.
- **Secret scanning:** `secret-scan.yml` runs gitleaks on every PR. Never commit credentials; a leaked one must be rotated.

**Last Updated**: 2026-11-10

**Maintained By**: pookmish

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
