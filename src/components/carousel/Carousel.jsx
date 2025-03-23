import React from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function Carousel() {

    const slides = [
        { id: 1, image: "/public/istockphoto-1498170916-1024x1024.png", alt: "Food Donation" },
        { id: 2, image: "/public/gettyimages-1329036922-612x612.png", alt: "Surplus Food Distribution" },
        { id: 3, image: "/public/istockphoto-1768525844-1024x1024.png", alt: "Sustainable Food System" },
      ];

   return (
    <div className="w-full mt-22 ">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        className="rounded-lg overflow-hidden shadow-lg"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <img src={slide.image} alt={slide.alt} className="w-full h-[500px] object-fill" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};


export default Carousel