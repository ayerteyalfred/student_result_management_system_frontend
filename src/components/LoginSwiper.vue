<template>
  <Swiper :space-between="20" :loop="true" :pagination="{ clickable: true }" :navigation="true" :lazyloading="true"
    :autoplay="{
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    }" :modules="modules" class="mySlider cursor-grab">
    <template v-for="slide in slideStory" :key="slide.key">
      <Swiper-slide class="swiper-slide relative">
        <img :src="slide.image" alt="Slide Image" class="w-[400px] h-full hidden rounded-r-2xl md:block object-cover" />
        <div
          class="absolute hidden bottom-10 right-6 p-6 bg-white bg-opacity-30 backdrop-blur-sm rounded drop-shadow-lg md:block">
          <span class="text-white text-xl">
            Welcome to DEKS School Result
            <br />
            Management System - Your
            <br />
            Gateway to Academic Excellence.
          </span>
        </div>
      </Swiper-slide>
    </template>
  </Swiper>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const modules = [Navigation, Pagination, Autoplay]

const slideStory = [
  {
    key: 1,
    id: 0,
    image: '/img/slide1.jpg'
  },
  {
    key: 2,
    id: 1,
    image: '/img/slide2.jpg'
  },
  {
    key: 3,
    id: 2,
    image: '/img/slide3.jpg'
  },
  {
    key: 4,
    id: 4,
    image: '/img/slide4.jpg'
  }
]
</script>

<style scoped></style>