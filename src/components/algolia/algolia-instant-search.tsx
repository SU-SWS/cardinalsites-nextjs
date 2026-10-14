"use client"

import {liteClient} from "algoliasearch/lite"
import {history} from "instantsearch.js/es/lib/routers"
import {InstantSearch, useInfiniteHits, useInstantSearch, useSearchBox} from "react-instantsearch"
import {useEffect, useLayoutEffect, useMemo, useRef, useState} from "react"
import Button from "@components/elements/button"
import DefaultHit, {DefaultAlgoliaHit} from "@components/algolia/hits/default"

type RouteState = {
  q?: string
}

type Props = {
  appId: string
  searchIndex: string
  searchApiKey: string
}

const AlgoliaInstantSearch = (props: Props) => {
  // With Cache Components, Next.js keeps a visited route mounted inside a hidden React <Activity> and reveals it on
  // back/forward or a link back to /search. Hiding the route disposes the InstantSearch instance and its router, and
  // restarting that disposed instance leaves the form unable to search. Mount a fresh instance each time the route is
  // revealed again so it reads the current URL and starts clean. Effects re-run on reveal, but refs persist.
  const [instanceKey, setInstanceKey] = useState(0)
  const hasActivatedRef = useRef(false)
  useLayoutEffect(() => {
    if (hasActivatedRef.current) setInstanceKey(key => key + 1)
    hasActivatedRef.current = true
  }, [])

  return <Search key={instanceKey} {...props} />
}

const Search = ({appId, searchIndex, searchApiKey}: Props) => {
  // Memoised so InstantSearch isn't handed a brand new client on every render.
  const searchClient = useMemo(() => liteClient(appId, searchApiKey), [appId, searchApiKey])

  return (
    <InstantSearch
      indexName={searchIndex}
      searchClient={searchClient}
      future={{preserveSharedStateOnUnmount: true}}
      insights={true}
      routing={{
        router: history<RouteState>({cleanUrlOnDispose: false}),
        stateMapping: {
          stateToRoute(uiState): RouteState {
            const query = uiState[searchIndex]?.query
            return query ? {q: query} : {}
          },
          routeToState(routeState) {
            return {
              [searchIndex]: {query: routeState.q},
            }
          },
        },
      }}
    >
      <div className="space-y-10">
        <SearchBox />
        <SearchStatus />
        <HitList />
      </div>
    </InstantSearch>
  )
}

const SearchStatus = () => {
  const {status, error, results} = useInstantSearch()

  if (status === "error" || error) {
    return <p role="alert">Unable to load search results at this time. Please try again later.</p>
  }

  return (
    <div aria-live="polite" aria-atomic>
      {status === "stalled" && <p>Loading results...</p>}
      {status !== "stalled" && results.query && (
        <p className="sr-only">
          {results.nbHits} {results.nbHits === 1 ? "result" : "results"} for {results.query}
        </p>
      )}
    </div>
  )
}

const HitList = () => {
  const {items, isLastPage, showMore, sendEvent} = useInfiniteHits<DefaultAlgoliaHit>()
  const {results, status} = useInstantSearch()
  const listRef = useRef<HTMLUListElement>(null)
  const focusIndex = useRef<number | null>(null)

  // After loading more results, move focus to the first new item so keyboard and screen reader users keep their place.
  useEffect(() => {
    if (focusIndex.current === null || items.length <= focusIndex.current) return
    listRef.current?.querySelectorAll<HTMLElement>(":scope > li a")[focusIndex.current]?.focus()
    focusIndex.current = null
  }, [items.length])

  if (status === "error") return null

  // Without keywords Algolia returns the index's top ranked records, so there is always something to browse.
  if (items.length === 0) {
    return status === "idle" && results.query ? <p>No results for your search. Please try another search.</p> : null
  }

  return (
    <>
      <ul className="list-unstyled" ref={listRef}>
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

      {!isLastPage && (
        <Button
          buttonElem
          centered
          disabled={status !== "idle"}
          onClick={() => {
            focusIndex.current = items.length
            showMore()
          }}
        >
          Load more results
        </Button>
      )}
    </>
  )
}

const SearchBox = () => {
  const {query, refine, clear} = useSearchBox()
  const inputRef = useRef<HTMLInputElement>(null)

  // Keep the uncontrolled input in sync when the query changes from outside, such as browser back/forward.
  useEffect(() => {
    if (inputRef.current && document.activeElement !== inputRef.current) inputRef.current.value = query
  }, [query])

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
        refine(inputRef.current?.value.trim() || "")
      }}
      onReset={event => {
        event.preventDefault()
        event.stopPropagation()
        clear()

        if (inputRef.current) {
          inputRef.current.value = ""
          inputRef.current.focus()
        }
      }}
    >
      <div className="mx-auto w-fit">
        <label className="block font-bold" htmlFor="search-input">
          Keywords<span className="sr-only">&nbsp;Search</span>
        </label>
        <input
          id="search-input"
          className="mb-20 h-40 max-w-xl rounded-sm border border-black-30 p-10 type-2 shadow-2xl"
          ref={inputRef}
          autoCorrect="on"
          spellCheck={false}
          maxLength={512}
          type="search"
          required
          defaultValue={query}
          autoFocus
        />
        <div className="flex gap-20">
          <Button type="submit">Submit</Button>
          <Button secondary type="reset" className={query.length === 0 ? "hidden" : undefined}>
            Reset
          </Button>
        </div>
      </div>
    </form>
  )
}

export default AlgoliaInstantSearch
