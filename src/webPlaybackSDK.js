/* eslint-disable no-undef */
/* eslint-disable camelcase */
let isPlaying = false
let currentTrack = null
const volumen = document.getElementById('default-range')

export async function iniciarSpotifyWebPlaybackSDK (token) {
  let device_id
  let rangeVolume

  const player = new Spotify.Player({
    name: 'Web Playback SDK Quick Start Player',
    getOAuthToken: cb => {
      cb(token)
    }
  })

  player.addListener('initialization_error', ({ message }) => { })
  player.addListener('authentication_error', ({ message }) => { })
  player.addListener('account_error', ({ message }) => { })

  player.addListener('player_state_changed', state => {
    isPlaying = !state.paused
  })

  player.addListener('ready', ({ device_id: id }) => {
    device_id = id
  })

  player.setName('SpotMix')

  player.addListener('not_ready', ({ device_id }) => {
  })

  volumen.addEventListener('input', function () {
    rangeVolume = volumen.value
    player.setVolume(rangeVolume / 100).then(() => {
    })
  })

  document.getElementById('Play').onclick = function () {
    const idCancion = localStorage.getItem('idTrack')
    if (isPlaying) {
      player.pause().then(() => {
      })
    } else {
      if (idCancion === currentTrack) {
        player.resume().then(() => {
        })
      } else {
        reproducirCancion(token, device_id, idCancion)
        currentTrack = idCancion
      }
    }
  }

  player.setName('SpotMix')
  // Not Ready
  player.addListener('not_ready', ({ device_id }) => {
  })

  player.connect()
}

async function reproducirCancion (token, device_id, idCancion) {
  isPlaying = true
  await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      uris: [`spotify:track:${idCancion}`]
    })
  })
}
