const helper = require('../../helpers/wrapper')
const bcrypt = require('bcrypt')
const authModel = require('./auth_model')
const { sendMail } = require('../../helpers/send_email')
const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = {
  register: async (req, res) => {
    try {
      const { userRealName, userEmail, userPassword } = req.body
      const salt = bcrypt.genSaltSync(10)
      const encryptPassword = bcrypt.hashSync(userPassword, salt)

      const data = {
        user_real_name: userRealName,
        user_email: userEmail,
        user_password: encryptPassword
      }

      const checkEmailUser = await authModel.getDataByCondition({
        user_email: userEmail
      })

      console.log(checkEmailUser)

      if (checkEmailUser.length === 0) {
        const result = await authModel.register(data)
        delete result.user_password

        const token = jwt.sign({ ...data }, process.env.PRIVATE_KEY, {
          expiresIn: '30s'
        })

        const url = `http://localhost:3004/backend/api/v1/auth/user-verify/${result.id}/${token}`
        sendMail('Please activate your account', url, userEmail)

        return helper.response(
          res,
          200,
          'Succes register User Please Check your Email to Activate your Account !',
          result
        )
      } else {
        return helper.response(res, 400, 'Email has been registered')
      }
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  login: async (req, res) => {
    try {
      const { userEmail, userPassword } = req.body
      const checkEmailUser = await authModel.getDataByCondition({
        user_email: userEmail
      })

      if (checkEmailUser.length > 0) {
        // if (checkEmailUser[0].user_verification === 0) {
        //   return helper.response(res, 403, 'Account is not verified')
        // }

        const checkPassword = bcrypt.compareSync(
          userPassword,
          checkEmailUser[0].user_password
        )

        if (checkPassword) {
          const payload = checkEmailUser[0]
          delete payload.user_password
          const token = jwt.sign({ ...payload }, process.env.PRIVATE_KEY, {
            expiresIn: '24h'
          })

          const result = { ...payload, token }
          return helper.response(res, 200, 'Succes Login !', result)
        } else {
          console.log('Wrong Password')
          return helper.response(res, 400, 'Wrong password')
        }
      } else {
        console.log('Email not Registered')
        return helper.response(res, 404, 'Email not Registerd')
      }
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  changeUserVerification: async (req, res) => {
    try {
      const { userId, token } = req.params
      const setData = {
        user_verification: '1'
      }
      let verificationToken = ''
      jwt.verify(token, process.env.PRIVATE_KEY, (error) => {
        if (
          (error && error.name === 'JsonWebTokenError') ||
          (error && error.name === 'TokenExpiredError')
        ) {
          // Jika refreshToken tidak bisa  dipakai lagi
          return helper.response(res, 403, 'error_jwt_expired')
        } else {
          verificationToken = token
        }
      })
      if (verificationToken) {
        const result = await authModel.updateData(setData, userId)
        return helper.response(
          res,
          200,
          `User ${userId} have been verified!`,
          result
        )
      } else {
        console.log('Change user verification controller is NOT working!')
      }
    } catch (error) {
      console.log(error)
    }
  }
}
