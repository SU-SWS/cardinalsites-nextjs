'use client';
import React, { useRef } from 'react';
import Slider, { CustomArrowProps, Settings } from 'react-slick';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/16/solid';

const NextArrow = ({ onClick }: CustomArrowProps) => {
  return (
    <button
      className='absolute top-1/3 right-1 z-50'
      onClick={onClick}
      aria-label='Next'
    >
      <ArrowRightIcon className='w-50 text-black-true bg-teal rounded-full p-10' />
    </button>
  );
};

const PrevArrow = ({ onClick }: CustomArrowProps) => {
  return (
    <button
      className='absolute top-1/3 left-1 z-50'
      onClick={onClick}
      aria-label='Previous'
    >
      <ArrowLeftIcon className='w-50 text-black-true bg-teal rounded-full p-10' />
    </button>
  );
};

type SlideshowProps = {
  children: React.JSX.Element;
  slideshowProps?: Omit<Settings, "children">;
}

const Slideshow = ({ children, slideshowProps, ...props }: SlideshowProps) => {
  const arrowRef = useRef<Slider>(null);
  const settings: Settings = {
    className: 'center',
    centerMode: true,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
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
    <div className='relative w-full'>
      <Slider ref={arrowRef} {...settings} {...props}>
        {children}
      </Slider>
    </div>
  );
};

export default Slideshow;
