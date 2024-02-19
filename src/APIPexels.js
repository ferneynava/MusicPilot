import dotenv from 'dotenv'
import express from 'express'
import fetch from 'node-fetch'
import cors from 'cors'

dotenv.config()

const app = express()
const port = 3000
app.use(cors())

app.get('/api/photos', async (req, res) => {
  const respuesta = await fetch('https://api.pexels.com/v1/photos/1047442', {
    method: 'GET',
    headers: {
      Authorization: process.env.PEXELS_API_KEY,
      'Content-Type': 'application/json'
    }
  })

  const data = await respuesta.json()
  res.send(data)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
