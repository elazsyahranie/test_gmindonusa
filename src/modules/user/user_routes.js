const express = require('express')
const Route = express.Router()
const uploads = require('../../middleware/uploads')
const { authentication } = require('../../middleware/auth')

const {
  getUserByIdRedis,
  getUserSearchKeywordRedis,
  getContactsRedis,
  getContactsDataOnlyRedis,
  clearDataUserRedis,
  clearDataContactsRedis
} = require('../../middleware/redis')

const {
  getAllUser,
  getUsernameSearchKeyword,
  getUserbyId,
  getContacts,
  getContactsWithoutUserData,
  sendFriendRequest,
  getFriendRequestData,
  getPendingRequestData,
  confirmFriendRequest,
  getContactPagination,
  createRoom,
  getRoomList,
  changeUserVerification,
  updateUser,
  updateUserPassword,
  updateUserImage,
  deleteUser
} = require('./user_controller')

Route.get('/', authentication, getAllUser)
Route.get(
  '/keyword',
  authentication,
  getUserSearchKeywordRedis,
  getUsernameSearchKeyword
)
Route.get('/:id', authentication, getUserByIdRedis, getUserbyId)
Route.post(
  '/send-friend-request',
  authentication,
  clearDataContactsRedis,
  sendFriendRequest
)
Route.get('/friend-request/:id', authentication, getFriendRequestData)
Route.get('/pending-request/:id', authentication, getPendingRequestData)
Route.post(
  '/confirm-friend-request',
  authentication,
  clearDataUserRedis,
  clearDataContactsRedis,
  confirmFriendRequest
)
Route.get('/contact/:id', authentication, getContactsRedis, getContacts)
Route.get(
  '/contact-data-only/:id',
  authentication,
  getContactsDataOnlyRedis,
  getContactsWithoutUserData
)
Route.get('/contact-pagination/:id', authentication, getContactPagination)
Route.post(
  '/create-room',
  clearDataUserRedis,
  clearDataContactsRedis,
  createRoom
)
Route.get('/get-room-list/:id', authentication, getRoomList)
Route.get('/verify-user/:token', changeUserVerification)
Route.patch(
  '/:id',
  authentication,
  clearDataUserRedis,
  clearDataContactsRedis,
  updateUser
)
Route.patch(
  '/update-password/:id',
  clearDataUserRedis,
  clearDataContactsRedis,
  updateUserPassword
)
Route.patch(
  '/update-image/:id',
  clearDataUserRedis,
  clearDataContactsRedis,
  uploads,
  updateUserImage
)
Route.delete('/:id', clearDataUserRedis, clearDataContactsRedis, deleteUser)
module.exports = Route
