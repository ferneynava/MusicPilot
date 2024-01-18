// import './style.css';
import cryptoJs from 'crypto-js'
import { nanoid } from 'nanoid'
import { iniciarSpotifyWebPlaybackSDK } from './webPlaybackSDK.js'
// import javascriptLogo from './javascript.svg'
// import viteLogo from '/vite.svg'

const clienID = '908cc6491f5448249c5348685fd2a696'
const redireccionarURI = 'http://localhost:5173/callback'

const urlParams = new URLSearchParams(window.location.search)
const code = urlParams.get('code')

if (window.location.search.includes('code')) {
  const token = await obtenerToken()
  window.onSpotifyWebPlaybackSDKReady = () => {
    iniciarSpotifyWebPlaybackSDK(token)
  }
  const tuMusica = await tusMeGusta(token)
  console.log(tuMusica)
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
  params.append('scope', 'user-read-private user-read-email user-modify-playback-state streaming playlist-read-private user-library-read')

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

async function tusMeGusta (token) {
  const tusMeGusta = await fetch('https://api.spotify.com/v1/me/tracks', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    limit: 20
  })

  const tuMusica = await tusMeGusta.json()
  return tuMusica
}
