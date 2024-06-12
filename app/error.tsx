"use client"

import Button from "@components/elements/button"

const ErrorPage = ({error, reset}: {error: Error; reset: () => void}) => {
  console.warn(error.message)
  return (
    <div className="my-50 centered mt-32">
      <h1>Something went wrong!</h1>
      <p>Apologies, an error occurred when attempting to preset the page you are attempting to view. Please try a different path.</p>
      <Button
        buttonElem
        onClick={() => reset()}
      >
        Try again
      </Button>
    </div>
  )
}

export default ErrorPage
