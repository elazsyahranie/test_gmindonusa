const express = require('express')
require('dotenv').config()
const morgan = require('morgan')
const cors = require('cors')
const xss = require('xss-clean')
const helmet = require('helmet')
const compression = require('compression')
const bodyParser = require('body-parser')
const routerNavigation = require('./routes')
const socket = require('socket.io')

const app = express()
const port = process.env.DB_PORT

app.use(morgan('dev'))
app.use(cors())
app.options('', cors())
app.use(xss())
app.use(helmet())
app.use(compression())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use('/backend/api/v1', routerNavigation)
app.use('/backend/api', express.static('src/uploads'))

const server = require('http').createServer(app)
const io = socket(server, {
  cors: {
    origin: '*'
  },
  path: '/backend3/socket.io'
})
// globalMessage = pesan yang dikirimkan ke semua client
io.on('connection', (socket) => {
  console.log('Socket.io connect !')
  socket.on('globalMessage', (data) => {
    console.log(data)
    io.emit('chatMessage', data)
  })
  // Harus sama dengan di Frontend. 'globalMessage' ya 'globalMessage'
  // socket.on('globalMessage', (data) => {
  //   console.log(data)
  // })
})

server.listen(port, () => {
  // bagian sini ubah jadi server.listen
  console.log(`Express app is listen on port ${port} !`)
})
