import Rows from "@components/paragraphs/rows/rows";
import {notFound} from "next/navigation";
import {getEntityFromPath} from "@lib/gql/gql-queries";
import {NodeStanfordPage, NodeUnion} from "@lib/gql/__generated__/drupal.d";
import {isDraftMode} from "@lib/drupal/utils";
import {Metadata} from "next";
import {getNodeMetadata} from "./[...slug]/metadata";
import BannerParagraph from "@components/paragraphs/stanford-banner/banner-paragraph";

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const revalidate = false;
export const dynamic = 'force-static';

const Home = async () => {
  const {entity, error} = await getEntityFromPath<NodeStanfordPage>('/', isDraftMode());

  if (error) throw new Error(error);
  if (!entity) notFound();

  return (
    <article>
      {entity.suPageBanner?.__typename === "ParagraphStanfordBanner" &&
        <header aria-label="Home Page banner">
          <BannerParagraph paragraph={entity.suPageBanner} eagerLoadImage/>
        </header>
      }
      {entity.suPageComponents &&
        <Rows components={entity.suPageComponents}/>
      }
    </article>
  )
}

export const generateMetadata = async (): Promise<Metadata> => {
  const {entity} = await getEntityFromPath<NodeUnion>('/')
  return entity ? getNodeMetadata(entity) : {};
}

export default Home;