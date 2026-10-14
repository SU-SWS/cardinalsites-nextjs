"use client"

import Button from "@components/elements/button"

const ErrorPage = ({error, reset}: {error: Error & {digest?: string}; reset: () => void}) => {
  console.warn(error.message)
  // Drupal request failures carry a readable digest naming the cause. @see lib/gql/gql-client.ts
  const errorCode = error.digest?.startsWith("DRUPAL_") ? error.digest : undefined
  return (
    <div className="my-50 mt-32 centered">
      <h1>Something went wrong!</h1>
      <p>
        Apologies, an error occurred when attempting to preset the page you are attempting to view. Please try a
        different path.
      </p>
      {errorCode && <p>Error code: {errorCode}</p>}
      <Button buttonElem onClick={() => reset()}>
        Try again
      </Button>
    </div>
  )
}

export default ErrorPage
