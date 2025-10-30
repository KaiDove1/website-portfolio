import React from 'react'
import "./testimonial.css"
import { Data } from "./Data";
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Pagination } from 'swiper/modules';

const Testimonials = () => {
    return (
        <section className="testimonails container section" id="future">
            <h2 className="section__title">Future Plans or Ideas</h2>
            <span className="section__subtitle">Gallery/Future/Features</span>

            <Swiper className="testimonials__container"
                loop={true}
                grabCursor={true}
                spaceBetween={24}
                slidesPerView={1}
                pagination={{
                    clickable: true,
                }}
                breakpoints={{
                    576: {
                        slidesPerView: 2,
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 40,
                    },

                }}
                modules={[Pagination]}
                threshold={0}
            >
                {Data.map(({ id, image, title, description }) => {
                    return (
                        <SwiperSlide className="testimonial__card" key={id}>
                            <img src={image} alt="" className="testimonial__img" />
                            <h3 className="testimonial__name">{title}</h3>

                            <p className="testimonial__description">{description}</p>
                        </SwiperSlide>
                    )
                })}
            </Swiper>
        </section>
    )
}

export default Testimonials;