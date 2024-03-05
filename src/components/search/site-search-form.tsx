import {ComponentProps, useId} from "react";
import {MagnifyingGlassIcon} from "@heroicons/react/20/solid";

const SiteSearchForm = ({...props}: ComponentProps<any>) => {
  const inputId = useId();
  return (
    <form aria-label="Site Search" action="/search" {...props}>
      <div className="relative mt-10">
        <label htmlFor={inputId} className="sr-only">
          Search this site
        </label>
        <input
          className="rounded-full h-20 w-full lg:w-100 text-20"
          type="text"
          placeholder="Search this site"
          id={inputId}
          name="q"
          required
        />
        <button type="submit" className="absolute top-5 right-5">
          <MagnifyingGlassIcon width={30}/>
          <span className="sr-only">Submit Search</span>
        </button>
      </div>
    </form>
  )
}

export default SiteSearchForm;