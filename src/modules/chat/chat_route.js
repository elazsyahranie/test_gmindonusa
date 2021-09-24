const express = require('express')
const Route = express.Router()

const { insertMessage, getMessages } = require('./chat_controller')

Route.post('/insert-message', insertMessage)
Route.get('/get-message/:room', getMessages)
module.exports = Route
