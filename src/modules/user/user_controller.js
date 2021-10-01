/* eslint-disable no-unneeded-ternary */
const helper = require('../../helpers/wrapper')
const helperUser = require('../../helpers/wrapperUser')
const bcrypt = require('bcrypt')
const redis = require('redis')
const client = redis.createClient()
const userModel = require('./user_model')
require('dotenv').config()
const jwt = require('jsonwebtoken')

module.exports = {
  getAllUser: async (req, res) => {
    try {
      let { page, limit, sort, search } = req.query
      page = page ? parseInt(page) : 1
      limit = limit ? parseInt(limit) : 5
      sort = sort ? sort : 'user_id ASC'
      search = search ? search : ''
      const totalData = await userModel.getDataCount()
      // console.log('Total Data: ' + totalData)
      const totalPage = Math.ceil(totalData / limit)
      // console.log('Total Page: ' + totalPage)
      const offset = page * limit - limit
      // console.log('offset' + offset)
      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData
      }
      const result = await userModel.getDataAll(limit, offset, sort, search)
      console.log(result.length)
      return helper.response(res, 200, 'Success Get Data', result, pageInfo)
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  getUserbyId: async (req, res) => {
    try {
      const { id } = req.params
      const result = await userModel.getDataByCondition({ user_id: id })
      return helperUser.response(
        res,
        200,
        `Success get data by ID ${id}`,
        result[0]
      )
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  getUsernameSearchKeyword: async (req, res) => {
    try {
      const { keyword } = req.query
      let { page, limit, sort } = req.query

      page = page ? parseInt(page) : 1
      limit = limit ? parseInt(limit) : 5
      sort = sort ? sort : 'user_name ASC'

      const totalData = await userModel.getDataCount()
      console.log('Total Data: ' + totalData)
      const totalPage = Math.ceil(totalData / limit)
      console.log('Total Page: ' + totalPage)
      const offset = page * limit - limit
      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData
      }
      const result = await userModel.getUserSearchKeyword(
        keyword,
        limit,
        offset,
        sort
      )
      return helper.response(
        res,
        200,
        'Success Find Username By Keyword',
        result,
        pageInfo
      )
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  createRoom: async (req, res) => {
    try {
      const { userId, friendId } = req.body
      const generateNumber = Math.floor(Math.random() * 20)
      const multiplyIDNumbers = userId * friendId
      const roomChat = generateNumber + multiplyIDNumbers
      console.log(generateNumber)
      console.log(multiplyIDNumbers)
      console.log(`${generateNumber} + ${multiplyIDNumbers} = ${roomChat}`)
      const setData = {
        room_chat: roomChat,
        user_id: userId,
        friend_id: friendId
      }
      const setData2 = {
        room_chat: roomChat,
        user_id: friendId,
        friend_id: userId
      }
      const result = await userModel.insertRoom(setData)
      const result2 = await userModel.insertRoom(setData2)
      return helper.response(
        res,
        200,
        'Successfuly make room chat!',
        result,
        result2
      )
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  getRoomList: async (req, res) => {
    try {
      const { id } = req.params
      const result = await userModel.findRoomList(id)
      return helper.response(res, 200, 'Succesfully get list of rooms!', result)
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad request', error)
    }
  },
  addFriend: async (req, res) => {
    try {
      const { contactUserId, contactFriendId } = req.body
      const setData = {
        contact_user_id: contactUserId,
        contact_friend_id: contactFriendId
      }
      const result = await userModel.addContact(setData)
      if (result) {
        const generateNumber = Math.floor(Math.random() * 20)
        const multiplyIDNumbers = contactUserId * contactFriendId
        const roomChat = generateNumber + multiplyIDNumbers
        console.log(generateNumber)
        console.log(multiplyIDNumbers)
        console.log(`${generateNumber} + ${multiplyIDNumbers} = ${roomChat}`)
        return helper.response(res, 200, 'Succesuly add friend', result)
      } else {
        return helper.response(res, 400, "There's something's wrong!")
      }
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  getContacts: async (req, res) => {
    try {
      const { id } = req.params
      const result = await userModel.getContactData({ contact_user_id: id })
      if (result.length > 0) {
        client.setex(`getcontacts:${id}`, 3600, JSON.stringify(result))
        return helper.response(res, 200, 'Succes get contacts data', result)
      } else {
        return helper.response(res, 404, 'Contacts data not found!', result)
      }
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  getContactPagination: async (req, res) => {
    try {
      let { page, limit, sort, search } = req.query

      page = page ? parseInt(page) : 1
      limit = limit ? parseInt(limit) : 5
      sort = sort ? sort : 'movie_id ASC'
      search = search ? search : ''

      const totalData = await userModel.getDataCount(search)
      const totalPage = Math.ceil(totalData / limit)
      const offset = page * limit - limit
      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData
      }

      const result = await userModel.getContactDataPagination(
        limit,
        offset,
        sort,
        search
      )
      console.log(limit, offset)
      return helper.response(
        res,
        200,
        'Success Get Contact With Pagination',
        result,
        pageInfo
      )
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  updateUser: async (req, res) => {
    try {
      const { id } = req.params
      const { userName, userEmail, userPhone, userBio } = req.body
      const setData = {
        user_name: userName,
        user_email: userEmail,
        user_phone: userPhone,
        user_bio: userBio
      }
      console.log(setData)
      const result = await userModel.updateData(setData, id)
      return helper.response(
        res,
        200,
        `Success Update User Data By Id: ${id}`,
        result
      )
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  updateUserPassword: async (req, res) => {
    try {
      const { id } = req.params
      const { userPassword, userNewPassword } = req.body
      const checkUser = await userModel.getDataConditions({
        user_id: id
      })

      if (checkUser.length > 0) {
        if (checkUser[0].user_verification === 0) {
          return helper.response(res, 403, 'Account is not verified')
        }

        const checkPassword = bcrypt.compareSync(
          userPassword,
          checkUser[0].user_password
        )

        if (checkPassword) {
          const salt = bcrypt.genSaltSync(10)
          const encryptPassword = bcrypt.hashSync(userNewPassword, salt)
          const setData = {
            user_password: encryptPassword
          }
          const result = await userModel.updateData(setData, id)
          return helper.response(
            res,
            200,
            `Change password success! User ID - ${id}`,
            result
          )
        } else {
          return helper.response(
            res,
            400,
            'You entered the previous password wrong!'
          )
        }
      }
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  updateUserImage: async (req, res) => {
    try {
      const { id } = req.params

      const checkUserData = await userModel.getDataByCondition({
        user_id: id
      })

      const setData = {
        user_image: req.file ? req.file.filename : '',
        user_updated_at: new Date(Date.now())
      }

      console.log(setData)
      if (checkUserData.length > 0) {
        const result = await userModel.updateUserImage(setData, { user_id: id })
        return helper.response(
          res,
          200,
          `Success Update User Image By Id: ${id}`,
          result
        )
      } else {
        return helper.response(
          res,
          404,
          `User Data By Id ${id} Not Found`,
          null
        )
      }
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  changeUserVerification: async (req, res) => {
    try {
      let token = req.params.token
      let userId = ''
      let setData = {}
      console.log(`This is the token! ${token}`)
      if (/^\d+$/.test(token)) {
        userId = token
        setData = { user_verification: 1 }
      } else {
        jwt.verify(token, process.env.PRIVATE_KEY, (error, result) => {
          if (
            (error && error.name === 'JsonWebTokenError') ||
            (error && error.name === 'TokenExpiredError')
          ) {
            return helper.response(res, 403, error.message)
          } else {
            // console.log('DECODE token', result)
            token = result
          }
        })
        userId = token.userId
        setData = token.setData
      }

      if (userId && setData) {
        // console.log('Update', setData)
        const result = await userModel.updateData(setData, userId)
        return helper.response(
          res,
          200,
          'succes update data',
          Object.keys(result)
        )
      } else {
        console.log('The Bad Request was from the Email')
        return helper.response(res, 400, 'Bad Request', null)
      }
    } catch (error) {
      console.log('Nope. The Bad Request was from the request itself')
      console.log(error)
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params
      const result = await userModel.deleteData(id)
      return helper.response(res, 200, `Success Delete User ${id}`, result)
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  }
}
