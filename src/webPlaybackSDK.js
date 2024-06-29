/* eslint-disable no-undef */
/* eslint-disable camelcase */
let isPlaying = false
let currentTrack = null
let device_id
let cuentaPremium
let player
let globalToken = ''

const volumen = document.getElementById('default-range')
const warningCuentaPro = document.querySelector('.warningCuentaPro')
const closeWarning = document.querySelector('.closeWarning')
const wsUrl = 'ws://192.168.43.51:300'
let websocket
let playReceived = false

function iniciarWebSocket () {
  websocket = new WebSocket(wsUrl)
  websocket.onerror = function (event) {
    console.log('No se ha podido conectar con el dispositivo. Asegúrate de que el ESP32 esté correctamente conectado a la computadora.')
  }

  websocket.onopen = (event) => {
    playReceived = false
  }

  websocket.onmessage = (event) => {
    if (event.data === 'Play' && !playReceived) {
      play(globalToken)
      playReceived = true
    } else if (event.data === 'Pausa' && playReceived) {
      play(globalToken)
      playReceived = false
    }
  }
  websocket.onclose = (event) => {
    setTimeout(() => {
      iniciarWebSocket()
    }, 5000)
    playReceived = false
  }
}

iniciarWebSocket()

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

  if (isPlaying) {
    player.pause().then(() => {
    })
  } else {
    if (idCancion === currentTrack) {
      player.resume().then(() => {
      })
    } else {
      reproducirCancion(globalToken, idCancion)
      currentTrack = idCancion
    }
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
