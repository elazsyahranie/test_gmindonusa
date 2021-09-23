const express = require('express')
const Route = express.Router()
const userRouter = require('../modules/user/user_routes')
const authRouter = require('../modules/auth/auth_routes')
const chatRouter = require('../modules/chat/chat_route')
const activationRouter = require('../modules/auth_activation/auth_activation_routes')

// Untuk URL di Postman
Route.use('/user', userRouter)
Route.use('/auth', authRouter)
Route.use('/chat', chatRouter)
Route.use('/activation', activationRouter)
module.exports = Route
