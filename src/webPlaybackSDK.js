/* eslint-disable no-undef */
/* eslint-disable camelcase */
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, onValue } from 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyDg1BblRjwqQAK7ZpJBomgAgJLLhTztOk0',
  authDomain: 'musicpilot-362fb.firebaseapp.com',
  databaseURL: 'https://musicpilot-362fb-default-rtdb.firebaseio.com',
  projectId: 'musicpilot-362fb',
  storageBucket: 'musicpilot-362fb.appspot.com',
  messagingSenderId: '763576206981',
  appId: '1:763576206981:web:1740eb78dedfcb59878bec',
  measurementId: 'G-J0MZ2MD0QP'
}

const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

let isPlaying = false
let currentTrack = null
let device_id
let cuentaPremium
let player
let globalToken = ''

const volumen = document.getElementById('default-range')
const warningCuentaPro = document.querySelector('.warningCuentaPro')
const closeWarning = document.querySelector('.closeWarning')
const playButton = document.getElementById('Play')
const pausaButton = document.getElementById('Pausa')

let playReceived = false
let initialLoad = true

const messageRef = ref(db, '/musicpilot/reproductor')
onValue(messageRef, (snapshot) => {
  if (initialLoad) {
    initialLoad = false
  } else {
    const data = snapshot.val()
    iniciarWebSocket(data)
  }
})

function iniciarWebSocket (message) {
  if (message === 'Play' && !playReceived) {
    if (!playButton.classList.contains('hidden')) {
      playButton.classList.add('hidden')
      pausaButton.classList.remove('hidden')
    }
    play(globalToken)
    playReceived = true
  } else if (message === 'Pausa' && playReceived) {
    if (!pausaButton.classList.contains('hidden')) {
      pausaButton.classList.add('hidden')
      playButton.classList.remove('hidden')
    }
    pausa()
    playReceived = false
  }
}

export async function iniciarMusicPilotWebPlaybackSDK (token) {
  globalToken = token
  let rangeVolume

  player = new Spotify.Player({
    name: 'Web Playback SDK Quick Start Player',
    getOAuthToken: cb => {
      cb(globalToken)
    }
  })

  player.addListener('initialization_error', ({ message }) => { })
  player.addListener('authentication_error', ({ message }) => { })
  player.addListener('account_error', ({ message }) => {
    cuentaPremium = true
  })
  player.addListener('playback_error', ({ message }) => { })

  player.addListener('player_state_changed', state => {
    isPlaying = !state.paused
  })

  player.addListener('ready', ({ device_id: id }) => {
    device_id = id
  })

  volumen.addEventListener('input', function () {
    rangeVolume = volumen.value
    player.setVolume(rangeVolume / 100).then(() => {
    })
  })

  document.getElementById('Play').onclick = () => {
    play(globalToken)
  }

  document.getElementById('Pausa').onclick = () => {
    pausa()
  }

  player.setName('SpotMix')
  // Not Ready
  player.addListener('not_ready', ({ device_id }) => {
  })

  player.connect()
}

function play (globalToken) {
  const idCancion = localStorage.getItem('idTrack')
  if (cuentaPremium) {
    warningCuentaPro.classList.remove('hidden')
    warningCuentaPro.classList.add('fadeIn')
  }
  if (idCancion === currentTrack) {
    player.resume().then(() => {
    })
  } else {
    reproducirCancion(globalToken, idCancion)
    currentTrack = idCancion
  }
}

function pausa () {
  if (isPlaying) {
    player.pause().then(() => {
    })
  }
}

async function reproducirCancion (globalToken, idCancion) {
  isPlaying = true
  await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${globalToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      uris: [`spotify:track:${idCancion}`]
    })
  })
}

closeWarning.addEventListener('click', () => {
  warningCuentaPro.classList.add('hidden')
})
