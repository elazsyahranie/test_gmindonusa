const express = require('express')
const Route = express.Router()
// const authController = require('./auth_controller')

// const { clearDataUserRedis } = require('../../middleware/redis')

const {
  getAllUser,
  register,
  login,
  createRoom,
  changeUserVerification,
  updateUser,
  deleteUser
} = require('./auth_controller')

Route.get('/', getAllUser)
Route.post('/register', register)
Route.post('/login', login)
Route.post('/create-room', createRoom)
Route.get('/verify-user/:token', changeUserVerification)
Route.patch('/:id', updateUser)
Route.delete('/:id', deleteUser)
module.exports = Route
