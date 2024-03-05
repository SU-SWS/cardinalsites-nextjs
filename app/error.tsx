"use client";

const ErrorPage = ({error, reset}: { error: Error; reset: () => void }) => {
  console.error(error.message);
  return (
    <div className="centered my-50 mt-32">
      <h1>Something went wrong!</h1>
      Apologies, an error occurred when attempting to preset the page you are attempting to view. Please try a different
      path.
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}

export default ErrorPage