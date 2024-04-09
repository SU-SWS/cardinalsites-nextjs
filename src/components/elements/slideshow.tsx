"use client";

import {HTMLAttributes, JSX} from "react";
import Slider, {CustomArrowProps, Settings} from "react-slick";
import {ArrowLeftIcon, ArrowRightIcon} from "@heroicons/react/16/solid";
import {twMerge} from "tailwind-merge";
import {clsx} from "clsx";


const NextArrow = ({className, onClick}: CustomArrowProps) => {
  const slickDisabled = !!(className && className?.indexOf("slick-disabled") > 0);
  return (
    <button
      className="absolute top-1/3 right-1 z-50"
      onClick={onClick}
      aria-label="Next"
      disabled={slickDisabled}
    >
      <ArrowRightIcon className={twMerge(clsx("w-50 text-black-true bg-teal rounded-full p-10", {"text-black-50": slickDisabled}))}/>
    </button>
  );
};

const PrevArrow = ({className, onClick}: CustomArrowProps) => {
  const slickDisabled = !!(className && className?.indexOf("slick-disabled") > 0);
  return (
    <button
      className="absolute top-1/3 left-1 z-50"
      onClick={onClick}
      aria-label="Previous"
      disabled={slickDisabled}
    >
      <ArrowLeftIcon className={twMerge(clsx("w-50 text-black-true bg-teal rounded-full p-10", {"text-black-50": slickDisabled}))}/>
    </button>
  );
};

type SlideshowProps = HTMLAttributes<HTMLDivElement> & {
  children: JSX.Element | JSX.Element[];
  slideshowProps?: Omit<Settings, "children">;
}

const Slideshow = ({children, slideshowProps, ...props}: SlideshowProps) => {
  const settings: Settings = {
    autoplay: false,
    centerMode: false,
    className: "overflow-hidden pb-8 [&_.slick-slide]:float-left [&_.slick-slide]:px-5",
    dots: false,
    infinite: false,
    initialSlide: 0,
    nextArrow: <NextArrow/>,
    prevArrow: <PrevArrow/>,
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
  };
  return (
    <div {...props} className={twMerge("relative w-full", props.className)}>
      <Slider {...settings}>
        {children}
      </Slider>
    </div>
  );
};

export default Slideshow;
