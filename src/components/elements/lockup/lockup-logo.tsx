import {Maybe} from "@lib/gql/__generated__/drupal.d";
import StanfordWordMark from "@components/images/stanford-wordmark";

const LockupLogo = ({logoUrl, siteName = ''}: { logoUrl?: Maybe<string>, siteName?: Maybe<string> }) => {
  return (
    <>
      {logoUrl &&
        <picture>
          <img
            src={logoUrl}
            alt={`${siteName} Logo`}
            className="object-contain max-w-[400px] max-h-[35px] h-auto"
          />
        </picture>
      }
      {!logoUrl &&
        <StanfordWordMark className="block text-cardinal-red no-underline max-h-[30px] w-auto"/>
      }
    </>
  )
}

export default LockupLogo;