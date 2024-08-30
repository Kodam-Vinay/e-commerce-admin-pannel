import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import "../App.css";

import { EffectCoverflow, Autoplay } from "swiper/modules";
import { CLOUDINARY_IMAGE_ACCESS_URL } from "../utils/constants";
import { Link } from "react-router-dom";
import { v4 as uniqueId } from "uuid";

export default function ProductCarousel({ imagesList }) {
  return (
    <Swiper
      effect={"coverflow"}
      grabCursor={true}
      centeredSlides={true}
      slidesPerView={"auto"}
      coverflowEffect={{
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      }}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      modules={[EffectCoverflow, Autoplay]}
      className="mySwiper"
    >
      {imagesList?.map((eachImage) => {
        const link =
          CLOUDINARY_IMAGE_ACCESS_URL?.replace(
            process.env.REACT_APP_CLOUDINARY_PRESET,
            process.env.REACT_APP_CLOUDINARY_PRODUCTS_PRESET
          ) +
          "/" +
          eachImage?.url;
        return (
          <SwiperSlide key={uniqueId()}>
            <Link to={link} target="_blank">
              <img
                loading="lazy"
                src={link}
                alt="product-icon"
                className="h-24 w-24"
              />
            </Link>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
