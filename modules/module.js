//reqiuring the database connection
let db = require("../connections/connections.js")

// inserting the data in the database
const _createOrder = (data) => {
  return db('orders')
  .insert(data)
  .returning('*')
}

// delete from the database
const _deleteOrder = (id) => {
  return db('orders')
  .del()
  .where({order_id:id})
  .returning('*')
}

// update the database
const _updateOrder = (name,data) => {
  return db('users')
  .update(data)
  .where({user_name: name})
  .returning('*')
}

// exporting the functions to the controller.js
module.exports = {_createOrder,_deleteOrder,_updateOrder}

