import Link from "@components/elements/link";
import {H2, H3} from "@components/elements/headers";
import {HtmlHTMLAttributes} from "react";
import {NodeStanfordPage} from "@lib/gql/__generated__/drupal.d";
import ImageCard from "@components/patterns/image-card";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordPage
  headingLevel?: "h2" | "h3"
}

const StanfordPageCard = ({node, headingLevel, ...props}: Props) => {
  const pageTitleBannerImage = node.suPageBanner?.__typename === "ParagraphStanfordPageTitleBanner" && node.suPageBanner.suTitleBannerImage.mediaImage;
  const bannerImage = node.suPageBanner?.__typename === "ParagraphStanfordBanner" && node.suPageBanner.suBannerImage?.mediaImage;
  const image = node.suPageImage?.mediaImage || pageTitleBannerImage || bannerImage || undefined;

  const Heading = headingLevel === "h3" ? H3 : H2;
  return (
    <ImageCard
      {...props}
      aria-labelledby={node.id}
      imageUrl={image?.url}
      imageAlt={image?.alt}
      isArticle
    >
      <Heading className="text-m2 [&_a]:text-black" id={node.id}>
        <Link href={node.path}>
          {node.title}
        </Link>
      </Heading>

      {node.suPageDescription &&
        <p>{node.suPageDescription}</p>
      }
    </ImageCard>
  );
};
export default StanfordPageCard;