import {Table, Thead, Th, Tbody, Tr, Td} from "@components/elements/responsive-tables/tables"
import Link from "@components/elements/link"
import parse, {HTMLReactParserOptions, Element, domToReact, attributesToProps, DOMNode} from "html-react-parser"
import Oembed from "@components/elements/oembed"
import React, {HtmlHTMLAttributes, ImgHTMLAttributes, ReactElement} from "react"
import {H2, H3, H4, H5, H6} from "@components/elements/headers"
import cn from "@lib/utils/className"
import {Maybe} from "@lib/gql/__generated__/graphql"
import Mathjax from "@components/tools/mathjax"
import Script from "next/script"
import {getIdFromText} from "@lib/utils/text-tools"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  /**
   * HTML string.
   */
  html?: Maybe<string>
  /**
   * Lowercase tag names to keep. Any other tag is stripped, but its contents are kept. When
   * omitted, every tag is kept.
   */
  allowedTags?: Array<string>
}

// Display math ($$...$$) and inline math (\[...\] or \(...\)) both need the mathjax library.
const mathJaxDelimiters = /\$\$[\s\S]*\$\$|\\\[[\s\S]*\\\]|\\\([\s\S]*\\\)/

const Wysiwyg = ({html, allowedTags, className, ...props}: Props): ReactElement | undefined => {
  if (!html) return

  // Remove blank lines, which the parser would otherwise keep as stray whitespace text nodes.
  // Comments need no such treatment because the parser drops comment nodes on its own.
  const cleanHtml = html.replaceAll(/^\s*\n/gm, "")

  return (
    <div className={cn("wysiwyg", className)} {...props}>
      {mathJaxDelimiters.test(cleanHtml) && <Mathjax />}
      {convertHtml(cleanHtml, allowedTags)}
    </div>
  )
}

/**
 * Tags rendered by a react component instead of the plain html element.
 *
 * `h1` is deliberately demoted: the page supplies its own h1, so a second one in editor content
 * breaks the heading outline.
 */
const componentMap: Record<string, React.ElementType> = {
  h1: H2,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  table: Table,
  thead: Thead,
  tbody: Tbody,
  tr: Tr,
  th: Th,
  td: Td,
}

const headingTags = new Set(["h1", "h2", "h3", "h4", "h5", "h6"])

/**
 * Tags that must never be given children.
 * @see https://developer.mozilla.org/en-US/docs/Glossary/Void_element
 */
const voidTags = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "source",
  "track",
  "wbr",
])

/**
 * Tags that carry code rather than content, so stripping one has to take its children with it.
 * Unwrapping them instead would print the javascript/css into the page as visible text.
 */
const strippedWithContents = new Set(["script", "style", "iframe", "object", "embed", "noscript", "template"])

/**
 * Text of a node and all of its descendants. Used for heading anchor ids.
 */
const textContent = (node: Element): string =>
  node.children
    .map(child => {
      if (child instanceof Element) return textContent(child)
      return "data" in child && child.type !== "comment" ? child.data : ""
    })
    .join("")

/**
 * React props for a dom node: drupal classes translated to tailwind, editor bookkeeping removed.
 *
 * `className` is merged ahead of the node's own classes so that author classes win a conflict.
 */
const getNodeProps = (node: Element, className?: string) => {
  const props = attributesToProps(node.attribs)

  const classes = cn(className, fixClasses(props.className))
  if (classes) props.className = classes
  else delete props.className

  delete props["data-entity-substitution"]
  delete props["data-entity-type"]
  delete props["data-entity-uuid"]

  return props
}

/**
 * Build the parser options.
 *
 * `allowedTags` is a lowercase tag name allowlist. When omitted, every tag is kept. When provided,
 * any other tag is removed but its children are still rendered, so text inside an unwanted wrapper
 * survives the strip.
 */
const createOptions = (allowedTags?: Array<string>): HTMLReactParserOptions => {
  const allowed = allowedTags ? new Set(allowedTags.map(tag => tag.toLowerCase())) : undefined

  const options: HTMLReactParserOptions = {
    replace: domNode => {
      if (!(domNode instanceof Element)) return

      if (allowed && !allowed.has(domNode.name)) {
        if (strippedWithContents.has(domNode.name)) return <></>
        return <>{domToReact(domNode.children as DOMNode[], options)}</>
      }

      const children = domNode.children as DOMNode[]
      const NodeName: React.ElementType = componentMap[domNode.name] || (domNode.name as React.ElementType)

      switch (domNode.name) {
        case "a": {
          const {href, ...props} = getNodeProps(domNode)
          // Legacy jump targets (`<a id="place"></a>`) carry no href, and a link to "#" would be a
          // tabbable no-op, so leave them as the plain anchors they are.
          if (!href) return <NodeName {...props}>{domToReact(children, options)}</NodeName>

          if ((href as string).startsWith("#")) {
            return (
              <a href={href as string} {...props}>
                {domToReact(children, options)}
              </a>
            )
          }

          return (
            <Link href={href as string} {...props}>
              {domToReact(children, options)}
            </Link>
          )
        }

        case "div":
        case "article": {
          if (domNode.attribs.class?.includes("media-entity-wrapper")) {
            return cleanMediaMarkup(domNode, options)
          }
          const props = getNodeProps(domNode)
          delete props.role
          return <NodeName {...props}>{domToReact(children, options)}</NodeName>
        }

        case "figure":
          return cleanMediaMarkup(domNode, options)

        case "p":
          return (
            <NodeName {...getNodeProps(domNode, "max-w-[100ch] text-21 leading-[1.7]")}>
              {domToReact(children, options)}
            </NodeName>
          )

        case "script":
          return <Script {...getNodeProps(domNode)}>{domToReact(children, options)}</Script>

        // https://v3.tailwindcss.com/docs/preflight#lists-are-unstyled
        case "ul": {
          const marker = cn({
            "list-circle": domNode.attribs.type === "circle",
            "list-square": domNode.attribs.type === "square",
          })
          return <NodeName {...getNodeProps(domNode, marker)}>{domToReact(children, options)}</NodeName>
        }

        // https://v3.tailwindcss.com/docs/preflight#lists-are-unstyled
        case "ol": {
          const marker = cn({
            "list-lower-alpha": domNode.attribs.type === "a",
            "list-upper-alpha": domNode.attribs.type === "A",
            "list-lower-roman": domNode.attribs.type === "i",
            "list-upper-roman": domNode.attribs.type === "I",
          })
          return <NodeName {...getNodeProps(domNode, marker)}>{domToReact(children, options)}</NodeName>
        }

        case "hr":
          return <NodeName {...getNodeProps(domNode, "border-black")} />

        case "pre": {
          const codeStyles =
            "[&_code]:mb-10 [&_code]:block [&_code]:rounded-[0.3rem] [&_code]:border [&_code]:border-black-20 [&_code]:bg-black-10 [&_code]:p-20 [&_code]:text-wrap [&_code]:text-black"
          return <NodeName {...getNodeProps(domNode, codeStyles)}>{domToReact(children, options)}</NodeName>
        }

        default: {
          const props = getNodeProps(domNode)
          if (voidTags.has(domNode.name)) return <NodeName {...props} />

          // Give every editor heading an anchor target, not only the ones whose children parse to a
          // plain string.
          if (headingTags.has(domNode.name) && !props.id) {
            const id = getIdFromText(textContent(domNode))
            if (id) props.id = id
          }

          return <NodeName {...props}>{domToReact(children, options)}</NodeName>
        }
      }
    },
  }

  return options
}

/**
 * Drupal and decanter class names mapped to their tailwind equivalents.
 *
 * Keys are matched after the `su-` prefix is dropped, so `su-intro-text` and `intro-text` both map.
 */
const classMap: Record<string, string> = {
  "text-align-center": "text-center mx-auto",
  "text-align-right": "text-right",
  "align-center": "mx-auto",
  "align-left": "float-left mr-20 mb-20",
  "align-right": "float-right ml-20 mb-20",
  "visually-hidden": "sr-only",
  "font-splash": "font-bold type-4",
  "callout-text": "font-bold type-2",
  "related-text": "shadow-lg border border-black-20 p-32",
  "intro-text": "type-2",
  "quote-text": "px-48 py-32 ml-64 type-3 border-l-3 border-black",
  "drop-cap":
    "type-2 first-letter:font-bold first-letter:type-6 first-letter:float-left first-letter:my-4 first-letter:mr-8",
}

const fixClasses = (classes?: string | boolean): string => {
  if (typeof classes !== "string") return ""

  return cn(
    classes
      .split(/\s+/)
      .map(className => className.replace(/^su-/, ""))
      // Tablesaw styled the old drupal tables; the responsive table component handles that now.
      .filter(className => className && !className.startsWith("tablesaw"))
      .map(className => classMap[className] || className)
  )
}

/**
 * Depth first search for the first element matching `match`, starting with `node` itself.
 */
const findElement = (node: Element, match: (node: Element) => boolean): Element | undefined => {
  if (match(node)) return node

  for (const child of node.children) {
    if (child instanceof Element) {
      const found = findElement(child, match)
      if (found) return found
    }
  }
}

const getMediaSrc = (node: Element): string => node.attribs.src || node.attribs["data-src"] || ""

const cleanMediaMarkup = (node: Element, options: HTMLReactParserOptions) => {
  const nodeProps = getNodeProps(node)
  delete nodeProps.role

  // Special handling of Oembeds.
  const oembed = findElement(node, child => getMediaSrc(child).includes("/media/oembed"))
  if (oembed) {
    // Drupal's own params (max_width, max_height, hash) sit alongside the media url in the src, so
    // let the url parser pull out just the one we want.
    const src = new URL(getMediaSrc(oembed), process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || "http://localhost")
    const url = src.searchParams.get("url")
    if (url) return <Oembed url={url} />
  }

  const image = findElement(node, child => child.name === "img")
  if (image) {
    let {src} = image.attribs
    if (!src) return

    if (src.startsWith("/")) src = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + src

    const {alt} = image.attribs
    const width = image.attribs.width || image.attribs["data-width"]
    const height = image.attribs.height || image.attribs["data-height"]

    const caption = findElement(node, child => child.name === "figcaption")

    if (caption) {
      // `w-fit` shrinks the figure to the image so that the caption wraps at the image width.
      return (
        <figure {...nodeProps} className={cn("w-fit", nodeProps.className)}>
          <WysiwygImage src={src} alt={alt} height={height} width={width} />
          <figcaption className="text-center">{domToReact(caption.children as DOMNode[], options)}</figcaption>
        </figure>
      )
    }
    return <WysiwygImage src={src} alt={alt} height={height} width={width} {...nodeProps} />
  }

  const NodeName: React.ElementType = node.name as React.ElementType
  return <NodeName {...nodeProps}>{domToReact(node.children as DOMNode[], options)}</NodeName>
}

/**
 * Plain `<img>` rather than `next/image` on purpose.
 *
 * Editors embed an image *style* derivative, so the file has already been resized by Drupal for
 * the context it appears in. Those urls carry a per-image `?itok=` hash, and Drupal returns 403
 * for a derivative requested without a valid token until the file exists on disk, so the token has
 * to survive to the browser intact. Sending it through the optimizer instead would mean either
 * loosening `images.remotePatterns` to accept any query string or dropping the token, and the
 * remaining win over an already-sized derivative is only the format conversion.
 */
const WysiwygImage = ({
  src,
  alt,
  ...props
}: ImgHTMLAttributes<HTMLImageElement> & {
  src: string
}) => (
  // eslint-disable-next-line @next/next/no-img-element -- see above
  <img src={src.trim()} alt={alt || ""} loading="lazy" decoding="async" {...props} />
)

const defaultOptions = createOptions()

/**
 * Turn a Drupal html string into react elements.
 *
 * Use this when the markup has to render without the `wysiwyg` wrapper div, such as inside a
 * heading, a table cell, or a card teaser. Anything that wants the wrapper and its typography
 * should use the `Wysiwyg` component instead.
 *
 * Drupal classes are translated to their tailwind equivalents, editor bookkeeping attributes are
 * dropped, and links, media, tables and headings are swapped for their react components.
 *
 * @param html - Html string from Drupal.
 * @param allowedTags - Lowercase tag names to keep. Any other tag is stripped, but its contents are
 *   kept, so `["strong"]` reduces markup to text plus bold. Tags that hold code instead of content,
 *   like `<script>`, are removed along with their contents. When omitted, every tag is kept.
 */
export const convertHtml = (html?: Maybe<string>, allowedTags?: Array<string>) => {
  return parse(html || "", allowedTags ? createOptions(allowedTags) : defaultOptions)
}
export default Wysiwyg
