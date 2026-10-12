"use client"

import dynamic from "next/dynamic"

/**
 * Client only Algolia search. Skipping SSR keeps Algolia requests out of the server render and the
 * InstantSearch bundle out of the initial page load.
 */
const AlgoliaSearch = dynamic(() => import("@components/algolia/algolia-instant-search"), {
  ssr: false,
  loading: () => <p>Loading search...</p>,
})

export default AlgoliaSearch
