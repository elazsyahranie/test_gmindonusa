const express = require('express')
const Route = express.Router()

const { login, register, changeUserVerification } = require('./auth_controller')

Route.post('/login', login)
Route.post('/register', register)
Route.get('/user-verify/:id/:token', changeUserVerification)

module.exports = Route
