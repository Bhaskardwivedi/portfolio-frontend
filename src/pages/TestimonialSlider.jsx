import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const TestimonialSlider = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    axios.get("https://api.bhaskarai.com/api/feedback/testimonials/")
      .then((res) => setTestimonials(res.data))
      .catch((err) => console.error("Error loading testimonials", err));
  }, []);

  return (
    <section className="py-16 px-4 bg-white text-gray-800">
      <div className="text-center mb-10">
        <h3 className="text-sm font-semibold text-blue-500 uppercase">Testimonials</h3>
        <h2 className="text-3xl font-bold">What our Clients Say</h2>
        <p className="text-gray-500 mt-2">Feedback from clients I've worked with</p>
      </div>

      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        loop
        autoplay={{ delay: 4000 }}
        navigation
        modules={[Autoplay, Navigation]}
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {testimonials.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="bg-white border rounded-lg shadow p-6 h-full text-left flex flex-col justify-between">
              {/* ⭐ Rating */}
              <div className="text-yellow-400 mb-2 text-sm">
                {"⭐".repeat(item.rating || 5)}
              </div>

              {/* 💬 Message */}
              <p className="text-gray-700 italic mb-4">“{item.message}”</p>

              {/* 👤 Client Info */}
              <div className="mt-auto flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center font-bold text-white">
                  {item.name[0]}
                </div>
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.designation} @ {item.company}
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default TestimonialSlider;
