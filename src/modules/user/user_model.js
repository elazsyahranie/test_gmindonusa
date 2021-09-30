const connection = require('../../config/mysql')

module.exports = {
  getDataAll: (limit, offset, sort, search) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM user WHERE user_name LIKE '%${search}%' ORDER BY ${sort} LIMIT ? OFFSET ?`,
        [limit, offset],
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  getDataCount: () => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT COUNT(*) AS total FROM user',
        (error, result) => {
          !error ? resolve(result[0].total) : reject(new Error(error))
        }
      )
    })
  },
  getUserSearchKeyword: (keyword, limit, offset) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM user WHERE user_name LIKE '%${keyword}%' LIMIT ? OFFSET ?`,
        [limit, offset],
        (error, result) => {
          console.log(result)
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  findRoom: (idOne, idTwo) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM contact WHERE contact_user_id = ${idOne} AND contact_friend_id = ${idTwo}`,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(result))
        }
      )
    })
  },
  // SELECT * FROM user JOIN balance ON user.user_id = balance.user_id WHERE user.user_id = ${id}
  findRoomList: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM room_chat JOIN user ON room_chat.friend_id = user.user_id WHERE room_chat.user_id = ${id}`,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(result))
        }
      )
    })
  },
  addContact: (data) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO contact SET ?', data, (error, result) => {
        console.log(error)
        if (!error) {
          const newResult = {
            id: result.insertId,
            ...data
          }
          resolve(newResult)
        } else {
          reject(new Error(error))
        }
      })
    })
  },
  insertRoom: (data) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO room_chat SET ?', data, (error, result) => {
        console.log(error)
        if (!error) {
          const newResult = {
            id: result.insertId,
            ...data
          }
          resolve(newResult)
        } else {
          reject(new Error(error))
        }
      })
    })
  },
  getDataConditions: (data) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM user WHERE ?', data, (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },
  getDataByCondition: (condition) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM user WHERE ?',
        condition,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  getContactData: (condition) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM contact INNER JOIN user ON contact.contact_friend_id = user.user_id WHERE ?',
        condition,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  getDataById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM user WHERE user_id = ${id}`,
        (error, result) => {
          console.log(error)
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  updateData: (setData, id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE user SET ? WHERE user_id = ${id}`,
        setData,
        (error, result) => {
          if (!error) {
            const newResult = {
              id: id,
              ...setData
            }
            resolve(newResult)
          } else {
            reject(new Error(error))
          }
        }
      )
    })
  },
  updateUserImage: (setData, id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE user SET ? WHERE ?',
        [setData, id],
        (error, result) => {
          if (!error) {
            const newResult = {
              id: id,
              ...setData
            }
            console.log(newResult)
            resolve(newResult)
          } else {
            reject(new Error(error))
          }
        }
      )
    })
  },
  updateUserPassword: (setData, id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE user SET ? WHERE user_id = ?',
        [setData, id],
        (error, result) => {
          if (!error) {
            const newResult = {
              id: result.insertId,
              ...setData
            }
            resolve(newResult)
          } else {
            reject(new Error(error))
          }
        }
      )
    })
  },
  deleteData: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'DELETE FROM user WHERE user_id = ?',
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  }
}
