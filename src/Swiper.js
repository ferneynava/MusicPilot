import Swiper from 'swiper/bundle'
import Atropos from 'atropos'
import 'atropos/css'

// import styles bundle
import 'swiper/css/bundle'

export let swiper
// init Swiper:
document.addEventListener('DOMContentLoaded', (event) => {
  swiper = new Swiper('.swiper', {
    slidesPerView: 2,
    speed: 200,
    init: false,
    autoplay: {
      delay: 10000
    },
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    breakpoints: {
      300: { slidesPerView: 2, spaceBetween: 20 },
      600: { slidesPerView: 3, spaceBetween: 30 },
      800: { slidesPerView: 4, spaceBetween: 30 },
      1024: { slidesPerView: 5, spaceBetween: 30 },
      1200: { slidesPerView: 6, spaceBetween: 30 },
      1500: { slidesPerView: 7, spaceBetween: 40 },
      1800: { slidesPerView: 8, spaceBetween: 40 }
    },
    onSlideChange: function () {
      swiper.autoplay.start()
    }
  })

  // eslint-disable-next-line no-unused-vars
  const atropos = Atropos({
    el: '.my-atropos',
    rotateLock: true,
    shadow: false
  })
})
