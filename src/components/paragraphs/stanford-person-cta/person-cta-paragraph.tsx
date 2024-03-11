import Image from "next/image";
import Link from "@components/elements/link";
import {HtmlHTMLAttributes} from "react";
import {ParagraphStanfordPersonCtum,} from "@lib/gql/__generated__/drupal.d";
import {twMerge} from "tailwind-merge";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphStanfordPersonCtum
}

const PersonCtaParagraph = ({paragraph, ...props}: Props) => {
  const image = paragraph.suPersonCtaImage?.mediaImage
  return (
    <div {...props} className={twMerge("centered flex gap-10", props.className)}>
      {image?.url &&
        <div className="relative aspect-[1/1] w-[200px]">
          <Image
            className="rounded-full"
            src={image.url}
            alt={image.alt || ""}
            fill
            sizes="(max-width: 768px) 100vw, 1000px"
          />
        </div>
      }

      <div>
        {paragraph.suPersonCtaLink?.url &&
          <div>
            <Link href={paragraph.suPersonCtaLink.url}>
              {paragraph.suPersonCtaName}
            </Link>
          </div>
        }

        {!paragraph.suPersonCtaLink &&
          <div>{paragraph.suPersonCtaName}</div>
        }

        {paragraph.suPersonCtaTitle}
      </div>
    </div>
  )
}
export default PersonCtaParagraph