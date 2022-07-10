// reqiuring from the module.js file
const { _createOrder,
  _deleteOrder,
  _updateOrder} = require("../modules/module.js");

// this function is going to send the data to the database by using Knex to create an order
const createOrder = (req, res) => {
  _createOrder(req.body)
  .then(result=>{
    res.json(result)
  })
  .catch(err=>{
    console.log(err);
    res.status(404).json({msg:'not found'})
  })
}

// this function is going to delete the data in the database by using Knex
const deleteOrder = (req,res)=>{
  _deleteOrder(req.body.order_id)
  .then(result=>{
    res.json(result);
  })
  .catch(err=>{
    console.log(err);
    res.status(404).json({msg:'not found'})
  })
}

// this function is going to update the data in the database by using Knex
const updateOrder = (req, res) => {
  _updateOrder(req.body.user_name, req.body)
  .then(result=>{
    res.json(result)
  })
  .catch(err=>{
    console.log(err);
    res.status(404).json({msg:'not found'})
  })
}

// exporting to the routes.js file
module.exports = {createOrder,deleteOrder,updateOrder}
