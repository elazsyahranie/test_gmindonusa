const helper = require('../../helpers/wrapper')
const chatModel = require('./chat_model')

module.exports = {
  insertMessage: async (req, res) => {
    try {
      const { roomChat, senderId, receiverId, chatMessage } = req.body
      const setData = {
        room_chat: roomChat,
        sender_id: senderId,
        receiver_id: receiverId,
        message: chatMessage
      }
      const result = await chatModel.recordMessage(setData)
      return helper.response(res, 200, 'Chat message recorded!', result)
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad request', error)
    }
  },
  getMessages: async (req, res) => {
    try {
      const { room } = req.params
      const result = await chatModel.getChatRecords(room)
      return helper.response(res, 200, 'Get messages success!', result)
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad request', error)
    }
  }
}
