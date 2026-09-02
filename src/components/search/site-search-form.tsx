import {HTMLAttributes, useId} from "react"
import {MagnifyingGlassIcon} from "@heroicons/react/20/solid"

type Props = HTMLAttributes<HTMLFormElement> & {
  inputValue?: string
}

const SiteSearchForm = ({inputValue, ...props}: Props) => {
  const inputId = useId()
  return (
    <form aria-label="Site Search" action="/search" {...props}>
      <div className="relative mt-20">
        <label htmlFor={inputId} className="sr-only">
          Search this site
        </label>
        <input
          className="h-45 w-full rounded-full px-16 text-19 lg:border-black-20"
          type="text"
          placeholder="Search this site"
          id={inputId}
          name="q"
          required
          defaultValue={inputValue}
        />
        <button type="submit" className="absolute top-1/2 right-5 -translate-y-1/2">
          <MagnifyingGlassIcon width={25} className="text-digital-red" />
          <span className="sr-only">Submit Search</span>
        </button>
      </div>
    </form>
  )
}

export default SiteSearchForm
