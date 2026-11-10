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

### Clear global elements

- **Clear Main Menu** checkbox: revalidates the `menu:main` tag.
- **Clear Global Header & Footer** checkbox: revalidates the `config-pages` tag (footer, site settings and other
  config pages).

### Specific paths or tags

- **Specific Path** text input that takes one or more space-separated values.
- A path can be entered with or without its leading slash (`/about/team` or `about/team`); both clear
  `paths:/about/team`. Enter `/` for the home page.
- A value without a leading slash is also cleared as a raw cache tag, so tag names work too (for example
  `views:stanford_news` or `menus`).

## Usage

1. Navigate to `/system/cache-clear`
2. Enter credentials when prompted (from environment variables)
3. Check "Clear Main Menu" and/or "Clear Global Header & Footer", and/or enter paths or tags in "Specific Path"
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

- `revalidateTag()` for every cleared tag and path (`revalidatePath()` isn't used)

### Security

- Protected by HTTP Basic Authentication via Next.js proxy middleware
- Authentication logic in `/proxy.tsx` (`checkCacheClearAuth` function)
- Credentials stored in environment variables (or Vault). If either variable is unset, every login is refused.
- Route is dynamic (not statically generated)
