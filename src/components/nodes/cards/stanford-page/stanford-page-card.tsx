import Link from "@components/elements/link";
import Image from "next/image";
import {H2, H3} from "@components/elements/headers";
import {HtmlHTMLAttributes} from "react";
import {NodeStanfordPage} from "@lib/gql/__generated__/drupal.d";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordPage
  headingLevel?: "h2" | "h3"
}

const StanfordPageCard = ({node, headingLevel, ...props}: Props) => {
  const pageTitleBannerImage = node.suPageBanner?.__typename === "ParagraphStanfordPageTitleBanner" && node.suPageBanner.suTitleBannerImage.mediaImage;
  const bannerImage = node.suPageBanner?.__typename === "ParagraphStanfordBanner" && node.suPageBanner.suBannerImage?.mediaImage;
  const image = node.suPageImage?.mediaImage || pageTitleBannerImage || bannerImage;

  const Heading = headingLevel === 'h3' ? H3 : H2;
  return (
    <article aria-labelledby={node.id} className="mx-auto shadow-xl border border-black-20 overflow-hidden" {...props}>
      {image &&
        <div
          className="relative aspect-[16/9] w-full">
          <Image
            className="object-cover"
            src={image.url}
            alt={image.alt || ''}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 900px) 75vw, 1000px"
          />
        </div>
      }
      <div className="p-10">

        <Heading className="text-m2 [&_a]:text-black" id={node.id}>
          <Link href={node.path}>
            {node.title}
          </Link>
        </Heading>

        {node.suPageDescription &&
          <p>{node.suPageDescription}</p>
        }
      </div>
    </article>
  );
};
export default StanfordPageCard;