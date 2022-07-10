
const { _createUser} = require("../modules/users.js");
//reqiuring bcrypt to hash the password
const bcrypt = require("bcrypt")
const db = require('../connections/connections.js');


// creating a user by sending the data and also hashing the password
  const createUser = async (req, res) => {
    data1 = req.flash("user name already used")
    let password = req.body.user_password.toString()
    let hashPassword = await bcrypt.hash(password,10)
    //inserting all the information in obj
    let obj = {user_name : req.body.user_name,
                user_password : hashPassword,
              user_address : req.body.user_address,
              user_number : req.body.user_number,
              user_email : req.body.user_email}
      _createUser(req.body.user_name)
    .then(result=>{// gettin g the data with the username
      if(result.length >= 1){ // if results is greater than 0 means the username already exists in the database
        req.flash("user","User name already exists")// showing a msg that the username exists and the database so choose another name
        res.redirect("/sign")// redirect to the same page
        console.log("already exists")
      }else{// if results is 0 than insert the data in the data base by using knex and redirect to /login
        res.redirect("/login")
        console.log("created user")
        return db('users')
        .insert(obj)
        .returning('*')
      }
    })
    .catch(err=>{
      console.log(err);
      res.status(404).json(err)
    })
    }

  
// exporting to the server.js file
  module.exports = {
    createUser
  }