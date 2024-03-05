import Link from "@components/elements/link";
import parse, {HTMLReactParserOptions, Element, domToReact, attributesToProps, DOMNode} from "html-react-parser"
import Image from "next/image";
import Oembed from "@components/elements/ombed";
import React, {ComponentProps, HtmlHTMLAttributes} from "react";
import {H2, H3, H4, H5, H6} from "@components/elements/headers";
import {twMerge} from "tailwind-merge";
import {Maybe} from "@lib/gql/__generated__/drupal.d";
import Mathjax from "@components/tools/mathjax";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  html?: Maybe<string>
}

const Wysiwyg = ({html, className, ...props}: Props) => {
  if (!html) return;
  // Remove comments and empty lines.
  html = html.replaceAll(/<!--[\s\S]*?-->/g, '').replaceAll(/(^(\r\n|\n|\r)$)|(^(\r\n|\n|\r))|^\s*$/gm, "");

  const addMathJax = html.match(/\$\$.*\$\$/) || html.match(/\\\[.*\\\]/) || html.match(/\\\(.*\\\)/);
  return (
    <div className={twMerge('wysiwyg', className)} {...props}>
      {addMathJax && <Mathjax/>}
      {formatHtml(html)}
    </div>
  )
}

const options: HTMLReactParserOptions = {
  replace: (domNode) => {

    if (domNode instanceof Element) {
      const nodeProps = attributesToProps(domNode.attribs);
      nodeProps.className = fixClasses(nodeProps.className);
      const NodeName = domNode.name as React.ElementType
      const children: DOMNode[] = domNode.children as DOMNode[];

      switch (domNode.name) {
        case "a":
          return (
            <Link href={nodeProps.href as string} prefetch={false} {...nodeProps}>
              {domToReact(children, options)}
            </Link>
          )

        case "div":
          delete nodeProps.role;
          if (nodeProps.className && !!nodeProps.className.indexOf('media-entity-wrapper')) {
            return cleanMediaMarkup(domNode);
          }
          return <NodeName {...nodeProps}>{domToReact(children, options)}</NodeName>

        case 'figure':
          return cleanMediaMarkup(domNode);

        case 'p':
          nodeProps.className = twMerge(nodeProps.className, 'max-w-[100ch]');
          return <NodeName {...nodeProps}>{domToReact(children, options)}</NodeName>

        case 'script':
          return <></>;

        case "h2":
          return <H2 {...nodeProps}>{domToReact(children, options)}</H2>
        case "h3":
          return <H3 {...nodeProps}>{domToReact(children, options)}</H3>
        case "h4":
          return <H4 {...nodeProps}>{domToReact(children, options)}</H4>
        case "h5":
          return <H5 {...nodeProps}>{domToReact(children, options)}</H5>
        case "h6":
          return <H6 {...nodeProps}>{domToReact(children, options)}</H6>
        case "b":
        case "cite":
        case "dt":
        case "pre":
        case "code":
        case "dl":
        case "dd":
        case "i":
        case "aside":
        case "abbr":
        case "span":
        case "blockquote":
        case "ul":
        case "ol":
        case "li":
        case "table":
        case "tbody":
        case "th":
        case "td":
        case "tr":
        case "strong":
        case "em":
        case "s":
        case "sub":
        case "sup":
        case "thead":
        case "tfoot":
        case "caption":
          return <NodeName {...nodeProps}>{domToReact(children, options)}</NodeName>

        // Void element tags like <br>, <hr>, <source>, etc.
        // @see https://developer.mozilla.org/en-US/docs/Glossary/Void_element
        default:
          return <NodeName {...nodeProps}/>;
      }
    }
  }
}

const fixClasses = (classes?: string | boolean): string => {
  if (!classes) return '';
  // Pad the classes so that we can easily replace a whole class instead of parts of them.
  classes = ` ${classes} `;

  classes = classes.replaceAll(' su-', ' ')
    .replaceAll(' text-align-center ', ' text-center ')
    .replace(' text-align-right ', ' text-right ')
    .replaceAll(' align-center ', ' mx-auto ')
    .replaceAll(' align-left ', ' float-left mr-10 mb-10 ')
    .replaceAll(' align-right ', ' float-right ml-10 mb-10 ')
    .replaceAll(' visually-hidden ', ' sr-only ')
    .replaceAll(' font-splash ', ' splash-text text-m4 ')
    .replaceAll(' callout-text ', ' font-bold text-m2 ')
    .replaceAll(' related-text ', ' shadow-lg border border-black-20 p-16 ')
    .replaceAll(' drop-cap ', ' text-m1 first-letter:font-bold first-letter:text-m6 first-letter:float-left first-letter:my-2 first-letter:mr-4 ')
    .replaceAll(' intro-text ', ' text-m2 ')
    .replace(/ tablesaw.*? /g, ' ')
    .replace(/ +/g, ' ')
    .trim();

  classes = classes.split(' ')
    .filter(className => className.trim().length >= 1)
    .join(' ');

  return twMerge(classes.trim());
}

const cleanMediaMarkup = (node: Element) => {
  const nodeProps = attributesToProps(node.attribs);
  nodeProps.className = fixClasses(nodeProps.className);

  const getImage = (node: Element): ComponentProps<any> | undefined => {
    let img;
    if (node.name === 'img') {
      const attribs = node.attribs;
      attribs.width = attribs.width || attribs['data-width'];
      attribs.height = attribs.height || attribs['data-height'];
      return attribs;
    }
    if (node.children.length > 0) {
      for (let child of node.children) {
        if (child instanceof Element) {
          img = getImage(child);
          if (img) return img;
        }
      }
    }
  }
  const getFigCaption = (node: Element): DOMNode[] | undefined => {
    let caption;
    if (node.name === 'figcaption') {
      return node.children as DOMNode[];
    }
    if (node.children.length > 0) {
      for (let child of node.children) {
        if (child instanceof Element) {
          caption = getFigCaption(child);
          if (caption) return caption;
        }
      }
    }
  }

  const getOembedUrl = (node: Element): string | undefined => {
    const src = node.attribs?.src || node.attribs['data-src'];
    if (src?.startsWith('/media/oembed')) {
      return decodeURIComponent(src as string).replace(/^.*url=(.*)?&.*$/, '$1');
    }
    if (node.children.length > 0) {
      for (let child of node.children) {
        if (child instanceof Element) {
          const url: string | undefined = getOembedUrl(child);
          if (url) return url;
        }
      }
    }
  }

  // Special handling of Oembeds
  const oembedUrl = getOembedUrl(node);
  if (oembedUrl) {
    return (
      <Oembed url={oembedUrl}/>
    );
  }

  const image = getImage(node);
  if (image) {
    let {src, alt, width, height} = image;

    if (src?.startsWith('/')) {
      src = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + src;
    }
    const figCaption = getFigCaption(node);

    if (figCaption) {
      nodeProps.className = twMerge('table', nodeProps.className);
      if (!!nodeProps.className?.indexOf('mx-auto')) nodeProps.className += ' w-full'
      delete nodeProps.role;
      return (
        <figure {...nodeProps}>
          <WysiwygImage src={src} alt={alt} height={height} width={width}/>
          <figcaption className="table-caption caption-bottom text-center">
            {domToReact(figCaption, options)}
          </figcaption>
        </figure>
      )
    }
    return (
      <WysiwygImage
        src={src}
        alt={alt}
        height={height}
        width={width}
        {...nodeProps}
      />
    )
  }
  let NodeName: React.ElementType = node.name as React.ElementType
  return <NodeName {...nodeProps}>{domToReact(node.children as DOMNode[], options)}</NodeName>
}

const WysiwygImage = ({src, alt, height, width, className}: {
  src: string,
  alt?: Maybe<string>,
  height?: Maybe<string>,
  width?: Maybe<string>,
  className?: string
}) => {
  if (width && height) {
    return (
      <Image
        className={fixClasses(className)}
        src={src.trim()}
        alt={alt ? alt.trim() : ""}
        height={parseInt(height)}
        width={parseInt(width)}
      />
    )
  }
  return (
    <div className="overflow-hidden aspect-[16/9] w-full relative mb-10">
      <Image
        className="object-cover object-center"
        src={src.trim()}
        alt={alt?.trim() || ""}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 900px) 50vw, (max-width: 1700px) 33vw, 1500px"
      />
    </div>
  )
}


const formatHtml = (html: string) => parse(html || '', options);


export default Wysiwyg;