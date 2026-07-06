import {CitationUnion} from "@lib/gql/__generated__/graphql"

const Citation = ({citation}: {citation: CitationUnion}) => {
  let day: number | false = false
  let month: string | false = false
  const dayTypes =
    citation.__typename === "CitationSuArticleNewspaper" ||
    citation.__typename === "CitationSuArticleJournal" ||
    citation.__typename === "CitationSuOther" ||
    citation.__typename === "CitationSuThesi"
  if (dayTypes && citation.suDay) day = citation.suDay
  if (dayTypes && citation.suMonth)
    month = new Date(2000, citation.suMonth - 1).toLocaleDateString("en-US", {month: "long"})

  const pubDate = [month, day ? `${day},` : null, citation.suYear].filter(Boolean)

  return (
    <div className="flex flex-col gap-10">
      {citation.suAuthor && (
        <div>
          <strong>Author{citation.suAuthor.length > 1 ? "s" : ""}</strong>
          <br />

          {citation.suAuthor.map((author, i) => (
            <div key={`author-${i}`}>{`${author.given} ${author.middle} ${author.family}`.replace(/ +/, " ")}</div>
          ))}
        </div>
      )}
      {citation.suPublisher && (
        <div>
          <strong>{citation.__typename === "CitationSuArticleJournal" ? "Journal Name" : "Publisher"}</strong>
          <br />
          {citation.suPublisher}
        </div>
      )}

      {!!pubDate.length && (
        <div>
          <strong>Publication Date</strong>
          <br />
          {pubDate.join(" ")}
        </div>
      )}

      {citation.__typename === "CitationSuThesi" && citation.suGenre && (
        <div>
          <strong>Type of Dissertation</strong>
          <br />
          {citation.suGenre}
        </div>
      )}

      {(citation.__typename === "CitationSuBook" ||
        citation.__typename === "CitationSuArticleJournal" ||
        citation.__typename === "CitationSuThesi") &&
        citation.suDoi && (
          <div>
            <strong>DOI</strong>
            <br />
            {citation.suDoi}
          </div>
        )}

      {citation.__typename === "CitationSuArticleJournal" && citation.suJournalPublisher && (
        <div>
          <strong>Publisher</strong>
          <br />
          {citation.suJournalPublisher}
        </div>
      )}
    </div>
  )
}
export default Citation
