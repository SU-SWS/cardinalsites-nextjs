"use client"

import {HTMLAttributes, JSX, useEffect, useRef} from "react"
import Slider, {CustomArrowProps, Settings} from "react-slick"
import {ArrowLeftIcon, ArrowRightIcon} from "@heroicons/react/16/solid"
import {twMerge} from "tailwind-merge"
import {clsx} from "clsx"

export const NextArrow = ({className, onClick}: CustomArrowProps) => {
  const slickDisabled = className?.includes("slick-disabled")
  return (
    <button className="absolute right-1 top-1/3 z-50" onClick={onClick} aria-label="Next" disabled={slickDisabled}>
      <ArrowRightIcon
        className={twMerge("w-50 bg-teal rounded-full p-10 text-black-true", clsx({"text-black-50": slickDisabled}))}
      />
    </button>
  )
}

export const PrevArrow = ({className, onClick}: CustomArrowProps) => {
  const slickDisabled = className?.includes("slick-disabled")
  return (
    <button className="absolute left-1 top-1/3 z-50" onClick={onClick} aria-label="Previous" disabled={slickDisabled}>
      <ArrowLeftIcon
        className={twMerge("w-50 bg-teal rounded-full p-10 text-black-true", clsx({"text-black-50": slickDisabled}))}
      />
    </button>
  )
}

type SlideshowProps = HTMLAttributes<HTMLDivElement> & {
  children: JSX.Element | JSX.Element[]
  slideshowProps?: Omit<Settings, "children">
}

export const Slideshow = ({children, slideshowProps, ...props}: SlideshowProps) => {
  const slideShowRef = useRef<HTMLDivElement>(null)

  const adjustSlideLinks = () => {
    // Set tabindex attributes based on if the slides are visible or not.
    const hiddenLinks = slideShowRef.current?.querySelectorAll(".slick-slide:not(.slick-active) a")
    if (hiddenLinks) {
      ;[...hiddenLinks].map(link => link.setAttribute("tabindex", "-1"))
    }

    const visibleLinks = slideShowRef.current?.querySelectorAll(".slick-slide.slick-active a:not([aria-hidden])")
    if (visibleLinks) {
      ;[...visibleLinks].map(link => link.removeAttribute("tabindex"))
    }
  }

  useEffect(() => {
    adjustSlideLinks()
  }, [])

  const settings: Settings = {
    afterChange: () => adjustSlideLinks(),
    autoplay: false,
    centerMode: false,
    className:
      "[&_.slick-track]:flex [&_.slick-slider]:relative [&_.slick-slide>div]:h-full [&_.slick-slide>div>div]:h-full",
    dots: false,
    infinite: false,
    initialSlide: 0,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    slidesToScroll: 1,
    slidesToShow: 3,
    speed: 500,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
        },
      },
    ],
    ...slideshowProps,
  }
  return (
    <section
      ref={slideShowRef}
      {...props}
      aria-roledescription="carousel"
      className={twMerge("relative w-full", props.className)}
    >
      <Slider {...settings}>{children}</Slider>
    </section>
  )
}

export const Slide = ({
  slideNumber,
  totalSlides,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  slideNumber: number
  totalSlides: number
}) => {
  return (
    <div
      {...props}
      role="group"
      aria-roledescription="slide"
      aria-label={props["aria-labelledby"] || props["aria-label"] ? undefined : `${slideNumber} of ${totalSlides}`}
    >
      {children}
    </div>
  )
}
