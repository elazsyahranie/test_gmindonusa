const express = require('express')
const Route = express.Router()
// const { authentication } = require('../../middleware/auth')

const { getAllUsers, updateUser, deleteUser } = require('./user_controller')

Route.get('/', getAllUsers)
Route.patch('/update-user/:id', updateUser)
Route.delete('/delete-user/:id', deleteUser)

module.exports = Route
