import Link from "@components/elements/link";
import Image from "next/image";
import {H2, H3} from "@components/elements/headers";
import {HtmlHTMLAttributes} from "react";
import {NodeStanfordPage} from "@lib/gql/__generated__/drupal.d";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordPage
  headingLevel?: "h2" | "h3"
}

const StanfordPageListItem = ({node, headingLevel, ...props}: Props) => {
  const pageTitleBannerImage = node.suPageBanner?.__typename === "ParagraphStanfordPageTitleBanner" && node.suPageBanner.suTitleBannerImage.mediaImage;
  const bannerImage = node.suPageBanner?.__typename === "ParagraphStanfordBanner" && node.suPageBanner.suBannerImage?.mediaImage;
  const image = node.suPageImage?.mediaImage || pageTitleBannerImage || bannerImage;

  const Heading = headingLevel === 'h3' ? H3 : H2;
  return (
    <article aria-labelledby={node.id} className="@container py-10 ">
      <div className="flex flex-col @4xl:flex-row justify-between gap-20" {...props}>
        <div className="order-2 @4xl:order-1">
          <Heading className="text-m2" id={node.id}>
            <Link href={node.path}>
              {node.title}
            </Link>
          </Heading>

          {node.suPageDescription &&
            <p>{node.suPageDescription}</p>
          }
        </div>

        {image &&
          <div
            className="order-1 @4xl:order-2 relative aspect-[16/9] h-fit w-full @4xl:w-1/4 shrink-0">
            <Image
              className="object-cover"
              src={image.url}
              alt={image.alt || ''}
              fill
              sizes="(max-width: 768px) 100vw, 1000px"
            />
          </div>
        }
      </div>
    </article>
  );
};
export default StanfordPageListItem;