/* eslint-disable camelcase */
export async function iniciarSpotifyWebPlaybackSDK (token) {
  // eslint-disable-next-line no-undef
  const player = new Spotify.Player({
    name: 'Web Playback SDK Quick Start Player',
    getOAuthToken: cb => { cb(token) },
    volume: 1
  })

  // Error handling
  player.addListener('initialization_error', ({ message }) => { console.error(message) })
  player.addListener('authentication_error', ({ message }) => { console.error(message) })
  player.addListener('account_error', ({ message }) => { console.error(message) })
  player.addListener('playback_error', ({ message }) => { console.error(message) })

  // Playback status updates
  player.addListener('player_state_changed', state => { console.log(state) })

  // Ready
  // eslint-disable-next-line camelcase
  player.addListener('ready', ({ device_id }) => {
    console.log('Ready with Device ID', device_id)
    // reproducirCancion(token, device_id)
  })
  player.setName('SpotMix')
  // Not Ready
  player.addListener('not_ready', ({ device_id }) => {
    console.log('Device ID has gone offline', device_id)
  })

  //   document.getElementById('Play').onclick = function () {
  //     player.togglePlay()
  //   }

  // Connect to the player!
  player.connect()
}

// async function reproducirCancion (token, device_id) {
//   const IDcancion = '0Ueebi9UrB6jtIcGYal2uM'
//   await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
//     method: 'PUT',
//     headers: {
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       uris: [`spotify:track:${IDcancion}`]
//     })
//   })
// }
