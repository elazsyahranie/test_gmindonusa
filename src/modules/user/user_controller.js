const helper = require('../../helpers/wrapper')
// const redis = require('redis')
// const client = redis.createClient()
// const bcrypt = require('bcrypt')
const userModel = require('./user_model')
// const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = {
  getAllUsers: async (req, res) => {
    try {
      const result = await userModel.getAllData()
      if (result.length > 0) {
        return helper.response(res, 200, 'Success Get All Data movie', result)
      } else {
        return helper.response(res, 404, 'Data Not Found', null)
      }
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  updateUser: async (req, res) => {
    try {
      const { id } = req.params
      const { userName, userEmail } = req.body
      const setData = {
        user_real_name: userName,
        user_email: userEmail
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
