/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import cryptoJs from 'crypto-js'
import { nanoid } from 'nanoid'
import { iniciarSpotifyWebPlaybackSDK } from './webPlaybackSDK.js'
import { swiper } from './Swiper.js'

const clienID = '908cc6491f5448249c5348685fd2a696'
const redireccionarURI = 'http://localhost:5173/callback'

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
  play: '#Play'
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

elements.menuCerrar.addEventListener('click', inactiveMenu)
elements.inicio.addEventListener('click', inactiveMenu)
elements.playlist.addEventListener('click', inactiveMenu)
elements.albumes.addEventListener('click', inactiveMenu)
elements.artistas.addEventListener('click', inactiveMenu)
elements.devolverMisPlaylist.addEventListener('click', activePlaylist)
function activePlaylist () {
  elements.misPlaylists.classList.remove('mobilePlaylist')
  elements.cancionesPlaylists.classList.add('mobilePlaylist')
  elements.devolverMisPlaylist.classList.add('hidden')
}
elements.devolverMisAlbumes.addEventListener('click', activeAlbumes)
function activeAlbumes () {
  elements.misAlbumes.classList.remove('infoAlbumMovil')
  elements.cancionesInfAlbum.classList.add('infoAlbumMovil')
  elements.devolverMisAlbumes.classList.add('hidden')
}
elements.devolverMisArtistas.addEventListener('click', activeArtistas)
function activeArtistas () {
  elements.misArtistas.classList.remove('mobileInfArtista')
  elements.cancionesInfArtista.classList.add('mobileInfArtista')
  elements.devolverMisArtistas.classList.add('hidden')
}

elements.containerPlay_Hover.addEventListener('mouseover', () => {
  active = true
  elements.play.style.transition = 'all 0.8s ease'
  elements.play.style.transform = 'scale(1.2)'
})

elements.containerPlay_Hover.addEventListener('mouseout', () => {
  active = true
  elements.play.style.transition = 'all 0.8s ease'
  elements.play.style.transform = 'scale(1)'
})

elements.containerPlay_Hover.addEventListener('click', () => {
  elements.play.style.transition = 'all 0.8s ease'
  elements.play.style.transform = 'scale(1.3)'
})

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

  window.onSpotifyWebPlaybackSDKReady = () => {
    iniciarSpotifyWebPlaybackSDK(token)
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

  const perfilHTML = `<div class="flex gap-4 items-center">
  <img src="${usuarios.images[0].url}" alt="${usuarios.display_name}" class="w-8 h-8 rounded-lg">
</div>`

  elements.perfil.innerHTML = perfilHTML
  elements.perfilMobile.innerHTML = perfilHTML

  tuMusica.items.forEach((element, index) => {
    elements.swiperWrapper.innerHTML += `
      <div id="${index}" class="swiper-slide cursor-pointer">
        <img src="${element.track.album.images[1].url}" alt="${element.track.name}" class="object-cover rounded-lg swiper-lazy">
      </div>
      `
  })
  function Tracks (element, popularity) {
    this.tracksPlaylist = function () {
      return `
        <div id="selectCanciones" class="grid grid-cols-2 gap-8 items-center justify-between cursor-pointer hover:text-[#1ED760]" onclick="tracksplaylist('${element.track.artists[0].id}', '${element.track.name.replace(/'/g, "\\'")}', '${element.track.id}')">
          
          <div class="flex flex-row gap-4 items-center">
            <img src="${element.track.album.images[0].url}" alt="${element.track.name}" class="rounded-lg h-20">
            <div class="flex flex-col gap-y-2">
              <h1 class="font-semibold">${element.track.name}</h1>
              <p class="font-semibold text-slate-500 ">${element.track.artists[0].name}</p>
            </div>
          </div>
          <p class="font-semibold text-slate-500 text-end">${element.track.album.name}</p>
        </div>
      `
    }

    this.tracksAlbum = function () {
      const constartistNames = [element.artists[0].name, element.artists[1]?.name, element.artists[2]?.name].filter(name => name).join('💙 ')
      return `
        <div class="grid grid-cols-2 items-center justify-between cursor-pointer hover:text-[#1ED760] " onclick="tracksplaylist('${element.artists[0].id}', '${element.name.replace(/'/g, "\\'")}', '${element.id}')">
          
          <div class="items-center">
            <div class="flex flex-col gap-y-2">
              <h1 class="font-semibold">${element.name} </h1>
              <p class="font-semibold text-slate-500">${constartistNames}</p>
            </div>
          </div>
          <p class="font-semibold text-slate-500 justify-self-end">${popularity}</p>
        </div>
      `
    }

    this.tracksArtista = function () {
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
  }

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
                <div class="flex flex-col gap-y-8 items-center justify-center"> 
                  <h1 class="font-semibold z-10 text-3xl">${nombreCancion}</h1> 
                  <h1 class="font-semibold z-10 text-3xl">${tuMusica.items[index].track.artists[0].name}</h1>
                  <ul class="infoCancion relative z-10 flex flex-wrap gap-5 transition-colors text-textGray2 font-semibold text-base">
                    <li class="hover:text-white text-center">Genero: ${infoArt.genres[0]}</li>
                    <li class="hover:text-white text-center">Popularidad: ${infoArt.popularity}</li>
                    <li class="hover:text-white text-center">Followers: ${infoArt.followers.total}</li>
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
        const idArtistaSelect = tuMusica.items[id].track.artists[0].id

        const dataAPIupdateArtis = await datosAPI(token, idArtistaSelect, undefined, undefined, undefined, undefined, undefined).then(([data, urlsLength]) => {
          const datos = data.then(data => {
            return [data, urlsLength]
          })
          return datos
        })

        localStorage.setItem('idTrack', dataAPIupdateArtis[0][1].items[id].track.id)
        console.log(dataAPIupdateArtis[0][1].items[id].track.id)

        const longitudURL = dataAPIupdateArtis[1]
        const infoArtClick = dataAPIupdateArtis[0][longitudURL - 1]

        let nombreCancion = tuMusica.items[id].track.name
        if (nombreCancion.length > 40) {
          nombreCancion = nombreCancion.substring(0, 40) + '...'
        }

        elements.infoFooterArtista.innerHTML = `
        <div class="flex flex-row items-center">
          <img src="${infoArtClick.images[2].url}" alt="${infoArtClick.name}" class="w-14 h-14 rounded-lg">
            <div class="infoArtistaMobile infoArtista flex flex-col gap-y-2 items-center justify-center ml-4">
              <h1 class="font-semibold text-xs">${nombreCancion}</h1>
              <h1 class="font-semibold text-lg">${infoArtClick.name}</h1>
            </div>
        </div>
        `
        elements.containerInfo.innerHTML = `
              <div class="grid lg:grid-cols-2 grid-cols-1 gap-9">
                <div class="flex flex-col gap-y-8 items-center justify-center"> 
                  <h1 class="font-semibold z-10 text-3xl">${nombreCancion}</h1> 
                  <h1 class="font-semibold z-10 text-3xl">${tuMusica.items[id].track.artists[0].name}</h1>
                  <ul class="relative z-10 flex flex-wrap gap-5 transition-colors text-textGray2 font-semibold text-base">
                    <li class="hover:text-white text-center">Genero: ${infoArtClick.genres[0]}</li>
                    <li class="hover:text-white text-center">Popularidad: ${infoArtClick.popularity}</li>
                    <li class="hover:text-white text-center">Followers: ${infoArtClick.followers.total}</li>
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

  const dataAPIupdateArtis = await datosAPI(token, tuMusica.items[0].track.artists[0].id, undefined, undefined, undefined, undefined, undefined).then(([data, urlsLength]) => {
    const datos = data.then(data => {
      return [data, urlsLength]
    })
    return datos
  })

  localStorage.setItem('idTrack', dataAPIupdateArtis[0][1].items[0].track.id)
  const longitudURL = dataAPIupdateArtis[1]
  const infoArt = dataAPIupdateArtis[0][longitudURL - 1]

  let nombreCancion = tuMusica.items[0].track.name
  if (nombreCancion.length > 40) {
    nombreCancion = nombreCancion.substring(0, 40) + '...'
  }

  elements.infoFooterArtista.innerHTML = `
      <div class="flex flex-row items-center">
        <img src="${infoArt.images[2].url}" alt="${infoArt.name}" class="w-14 h-14 rounded-lg">
          <div class="infoArtistaMobile infoArtista flex flex-col gap-y-2 items-center justify-center ml-4">
            <h1 class="font-semibold text-xs">${nombreCancion}</h1>
            <h1 class="font-semibold text-lg">${infoArt.name}</h1>
          </div>
      </div>
    `

  elements.misPlaylists.innerHTML = `
  <h1 class="text-lg font-semibold text-white py-6 ">💚 Mis Playlist ${usuarios.display_name}</h1>
    <div class="grid gap-5 overflow-y-scroll">
      ${playlist.items.map((element) => `
        <div class="containerMisListas grid gap-4 lg:grid-cols-2 sm:grid-cols-1 cursor-pointer items-center hover:text-[#1ED760] lg:gap-12 sm:gap-4" onclick="handleClick('${element.id}', '${element.images[0].url}', '${element.name}', '${element.description.replace(/'/g, "\\'")}')">
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
    <div class="flex items-center gap-4 flex-col sm:flex-row">
      <img src="${playlist.items[0].images[0].url}" alt="playlist" class="rounded-lg h-40">
        <div class="flex flex-col">
          <h1 class="font-semibold text-4xl text-white">${playlist.items[0].name}</h1>
          <p class="font-semibold text-slate-500">${playlist.items[0].description.replace(/'/g, "\\'")}</p>
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

  window.handleClick = async (id, urlImagen, name, description) => {
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
      <div class="flex items-center gap-4 flex-col sm:flex-row">
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

  window.tracksplaylist = async (id, namePlaylist, idCancion) => {
    const dataAPIupdateArtis = await datosAPI(token, id, undefined, undefined, undefined, undefined, undefined).then(([data, urlsLength]) => {
      const datos = data.then(data => {
        return [data, urlsLength]
      })
      return datos
    })

    localStorage.setItem('idTrack', idCancion)
    const longitudURLs = dataAPIupdateArtis[1]
    const infoArt = dataAPIupdateArtis[0][longitudURLs - 1]

    if (namePlaylist.length > 40) {
      namePlaylist = namePlaylist.substring(0, 40) + '...'
    }
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
  <div class="flex items-center gap-4 flex-col sm:flex-row">
    <img src="${Albumes.items[0].album.images[0].url}" alt="${Albumes.items[0].album.name}" class="rounded-lg h-40">
    <div class="flex flex-col">
      <h1 class="font-semibold text-4xl text-white">${nombreAlbum}</h1>
      <p class="font-semibold text-slate-500">${Albumes.items[0].album.artists[0].name}</p>
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

  window.handleClickAlbumes = async (id, urlImagen, name, description) => {
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
      <div class="flex items-center gap-4 flex-col sm:flex-row">
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
  elements.idMisArtistasBusqueda.style.display = 'none'
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
    <div class="flex items-center gap-4 flex-col sm:flex-row">
      <img src="${Artistas.artists.items[0].images[0].url}" alt="${Artistas.artists.items[0].name}" class="rounded-lg h-40">
      <div class="flex flex-col">
        <h1 class="font-semibold text-4xl text-white">${Artistas.artists.items[0].name}</h1>
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

  window.handleClickArtistas = async (id, urlImagen, name) => {
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
      <div class="flex items-center gap-4 flex-col sm:flex-row">
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

  // Buscador de canciones y artistas en la barra de navegacion de la pagina web
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

// Funcion para obtener datos de la API de Spotify

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
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    type: 'tracks'
  }))

  const datosPromesa = Promise.all(promises).then(responses => Promise.all(responses.map(response => response.json())))

  return [datosPromesa, urls.length]
}

// Observadores de las secciones de la pagina
// eslint-disable-next-line no-undef
const observerSectionInicio = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    elements.inicioLink.style.color = entry.isIntersecting ? '#1ED760' : 'white'
  })
}
, {
  threshold: 0.5
})
observerSectionInicio.observe(elements.inicioSection)

// eslint-disable-next-line no-undef
const observerSection = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    elements.playlistLink.style.color = entry.isIntersecting ? '#1ED760' : 'white'
  })
}, {
  threshold: 0.5
})
observerSection.observe(elements.playlistSection)

// eslint-disable-next-line no-undef
const observerSectionAlbumes = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    elements.albumesLink.style.color = entry.isIntersecting ? '#1ED760' : 'white'
  })
}, {
  threshold: 0.5
})
observerSectionAlbumes.observe(elements.albumesSection)

// eslint-disable-next-line no-undef
const observerSectionArtistas = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    elements.artistasLink.style.color = entry.isIntersecting ? '#1ED760' : 'white'
  })
}, {
  threshold: 0.5
})
observerSectionArtistas.observe(elements.artistasSection)

// eslint-disable-next-line no-undef
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
