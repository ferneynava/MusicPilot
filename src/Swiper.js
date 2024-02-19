import Swiper from 'swiper/bundle'
import Atropos from 'atropos'
import 'atropos/css'

// import styles bundle
import 'swiper/css/bundle'

export let swiper
// init Swiper:
document.addEventListener('DOMContentLoaded', (event) => {
  swiper = new Swiper('.swiper', {
    speed: 200,
    init: false,
    spaceBetween: 30,
    slidesPerView: 7,
    autoplay: {
      delay: 10000
    },
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    }
  })

  const atropos = Atropos({
    el: '.my-atropos',
    rotateLock: true,

    shadow: false

    // Reemplaza esto con el selector de tu elemento
    // Otras opciones de Atropos...
  })
})
