import {INFINITE_CACHE} from "next/dist/lib/constants"

export const getNextCache = (...tags: string[]) => {
  if (process.env.DISABLE_NEXT_CACHE) return {}
  return {next: {revalidate: INFINITE_CACHE, tags}}
}
