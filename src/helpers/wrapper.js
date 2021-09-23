require('dotenv').config()

module.exports = {
  response: (response, status, msg, data, pagination, another) => {
    const result = {}
    result.status = status || 200
    result.msg = msg
    result.data = data
    result.pagination = pagination
    result.another = another
    return response.status(result.status).json(result)
  }
}
