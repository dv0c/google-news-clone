"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface SwiperSliderProps {
  children: React.ReactNode;
  slidesPerView?: number;
  breakpoints?: Record<number, any>;
  showPagination?: boolean;
  showNavigation?: boolean;
  spaceBetween?: number;
}

export function SwiperSlider({
  children,
  slidesPerView = 1,
  breakpoints,
  showPagination = false,
  showNavigation = false,
  spaceBetween = 16,
}: SwiperSliderProps) {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      slidesPerView={slidesPerView}
      spaceBetween={spaceBetween}
      breakpoints={breakpoints}
      navigation={showNavigation}
      pagination={showPagination ? { clickable: true } : false}
      className="swiper-container"
    >
      {/* Wrap each child in a SwiperSlide */}
      {Array.isArray(children)
        ? children.map((child, index) => (
            <SwiperSlide key={index}>{child}</SwiperSlide>
          ))
        : <SwiperSlide>{children}</SwiperSlide>}
    </Swiper>
  );
}
