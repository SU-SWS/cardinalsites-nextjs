import {Maybe, ParagraphStanfordWysiwyg, ParagraphUnion} from "@lib/gql/__generated__/graphql"
import {decode} from "html-entities"
import {cache} from "react"

export const getFirstText = (components?: Maybe<ParagraphUnion[]>) => {
  const firstWysiwyg = components?.find(
    component => component.__typename === "ParagraphStanfordWysiwyg"
  ) as ParagraphStanfordWysiwyg
  if (firstWysiwyg) {
    return getCleanDescription(firstWysiwyg.suWysiwygText?.processed)
  }
}

export const getCleanDescription = (
  description: Maybe<string> | undefined,
  numSentences?: number
): string | undefined => {
  if (description) {
    const text: string =
      decode(description)
        .replaceAll(/(<([^>]+)>)/gi, " ")
        .replaceAll(/ +/g, " ")
        .replaceAll(/ </g, "<")
        .replace(/\.\s+$/, "")
        .split(".")
        .slice(0, numSentences || 1)
        .join(".") + "."
    return text?.length > 1 ? decode(text) : undefined
  }
}

export const getTimeDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / (60 * 60))
  const mins = Math.floor((seconds - hours * 60 * 60) / 60)
  const sec = seconds % 60

  if (hours) return `${hours}:${mins < 10 ? "0" + mins : mins}:${sec < 10 ? "0" + sec : sec}`
  if (mins) return `${mins}:${sec < 10 ? "0" + sec : sec}`
  return `${sec}`
}

type IdRegistry = {
  /**
   * Every id handed out so far, including the ones with a numeric suffix.
   */
  used: Set<string>
  /**
   * Next suffix to try for a given slug, so repeated duplicates don't rescan from 1.
   */
  nextSuffix: Map<string, number>
}

/**
 * Registry of ids already generated during the current render.
 *
 * `cache()` scopes this to a single server request, so ids restart at their unsuffixed form on every
 * page render instead of accumulating across requests. Outside of a server component render (client
 * components, both during SSR and hydration) `cache()` is a pass through, so each call gets a fresh
 * registry and the plain slug is returned. That keeps SSR and hydration in agreement.
 */
const getIdRegistry = cache((): IdRegistry => ({
  used: new Set<string>(),
  nextSuffix: new Map<string, number>(),
}))

const getSlugFromText = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replaceAll(/\s+/g, "-")
    .replaceAll(/[^\w-]/g, "")
    .replaceAll(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .split("-")
    .slice(0, 3)
    .join("-")

/**
 * Build a url friendly id from a string, appending a numeric suffix when that id is already taken.
 *
 * Call it once per element and reuse the returned value: every call consumes an id.
 */
export const getIdFromText = (text?: Maybe<string> | undefined): string | undefined => {
  if (!text) return undefined

  const slug = getSlugFromText(text)
  if (!slug) return undefined

  const {used, nextSuffix} = getIdRegistry()

  if (!used.has(slug)) {
    used.add(slug)
    return slug
  }

  // Keep incrementing in case the suffixed id is itself taken, ie. headings of "Section" and
  // "Section 1" both wanting `section-1`.
  let suffix = nextSuffix.get(slug) || 1
  while (used.has(`${slug}-${suffix}`)) suffix++

  const id = `${slug}-${suffix}`
  nextSuffix.set(slug, suffix + 1)
  used.add(id)
  return id
}
