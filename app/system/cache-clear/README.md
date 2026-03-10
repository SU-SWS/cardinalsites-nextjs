# Cache Clear Route

## Overview
The `/system/cache-clear` route provides a web interface for clearing Next.js cache (revalidating paths and tags).

## Access
- **URL**: `/system/cache-clear`
- **Authentication**: HTTP Basic Auth (handled by proxy.tsx middleware)

## Environment Variables
Add the following to your `.env.local` file:

```bash
CACHE_CLEAR_USERNAME=your_username
CACHE_CLEAR_PASSWORD=your_secure_password
```

## Features

### Clear All Cache
- Checkbox option to revalidate common tags and paths
- Tags revalidated: `paths`, `api`, `drupal`
- Paths revalidated: `/`, `/search`, `/books`, `/gallery`

### Specific Path/Tag Revalidation
- Text input with autocomplete suggestions
- Supports:
  - **Paths**: Enter `/path` (e.g., `/about`, `/books/legacy/123`)
  - **Tags**: Enter `tag:tagname` (e.g., `tag:paths`, `tag:api`)

## Usage

1. Navigate to `/system/cache-clear`
2. Enter credentials when prompted (from environment variables)
3. Choose one of the options:
   - Check "Clear all cache" to revalidate common paths and tags
   - OR enter a specific path or tag in the text input
4. Click "Clear Cache"
5. View the success/error message

## Technical Details

### Files
- `page.tsx` - Route page component
- `form.tsx` - Client component with form UI
- `actions.ts` - Server action for cache clearing
- `/proxy.tsx` - Middleware with basic auth protection (`checkCacheClearAuth` function)

### Server Actions
The form uses Next.js Server Actions (`clearCache` function) to handle:
- `revalidateTag()` for cache tags

### Security
- Protected by HTTP Basic Authentication via Next.js proxy middleware
- Authentication logic in `/proxy.tsx` (`checkCacheClearAuth` function)
- Credentials stored in environment variables
- Route is dynamic (not statically generated)
