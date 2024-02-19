// import './style.css';
import cryptoJs from 'crypto-js'
import { nanoid } from 'nanoid'
import { iniciarSpotifyWebPlaybackSDK } from './webPlaybackSDK.js'
import { swiper } from './Swiper.js'

// import javascriptLogo from './javascript.svg'
// import viteLogo from '/vite.svg'

const clienID = '908cc6491f5448249c5348685fd2a696'
const redireccionarURI = 'http://localhost:5173/callback'

const urlParams = new URLSearchParams(window.location.search)
const code = urlParams.get('code')
const hoverSwiper = document.querySelector('.swiperContent')
const paginationVisibility = document.querySelector('.pagination_')
const swiperWrapper = document.querySelector('.swiper-wrapper')
const infoArtista = document.querySelector('.infoArtista')
const infoFooterArtista = document.querySelector('.infoFooterArtista')

hoverSwiper.addEventListener('mouseover', () => {
  paginationVisibility.classList.remove('hidden')
})

hoverSwiper.addEventListener('mouseout', () => {
  paginationVisibility.classList.add('hidden')
})

if (window.location.search.includes('code')) {
  const token = await obtenerToken()

  window.onSpotifyWebPlaybackSDKReady = () => {
    iniciarSpotifyWebPlaybackSDK(token)
  }

  const tuMusica = await mixesMásEscuchados(token)

  tuMusica.items.forEach((element, index) => {
    swiperWrapper.innerHTML += `
      <div id="${index}" class="swiper-slide">
        <img src="${element.album.images[1].url}" alt="${element.name}" class="object-cover rounded-lg">
      </div>
      `
  })

  async function updateArtistInfo () {
    const index = swiper.realIndex
    console.log(index)
    const artistId = tuMusica.items[index].artists[0].id
    const infoArt = await informacionArtista(token, artistId)
    infoArtista.innerHTML = `
            <div class="containerInfo z-10 flex justify-center items-center gap-24 p-9">
              <div class="flex flex-col gap-y-8 items-center justify-center"> 
                <h1 class="font-semibold z-10 text-3xl">${tuMusica.items[index].name}</h1> 
                <h1 class="font-semibold z-10 text-3xl">${tuMusica.items[index].artists[0].name}</h1>
                <ul class="relative z-10 flex gap-5 transition-colors text-textGray2 font-semibold text-base">
                  <li class="hover:text-white text-center">Genero: ${infoArt.genres[0]}</li>
                  <li class="hover:text-white text-center">Popularidad: ${infoArt.popularity}</li>
                  <li class="hover:text-white text-center">Followers: ${infoArt.followers.total}</li>
                </ul>
              </div>
              <div class="w-[320px] h-[320px] relative z-20 ">
                <img src="${infoArt.images[1].url}" alt="${infoArt.name}" class="w-full h-full rounded-lg">
              </div>
            </div>
    `
    console.log(infoArt)
  }

  const infoArtFooter = await informacionArtista(token, '4zLCaxN5L394pfzaKd3Yqb')
  infoFooterArtista.innerHTML = `
      <div class="flex flex-row items-center">
        <img src="${infoArtFooter.images[2].url}" alt="${infoArtFooter.name}" class="w-14 h-14 rounded-lg">
          <div class="flex flex-col gap-y-2 items-center justify-center">
            <h1 class="font-semibold text-xs ml-4">${tuMusica.items[12].name}</h1>
            <h1 class="font-semibold text-lg ml-4">${infoArtFooter.name}</h1>
          </div>
      </div>
    `

  swiper.on('slideChange', updateArtistInfo)
  swiper.init()
} else {
  inicioAutorizacion()
}

async function inicioAutorizacion () {
  const codigoVerifido = verificadorDeCodigo(128)
  const codigosCaracteres = codigoCaracteres(codigoVerifido)

  window.localStorage.setItem('codigoVerificado', codigoVerifido)
  const params = new URLSearchParams()
  params.append('client_id', clienID)
  params.append('response_type', 'code')
  params.append('redirect_uri', redireccionarURI)
  params.append('code_challenge_method', 'S256')
  params.append('code_challenge', codigosCaracteres)
  params.append('scope', 'user-read-private user-read-email user-modify-playback-state streaming playlist-read-private user-library-read user-top-read')

  // Redirige al usuario a la pagina de autenticacion de spotify
  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`
}

function verificadorDeCodigo (lenght) {
  const codigoVerificado = nanoid(lenght)
  return codigoVerificado
}

function codigoCaracteres (codeVerifier) {
  const codigosCaracteres = cryptoJs.SHA256(codeVerifier).toString(cryptoJs.enc.Base64).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  return codigosCaracteres
}

async function obtenerToken () {
  const codigoVerificado = window.localStorage.getItem('codigoVerificado')

  const body = new URLSearchParams()
  body.append('client_id', clienID)
  body.append('grant_type', 'authorization_code')
  body.append('code', code)
  body.append('redirect_uri', redireccionarURI)
  body.append('code_verifier', codigoVerificado)

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  })

  const data = await res.json()
  const token = data.access_token
  return token
}

async function mixesMásEscuchados (token) {
  const resMasEscuchados = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=50', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    type: 'tracks'
  })

  const masEscuchados = await resMasEscuchados.json()
  return masEscuchados
}

async function informacionArtista (token, id) {
  const informacion = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  const informacionArt = await informacion.json()
  return informacionArt
}
