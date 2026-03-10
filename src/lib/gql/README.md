# GraphQL Integration

This directory contains all GraphQL query definitions, the generated TypeScript types, and the helper functions that fetch data from the Drupal GraphQL API.

## Directory Structure

```
src/lib/gql/
├── *.drupal.gql            # GraphQL query/fragment definitions (hand-authored)
├── gql-client.tsx          # GraphQLClient factory with auth header logic
├── gql-queries.tsx         # Cached server-side data fetching helpers
├── gql-views.tsx           # Cached view/listing page fetchers
├── filter-vocabs.ts        # Enum of Drupal taxonomy vocabulary IDs used for filtering
└── __generated__/          # Auto-generated — do not edit by hand
    ├── graphql.ts          # All schema types + TypedDocumentNode per operation
    ├── gql.ts              # Typed gql() tag used internally by the preset
    └── index.ts            # Re-exports everything from graphql.ts and gql.ts
```

---

## Code Generation

Types and document nodes are generated from the live Drupal GraphQL schema using [`@graphql-codegen/client-preset`](https://the-guild.dev/graphql/codegen/plugins/presets/preset-client).

### Running Codegen

```bash
yarn graphql
```

This command:
1. Fetches the schema introspection from `$NEXT_PUBLIC_DRUPAL_BASE_URL/graphql` using Basic Auth credentials from `.env.local`.
2. Parses all `*.drupal.gql` files in this directory.
3. Writes `__generated__/graphql.ts`, `__generated__/gql.ts`, and `__generated__/index.ts`.

> **Never edit files inside `__generated__/` directly.** Changes will be overwritten on the next codegen run.

### Required Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_DRUPAL_BASE_URL` | Base URL of the Drupal site (e.g. `https://example.stanford.edu`) |
| `DRUPAL_BASIC_AUTH` | `username:password` for standard read-only requests |
| `DRUPAL_BASIC_AUTH_ADMIN` | `username:password` for preview / draft content requests |
| `DRUPAL_REQUEST_HEADERS` | *(optional)* JSON object of extra headers forwarded to every request |

### What Gets Generated

Each named query or fragment in a `.drupal.gql` file produces a **dedicated, strongly-typed export** in `__generated__/graphql.ts`:

| Export pattern | Example |
|---|---|
| `<Name>Document` | `RouteDocument` — `TypedDocumentNode<RouteQuery, RouteQueryVariables>` |
| `<Name>Query` | `RouteQuery` — the exact TypeScript shape of the response |
| `<Name>QueryVariables` | `RouteQueryVariables` — the accepted input variables |
| `Fragment<Name>Fragment` | `FragmentNodeStanfordPageFragment` — fragment result type |

Because each document is a `TypedDocumentNode`, passing it to `client.request()` automatically narrows the return type without needing an explicit generic parameter — this happens automatically once `yarn graphql` has been re-run against the schema.

---

## GraphQL Source Files

### `route-query.drupal.gql`
Resolves a URL path to either a content entity or a redirect.
- `Route` — returns a `RouteInternal` (with entity) or `RouteRedirect`.
- `Redirects` — returns all configured redirects (used for static generation).

### `entity-queries.drupal.gql`
Full-entity queries used when rendering individual node pages:
- `Node`, `AllNodes` — single node by UUID and paginated list of all nodes.
- `Courses`, `Events`, `EventSeries`, `News`, `BasicPages`, `People`, `Policies`, `Publications`, `Media`, `Term` — per-content-type collections.
- `CourseFiltersTerms`, `EventFiltersTerms`, `MediaContentFiltersTerms`, `NewsSpotlightFiltersTerms`, `OpportunityFiltersTerms`, `PersonFiltersTerms`, `PublicationFiltersTerms` — taxonomy terms used to populate filter dropdowns.
- `ConfigPages` — site-wide config: site settings, global messages, footers, lockup settings.

### `view-queries.drupal.gql`
Paginated listing queries backed by Drupal Views, used by filtered-list and card-grid components:
`stanfordBasicPages`, `stanfordCourses`, `stanfordEvents`, `stanfordEventsPastEvents`, `stanfordMedia`, `stanfordNews`, `stanfordOpportunities`, `stanfordPerson`, `stanfordPublications`, `stanfordSharedTags`, `search`.

### `menu.drupal.gql`
- `Menu` — fetches a navigation menu by name with up to five levels of nested children.

### `fragments-nodes.drupal.gql`
Reusable node fragments spread into the queries above:
- `FragmentNodeInterface` / `FragmentNodePage` — shared base fields (uuid, path, status, metatags).
- `FragmentNode<ContentType>` — full-detail fragments for each node type.
- `FragmentNode<ContentType>Teaser` — reduced card/list fragments.
- `FragmentNodeUnion` — union of all node teaser fragments.

### `fragments-paragraphs.drupal.gql`
Reusable paragraph component fragments (Accordion, Banner, Card, Gallery, WYSIWYG, etc.) and `FragmentParagraphUnion`.

### `fragments-fields.drupal.gql`
Primitive field fragments reused across node and paragraph fragments: `FragmentText`, `FragmentLink`, `FragmentTextSummary`, `FragmentMetaTag`, `FragmentTermInterface`, `FragmentMediaInterface`, `FragmentDateTime`, `FragmentAddressType`, and others.

---

## Client (`gql-client.tsx`)

`graphqlClient()` returns a configured [`GraphQLClient`](https://github.com/jasonkuhrt/graphql-request) instance.

```ts
import { graphqlClient } from "@lib/gql/gql-client"

const client = graphqlClient()               // standard credentials
const client = graphqlClient({}, true)       // preview/draft credentials (DRUPAL_BASIC_AUTH_ADMIN)
```

**`buildHeaders(headers?, isPreviewMode?)`** — exported separately so custom request configs (e.g. revalidation tags) can be constructed without creating a full client.

Authentication precedence:
- Preview mode → `DRUPAL_BASIC_AUTH_ADMIN` → fallback to `DRUPAL_BASIC_AUTH`
- Standard mode → `DRUPAL_BASIC_AUTH`
- `DRUPAL_REQUEST_HEADERS` entries are merged in before the Authorization header.

---

## Query Helpers (`gql-queries.tsx`)

All functions are annotated `"use cache"` and use Next.js [`cacheTag`](https://nextjs.org/docs/app/api-reference/functions/cacheTag) + `cacheLife("max")` for fine-grained on-demand revalidation.

### `getEntityFromPath(path, previewMode?, teaser?)`
Resolves a URL path to a typed entity or redirect. Used by every `[...slug]` route.

```ts
const { entity, redirect } = await getEntityFromPath<NodeStanfordPage>("/about")
if (redirect) { /* handle redirect */ }
if (entity) { /* render entity */ }
```

Cache tags: `paths:<path>`, `all-entities`

### `getConfigPage<T>(configPageType)`
Returns the first config-page node of the given `__typename`. Cast `T` to the expected config type.

```ts
const settings = await getConfigPage<StanfordBasicSiteSetting>("StanfordBasicSiteSetting")
```

Cache tag: `config-pages`

### `getConfigPageField<T, F>(configPageType, fieldName)`
Convenience wrapper around `getConfigPage` that returns a single field value.

```ts
const siteName = await getConfigPageField<StanfordBasicSiteSetting, string>(
  "StanfordBasicSiteSetting",
  "suSiteName"
)
```

### `getMenu(name?, maxLevels?)`
Returns a filtered `MenuItem[]` tree. Strips `"Inaccessible"` items and normalises the home-page URL.

```ts
const items = await getMenu(MenuAvailable.Main, 2)
```

Cache tags: `menus`, `menu:<name>`

### `getAllNodes()`
Paginates through all node types using cursor-based pagination and returns a flat `NodeUnion[]`. Used by `generateStaticParams` during static site generation.

Cache tag: `all-entities`

### `getAlgoliaCredential()`
Returns `[appId, indexName, apiKey]`. Prefers environment variables; falls back to `StanfordBasicSiteSetting` config page values.

### `getFilterTerms(vocab)`
Returns taxonomy terms for a given `FilterVocabs` vocabulary, used to populate filter dropdowns.

```ts
const terms = await getFilterTerms(FilterVocabs.Events)
```

### `getTermFilterGroups(vocab)`
Builds a `FilterGroup[]` hierarchy from the flat `getFilterTerms` result — parent terms become group labels, child terms become selectable options.

---

## View Helpers (`gql-views.tsx`)

### `getViewPagedItems(viewId, displayId, pageSize?, contextualFilter?, page?, filter?)`
Dispatches to the correct Drupal Views query based on `viewId--displayId`. Returns `{ items: NodeUnion[], totalItems: number }`.

This is a `"use cache"` function. Cache tags are set per view type (e.g. `views:stanford_event`).

Supported `viewId--displayId` combinations:

| viewId | displayId(s) |
|---|---|
| `search` | `search` |
| `stanford_basic_pages` | `basic_page_type_list`, `card_grid_alpha`, `viewfield_block_1` |
| `stanford_courses` / `courses_filtered` | `default_list_viewfield_block`, `vertical_teaser_viewfield_block`, `list`, `card_grid` |
| `stanford_events` | `cards`, `list_page` |
| `stanford_events` | `past_events_list_block` |
| `stanford_news` / `stanford_news_filtered` | `block_1`, `vertical_cards`, `spotlight_card_grid`, `spotlight_card_grid_no_date`, `spotlight_cards` |
| `stanford_opportunities` / `stanford_opportunities_filtered` | `cards`, `list`, `list_page` |
| `stanford_person` / `people_filtered` | `grid_list_all` |
| `stanford_publications` | `apa_list`, `chicago_list` |
| `stanford_shared_tags` | `card_grid` |
| `media_content` / `media_filtered` | `list`, `card_grid`, `default_list` |

### `loadViewPage(...)`
Server action wrapper that calls `getViewPagedItems` and returns a rendered `<View>` JSX element. Used by `ParagraphStanfordFilteredList` for client-side page transitions.

---

## Filter Vocabs (`filter-vocabs.ts`)

`FilterVocabs` is an enum mapping human-readable content types to Drupal taxonomy vocabulary machine names. Use it instead of hard-coding vocabulary IDs anywhere in the app.

```ts
import { FilterVocabs } from "@lib/gql/filter-vocabs"

FilterVocabs.Events       // "event_filters"
FilterVocabs.People       // "person_filters"
FilterVocabs.Publications // "publication_filters"
```

---

## Adding a New Query

1. **Write the query** in the appropriate `.drupal.gql` file (or create a new `<name>.drupal.gql` file).

   ```graphql
   # entity-queries.drupal.gql
   query MyNewContent($uuid: ID!) {
     myContent(id: $uuid) {
       uuid
       title
       path
     }
   }
   ```

2. **Regenerate types:**

   ```bash
   yarn graphql
   ```

   This produces `MyNewContentDocument`, `MyNewContentQuery`, and `MyNewContentQueryVariables` in `__generated__/graphql.ts`.

3. **Call the query** using the document node and the typed client:

   ```ts
   import { graphqlClient } from "@lib/gql/gql-client"
   import { MyNewContentDocument, MyNewContentQuery } from "@lib/gql/__generated__/graphql"

   const result = await graphqlClient().request<MyNewContentQuery>(
     MyNewContentDocument,
     { uuid }
   )
   ```

   > After `yarn graphql` regenerates the types, `MyNewContentDocument` becomes a `TypedDocumentNode<MyNewContentQuery, MyNewContentQueryVariables>` and the explicit `<MyNewContentQuery>` generic can be dropped — the return type will be inferred automatically.

4. **Add cache tags** if wrapping in a `"use cache"` function:

   ```ts
   "use cache"
   import { cacheTag } from "next/dist/server/use-cache/cache-tag"
   import { cacheLife } from "next/dist/server/use-cache/cache-life"

   cacheTag("my-content")
   cacheLife("max")
   ```
