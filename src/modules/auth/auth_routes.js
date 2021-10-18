const express = require('express')
const Route = express.Router()
// const authController = require('./auth_controller')

// const { clearDataUserRedis } = require('../../middleware/redis')

const {
  getAllUser,
  register,
  login,
  refresh,
  changeUserVerification,
  updateUser,
  deleteUser
} = require('./auth_controller')

Route.get('/', getAllUser)
Route.post('/register', register)
Route.post('/refresh', refresh)
Route.post('/login', login)
Route.get('/verify-user/:userId/:token', changeUserVerification)
Route.patch('/:id', updateUser)
Route.delete('/:id', deleteUser)
module.exports = Route
