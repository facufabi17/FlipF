"use client"

import React from "react"
// import Image from "next/image" // Replaced with img tag for Vite
import { Swiper, SwiperSlide } from "swiper/react"

import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/pagination"
import "swiper/css/navigation"
import { SparklesIcon } from "lucide-react"
import { Autoplay, EffectCoverflow, Navigation, Pagination, } from "swiper/modules"

import { Badge } from "@/components/ui/badge"

interface CardItem {
    src: string;
    title: string;
    category?: string;
    description?: string;
}

interface CarouselProps {
    items: CardItem[]
    autoplayDelay?: number
    showPagination?: boolean
    showNavigation?: boolean
}

export const CardCarousel: React.FC<CarouselProps> = ({
    items,
    autoplayDelay = 1500,
    showPagination = true,
    showNavigation = true,
}) => {
    // ... css variable ...
    const css = `
  .swiper {
    width: 100%;
    padding-bottom: 50px;
  }
  
  .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 300px;
    height: 400px; /* Fixed height for consistency */
  }
  
  .swiper-slide img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  
  .swiper-3d .swiper-slide-shadow-left {
    background-image: none;
  }
  .swiper-3d .swiper-slide-shadow-right{
    background: none;
  }
  `
    return (
        <section className="w-full">
            <style>{css}</style>
            <div className="mx-auto w-full max-w-6xl rounded-[24px] border border-white/5 p-2 shadow-sm md:rounded-t-[44px]">
                {/* ... Badge and Title section ... */}
                <div className="relative mx-auto flex w-full flex-col rounded-[24px] border border-white/5 bg-white/5 p-2 shadow-sm md:items-start md:gap-8 md:rounded-b-[20px] md:rounded-t-[40px] md:p-2">
                    <Badge
                        variant="outline"
                        className="absolute left-4 top-6 rounded-[14px] border border-white/10 text-base md:left-6 text-white"
                    >
                        <SparklesIcon className="fill-[#00F5F1] stroke-1 text-white mr-2 w-4 h-4" />{" "}
                        Cursos Recomendados
                    </Badge>
                    <div className="flex flex-col justify-center pb-2 pl-4 pt-14 md:items-center w-full">
                        <div className="flex gap-2 text-center">
                            <div>
                                <h3 className="text-4xl opacity-85 font-bold tracking-tight text-white">
                                    Explora Nuestra Academia
                                </h3>
                                <p className="text-gray-400 mt-2">
                                    Descubre los <span className="text-[#00F5F1] font-bold">cursos</span> que están transformando carreras.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex w-full items-center justify-center gap-4 mt-8">
                        <div className="w-full">
                            <Swiper
                                spaceBetween={50}
                                autoplay={{
                                    delay: autoplayDelay,
                                    disableOnInteraction: false,
                                }}
                                effect={"coverflow"}
                                grabCursor={true}
                                centeredSlides={true}
                                loop={true}
                                slidesPerView={"auto"}
                                coverflowEffect={{
                                    rotate: 0,
                                    stretch: 0,
                                    depth: 100,
                                    modifier: 2.5,
                                }}
                                pagination={showPagination}
                                navigation={
                                    showNavigation
                                        ? {
                                            nextEl: ".swiper-button-next",
                                            prevEl: ".swiper-button-prev",
                                        }
                                        : undefined
                                }
                                modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
                                className="mySwiper"
                            >
                                {items.map((item, index) => (
                                    <SwiperSlide key={index}>
                                        <div className="size-full rounded-3xl overflow-hidden border border-white/10 group relative">
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity"></div>
                                            <img
                                                src={item.src}
                                                className="size-full rounded-xl object-cover"
                                                alt={item.title}
                                            />
                                            <div className="absolute bottom-0 left-0 w-full p-6 z-20 flex flex-col justify-end">
                                                {item.category && (
                                                    <span className="text-[#00F5F1] text-xs font-bold uppercase tracking-wider mb-2">{item.category}</span>
                                                )}
                                                <h4 className="text-white font-bold text-lg leading-tight mb-2 shadow-black drop-shadow-md">{item.title}</h4>
                                                {item.description && (
                                                    <p className="text-gray-300 text-xs line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                                                        {item.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
