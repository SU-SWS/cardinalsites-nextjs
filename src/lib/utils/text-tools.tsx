import {Maybe, ParagraphStanfordWysiwyg, ParagraphUnion} from "@lib/gql/__generated__/drupal.d"
import {decode} from "html-entities"

export const getFirstText = (components?: Maybe<ParagraphUnion[]>) => {
  const firstWysiwyg = components?.find(
    component => component.__typename === "ParagraphStanfordWysiwyg"
  ) as ParagraphStanfordWysiwyg
  if (firstWysiwyg) {
    return getCleanDescription(firstWysiwyg.suWysiwygText?.processed)
  }
}

export const getCleanDescription = (description: string | undefined, numSentences?: number): string | undefined => {
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
