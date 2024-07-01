/* eslint-disable no-const-assign */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
import cryptoJs from 'crypto-js'
import { nanoid } from 'nanoid'
import { iniciarMusicPilotWebPlaybackSDK } from './webPlaybackSDK.js'
import { swiper } from './Swiper.js'

const clienID = '908cc6491f5448249c5348685fd2a696'
const redireccionarURI = 'https://musicpilot-362fb.web.app'

const urlParams = new URLSearchParams(window.location.search)
const code = urlParams.get('code')
const selectors = {
  swiperWrapper: '.swiper-wrapper',
  containerInfo: '.containerInfo',
  infoFooterArtista: '.infoFooterArtista',
  misPlaylists: '.misPlaylists',
  cancionesPlaylists: '.cancionesPlaylists',
  devolverMisPlaylist: '.devolverMisPlaylist',
  devolverMisAlbumes: '.devolverMisAlbumes',
  devolverMisArtistas: '.devolverMisArtistas',
  misAlbumes: '.misAlbumes',
  cancionesInfAlbum: '.cancionesInfAlbum',
  misArtistas: '.misArtistas',
  misArtistasBusqueda: '.misArtistasBusqueda',
  cancionesInfArtista: '.cancionesInfArtista',
  search: '#idBuscador',
  searchButton: '#searchButton',
  enlaces: 'a',
  achorArtistas: '.artistas',
  idMisArtistas: '#idmisArtistas',
  idMisArtistasBusqueda: '#idmisArtistasBusqueda',
  footerInfo: '.footerInfo',
  footerRepro: '.footerRepro',
  perfil: '.perfil',
  perfilMobile: '.perfil-mobile',
  inicioLink: 'a[href="#Inicio"]',
  playlistLink: 'a[href="#Playlist"]',
  albumesLink: 'a[href="#Albumes"]',
  artistasLink: 'a[href="#Artistas"]',
  inicioSection: '#Inicio',
  playlistSection: '#Playlist',
  albumesSection: '#Albumes',
  artistasSection: '#Artistas',
  menu: '.Menu-Movil',
  menuActive: '.menuActive',
  menuCerrar: '.Menu-iphon_cerrar',
  inicio: '.inicio',
  playlist: '.playlist',
  albumes: '.albumes',
  artistas: '.artistasClickMovil',
  containerPlay_Hover: '.containerPlay_Hover',
  play: '#Play',
  pausa: '#Pausa',
  siguiente: '#Siguiente',
  anterior: '#Anterior',
  cerrarSesion: '.cerrarSesion',
  asidePerfilSesion: '.asidePerfilSesion',
  cerrarSesionMovil: '.cerrarSesionMovil'
}

const elements = {}
let active = false
for (const key in selectors) {
  if (key === 'enlaces') {
    elements[key] = document.querySelectorAll(selectors[key])
  } else {
    elements[key] = document.querySelector(selectors[key])
  }
}

// Funciones de autorizacion y verificacion de usuario
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
  params.append('scope', 'user-read-private user-read-email user-modify-playback-state streaming playlist-read-private user-library-read user-top-read user-follow-read')

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

// Cambia de seccion al hacer click en el enlace
elements.menu.addEventListener('click', () => {
  const inactiveMenu = elements.menuActive.classList.contains('hidden')
  if (inactiveMenu) {
    elements.menuActive.classList.remove('hidden')
  }
})

function assignEvents (elementSiguiente, elementAnterior, elementContainerPlayHover, elementsPlay, elementPausa, elementMenuCerrar, elementInicio, elementPlaylist, elementAlbumes, elementArtistas, elementDevolverMisPlaylist, elementDevolverMisAlbumes, elementDevolverMisArtistas) {
  elementSiguiente.onmouseover = function () {
    this.style.color = 'white'
  }

  elementSiguiente.onmouseout = function () {
    this.style.color = '#969696'
  }

  elementSiguiente.onmousedown = function () {
    this.style.color = '#969696'
  }

  elementSiguiente.onmouseup = function () {
    this.style.color = 'white'
  }

  elementAnterior.onmouseover = function () {
    this.style.color = 'white'
  }

  elementAnterior.onmouseout = function () {
    this.style.color = '#969696'
  }

  elementAnterior.onmousedown = function () {
    this.style.color = '#969696'
  }

  elementAnterior.onmouseup = function () {
    this.style.color = 'white'
  }

  elementContainerPlayHover.addEventListener('mouseover', () => {
    active = true
    elementsPlay.style.transition = 'all 0.8s ease'
    elementsPlay.style.transform = 'scale(1.2)'
    elementPausa.style.transition = 'all 0.8s ease'
    elementPausa.style.transform = 'scale(1.2)'
  })

  elementContainerPlayHover.addEventListener('mouseout', () => {
    active = true
    elementsPlay.style.transition = 'all 0.8s ease'
    elementsPlay.style.transform = 'scale(1)'
    elementPausa.style.transition = 'all 0.8s ease'
    elementPausa.style.transform = 'scale(1)'
  })

  elementContainerPlayHover.addEventListener('click', () => {
    if (elementPausa.classList.contains('hidden')) {
      elementPausa.classList.remove('hidden')
      elementsPlay.classList.add('hidden')
    } else {
      elementPausa.classList.add('hidden')
      elementsPlay.classList.remove('hidden')
    }
  })

  elementMenuCerrar.addEventListener('click', inactiveMenu)
  elementInicio.addEventListener('click', inactiveMenu)
  elementPlaylist.addEventListener('click', inactiveMenu)
  elementAlbumes.addEventListener('click', inactiveMenu)
  elementArtistas.addEventListener('click', inactiveMenu)
  elementDevolverMisPlaylist.addEventListener('click', activePlaylist)
  elementDevolverMisAlbumes.addEventListener('click', activeAlbumes)
  elementDevolverMisArtistas.addEventListener('click', activeArtistas)
}

assignEvents(elements.siguiente, elements.anterior, elements.containerPlay_Hover, elements.play, elements.pausa, elements.menuCerrar, elements.inicio, elements.playlist, elements.albumes, elements.artistas, elements.devolverMisPlaylist, elements.devolverMisAlbumes, elements.devolverMisArtistas)

function activePlaylist () {
  elements.misPlaylists.classList.remove('mobilePlaylist')
  elements.cancionesPlaylists.classList.add('mobilePlaylist')
  elements.devolverMisPlaylist.classList.add('hidden')
}

function activeAlbumes () {
  elements.misAlbumes.classList.remove('infoAlbumMovil')
  elements.cancionesInfAlbum.classList.add('infoAlbumMovil')
  elements.devolverMisAlbumes.classList.add('hidden')
}

function activeArtistas () {
  elements.misArtistas.classList.remove('mobileInfArtista')
  elements.cancionesInfArtista.classList.add('mobileInfArtista')
  elements.devolverMisArtistas.classList.add('hidden')
}

function inactiveMenu () {
  const inactiveMenu = elements.menuActive.classList.contains('hidden')
  if (!inactiveMenu) {
    elements.menuActive.classList.add('hidden')
  }
}

// Cambia el color del enlace clickeado
let ultimoEnlaceClickeado = null
elements.enlaces.forEach(enlace => {
  enlace.addEventListener('mousedown', function () {
    if (ultimoEnlaceClickeado) {
      ultimoEnlaceClickeado.style.color = 'white'
    }
    this.style.color = '#1ED760'
    ultimoEnlaceClickeado = this
  })
})

// Verifica si el usuario ya ha iniciado sesion
if (window.location.search.includes('code')) {
  const token = await obtenerToken()
  let trackInicial = 0

  window.onSpotifyWebPlaybackSDKReady = () => {
    iniciarMusicPilotWebPlaybackSDK(token)
  }

  const dataAPI = await datosAPI(token).then(([data, urlsLength]) => {
    const datos = data.then(data => {
      return [data, urlsLength]
    })
    return datos
  })

  const usuarios = dataAPI[0][0]
  const tuMusica = dataAPI[0][1]
  const playlist = dataAPI[0][2]
  const Albumes = dataAPI[0][3]
  const Artistas = dataAPI[0][4]
  const arrayTracksId = []
  const arrayTracksIdArtistas = []
  const arrayTracksNameArtistas = []
  const arrayIdMisPlaylis = []
  const newArrayTracksIdPlaylist = []
  const newArrayTracksIdArtistasPlaylist = []
  const newArrayTracksIdNameArtistasPlaylist = []
  const newArrayTracksIdAlbum = []
  const newArrayTracksIdArtistasAlbum = []
  const newArrayTracksIdNameArtistasAlbum = []
  const newArrayTracksIdArtistas = []
  const newArrayTracksIdArtistasArtistas = []
  const newArrayTracksIdNameArtistasArtistas = []

  playlist.items.map((element) =>
    arrayIdMisPlaylis.push(element.id)
  )

  const perfilHTML = `
    <div class="flex gap-4 items-center cursor-pointer" onclick="clickPerfil()">
      <img src="${usuarios.images[0].url}" alt="${usuarios.display_name}" class="w-8 h-8 rounded-lg">
    </div>
`

  window.clickPerfil = function () {
    elements.asidePerfilSesion.classList.toggle('hidden')
  }

  elements.cerrarSesion.onclick = function () {
    elements.asidePerfilSesion.classList.toggle('hidden')
    window.localStorage.clear()
    inicioAutorizacion()
  }

  elements.cerrarSesionMovil.onclick = function () {
    window.localStorage.clear()
    inicioAutorizacion()
  }

  elements.perfil.innerHTML = perfilHTML
  elements.perfilMobile.innerHTML = perfilHTML

  async function updateArtistInfo () {
    const index = swiper.realIndex
    const artistId = tuMusica.items[index].track.artists[0].id
    const dataAPIupdateArtis = await datosAPI(token, artistId, undefined, undefined, undefined, undefined, undefined).then(([data, urlsLength]) => {
      const datos = data.then(data => {
        return [data, urlsLength]
      })
      return datos
    })
    const longitudURL = dataAPIupdateArtis[1]
    const infoArt = dataAPIupdateArtis[0][longitudURL - 1]

    let nombreCancion = tuMusica.items[index].track.name
    if (nombreCancion.length > 40) {
      nombreCancion = nombreCancion.substring(0, 40) + '...'
    }

    elements.containerInfo.innerHTML = `
              <div class="grid lg:grid-cols-2 grid-cols-1 gap-9"> 
                <div class="flex flex-col gap-y-4 items-center justify-center"> 
                  <h1 class="font-semibold z-10 text-3xl">${nombreCancion}</h1> 
                  <h1 class="font-semibold z-10 text-3xl">${tuMusica.items[index].track.artists[0].name}</h1>
                  <ul class="infoCancion relative z-10 flex flex-wrap gap-5 transition-colors text-textGray2 font-semibold text-base justify-center">
                    <li class="hover:text-white text-center text-[#AACCFF]">Genero: ${infoArt.genres[0]}</li>
                    <li class="hover:text-white text-center text-[#AACCFF]">Popularidad: ${infoArt.popularity}</li>
                    <li class="hover:text-white text-center text-[#AACCFF]">Followers: ${infoArt.followers.total}</li>
                  </ul>
                </div>
                <div class="presentacionImg h-[320px] relative z-20">
                  <img src="${infoArt.images[1].url}" alt="${infoArt.name}" class="w-full h-full rounded-lg">
                </div>
              </div>
    `
  }

  swiper.on('init', () => {
    const slides = document.querySelectorAll('.swiper-slide')
    slides.forEach((slide) => {
      slide.addEventListener('click', async () => {
        const id = slide.id
        trackInicial = id

        const idArtistaSelect = tuMusica.items[id].track.artists[0].id
        let nombreCancion = tuMusica.items[id].track.name

        const dataAPIupdateArtis = await datosAPI(token, idArtistaSelect, undefined, undefined, undefined, undefined, undefined).then(([data, urlsLength]) => {
          const datos = data.then(data => {
            return [data, urlsLength]
          })
          return datos
        })

        localStorage.setItem('idTrack', dataAPIupdateArtis[0][1].items[id].track.id)

        elements.siguiente.onclick = function () {
          trackInicial++
          if (trackInicial === tuMusica.items.length) {
            trackInicial = 0
          }
          nombreCancion = tuMusica.items[trackInicial].track.name
          if (nombreCancion.length > 40) {
            nombreCancion = nombreCancion.substring(0, 40) + '...'
          }
          infoArtImg = tuMusica.items[trackInicial].track.album.images[2].url
          infoArtista = tuMusica.items[trackInicial].track.artists[0].name
          localStorage.setItem('idTrack', tuMusica.items[trackInicial].track.id)
          infoFooterTuMusicaPlay(nombreCancion, infoArtImg, infoArtista)
        }

        elements.anterior.onclick = function () {
          trackInicial--
          if (trackInicial < 0) {
            trackInicial = tuMusica.items.length - 1
          }
          nombreCancion = tuMusica.items[trackInicial].track.name
          if (nombreCancion.length > 40) {
            nombreCancion = nombreCancion.substring(0, 40) + '...'
          }
          infoArtImg = tuMusica.items[trackInicial].track.album.images[2].url
          infoArtista = tuMusica.items[trackInicial].track.artists[0].name
          localStorage.setItem('idTrack', tuMusica.items[trackInicial].track.id)
          infoFooterTuMusicaPlay(nombreCancion, infoArtImg, infoArtista)
        }

        const longitudURL = dataAPIupdateArtis[1]
        const infoArtClick = dataAPIupdateArtis[0][longitudURL - 1]

        if (nombreCancion.length > 40) {
          nombreCancion = nombreCancion.substring(0, 40) + '...'
        }

        infoFooterTuMusicaPlay(nombreCancion, infoArtClick.images[2].url, infoArtClick.name)

        elements.containerInfo.innerHTML = `
              <div class="grid lg:grid-cols-2 grid-cols-1 gap-9">
                <div class="flex flex-col gap-y-8 items-center justify-center"> 
                  <h1 class="font-semibold z-10 text-3xl">${nombreCancion}</h1> 
                  <h1 class="font-semibold z-10 text-3xl">${tuMusica.items[id].track.artists[0].name}</h1>
                  <ul class="relative z-10 flex flex-wrap gap-5 transition-colors text-textGray2 font-semibold text-base justify-center">
                    <li class="hover:text-white text-center text-[#AACCFF]">Genero: ${infoArtClick.genres[0]}</li>
                    <li class="hover:text-white text-center text-[#AACCFF]">Popularidad: ${infoArtClick.popularity}</li>
                    <li class="hover:text-white text-center text-[#AACCFF]">Followers: ${infoArtClick.followers.total}</li>
                  </ul>
                </div>
                <div class="presentacionImg  h-[320px] relative z-20 ">
                  <img src="${infoArtClick.images[1].url}" alt="${infoArtClick.name}" class="w-full h-full rounded-lg">
                </div>
              </div>
    `
      })
    })
  })

  function infoFooterTuMusicaPlay (nombreCancion, infoArtImg, infoArtista) {
    elements.infoFooterArtista.innerHTML = `
    <div class="flex flex-row items-center">
      <img src="${infoArtImg}" alt="${infoArtista}" class="w-14 h-14 rounded-lg">
        <div class="infoArtistaMobile infoArtista flex flex-col gap-y-2 items-center justify-center ml-4">
          <h1 class="font-semibold text-xs">${nombreCancion}</h1>
          <h1 class="font-semibold text-lg">${infoArtista}</h1>
        </div>
    </div>
    `
  }

  tuMusica.items.forEach((element, index) => {
    elements.swiperWrapper.innerHTML += `
      <div id="${index}" class="swiper-slide cursor-pointer">
        <img src="${element.track.album.images[1].url}" alt="${element.track.name}" class="object-cover rounded-lg swiper-lazy">
      </div>
      `
  })

  localStorage.setItem('idTrack', tuMusica.items[trackInicial].track.id)

  let infoArtImg = tuMusica.items[0].track.album.images[2].url
  let nombreCancion = tuMusica.items[0].track.name
  let infoArtista = tuMusica.items[0].track.artists[0].name

  if (nombreCancion.length > 40) {
    nombreCancion = nombreCancion.substring(0, 40) + '...'
  }

  infoFooterTuMusica()

  elements.siguiente.onclick = function () {
    trackInicial++
    if (trackInicial === tuMusica.items.length) {
      trackInicial = 0
    }

    nombreCancion = tuMusica.items[trackInicial].track.name
    if (nombreCancion.length > 40) {
      nombreCancion = nombreCancion.substring(0, 40) + '...'
    }

    infoArtImg = tuMusica.items[trackInicial].track.album.images[2].url
    infoArtista = tuMusica.items[trackInicial].track.artists[0].name
    localStorage.setItem('idTrack', tuMusica.items[trackInicial].track.id)
    infoFooterTuMusica()
  }

  elements.anterior.onclick = function () {
    trackInicial--
    if (trackInicial < 0) {
      trackInicial = tuMusica.items.length - 1
    }
    nombreCancion = tuMusica.items[trackInicial].track.name
    if (nombreCancion.length > 40) {
      nombreCancion = nombreCancion.substring(0, 40) + '...'
    }
    infoArtImg = tuMusica.items[trackInicial].track.album.images[2].url
    infoArtista = tuMusica.items[trackInicial].track.artists[0].name
    localStorage.setItem('idTrack', tuMusica.items[trackInicial].track.id)
    infoFooterTuMusica()
  }

  function infoFooterTuMusica () {
    elements.infoFooterArtista.innerHTML = `
    <div class="flex flex-row items-center">
      <img src="${infoArtImg}" alt="${infoArtista}" class="w-14 h-14 rounded-lg">
        <div class="infoArtistaMobile infoArtista flex flex-col gap-y-2 items-center justify-center ml-4">
          <h1 class="font-semibold text-xs">${nombreCancion}</h1>
          <h1 class="font-semibold text-lg">${infoArtista}</h1>
        </div>
    </div>
  `
  }

  function Tracks (element, popularity) {
    this.tracksPlaylist = function () {
      arrayTracksId.push(element.track.id)
      arrayTracksIdArtistas.push(element.track.artists[0].id)
      arrayTracksNameArtistas.push(element.track.name.replace(/'/g, "\\'"))

      return `
        <div id="selectCanciones" class="grid grid-cols-2 gap-8 items-center justify-between cursor-pointer hover:text-[#1ED760]" onclick="tracksplaylist('${element.track.artists[0].id}', '${element.track.name.replace(/'/g, "\\'")}', '${element.track.id}')">
          
          <div class="flex flex-row gap-4 items-center">
            <img src="${element.track.album.images[0].url}" alt="${element.track.name}" class="rounded-lg h-20">
            <div class="flex flex-col gap-y-2">
              <h1 class="font-semibold">${element.track.name}</h1>
              <p class="font-semibold text-[#AACCFF] ">${element.track.artists[0].name}</p>
            </div>
          </div>
          <p class="font-semibold text-[#AACCFF] text-end">${element.track.album.name}</p>
        </div>
      `
    }

    this.tracksPlaylistInicioPagina = function () {
      return `
      <div id="selectCanciones" class="grid grid-cols-2 gap-8 items-center justify-between cursor-pointer hover:text-[#1ED760]" onclick="tracksPlaylistInicio('${element.track.artists[0].id}', '${element.track.name.replace(/'/g, "\\'")}', '${element.track.id}')">
        
        <div class="flex flex-row gap-4 items-center">
          <img src="${element.track.album.images[0].url}" alt="${element.track.name}" class="rounded-lg h-20">
          <div class="flex flex-col gap-y-2">
            <h1 class="font-semibold">${element.track.name}</h1>
            <p class="font-semibold text-[#AACCFF] ">${element.track.artists[0].name}</p>
          </div>
        </div>
        <p class="font-semibold text-[#AACCFF] text-end">${element.track.album.name}</p>
      </div>
    `
    }

    this.tracksAlbum = function () {
      const constartistNames = [element.artists[0].name, element.artists[1]?.name, element.artists[2]?.name].filter(name => name).join('💙 ')
      arrayTracksId.push(element.id)
      arrayTracksIdArtistas.push(element.artists[0].id)
      arrayTracksNameArtistas.push(element.name.replace(/'/g, "\\'"))

      return `
        <div class="grid grid-cols-2 items-center justify-between cursor-pointer hover:text-[#1ED760] " onclick="tracksplaylist('${element.artists[0].id}', '${element.name.replace(/'/g, "\\'")}', '${element.id}')">
          
          <div class="items-center">
            <div class="flex flex-col gap-y-2">
              <h1 class="font-semibold">${element.name} </h1>
              <p class="font-semibold text-[#AACCFF">${constartistNames}</p>
            </div>
          </div>
          <p class="font-semibold text-[#AACCFF] justify-self-end">${popularity}</p>
        </div>
      `
    }

    this.tracksAlbumInicioPagina = function () {
      const constartistNames = [element.artists[0].name, element.artists[1]?.name, element.artists[2]?.name].filter(name => name).join('💙 ')
      return `
        <div class="grid grid-cols-2 items-center justify-between cursor-pointer hover:text-[#1ED760] " onclick="tracksAlbumInicio('${element.artists[0].id}', '${element.name.replace(/'/g, "\\'")}', '${element.id}')">
          
          <div class="items-center">
            <div class="flex flex-col gap-y-2">
              <h1 class="font-semibold">${element.name} </h1>
              <p class="font-semibold text-[#AACCFF]">${constartistNames}</p>
            </div>
          </div>
          <p class="font-semibold text-[#AACCFF] justify-self-end">${popularity}</p>
        </div>
      `
    }

    this.tracksArtista = function () {
      arrayTracksId.push(element.id)
      arrayTracksIdArtistas.push(element.artists[0].id)
      arrayTracksNameArtistas.push(element.name.replace(/'/g, "\\'"))

      return `
        <div class="grid grid-cols-1 items-center justify-between cursor-pointer hover:text-[#1ED760] " onclick="tracksplaylist('${element.artists[0].id}', '${element.name.replace(/'/g, "\\'")}', '${element.id}')">
          
        <div class="flex flex-row gap-4 items-center">
          <img src="${element.album.images[0].url}" alt="${element.name}" class="rounded-lg h-20">
          <div class="flex flex-col gap-y-2">
            <h1 class="font-semibold">${element.name}</h1>
          </div>
        </div>
        </div>
      `
    }

    this.tracksArtistaInicioPagina = function () {
      return `
        <div class="grid grid-cols-1 items-center justify-between cursor-pointer hover:text-[#1ED760] " onclick="tracksArtistaInicio('${element.artists[0].id}', '${element.name.replace(/'/g, "\\'")}', '${element.id}')">
          
        <div class="flex flex-row gap-4 items-center">
          <img src="${element.album.images[0].url}" alt="${element.name}" class="rounded-lg h-20">
          <div class="flex flex-col gap-y-2">
            <h1 class="font-semibold">${element.name}</h1>
          </div>
        </div>
        </div>
      `
    }
  }

  elements.misPlaylists.innerHTML = `
  <h1 class="text-lg font-semibold text-white py-6 ">💚 Mis Playlist ${usuarios.display_name}</h1>
    <div class="grid gap-5 overflow-y-scroll">
      ${playlist.items.map((element) =>
        `<div class="containerMisListas grid gap-4 lg:grid-cols-2 sm:grid-cols-1 cursor-pointer items-center hover:text-[#1ED760] lg:gap-12 sm:gap-4" onclick="handleClick('${element.id}', '${element.images[0].url}', '${element.name}', '${element.description.replace(/'/g, "\\'")}')">
          <img src="${element.images[0].url}" alt="${element.name}" class="rounded-lg h-32">
          <h1 class="font-semibold text-base justify-self-start text-start">${element.name}</h1>
        </div>
      `).join('')
        }
    </div>
  `

  const dataAPIcancionesPlay = await datosAPI(token, undefined, playlist.items[0].id, undefined, undefined, undefined, undefined).then(([data, urlsLength]) => {
    const datos = data.then(data => {
      return [data, urlsLength]
    })
    return datos
  })

  const longitudURLs = dataAPIcancionesPlay[1]
  const cancionesPlaylist = dataAPIcancionesPlay[0][longitudURLs - 1]

  elements.cancionesPlaylists.innerHTML = `  
    <div class="flex items-center gap-4 flex-col sm:flex-row cancionesPlaylistsMobile">
      <img src="${playlist.items[0].images[0].url}" alt="playlist" class="rounded-lg h-40">
        <div class="flex flex-col">
          <h1 class="font-semibold text-4xl text-white">${playlist.items[0].name}</h1>
          <p class="font-semibold text-[#AACCFF]">${playlist.items[0].description.replace(/'/g, "\\'")}</p>
        </div>
    </div>
      
    <nav class="p-4 border-white border-b-2">
          <ul class="flex items-center justify-between">
            <li>Titulo</li>
            <li>Álbum</li>
          </ul>
    </nav>
    
    <div class="grid overflow-y-scroll gap-5 p-5"> 
      ${cancionesPlaylist.items.map((element) => {
        const tracks = new Tracks(element)
        return tracks.tracksPlaylistInicioPagina()
      }).join('')}
    </div>
  `

  cancionesPlaylist.items.forEach((element) => {
    newArrayTracksIdPlaylist.push(element.track.id)
    newArrayTracksIdArtistasPlaylist.push(element.track.artists[0].id)
    newArrayTracksIdNameArtistasPlaylist.push(element.track.name.replace(/'/g, "\\'"))
  })

  // Mis Albumes

  elements.misAlbumes.innerHTML = `
  <h1 class="text-lg font-semibold text-white py-6 ">💚 Mis Álbumes ${usuarios.display_name}</h1>
  <div class="grid gap-5 overflow-y-scroll">
    ${Albumes.items.map((element) => `
      <div class="containerMisListas grid gap-4 lg:grid-cols-2 sm:grid-cols-1 cursor-pointer items-center hover:text-[#1ED760] lg:gap-12 sm:gap-4" onclick="handleClickAlbumes('${element.album.id}', '${element.album.images[0].url}', '${element.album.name}', '${element.album.artists[0].name}')">
      <img src="${element.album.images[0].url}" alt="${element.album.name}" class="rounded-lg h-32">
      <h1 class="font-semibold text-base justify-self-start text-start">${element.album.name}</h1>
      </div>
    `).join('')
  }
  </div>
`

  const idAlbum = Albumes.items[0].album.id

  const dataAPICancionesAlbumes = await datosAPI(token, undefined, undefined, idAlbum, undefined, undefined, undefined).then(([data, urlsLength]) => {
    const datos = data.then(data => {
      return [data, urlsLength]
    })
    return datos
  })

  const longitudURLss = dataAPICancionesAlbumes[1]
  const cancionesAlbum = dataAPICancionesAlbumes[0][longitudURLss - 1]

  const dataAPICancionesArtAlbum = await datosAPI(token, undefined, undefined, undefined, cancionesAlbum.items[0].id, undefined, undefined).then(([data, urlsLength]) => {
    const datos = data.then(data => {
      return [data, urlsLength]
    })
    return datos
  })

  const longitudURLsss = dataAPICancionesArtAlbum[1]
  const infoArtAlbum = dataAPICancionesArtAlbum[0][longitudURLsss - 1]

  let nombreAlbum = Albumes.items[0].album.name
  if (nombreAlbum.length > 80) {
    nombreAlbum = nombreAlbum.substring(0, 80) + '...'
  }

  elements.cancionesInfAlbum.innerHTML = `  
  <div class="flex items-center gap-4 flex-col sm:flex-row cancionesAlbumMobile">
    <img src="${Albumes.items[0].album.images[0].url}" alt="${Albumes.items[0].album.name}" class="rounded-lg h-40">
    <div class="flex flex-col">
      <h1 class="font-semibold text-4xl text-white">${nombreAlbum}</h1>
      <p class="font-semibold text-[#AACCFF]">${Albumes.items[0].album.artists[0].name}</p>
    </div>
  </div>

  <nav class="p-4 border-white border-b-2">
    <ul class="flex items-center justify-between">
      <li>Titulo</li>
      <li>Popularidad 0 - 100</li>
    </ul>
  </nav>
  <div class="grid overflow-y-scroll gap-5 p-5">  
      ${cancionesAlbum.items.map((element) => {
        const tracksAlbum = new Tracks(element, infoArtAlbum.popularity)
        return tracksAlbum.tracksAlbumInicioPagina()
      }).join('')}
  </div>
`

  cancionesAlbum.items.forEach((element) => {
    newArrayTracksIdAlbum.push(element.id)
    newArrayTracksIdArtistasAlbum.push(element.artists[0].id)
    newArrayTracksIdNameArtistasAlbum.push(element.name.replace(/'/g, "\\'"))
  })

  // Mis Artistas

  elements.misArtistas.innerHTML = `
    <h1 class="text-lg font-semibold text-white py-6 ">💚 Artistas ${usuarios.display_name}</h1>
    <div class="grid gap-5 overflow-y-scroll">
      ${Artistas.artists.items.map((element) => `
        <div class="containerMisListas grid gap-4 lg:grid-cols-2 sm:grid-cols-1 cursor-pointer items-center hover:text-[#1ED760] lg:gap-12 sm:gap-4" onclick="handleClickArtistas('${element.id}', '${element.images[0].url}', '${element.name.replace(/'/g, "\\'")}')">
          <img src="${element.images[0].url}" alt="${element.name}" class="rounded-lg h-32 place-self-center">
          <h1 class="font-semibold text-base justify-self-start text-start">${element.name}</h1>
        </div>
      `).join('')
    }
    </div>
  `

  const dataAPICancionesPopularesArtista = await datosAPI(token, undefined, undefined, undefined, undefined, Artistas.artists.items[0].id, undefined).then(([data, urlsLength]) => {
    const datos = data.then(data => {
      return [data, urlsLength]
    })
    return datos
  })
  const longitudURLssss = dataAPICancionesPopularesArtista[1]

  const artistasTracksTop = dataAPICancionesPopularesArtista[0][longitudURLssss - 1]

  elements.cancionesInfArtista.innerHTML = `
    <div class="flex items-center gap-4 flex-col sm:flex-row cancionesArtistaMobile">
      <img src="${Artistas.artists.items[0].images[0].url}" alt="${Artistas.artists.items[0].name}" class="rounded-lg h-40">
      <div class="flex flex-col">
        <h1 class="font-semibold text-4xl text-white">${Artistas.artists.items[0].name}</h1>
      </div>
    </div>
    <h1 class="font-semibold text-4xl text-white"> Populares</h1>
  <div class="grid overflow-y-scroll gap-5 p-5">  
        ${artistasTracksTop.tracks.map((element) => {
          const tracksAlbum = new Tracks(element)
          return tracksAlbum.tracksArtistaInicioPagina()
        }).join('')}
  </div>
  `

  artistasTracksTop.tracks.forEach((element) => {
    newArrayTracksIdArtistas.push(element.id)
    newArrayTracksIdArtistasArtistas.push(element.artists[0].id)
    newArrayTracksIdNameArtistasArtistas.push(element.name.replace(/'/g, "\\'"))
  })

  window.handleClick = async (id, urlImagen, name, description) => {
    arrayTracksId.length = 0
    arrayTracksIdArtistas.length = 0
    arrayTracksNameArtistas.length = 0
    const pantallaPequeña = window.matchMedia('(max-width: 1019px)').matches
    if (pantallaPequeña) {
      elements.misPlaylists.classList.add('mobilePlaylist')
      elements.cancionesPlaylists.classList.remove('mobilePlaylist')
      elements.devolverMisPlaylist.classList.remove('hidden')
    }

    const dataAPIcancionesPlay = await datosAPI(token, undefined, id, undefined, undefined, undefined, undefined).then(([data, urlsLength]) => {
      const datos = data.then(data => {
        return [data, urlsLength]
      })
      return datos
    })

    const longitudURLs = dataAPIcancionesPlay[1]
    const cancionesPlaylist = dataAPIcancionesPlay[0][longitudURLs - 1]
    elements.cancionesPlaylists.innerHTML = `  
      <div class="flex items-center gap-4 flex-col sm:flex-row cancionesPlaylistsMobile">
        <img src="${urlImagen}" alt="playlist" class="rounded-lg h-40">
        <div class="flex flex-col">
          <h1 class="font-semibold text-4xl text-white">${name}</h1>
          <p class="font-semibold text-slate-500">${description}</p>
        </div>
      </div>

      <nav class="p-4 border-white border-b-2">
            <ul class="flex items-center justify-between">
              <li>Titulo</li>
              <li>Álbum</li>
            </ul>
      </nav>
      
      <div class="grid overflow-y-scroll gap-5 p-5"> 
      
        ${cancionesPlaylist.items.map((element) => {
          const tracks = new Tracks(element)
          return tracks.tracksPlaylist()
        }).join('')}
      </div>
    `
  }

  window.handleClickAlbumes = async (id, urlImagen, name, description) => {
    arrayTracksId.length = 0
    arrayTracksIdArtistas.length = 0
    arrayTracksNameArtistas.length = 0
    let nombreAlbums = name
    if (nombreAlbums.length > 80) {
      nombreAlbums = nombreAlbums.substring(0, 80) + '...'
    }

    const pantallaPequeña = window.matchMedia('(max-width: 1019px)').matches
    if (pantallaPequeña) {
      elements.misAlbumes.classList.add('infoAlbumMovil')
      elements.cancionesInfAlbum.classList.remove('infoAlbumMovil')
      elements.devolverMisAlbumes.classList.remove('hidden')
    }

    const dataAPICancionesAlbumes = await datosAPI(token, undefined, undefined, id, undefined, undefined, undefined).then(([data, urlsLength]) => {
      const datos = data.then(data => {
        return [data, urlsLength]
      })
      return datos
    })
    const longitudURLss = dataAPICancionesAlbumes[1]
    const cancionesAlbum = dataAPICancionesAlbumes[0][longitudURLss - 1]
    elements.cancionesInfAlbum.innerHTML = `  
      <div class="flex items-center gap-4 flex-col sm:flex-row cancionesAlbumMobile">
        <img src="${urlImagen}" alt="playlist" class="rounded-lg h-40">
        <div class="flex flex-col">
          <h1 class="font-semibold text-4xl text-white">${nombreAlbums}</h1>
          <p class="font-semibold text-slate-500">${description}</p>
        </div>
      </div>

      <nav class="p-4 border-white border-b-2">
        <ul class="flex items-center justify-between">
          <li>Titulo</li>
          <li>Popularidad 0 - 100</li>
        </ul>
      </nav>

      <div class="grid overflow-y-scroll gap-5 p-5">  
        ${cancionesAlbum.items.map((element) => {
          const tracksAlbum = new Tracks(element, infoArtAlbum.popularity)
          return tracksAlbum.tracksAlbum()
        }).join('')}
      </div>
      `
  }

  window.handleClickArtistas = async (id, urlImagen, name) => {
    arrayTracksId.length = 0
    arrayTracksIdArtistas.length = 0
    arrayTracksNameArtistas.length = 0

    const pantallaPequeña = window.matchMedia('(max-width: 1019px)').matches
    if (pantallaPequeña) {
      elements.misArtistas.classList.add('mobileInfArtista')
      elements.cancionesInfArtista.classList.remove('mobileInfArtista')
      elements.devolverMisArtistas.classList.remove('hidden')
    }
    const dataAPICancionesPopularesArtista = await datosAPI(token, undefined, undefined, undefined, undefined, id, undefined).then(([data, urlsLength]) => {
      const datos = data.then(data => {
        return [data, urlsLength]
      })
      return datos
    })

    const longitudURLssss = dataAPICancionesPopularesArtista[1]
    const artistasTracksTop = dataAPICancionesPopularesArtista[0][longitudURLssss - 1]
    elements.cancionesInfArtista.innerHTML = `
      <div class="flex items-center gap-4 flex-col sm:flex-row cancionesArtistaMobile">
        <img src="${urlImagen}" alt="${name}" class="rounded-lg h-40">
        <div class="flex flex-col">
          <h1 class="font-semibold text-4xl text-white">${name}</h1>
        </div>
      </div>
      <h1 class="font-semibold text-4xl text-white"> Populares</h1>
      <div class="grid overflow-y-scroll gap-5 p-5">  
        ${artistasTracksTop.tracks.map((element) => {
          const tracksAlbum = new Tracks(element)
          return tracksAlbum.tracksArtista()
        }).join('')}
      </div>
      `
  }

  window.tracksplaylist = async (id, name, idCancion) => {
    localStorage.setItem('idTrack', arrayTracksId[arrayTracksId.indexOf(idCancion)])
    let posicionArrayTracksId = arrayTracksId.indexOf(idCancion)
    let posicionArrayTracksIdArtistas = arrayTracksIdArtistas.indexOf(id)
    let posicionArrayTracksNameArtistas = arrayTracksNameArtistas.indexOf(name)
    const tracksIdArtistasSelec = arrayTracksIdArtistas[posicionArrayTracksIdArtistas]
    const TracksNameArtistasSelec = arrayTracksNameArtistas[posicionArrayTracksNameArtistas]
    playerFooter(tracksIdArtistasSelec, TracksNameArtistasSelec)

    elements.siguiente.onclick = function () {
      posicionArrayTracksIdArtistas++
      posicionArrayTracksNameArtistas++
      posicionArrayTracksId++

      if (posicionArrayTracksId === arrayTracksId.length) {
        posicionArrayTracksId = 0
      }
      if (posicionArrayTracksIdArtistas === arrayTracksIdArtistas.length) {
        posicionArrayTracksIdArtistas = 0
      }

      if (posicionArrayTracksNameArtistas === arrayTracksNameArtistas.length) {
        posicionArrayTracksNameArtistas = 0
      }

      const id = arrayTracksIdArtistas[posicionArrayTracksIdArtistas]
      const name = arrayTracksNameArtistas[posicionArrayTracksNameArtistas]
      localStorage.setItem('idTrack', arrayTracksId[posicionArrayTracksId])
      playerFooter(id, name)
    }

    elements.anterior.onclick = function () {
      posicionArrayTracksIdArtistas--
      posicionArrayTracksNameArtistas--
      posicionArrayTracksId--

      if (posicionArrayTracksId < 0) {
        posicionArrayTracksId = arrayTracksId.length - 1
      }

      if (posicionArrayTracksIdArtistas < 0) {
        posicionArrayTracksIdArtistas = arrayTracksIdArtistas.length - 1
      }

      if (posicionArrayTracksNameArtistas < 0) {
        posicionArrayTracksNameArtistas = arrayTracksNameArtistas.length - 1
      }

      const id = arrayTracksIdArtistas[posicionArrayTracksIdArtistas]
      const name = arrayTracksNameArtistas[posicionArrayTracksNameArtistas]
      localStorage.setItem('idTrack', arrayTracksId[posicionArrayTracksId])
      playerFooter(id, name)
    }
  }

  window.tracksPlaylistInicio = async (id, name, idCancion) => {
    localStorage.setItem('idTrack', newArrayTracksIdPlaylist[newArrayTracksIdPlaylist.indexOf(idCancion)])
    let indexTracksIdPlaylist = newArrayTracksIdPlaylist.indexOf(idCancion)
    let indexTracksIdArtistasPlaylist = newArrayTracksIdArtistasPlaylist.indexOf(id)
    let indexTracksIdNameArtistasPlaylist = newArrayTracksIdNameArtistasPlaylist.indexOf(name)

    const trackIdArtistaInicio = newArrayTracksIdArtistasPlaylist[indexTracksIdArtistasPlaylist]
    const nameArtistaInicio = newArrayTracksIdNameArtistasPlaylist[indexTracksIdNameArtistasPlaylist]

    playerFooter(trackIdArtistaInicio, nameArtistaInicio)

    elements.siguiente.onclick = function () {
      indexTracksIdPlaylist++
      indexTracksIdArtistasPlaylist++
      indexTracksIdNameArtistasPlaylist++
      if (indexTracksIdPlaylist === newArrayTracksIdPlaylist.length) {
        indexTracksIdPlaylist = 0
      }

      if (indexTracksIdArtistasPlaylist === newArrayTracksIdArtistasPlaylist.length) {
        indexTracksIdArtistasPlaylist = 0
      }
      if (indexTracksIdNameArtistasPlaylist === newArrayTracksIdNameArtistasPlaylist.length) {
        indexTracksIdNameArtistasPlaylist = 0
      }

      const trackIdArtista = newArrayTracksIdArtistasPlaylist[indexTracksIdArtistasPlaylist]
      const nameArtista = newArrayTracksIdNameArtistasPlaylist[indexTracksIdNameArtistasPlaylist]
      localStorage.setItem('idTrack', newArrayTracksIdPlaylist[indexTracksIdPlaylist])
      playerFooter(trackIdArtista, nameArtista)
    }

    elements.anterior.onclick = function () {
      indexTracksIdPlaylist--
      indexTracksIdArtistasPlaylist--
      indexTracksIdNameArtistasPlaylist--
      if (indexTracksIdPlaylist < 0) {
        indexTracksIdPlaylist = newArrayTracksIdPlaylist.length - 1
      }

      if (indexTracksIdArtistasPlaylist < 0) {
        indexTracksIdArtistasPlaylist = newArrayTracksIdArtistasPlaylist.length - 1
      }

      if (indexTracksIdNameArtistasPlaylist < 0) {
        indexTracksIdNameArtistasPlaylist = newArrayTracksIdNameArtistasPlaylist.length - 1
      }

      const trackIdArtista = newArrayTracksIdArtistasPlaylist[indexTracksIdArtistasPlaylist]
      const nameArtista = newArrayTracksIdNameArtistasPlaylist[indexTracksIdNameArtistasPlaylist]
      localStorage.setItem('idTrack', newArrayTracksIdPlaylist[indexTracksIdPlaylist])
      playerFooter(trackIdArtista, nameArtista)
    }
  }

  window.tracksAlbumInicio = async (id, name, idCancion) => {
    localStorage.setItem('idTrack', newArrayTracksIdAlbum[newArrayTracksIdAlbum.indexOf(idCancion)])
    let indexTracksIdPlaylistAlbum = newArrayTracksIdAlbum.indexOf(idCancion)
    let indexTracksIdArtistasAlbum = newArrayTracksIdArtistasAlbum.indexOf(id)
    let indexTrackIdNameArtistasAlbum = newArrayTracksIdNameArtistasAlbum.indexOf(name)

    const tracksIdArtistasAlbumInicio = newArrayTracksIdArtistasAlbum[indexTracksIdArtistasAlbum]
    const nameArtistaAlbumInicio = newArrayTracksIdNameArtistasAlbum[indexTrackIdNameArtistasAlbum]

    playerFooter(tracksIdArtistasAlbumInicio, nameArtistaAlbumInicio)

    elements.siguiente.onclick = function () {
      indexTracksIdPlaylistAlbum++
      indexTracksIdArtistasAlbum++
      indexTrackIdNameArtistasAlbum++

      if (indexTracksIdPlaylistAlbum === newArrayTracksIdAlbum.length) {
        indexTracksIdPlaylistAlbum = 0
      }

      if (indexTracksIdArtistasAlbum === newArrayTracksIdArtistasAlbum.length) {
        indexTracksIdArtistasAlbum = 0
      }

      if (indexTrackIdNameArtistasAlbum === newArrayTracksIdNameArtistasAlbum.length) {
        indexTrackIdNameArtistasAlbum = 0
      }

      const trackIdAlbum = newArrayTracksIdArtistasAlbum[indexTracksIdArtistasAlbum]
      const nameAlbum = newArrayTracksIdNameArtistasAlbum[indexTrackIdNameArtistasAlbum]
      localStorage.setItem('idTrack', newArrayTracksIdAlbum[indexTracksIdPlaylistAlbum])
      playerFooter(trackIdAlbum, nameAlbum)
    }

    elements.anterior.onclick = function () {
      indexTracksIdPlaylistAlbum--
      indexTracksIdArtistasAlbum--
      indexTrackIdNameArtistasAlbum--

      if (indexTracksIdPlaylistAlbum < 0) {
        indexTracksIdPlaylistAlbum = newArrayTracksIdAlbum.length - 1
      }

      if (indexTracksIdArtistasAlbum < 0) {
        indexTracksIdArtistasAlbum = newArrayTracksIdArtistasAlbum.length - 1
      }

      if (indexTrackIdNameArtistasAlbum < 0) {
        indexTrackIdNameArtistasAlbum = newArrayTracksIdNameArtistasAlbum.length - 1
      }

      const trackIdAlbum = newArrayTracksIdArtistasAlbum[indexTracksIdArtistasAlbum]
      const nameAlbum = newArrayTracksIdNameArtistasAlbum[indexTrackIdNameArtistasAlbum]
      localStorage.setItem('idTrack', newArrayTracksIdAlbum[indexTracksIdPlaylistAlbum])
      playerFooter(trackIdAlbum, nameAlbum)
    }
  }

  window.tracksArtistaInicio = async (id, name, idCancion) => {
    localStorage.setItem('idTrack', newArrayTracksIdArtistas[newArrayTracksIdArtistas.indexOf(idCancion)])
    let indexTracksIdArtistas = newArrayTracksIdArtistas.indexOf(idCancion)
    let indexTracksIdArtistasArtistas = newArrayTracksIdArtistasArtistas.indexOf(id)
    let indexTracksIdNameArtistasArtistas = newArrayTracksIdNameArtistasArtistas.indexOf(name)

    const tracksIdArtistasArtistasInicio = newArrayTracksIdArtistasArtistas[indexTracksIdArtistasArtistas]
    const nameArtistaArtistasInicio = newArrayTracksIdNameArtistasArtistas[indexTracksIdNameArtistasArtistas]

    playerFooter(tracksIdArtistasArtistasInicio, nameArtistaArtistasInicio)

    elements.siguiente.onclick = function () {
      indexTracksIdArtistas++
      indexTracksIdArtistasArtistas++
      indexTracksIdNameArtistasArtistas++

      if (indexTracksIdArtistas === newArrayTracksIdArtistas.length) {
        indexTracksIdArtistas = 0
      }

      if (indexTracksIdArtistasArtistas === newArrayTracksIdArtistasArtistas.length) {
        indexTracksIdArtistasArtistas = 0
      }

      if (indexTracksIdNameArtistasArtistas === newArrayTracksIdNameArtistasArtistas.length) {
        indexTracksIdNameArtistasArtistas = 0
      }

      const trackIdArtistas = newArrayTracksIdArtistasArtistas[indexTracksIdArtistasArtistas]
      const nameArtistas = newArrayTracksIdNameArtistasArtistas[indexTracksIdNameArtistasArtistas]
      localStorage.setItem('idTrack', newArrayTracksIdArtistas[indexTracksIdArtistas])
      playerFooter(trackIdArtistas, nameArtistas)
    }

    elements.anterior.onclick = function () {
      indexTracksIdArtistas--
      indexTracksIdArtistasArtistas--
      indexTracksIdNameArtistasArtistas--

      if (indexTracksIdArtistas < 0) {
        indexTracksIdArtistas = newArrayTracksIdArtistas.length - 1
      }

      if (indexTracksIdArtistasArtistas < 0) {
        indexTracksIdArtistasArtistas = newArrayTracksIdArtistasArtistas.length - 1
      }

      if (indexTracksIdNameArtistasArtistas < 0) {
        indexTracksIdNameArtistasArtistas = newArrayTracksIdNameArtistasArtistas.length - 1
      }

      const trackIdArtistas = newArrayTracksIdArtistasArtistas[indexTracksIdArtistasArtistas]
      const nameArtistas = newArrayTracksIdNameArtistasArtistas[indexTracksIdNameArtistasArtistas]
      localStorage.setItem('idTrack', newArrayTracksIdArtistas[indexTracksIdArtistas])
      playerFooter(trackIdArtistas, nameArtistas)
    }
  }

  async function playerFooter (id, namePlaylist) {
    const dataAPIupdateArtis = await datosAPI(token, id, undefined, undefined, undefined, undefined, undefined).then(([data, urlsLength]) => {
      const datos = data.then(data => {
        return [data, urlsLength]
      })
      return datos
    })

    if (namePlaylist.length > 40) {
      namePlaylist = namePlaylist.substring(0, 40) + '...'
    }

    const longitudURLs = dataAPIupdateArtis[1]
    const infoArt = dataAPIupdateArtis[0][longitudURLs - 1]
    elements.infoFooterArtista.innerHTML = `
      <div class="flex flex-row items-center">
        <img src="${infoArt.images[2].url}" alt="${infoArt.name}" class="w-14 h-14 rounded-lg">
        <div class="infoArtistaMobile infoArtista flex flex-col gap-y-2 items-center justify-center ml-4">
            <h1 class="font-semibold text-xs">${namePlaylist}</h1>
            <h1 class="font-semibold text-lg">${infoArt.name}</h1>
          </div>
      </div>
      `
  }

  // Buscador de canciones y artistas en la barra de navegacion de la pagina web
  elements.idMisArtistasBusqueda.style.display = 'none'
  elements.search.addEventListener('keydown', async (event) => {
    if (ultimoEnlaceClickeado) {
      ultimoEnlaceClickeado.style.color = 'white'
    }

    if (event.key === 'Enter') {
      searchArtistas()
    }
  })

  elements.searchButton.addEventListener('click', async () => {
    if (ultimoEnlaceClickeado) {
      ultimoEnlaceClickeado.style.color = 'white'
    }

    searchArtistas()
  })

  async function searchArtistas () {
    window.location.href = '#Artistas'
    elements.achorArtistas.style.color = '#1ED760'
    elements.idMisArtistas.style.display = 'none'
    elements.idMisArtistasBusqueda.style.display = 'block'
    ultimoEnlaceClickeado = elements.achorArtistas
    const dataAPIBuscador = await datosAPI(token, undefined, undefined, undefined, undefined, undefined, elements.search.value).then(([data, urlsLength]) => {
      const datos = data.then(data => {
        return [data, urlsLength]
      })
      return datos
    })
    const longitudArray = dataAPIBuscador[1]
    const artistasBuscador = dataAPIBuscador[0][longitudArray - 1]
    elements.misArtistasBusqueda.innerHTML = `
        <h1 class="text-lg font-semibold text-white py-6 ">💙 Artistas ${usuarios.display_name}</h1>
          <div class="grid gap-5 p-5 overflow-y-scroll">
          ${artistasBuscador.artists.items.map((element) => `
            <div class="grid grid-cols-2 gap-12 cursor-pointer items-center hover:text-[#1ED760]" onclick="handleClickArtistas('${element.id}', '${element.images[0].url}', '${element.name.replace(/'/g, "\\'")}')">
              <img src="${element.images[0].url}" alt="${element.name}" class="rounded-lg h-32 place-self-center">
              <h1 class="font-semibold text-base justify-self-start text-start">${element.name}</h1>
            </div>
          `).join('')}
          </div>
      `
  }

  swiper.on('slideChange', updateArtistInfo)

  swiper.init()
} else {
  inicioAutorizacion()
}

document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault()
})

// Funcion para obtener datos de la API de MusicPilot

async function datosAPI (token, id, idPlaylist, idAlbum, idPista, idPopularesArtista, searchArtist) {
  const urls = ['https://api.spotify.com/v1/me', 'https://api.spotify.com/v1/me/tracks?limit=20', 'https://api.spotify.com/v1/me/playlists', 'https://api.spotify.com/v1/me/albums', 'https://api.spotify.com/v1/me/following?type=artist']

  const idToUrl = {
    id: id && `https://api.spotify.com/v1/artists/${id}`,
    idPlaylist: idPlaylist && `https://api.spotify.com/v1/playlists/${idPlaylist}/tracks`,
    idAlbum: idAlbum && `https://api.spotify.com/v1/albums/${idAlbum}/tracks`,
    idPista: idPista && `https://api.spotify.com/v1/tracks/${idPista}`,
    idPopularesArtista: idPopularesArtista && `https://api.spotify.com/v1/artists/${idPopularesArtista}/top-tracks?market=ES`,
    idBuscador: searchArtist && `https://api.spotify.com/v1/search?q=${searchArtist}&type=artist`
  }

  const urlss = Object.values(idToUrl).filter(Boolean)
  urls.push(...urlss)
  const promises = urls.map(url => fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    type: 'tracks'
  }))

  const datosPromesa = Promise.all(promises).then(responses => Promise.all(responses.map(response => response.json())))

  return [datosPromesa, urls.length]
}

// Observadores de las secciones de la pagina

const observerSectionInicio = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    elements.inicioLink.style.color = entry.isIntersecting ? '#1ED760' : 'white'
  })
}
, {
  threshold: 0.5
})
observerSectionInicio.observe(elements.inicioSection)

const observerSection = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    elements.playlistLink.style.color = entry.isIntersecting ? '#1ED760' : 'white'
  })
}, {
  threshold: 0.5
})
observerSection.observe(elements.playlistSection)

const observerSectionAlbumes = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    elements.albumesLink.style.color = entry.isIntersecting ? '#1ED760' : 'white'
  })
}, {
  threshold: 0.5
})
observerSectionAlbumes.observe(elements.albumesSection)

const observerSectionArtistas = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    elements.artistasLink.style.color = entry.isIntersecting ? '#1ED760' : 'white'
  })
}, {
  threshold: 0.5
})
observerSectionArtistas.observe(elements.artistasSection)

const observerFooter = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (active) {
      elements.play.style.transition = 'all 0s ease'
    }
    elements.footerRepro.style.visibility = entry.isIntersecting ? 'hidden' : 'visible'
  })
}, {
  threshold: 0.5
})

observerFooter.observe(elements.footerInfo)

const scriptTag = document.createElement('script')
scriptTag.src = 'https://sdk.scdn.co/spotify-player.js'
document.body.appendChild(scriptTag)
