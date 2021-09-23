const connection = require('../../config/mysql')

module.exports = {
  recordMessage: (data) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO chat SET ?', data, (error, result) => {
        console.log(error)
        if (!error) {
          const newResult = {
            id: result.insertId,
            ...data
          }
          resolve(newResult)
        } else {
          reject(new Error(result))
        }
      })
    })
  },
  getChatRecords: (condition) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM chat WHERE ?',
        condition,
        (error, result) => {
          console.log(result)
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  }
}
