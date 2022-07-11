const db = require('../connections/connections.js');

// creating a user in the users table
const _createUser = (user) => {
  return db('users')
  .where({user_name:user})
  .returning('*')
}

// exporting the functions to the server.js
module.exports = {
  _createUser,
}
