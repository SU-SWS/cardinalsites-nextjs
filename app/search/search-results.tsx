"use client";

import {FormEvent, useRef, useState} from "react";
import Link from "@components/elements/link";
import {ArrowPathIcon} from "@heroicons/react/20/solid";
import {useRouter} from "next/navigation";

export type SearchResult = {
  id: string
  title: string
  path: string
  changed: string
}

type SearchState = {
  results: SearchResult[],
  searchString: string
  isLoading: boolean
}

type Props = {
  search: (_search: string) => Promise<SearchResult[]>
  initialSearchString: string
  initialResults: SearchResult[]
}

const SearchResults = ({search, initialSearchString, initialResults}: Props) => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [searchState, setSearchState] = useState<SearchState>({
    results: initialResults,
    searchString: initialSearchString || '',
    isLoading: false
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSearchState({...searchState, isLoading: true})

    const searchString = inputRef.current?.value || '';
    router.push(`/search?q=${searchString}`, {scroll: false})

    search(searchString).then(results => {
      setSearchState({results, searchString, isLoading: false})
    });
  }

  return (
    <div>
      <form className="mb-20 max-w-[500px]" onSubmit={onSubmit}>
        <label htmlFor="query" className="block mb-5">Keyword Search</label>
        <input
          ref={inputRef}
          className="rounded-full h-20 w-full lg:w-100 text-20 mb-10"
          id="query"
          type="text"
          required
          defaultValue={searchState.searchString}
        />
        <button
          type="submit"
          className={(searchState.isLoading ? "bg-black" : "bg-cardinal-red") + " text-white hocus:bg-black hocus:text-white px-10 py-5 no-underline hocus:underline transition cursor-pointer"}
          disabled={searchState.isLoading}
        >
          Search
        </button>
      </form>

      <div className="sr-only" aria-live="polite">
        Showing {searchState.results.length} {!searchState.searchString ? 'suggestions.' : `results for ${searchState.searchString}.`}
      </div>
      {searchState.isLoading &&
        <div className="fixed top-0 left-0 bg-black w-screen h-screen opacity-30">
          <ArrowPathIcon width={50} className="animate-spin fixed top-1/2 left-1/2 text-white"/>
        </div>
      }
      {searchState.results.length === 0 && <div>No results found for your search. Please try another keyword.</div>}

      {searchState.results.length > 0 &&
        <ul className="list-unstyled">
          {searchState.results.map(result =>
            <li key={result.id}
                className="border-b border-black-20 last:border-0 py-20">
              <Link href={result.path} className="text-m2 font-bold">
                {result.title}
              </Link>
              <div>Last
                Updated: {new Date(result.changed).toLocaleDateString('en-us', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}</div>
            </li>
          )}
        </ul>
      }
    </div>
  )
}
export default SearchResults