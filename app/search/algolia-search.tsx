"use client";

import algoliasearch from 'algoliasearch/lite';
import {useHits, useSearchBox} from "react-instantsearch";
import {InstantSearchNext} from 'react-instantsearch-nextjs';
import Link from "@components/elements/link";
import {H2} from "@components/elements/headers";
import Image from "next/image";
import {useRef} from "react";
import Button from "@components/elements/button";
import {UseSearchBoxProps} from "react-instantsearch";
import {useRouter, useSearchParams} from "next/navigation";
import {UseHitsProps} from "react-instantsearch-core/dist/es/connectors/useHits";

type Props = {
  appId: string
  searchIndex: string
  searchApiKey: string
}

const AlgoliaSearch = ({appId, searchIndex, searchApiKey}: Props) => {
  const searchClient = algoliasearch(appId, searchApiKey);
  const searchParams = useSearchParams();

  return (
    <div>
      <InstantSearchNext
        indexName={searchIndex}
        searchClient={searchClient}
        initialUiState={{
          [searchIndex]: {query: searchParams.get('q') || ''},
        }}
        future={{preserveSharedStateOnUnmount: true}}
      >
        <div className="space-y-10">
          <SearchBox/>
          <HitList/>
        </div>
      </InstantSearchNext>
    </div>
  )
}

const HitList = (props: UseHitsProps) => {
  const {hits} = useHits(props);
  if (hits.length === 0) {
    return (
      <p>No results for your search. Please try another search.</p>
    )
  }

  return (
    <ul className="list-unstyled">
      {hits.map(hit =>
        <li key={hit.objectID} className="border-b border-gray-300 last:border-0">
          <Hit hit={hit as unknown as AlgoliaHit}/>
        </li>
      )}
    </ul>
  )
}

type AlgoliaHit = {
  url: string
  title: string
  summary?: string
  photo?: string
  updated?: number
}

const Hit = ({hit}: { hit: AlgoliaHit }) => {
  const hitUrl = new URL(hit.url);

  return (
    <article className="@container flex justify-between gap-20 py-12">
      <div>
        <H2 className="text-m2">
          <Link href={hit.url.replace(hitUrl.origin, '')}>
            {hit.title}
          </Link>
        </H2>
        <p>{hit.summary}</p>

        {hit.updated &&
          <div className="text-2xl">
            Last Updated: {new Date(hit.updated * 1000).toLocaleDateString('en-us', {
            month: "long",
            day: "numeric",
            year: "numeric"
          })}
          </div>
        }
      </div>

      {hit.photo &&
        <div className="hidden @6xl:block relative shrink-0 aspect-1 h-[150px] w-[150px]">
          <Image
            className="object-cover"
            src={hit.photo.replace(hitUrl.origin, `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}`)}
            alt=""
            fill
          />
        </div>
      }
    </article>
  )
}


const SearchBox = (props?: UseSearchBoxProps) => {
  const router = useRouter();
  const {query, refine} = useSearchBox(props);
  const inputRef = useRef<HTMLInputElement>(null);

  if (query) {
    router.replace(`?q=${query}`, {scroll: false})
  }

  return (
    <form
      className="flex flex-col gap-10"
      action=""
      role="search"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        inputRef.current?.blur();
        refine(inputRef.current?.value || "");
      }}
      onReset={(event) => {
        event.preventDefault();
        event.stopPropagation();
        refine('');

        if (inputRef.current) {
          inputRef.current.value = '';
          inputRef.current.focus();
        }
      }}
    >
      <div className="flex flex-col">
        <label className="font-bold" htmlFor="search-input">
          Keywords<span className="sr-only">&nbsp;Search</span>
        </label>
        <input
          id="search-input"
          className="rounded-full hocus:shadow-2xl max-w-xl h-20 text-m1"
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
        <Button type="submit">
          Submit
        </Button>
        <Button
          secondary
          type="reset"
          className={query.length === 0 ? 'hidden' : undefined}
        >
          Reset
        </Button>
      </div>
      <div className="sr-only" aria-live="polite" aria-atomic>Showing results for {query}</div>
    </form>
  );
}

export default AlgoliaSearch;