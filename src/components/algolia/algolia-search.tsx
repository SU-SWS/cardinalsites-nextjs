"use client"

import {liteClient} from "algoliasearch/lite"
import {useHits, useSearchBox} from "react-instantsearch"
import {InstantSearchNext} from "react-instantsearch-nextjs"
import {useMemo, useRef} from "react"
import Button from "@components/elements/button"
import {UseSearchBoxProps} from "react-instantsearch"
import DefaultHit, {DefaultAlgoliaHit} from "@components/algolia/hits/default"
import {usePathname} from "next/navigation"

type Props = {
  appId: string
  searchIndex: string
  searchApiKey: string
}

const AlgoliaSearch = ({appId, searchIndex, searchApiKey}: Props) => {
  const pathname = usePathname()
  // Memoised so InstantSearch isn't handed a brand new client on every render.
  const searchClient = useMemo(() => liteClient(appId, searchApiKey), [appId, searchApiKey])

  return (
    <InstantSearchNext
      key={pathname}
      indexName={searchIndex}
      searchClient={searchClient}
      future={{preserveSharedStateOnUnmount: true}}
      insights={true}
      routing={{
        router: {cleanUrlOnDispose: false},
        stateMapping: {
          stateToRoute(uiState): Record<string, string> {
            const indexUiState = uiState[searchIndex]
            if (indexUiState.query) return {q: indexUiState.query}
            return {}
          },
          routeToState(routeState: Record<string, string>) {
            return {
              [searchIndex]: {query: routeState.q},
            }
          },
        },
      }}
    >
      <div className="space-y-10">
        <SearchBox />
        <HitList />
      </div>
    </InstantSearchNext>
  )
}

const HitList = () => {
  const {items, sendEvent} = useHits<DefaultAlgoliaHit>()

  if (items.length === 0) {
    return <p>No results for your search. Please try another search.</p>
  }

  return (
    <ul className="list-unstyled">
      {items.map(hit => (
        <li
          key={hit.objectID}
          onClick={() => sendEvent("click", hit, "Hit Clicked")}
          onAuxClick={() => sendEvent("click", hit, "Hit Clicked")}
          className="border-b border-gray-300 last:border-0"
        >
          <DefaultHit hit={hit} />
        </li>
      ))}
    </ul>
  )
}

const SearchBox = (props?: UseSearchBoxProps) => {
  const {query, refine} = useSearchBox(props)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <form
      className="flex flex-col gap-20"
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
          className="h-20 max-w-xl rounded-full px-20 type-2 hocus:shadow-2xl"
          ref={inputRef}
          autoCorrect="on"
          spellCheck={false}
          maxLength={512}
          type="search"
          required
          defaultValue={query}
          autoFocus
        />
      </div>
      <div className="flex gap-20">
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
