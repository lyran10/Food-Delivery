const express = require("express")
// all the function which are used to store and update or delete from thr database
const {createOrder,deleteOrder,updateOrder} = require("../controllers/controllers.js")
const router = express.Router()


//router
// using post method to create an order by using the createOrder function
router.post('/data', createOrder)
// using delete method to delete an order by using the deleteOrder function
router.delete('/cancel',deleteOrder);
// using put method to upadate an order by using the updateOrder function
router.put('/update',updateOrder);

//exporting the router
module.exports = router