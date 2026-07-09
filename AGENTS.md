# AGENTS.md

## Project Overview

This is a Next.js application that serves as a frontend for a Drupal backend CMS. The application uses TailwindCSS for styling and communicates with Drupal via GraphQL to fetch content structured with Paragraph entities.

## Technology Stack

- **Frontend Framework**: Next.js (v16)
- **Styling**: TailwindCSS (v3)
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
│   │    └── utils         # General reusable functions like string manipulations
└── app                    # Next.js Pages and API routes
```

## Architecture

### Frontend (Next.js)

**Routing Strategy**: App Router

**Rendering Strategy**:
- Incremental Static Regeneration (ISR)
- Revalidation interval: INFINITE & on demand

### Backend (Drupal)

**GraphQL Endpoint**: `[NEXT_PUBLIC_DRUPAL_BASE_URL]/graphql`

**Authentication**: JWT / API Key

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
  - fragments-[type].drupal.gql
  - [type]-query.drupal.gql

**Common Queries**:
- `Route`: Fetches any Drupal node, redirect, or other entity for the provided path url.
- `Menu`: Fetches the menu links for the desired menu.

**GraphQL Client**: graphql-request

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
VAULT_ROLE_ID=[Vault role id for SAML credential storage]
VAULT_SECRET_ID=[Vault secret id for SAML credential storage]
VAULT_PATH=[Vault path to secret for SAML credential storage]
SAML_ENTRY_POINT=[SAML IDP entry url]
SAML_ENTITY_ID=[SAML IDP Unique entityid]
SAML_IDP_CERT=[SAML Cert]
SAML_PRIVATE_KEY=[SAML private key]
SAML_SIGNING_CERT=[SAML signing cert ofr the IDP]
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
```

### Adding New Content Types

1. Create GraphQL query in `src/lib/gql`
2. Define any additional TypeScript types in `src/lib/@types/drupal`
3. Create page component in `src/components/nodes/pages`
4. Add paragraph components if needed in `src/components/paragraphs/`
5. Update Paragraph Renderer switch statement

### Adding New Paragraph Types

1. Define paragraph type in Drupal
2. Update GraphQL query fragments
3. Create corresponding React component in `src/components/paragraphs/`
4. Add type definition to `src/lib/@types/drupal`
5. Register in Paragraph Renderer

## Styling Guidelines

**TailwindCSS Configuration**: `tailwind.config.ts`

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

```typescript
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
- **Revalidation**: On demand revalidation. POST request to /api/revalidate path.

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
- Check purge/content configuration in tailwind.config.js
- Verify class names are not dynamically constructed

## Testing

**Testing Framework**: None

## Deployment

**Platform**: Vercel (primarily)

**Build Command**: `yarn build focus --production`

---

## Questions for AI Agents

When working with this codebase, AI agents should ask:

1. Which content type or paragraph type is being modified?
2. Is this a new feature or modification to existing functionality?
3. Should changes maintain the existing pattern or introduce a new pattern?
4. Are there specific accessibility or performance requirements?
5. Should new components be server or client components?

---

**Last Updated**: 2026-06-08

**Maintained By**: pookmish