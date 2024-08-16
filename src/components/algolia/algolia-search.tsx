"use client"

import {liteClient} from "algoliasearch/lite"
import {useHits, useSearchBox} from "react-instantsearch"
import {InstantSearchNext} from "react-instantsearch-nextjs"
import {useRef} from "react"
import Button from "@components/elements/button"
import {UseSearchBoxProps} from "react-instantsearch"
import {useRouter} from "next/navigation"
import {IndexUiState} from "instantsearch.js/es/types/ui-state"
import DefaultHit, {DefaultAlgoliaHit} from "@components/algolia/hits/default"
import {Hit as HitType} from "instantsearch.js"

type Props = {
  appId: string
  searchIndex: string
  searchApiKey: string
  initialUiState?: IndexUiState
}

const AlgoliaSearch = ({appId, searchIndex, searchApiKey, initialUiState = {}}: Props) => {
  const searchClient = liteClient(appId, searchApiKey)

  return (
    <div>
      <InstantSearchNext
        indexName={searchIndex}
        searchClient={searchClient}
        initialUiState={{[searchIndex]: initialUiState}}
        future={{preserveSharedStateOnUnmount: true}}
      >
        <div className="space-y-10">
          <SearchBox />
          <HitList />
        </div>
      </InstantSearchNext>
    </div>
  )
}

const HitList = () => {
  const {items: hits} = useHits<HitType<DefaultAlgoliaHit>>()
  if (hits.length === 0) {
    return <p>No results for your search. Please try another search.</p>
  }

  return (
    <ul className="list-unstyled">
      {hits.map(hit => (
        <li key={hit.objectID} className="border-b border-gray-300 last:border-0">
          <DefaultHit hit={hit} />
        </li>
      ))}
    </ul>
  )
}

const SearchBox = (props?: UseSearchBoxProps) => {
  const router = useRouter()
  const {query, refine} = useSearchBox(props)
  const inputRef = useRef<HTMLInputElement>(null)

  if (query) {
    router.replace(`?q=${query}`, {scroll: false})
  }

  return (
    <form
      className="flex flex-col gap-10"
      action=""
      role="search"
      noValidate
      onSubmit={e => {
        e.preventDefault()
        e.stopPropagation()
        inputRef.current?.blur()
        refine(inputRef.current?.value || "")
      }}
      onReset={event => {
        event.preventDefault()
        event.stopPropagation()
        refine("")

        if (inputRef.current) {
          inputRef.current.value = ""
          inputRef.current.focus()
        }
      }}
    >
      <div className="flex flex-col">
        <label className="font-bold" htmlFor="search-input">
          Keywords<span className="sr-only">&nbsp;Search</span>
        </label>
        <input
          id="search-input"
          className="type-2 h-20 max-w-xl rounded-full hocus:shadow-2xl"
          ref={inputRef}
          autoComplete="on"
          autoCorrect="on"
          autoCapitalize="off"
          spellCheck={false}
          maxLength={512}
          type="search"
          required
          defaultValue={query}
          autoFocus
        />
      </div>
      <div className="flex gap-10">
        <Button type="submit">Submit</Button>
        <Button secondary type="reset" className={query.length === 0 ? "hidden" : undefined}>
          Reset
        </Button>
      </div>
      <div className="sr-only" aria-live="polite" aria-atomic>
        Showing results for {query}
      </div>
    </form>
  )
}

export default AlgoliaSearch
