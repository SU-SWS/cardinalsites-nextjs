"use client"

import {LoadMoreListProps} from "@components/elements/load-more-list"
import {useLayoutEffect, useRef, JSX, useId, useState, ChangeEvent} from "react"
import {useBoolean, useCounter} from "usehooks-ts"
import useFocusOnRender from "@hooks/useFocusOnRender"
import useServerAction from "@hooks/useServerAction"
import cn from "@lib/utils/className"
import {ArrowPathIcon} from "@heroicons/react/20/solid"
import Button from "@components/elements/button"
import InputGroup from "@components/elements/inputs/input-group"
import RadioButton from "@components/elements/inputs/radio-button"

export type Props = LoadMoreListProps & {
  filters: Array<FilterGroup>
  filterKey: string
}

export type FilterGroup = {
  label: string
  options: Array<{label: string; value: string}>
}

const FilteredListViewClient = ({
  buttonText,
  children,
  ulProps,
  liProps,
  totalItems,
  loadPage,
  filters,
  filterKey,
  ...props
}: Props) => {
  const {count: filteredTotalItems, setCount: setFilteredTotalItems} = useCounter(totalItems)
  const [chosenFilters, setChosenFilters] = useState<Record<string, string>>({})
  const id = useId()
  const {count: page, increment: incrementPage, reset: resetPage} = useCounter(0)
  const [items, setItems] = useState<JSX.Element[]>(children)
  const {value: focusOnElement, setTrue: enableFocusElement, setFalse: disableFocusElement} = useBoolean(false)
  const [runLoadPage, isPending] = useServerAction(loadPage)

  const focusItemRef = useRef<HTMLLIElement>(null)

  const showMoreItems = () => {
    if (loadPage) {
      runLoadPage(page + 1, {[filterKey]: Object.values(chosenFilters)})
        .then(results => {
          const resultChildren = results?.props.children
          setItems([...items, ...resultChildren])

          enableFocusElement()
          incrementPage()
        })
        .catch(_e => console.warn("An error happened"))
    }
  }

  const setFocusOnItem = useFocusOnRender(focusItemRef, false)

  useLayoutEffect(() => {
    if (focusOnElement) setFocusOnItem()
  }, [focusOnElement, setFocusOnItem])

  const onInputChange = (filterIndex: string, event: ChangeEvent<HTMLInputElement>) => {
    const newState = {...chosenFilters}
    newState[filterIndex] = event.target.value

    runLoadPage(0, {[filterKey]: Object.values(newState).filter(Boolean)})
      .then(results => {
        const resultChildren = results?.props.children
        setFilteredTotalItems(results?.props.totalItems)
        setItems([...resultChildren])
        resetPage()
        setChosenFilters(newState)
        enableFocusElement()
      })
      .catch(_e => console.warn("An error happened"))
  }

  return (
    <div {...props} className={cn("relative", props.className)}>
      {isPending && (
        <div className="absolute top-0 left-0 z-20 h-full w-full bg-black-30/80">
          <div className="absolute bottom-20 left-1/2 -translate-x-25">
            <ArrowPathIcon className="animate-spin" width={50} />
          </div>
        </div>
      )}
      <div className="flex flex-col gap-24 lg:flex-row">
        <form className="shrink-0 lg:w-1/4">
          {filters.map((filterGroup, i) => (
            <InputGroup
              key={`filter-${filterGroup.label.toLowerCase().replaceAll(/[^a-z0-9-]/g, "-")}-${i}`}
              label={filterGroup.label}
            >
              <RadioButton
                value=""
                name={`filter-${filterGroup.label.toLowerCase().replaceAll(/[^a-z0-9-]/g, "-")}`}
                onRadioChange={onInputChange.bind(null, filterGroup.label)}
                inputProps={{defaultChecked: true}}
              >
                - Any -
              </RadioButton>
              {filterGroup.options.map(option => (
                <RadioButton
                  key={option.value}
                  value={option.value}
                  name={`filter-${filterGroup.label.toLowerCase().replaceAll(/[^a-z0-9-]/g, "-")}`}
                  onRadioChange={onInputChange.bind(null, filterGroup.label)}
                >
                  {option.label}
                </RadioButton>
              ))}
            </InputGroup>
          ))}
        </form>

        <div className="grow">
          <ul {...ulProps}>
            {items.map((item, i) => (
              <li
                key={`${id}--${i}`}
                ref={i === children.length * page ? focusItemRef : null}
                tabIndex={i === children.length * page && focusOnElement ? 0 : undefined}
                onBlur={disableFocusElement}
                {...liProps}
              >
                {item}
              </li>
            ))}
          </ul>
          <span className="sr-only" aria-live="polite" aria-atomic="true">
            Showing {items.length} of {filteredTotalItems} items.
          </span>

          {items.length < filteredTotalItems && loadPage && (
            <Button buttonElem centered onClick={showMoreItems}>
              {buttonText ? buttonText : "Load More"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default FilteredListViewClient
