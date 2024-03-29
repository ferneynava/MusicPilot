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
const swiperWrapper = document.querySelector('.swiper-wrapper')
const infoArtista = document.querySelector('.infoArtista')
const infoFooterArtista = document.querySelector('.infoFooterArtista')
const misPlaylists = document.querySelector('.misPlaylists')
const cancionesPlaylists = document.querySelector('.cancionesPlaylists')
const misAlbumes = document.querySelector('.misAlbumes')
const cancionesInfAlbum = document.querySelector('.cancionesInfAlbum')
const misArtistas = document.querySelector('.misArtistas')
const cancionesInfArtista = document.querySelector('.cancionesInfArtista')

// Verifica si el usuario ya ha iniciado sesion
if (window.location.search.includes('code')) {
  const token = await obtenerToken()

  window.onSpotifyWebPlaybackSDKReady = () => {
    iniciarSpotifyWebPlaybackSDK(token)
  }

  const tuMusica = await mixesMásEscuchados(token)

  tuMusica.items.forEach((element, index) => {
    swiperWrapper.innerHTML += `
      <div id="${index}" class="swiper-slide cursor-pointer">
        <img src="${element.album.images[1].url}" alt="${element.name}" class="object-cover rounded-lg">
      </div>
      `
  })

  function Tracks (element, popularity) {
    this.tracksPlaylist = function () {
      return `
        <div class="grid grid-cols-3 items-center justify-between cursor-pointer hover:text-[#1ED760]" onclick="tracksplaylist('${element.track.artists[0].id}', '${element.track.name}')">
          
          <div class="flex flex-row gap-4 items-center">
            <img src="${element.track.album.images[0].url}" alt="${element.track.name}" class="rounded-lg h-20">
            <div class="flex flex-col gap-y-2">
              <h1 class="font-semibold">${element.track.name}</h1>
              <p class="font-semibold text-slate-500">${element.track.artists[0].name}</p>
            </div>
          </div>
          <p class="font-semibold text-slate-500">${element.track.album.name}</p>
          <p class="font-semibold text-slate-500 justify-self-end">${element.added_at}</p>
        </div>
      `
    }

    this.tracksAlbum = function () {
      const constartistNames = [element.artists[0].name, element.artists[1]?.name, element.artists[2]?.name].filter(name => name).join('💙 ')
      return `
        <div class="grid grid-cols-2 items-center justify-between cursor-pointer hover:text-[#1ED760] " onclick="tracksplaylist('${element.artists[0].id}', '${element.name}')">
          
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
        <div class="grid grid-cols-1 items-center justify-between cursor-pointer hover:text-[#1ED760] " onclick="tracksplaylist('${element.artists[0].id}', '${element.name}')">
          
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
    const artistId = tuMusica.items[index].artists[0].id
    const infoArt = await informacionArtista(token, artistId)
    const usuario = await obtenerUsuario(token)
    infoArtista.innerHTML = `
            <div class="containerInfo z-10 grid justify-center items-center p-5">
              <div class="flex gap-4">
                <img src="${usuario.images[0].url}" alt="${usuario.display_name}" class="w-8 h-8 rounded-lg">
                <h1 class="font-semibold text-2xl">${usuario.display_name} 💙</h1>
              </div>
              <div class="flex gap-9"> 
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
            </div>
    `
  }

  swiper.on('init', () => {
    const slides = document.querySelectorAll('.swiper-slide')
    slides.forEach((slide) => {
      slide.addEventListener('click', async () => {
        const id = slide.id
        const idArtistaSelect = tuMusica.items[id].artists[0].id
        const infoArtClick = await informacionArtista(token, idArtistaSelect)
        const usuario = await obtenerUsuario(token)
        infoFooterArtista.innerHTML = `
        <div class="flex flex-row items-center">
          <img src="${infoArtClick.images[2].url}" alt="${infoArtClick.name}" class="w-14 h-14 rounded-lg">
            <div class="flex flex-col gap-y-2 items-center justify-center">
              <h1 class="font-semibold text-xs ml-4">${tuMusica.items[id].name}</h1>
              <h1 class="font-semibold text-lg ml-4">${infoArtClick.name}</h1>
            </div>
        </div>
        `
        infoArtista.innerHTML = `
            <div class="containerInfo z-10 grid justify-center items-center p-5 h-auto">
              <div class="flex gap-4">
                <img src="${usuario.images[0].url}" alt="${usuario.display_name}" class="w-8 h-8 rounded-lg">
                <h1 class="font-semibold text-2xl">${usuario.display_name} 💙</h1>
              </div>
              <div class="flex gap-9">
                <div class="flex flex-col gap-y-8 items-center justify-center"> 
                  <h1 class="font-semibold z-10 text-3xl">${tuMusica.items[id].name}</h1> 
                  <h1 class="font-semibold z-10 text-3xl">${tuMusica.items[id].artists[0].name}</h1>
                  <ul class="relative z-10 flex gap-5 transition-colors text-textGray2 font-semibold text-base">
                    <li class="hover:text-white text-center">Genero: ${infoArtClick.genres[0]}</li>
                    <li class="hover:text-white text-center">Popularidad: ${infoArtClick.popularity}</li>
                    <li class="hover:text-white text-center">Followers: ${infoArtClick.followers.total}</li>
                  </ul>
                </div>
              <div class="w-[320px] h-[320px] relative z-20 ">
                <img src="${infoArtClick.images[1].url}" alt="${infoArtClick.name}" class="w-full h-full rounded-lg">
              </div>
              </div>
            </div>
    `
      })
    })
  })

  const infoArtFooter = await informacionArtista(token, tuMusica.items[0].artists[0].id)
  infoFooterArtista.innerHTML = `
      <div class="flex flex-row items-center">
        <img src="${infoArtFooter.images[2].url}" alt="${infoArtFooter.name}" class="w-14 h-14 rounded-lg">
          <div class="flex flex-col gap-y-2 items-center justify-center">
            <h1 class="font-semibold text-xs ml-4">${tuMusica.items[0].name}</h1>
            <h1 class="font-semibold text-lg ml-4">${infoArtFooter.name}</h1>
          </div>
      </div>
    `

  const playlist = await obtenerPlaylist(token)
  const usuario = await obtenerUsuario(token)
  misPlaylists.innerHTML = `
  <h1 class="text-lg font-semibold text-white py-6 ">💙 Mis Playlist ${usuario.display_name}</h1>
    <div class="grid gap-5 p-5 overflow-y-scroll">
      ${playlist.items.map((element) => `
        <div class="grid grid-cols-2 cursor-pointer items-center hover:text-[#1ED760]" onclick="handleClick('${element.id}', '${element.images[0].url}', '${element.name}', '${element.description.replace(/'/g, "\\'")}')">
          <img src="${element.images[0].url}" alt="${element.name}" class="rounded-lg h-20 place-self-center">
          <h1 class="font-semibold text-base justify-self-start text-start">${element.name}</h1>
        </div>
      `).join('')
        }
    </div>
  `

  const cancionesPlaylist = await obtenerCancionesPlaylist(token, playlist.items[0].id)
  cancionesPlaylists.innerHTML = `  
    <div class="flex items-center gap-10">
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
            <li>Fecha en la que se añadio</li>
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
    const cancionesPlaylist = await obtenerCancionesPlaylist(token, id)
    cancionesPlaylists.innerHTML = `  
      <div class="flex items-center gap-10">
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
              <li>Fecha en la que se añadio</li>
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

  window.tracksplaylist = async (id, namePlaylist) => {
    const infoArtPlayList = await informacionArtista(token, id)
    infoFooterArtista.innerHTML = `
      <div class="flex flex-row items-center">
        <img src="${infoArtPlayList.images[2].url}" alt="${infoArtPlayList.name}" class="w-14 h-14 rounded-lg">
        <div class="flex flex-col gap-y-2 items-center justify-center">
            <h1 class="font-semibold text-xs ml-4">${namePlaylist}</h1>
            <h1 class="font-semibold text-lg ml-4">${infoArtPlayList.name}</h1>
          </div>
      </div>
      `
  }

  const albumes = await obtenerAlbumes(token)
  misAlbumes.innerHTML = `
    <h1 class="text-lg font-semibold text-white py-6 ">💙 Mis Albumes ${usuario.display_name}</h1>
    <div class="grid gap-5 p-5 overflow-y-scroll">
      ${albumes.items.map((element) => `
        <div class=" grid grid-cols-2 cursor-pointer items-center hover:text-[#1ED760] " onclick="handleClickAlbumes('${element.album.id}', '${element.album.images[0].url}', '${element.album.name}', '${element.album.artists[0].name}')">
        <img src="${element.album.images[0].url}" alt="${element.album.name}" class="rounded-lg h-20 place-self-center">
        <h1 class="font-semibold text-base justify-self-start text-start">${element.album.name}</h1>
        </div>
      `).join('')
    }
    </div>
  `
  const id = albumes.items[0].album.id
  const cancionesAlbum = await obtenerCancionesAlbum(token, id)
  const infoArtAlbum = await informacionPista(token, cancionesAlbum.items[0].id)
  cancionesInfAlbum.innerHTML = `  
  <div class="flex items-center gap-10">
    <img src="${albumes.items[0].album.images[0].url}" alt="${albumes.items[0].album.name}" class="rounded-lg h-40">
    <div class="flex flex-col">
      <h1 class="font-semibold text-4xl text-white">${albumes.items[0].album.name}</h1>
      <p class="font-semibold text-slate-500">${albumes.items[0].album.artists[0].name}</p>
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
    const cancionesAlbum = await obtenerCancionesAlbum(token, id)
    const infoArtAlbum = await informacionPista(token, cancionesAlbum.items[0].id)
    cancionesInfAlbum.innerHTML = `  
      <div class="flex items-center gap-10">
        <img src="${urlImagen}" alt="playlist" class="rounded-lg h-40">
        <div class="flex flex-col">
          <h1 class="font-semibold text-4xl text-white">${name}</h1>
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

  const artistas = await obtenerArtistas(token)

  misArtistas.innerHTML = `
    <h1 class="text-lg font-semibold text-white py-6 ">💙 Mis Artistas ${usuario.display_name}</h1>
    <div class="grid gap-5 p-5 overflow-y-scroll">
      ${artistas.artists.items.map((element) => `
        <div class="grid grid-cols-2 cursor-pointer items-center hover:text-[#1ED760] " onclick="handleClickArtistas('${element.id}', '${element.images[0].url}', '${element.name.replace(/'/g, "\\'")}')">
          <img src="${element.images[0].url}" alt="${element.name}" class="rounded-lg h-20 place-self-center">
          <h1 class="font-semibold text-base justify-self-start text-start">${element.name}</h1>
        </div>
      `).join('')
    }
    </div>
  `
  const artistasTracksTop = await obtenerCancionesPopularesArtista(token, artistas.artists.items[0].id)
  console.log(artistasTracksTop)
  cancionesInfArtista.innerHTML = `
    <div class="flex items-center gap-10">
      <img src="${artistas.artists.items[0].images[0].url}" alt="${artistas.artists.items[0].name}" class="rounded-lg h-40">
      <div class="flex flex-col">
        <h1 class="font-semibold text-4xl text-white">${artistas.artists.items[0].name}</h1>
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
    const artistasTracksTop = await obtenerCancionesPopularesArtista(token, id)
    cancionesInfArtista.innerHTML = `
      <div class="flex items-center gap-10">
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

  swiper.on('slideChange', updateArtistInfo)
  swiper.init()
} else {
  inicioAutorizacion()
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

// Peticiones API Spotify
async function obtenerUsuario (token) {
  const resUsuario = await fetch('https://api.spotify.com/v1/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  const usuario = await resUsuario.json()
  return usuario
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

async function obtenerPlaylist (token) {
  const resPlaylist = await fetch('https://api.spotify.com/v1/me/playlists', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  const playlist = await resPlaylist.json()
  return playlist
}

async function obtenerCancionesPlaylist (token, id) {
  const resCancionesPlaylist = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  const cancionesPlaylist = await resCancionesPlaylist.json()
  return cancionesPlaylist
}

async function obtenerAlbumes (token) {
  const resAlbumes = await fetch('https://api.spotify.com/v1/me/albums', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  const albumes = await resAlbumes.json()
  return albumes
}

async function obtenerCancionesAlbum (token, id) {
  const resCancionesAlbum = await fetch(`https://api.spotify.com/v1/albums/${id}/tracks`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  const cancionesAlbum = await resCancionesAlbum.json()
  return cancionesAlbum
}

async function informacionPista (token, id) {
  const resPista = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  const pista = await resPista.json()
  return pista
}

async function obtenerArtistas (token) {
  const resArtistas = await fetch('https://api.spotify.com/v1/me/following?type=artist', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  const artistas = await resArtistas.json()
  return artistas
}

async function obtenerCancionesPopularesArtista (token, id) {
  const resCancionesPopulares = await fetch(`https://api.spotify.com/v1/artists/${id}/top-tracks?market=ES`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  const cancionesPopulares = await resCancionesPopulares.json()
  return cancionesPopulares
}
