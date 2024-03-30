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
const enterBuscador = document.querySelector('#idBuscador')

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
        <div class="grid grid-cols-3 items-center justify-between cursor-pointer hover:text-[#1ED760]" onclick="tracksplaylist('${element.track.artists[0].id}', '${element.track.name.replace(/'/g, "\\'")}')">
          
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
        <div class="grid grid-cols-2 items-center justify-between cursor-pointer hover:text-[#1ED760] " onclick="tracksplaylist('${element.artists[0].id}', '${element.name.replace(/'/g, "\\'")}')">
          
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
        <div class="grid grid-cols-1 items-center justify-between cursor-pointer hover:text-[#1ED760] " onclick="tracksplaylist('${element.artists[0].id}', '${element.name.replace(/'/g, "\\'")}')">
          
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
    const dataAPIupdateArtis = await datosAPI(token, artistId, undefined, undefined, undefined, undefined).then(([data, urlsLength]) => {
      const datos = data.then(data => {
        return [data, urlsLength]
      })
      return datos
    })
    const longitudURL = dataAPIupdateArtis[1]
    const infoArt = dataAPIupdateArtis[0][longitudURL - 1]
    infoArtista.innerHTML = `
            <div class="containerInfo z-10 grid justify-center items-center p-5">
              <div class="flex gap-4">
                <img src="${usuarios.images[0].url}" alt="${usuarios.display_name}" class="w-8 h-8 rounded-lg">
                <h1 class="font-semibold text-2xl">${usuarios.display_name} 💙</h1>
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

        const dataAPIupdateArtis = await datosAPI(token, idArtistaSelect, undefined, undefined, undefined, undefined).then(([data, urlsLength]) => {
          const datos = data.then(data => {
            return [data, urlsLength]
          })
          return datos
        })
        const longitudURL = dataAPIupdateArtis[1]
        const infoArtClick = dataAPIupdateArtis[0][longitudURL - 1]

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
                <img src="${usuarios.images[0].url}" alt="${usuarios.display_name}" class="w-8 h-8 rounded-lg">
                <h1 class="font-semibold text-2xl">${usuarios.display_name} 💙</h1>
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

  const dataAPIupdateArtis = await datosAPI(token, tuMusica.items[0].artists[0].id, undefined, undefined, undefined, undefined).then(([data, urlsLength]) => {
    const datos = data.then(data => {
      return [data, urlsLength]
    })
    return datos
  })
  const longitudURL = dataAPIupdateArtis[1]
  const infoArt = dataAPIupdateArtis[0][longitudURL - 1]

  infoFooterArtista.innerHTML = `
      <div class="flex flex-row items-center">
        <img src="${infoArt.images[2].url}" alt="${infoArt.name}" class="w-14 h-14 rounded-lg">
          <div class="flex flex-col gap-y-2 items-center justify-center">
            <h1 class="font-semibold text-xs ml-4">${tuMusica.items[0].name}</h1>
            <h1 class="font-semibold text-lg ml-4">${infoArt.name}</h1>
          </div>
      </div>
    `

  misPlaylists.innerHTML = `
  <h1 class="text-lg font-semibold text-white py-6 ">💙 Mis Playlist ${usuarios.display_name}</h1>
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

  const dataAPIcancionesPlay = await datosAPI(token, undefined, playlist.items[0].id, undefined, undefined, undefined).then(([data, urlsLength]) => {
    const datos = data.then(data => {
      return [data, urlsLength]
    })
    return datos
  })
  const longitudURLs = dataAPIcancionesPlay[1]
  const cancionesPlaylist = dataAPIcancionesPlay[0][longitudURLs - 1]

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
    const dataAPIcancionesPlay = await datosAPI(token, undefined, id, undefined, undefined, undefined).then(([data, urlsLength]) => {
      const datos = data.then(data => {
        return [data, urlsLength]
      })
      return datos
    })
    const longitudURLs = dataAPIcancionesPlay[1]
    const cancionesPlaylist = dataAPIcancionesPlay[0][longitudURLs - 1]

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
    const dataAPIupdateArtis = await datosAPI(token, id, undefined, undefined, undefined, undefined).then(([data, urlsLength]) => {
      const datos = data.then(data => {
        return [data, urlsLength]
      })
      return datos
    })
    const longitudURLs = dataAPIupdateArtis[1]
    const infoArt = dataAPIupdateArtis[0][longitudURLs - 1]

    infoFooterArtista.innerHTML = `
      <div class="flex flex-row items-center">
        <img src="${infoArt.images[2].url}" alt="${infoArt.name}" class="w-14 h-14 rounded-lg">
        <div class="flex flex-col gap-y-2 items-center justify-center">
            <h1 class="font-semibold text-xs ml-4">${namePlaylist}</h1>
            <h1 class="font-semibold text-lg ml-4">${infoArt.name}</h1>
          </div>
      </div>
      `
  }

  misAlbumes.innerHTML = `
    <h1 class="text-lg font-semibold text-white py-6 ">💙 Mis Albumes ${usuarios.display_name}</h1>
    <div class="grid gap-5 p-5 overflow-y-scroll">
      ${Albumes.items.map((element) => `
        <div class=" grid grid-cols-2 cursor-pointer items-center hover:text-[#1ED760] " onclick="handleClickAlbumes('${element.album.id}', '${element.album.images[0].url}', '${element.album.name}', '${element.album.artists[0].name}')">
        <img src="${element.album.images[0].url}" alt="${element.album.name}" class="rounded-lg h-20 place-self-center">
        <h1 class="font-semibold text-base justify-self-start text-start">${element.album.name}</h1>
        </div>
      `).join('')
    }
    </div>
  `

  const idAlbum = Albumes.items[0].album.id

  const dataAPICancionesAlbumes = await datosAPI(token, undefined, undefined, idAlbum, undefined, undefined).then(([data, urlsLength]) => {
    const datos = data.then(data => {
      return [data, urlsLength]
    })
    return datos
  })
  const longitudURLss = dataAPICancionesAlbumes[1]
  const cancionesAlbum = dataAPICancionesAlbumes[0][longitudURLss - 1]
  const dataAPICancionesArtAlbum = await datosAPI(token, undefined, undefined, undefined, cancionesAlbum.items[0].id, undefined).then(([data, urlsLength]) => {
    const datos = data.then(data => {
      return [data, urlsLength]
    })
    return datos
  })
  const longitudURLsss = dataAPICancionesArtAlbum[1]

  const infoArtAlbum = dataAPICancionesArtAlbum[0][longitudURLsss - 1]

  cancionesInfAlbum.innerHTML = `  
  <div class="flex items-center gap-10">
    <img src="${Albumes.items[0].album.images[0].url}" alt="${Albumes.items[0].album.name}" class="rounded-lg h-40">
    <div class="flex flex-col">
      <h1 class="font-semibold text-4xl text-white">${Albumes.items[0].album.name}</h1>
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
    const dataAPICancionesAlbumes = await datosAPI(token, undefined, undefined, id, undefined, undefined).then(([data, urlsLength]) => {
      const datos = data.then(data => {
        return [data, urlsLength]
      })
      return datos
    })
    const longitudURLss = dataAPICancionesAlbumes[1]
    const cancionesAlbum = dataAPICancionesAlbumes[0][longitudURLss - 1]
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

  misArtistas.innerHTML = `
    <h1 class="text-lg font-semibold text-white py-6 ">💙 Mis Artistas ${usuarios.display_name}</h1>
    <div class="grid gap-5 p-5 overflow-y-scroll">
      ${Artistas.artists.items.map((element) => `
        <div class="grid grid-cols-2 cursor-pointer items-center hover:text-[#1ED760] " onclick="handleClickArtistas('${element.id}', '${element.images[0].url}', '${element.name.replace(/'/g, "\\'")}')">
          <img src="${element.images[0].url}" alt="${element.name}" class="rounded-lg h-20 place-self-center">
          <h1 class="font-semibold text-base justify-self-start text-start">${element.name}</h1>
        </div>
      `).join('')
    }
    </div>
  `

  const dataAPICancionesPopularesArtista = await datosAPI(token, undefined, undefined, undefined, undefined, Artistas.artists.items[0].id).then(([data, urlsLength]) => {
    const datos = data.then(data => {
      return [data, urlsLength]
    })
    return datos
  })
  const longitudURLssss = dataAPICancionesPopularesArtista[1]

  const artistasTracksTop = dataAPICancionesPopularesArtista[0][longitudURLssss - 1]

  cancionesInfArtista.innerHTML = `
    <div class="flex items-center gap-10">
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
    const dataAPICancionesPopularesArtista = await datosAPI(token, undefined, undefined, undefined, undefined, id).then(([data, urlsLength]) => {
      const datos = data.then(data => {
        return [data, urlsLength]
      })
      return datos
    })
    const longitudURLssss = dataAPICancionesPopularesArtista[1]
    const artistasTracksTop = dataAPICancionesPopularesArtista[0][longitudURLssss - 1]

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

  enterBuscador.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      // Aquí va el código que se ejecutará cuando se presione Enter
      console.log('Enter fue presionado')
    }
  })

  swiper.on('slideChange', updateArtistInfo)
  swiper.init()
} else {
  inicioAutorizacion()
}

document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault()
})

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

// Funcion para obtener datos de la API de Spotify

async function datosAPI (token, id, idPlaylist, idAlbum, idPista, idPopularesArtista) {
  const urls = ['https://api.spotify.com/v1/me', 'https://api.spotify.com/v1/me/top/tracks?limit=50', 'https://api.spotify.com/v1/me/playlists', 'https://api.spotify.com/v1/me/albums', 'https://api.spotify.com/v1/me/following?type=artist']

  const idToUrl = {
    id: id && `https://api.spotify.com/v1/artists/${id}`,
    idPlaylist: idPlaylist && `https://api.spotify.com/v1/playlists/${idPlaylist}/tracks`,
    idAlbum: idAlbum && `https://api.spotify.com/v1/albums/${idAlbum}/tracks`,
    idPista: idPista && `https://api.spotify.com/v1/tracks/${idPista}`,
    idPopularesArtista: idPopularesArtista && `https://api.spotify.com/v1/artists/${idPopularesArtista}/top-tracks?market=ES`
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
