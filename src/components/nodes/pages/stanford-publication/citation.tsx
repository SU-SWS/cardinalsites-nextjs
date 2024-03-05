import {CitationUnion} from "@lib/gql/__generated__/drupal.d";

const Citation = ({citation}: { citation: CitationUnion }) => {
  return (
    <div className="flex flex-col gap-10">
      {citation.suAuthor &&
        <div>
          <strong>Author{citation.suAuthor.length > 1 ? 's' : ''}</strong>
          <br/>

          {citation.suAuthor.map((author, i) =>
            <div key={`author-${i}`}>
              {`${author.given} ${author.middle} ${author.family}`.replace(/ +/, ' ')}
            </div>
          )}
        </div>
      }

      {citation.suPublisher &&
        <div>
          <strong>Publisher</strong>
          <br/>
          {citation.suPublisher}
        </div>
      }

    </div>
  )
}
export default Citation;