import {HTMLAttributes, useId} from "react";
import {MagnifyingGlassIcon} from "@heroicons/react/20/solid";

const SiteSearchForm = ({...props}: HTMLAttributes<HTMLFormElement>) => {
  const inputId = useId();
  return (
    <form aria-label="Site Search" action="/search" {...props}>
      <div className="relative mt-10">
        <label htmlFor={inputId} className="sr-only">
          Search this site
        </label>
        <input
          className="rounded-full h-15 w-full lg:w-100 text-19 lg:border-black-20"
          type="text"
          placeholder="Search this site"
          id={inputId}
          name="q"
          required
        />
        <button type="submit" className="absolute top-2 right-5">
          <MagnifyingGlassIcon width={25} className="text-digital-red"/>
          <span className="sr-only">Submit Search</span>
        </button>
      </div>
    </form>
  )
}

export default SiteSearchForm;