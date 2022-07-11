// variable to store the data and use in order.ejs
let data
//reqiuring all th dependencies
const { _createUser} = require("./modules/users.js");
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const flash = require("express-flash")
const session = require("express-session")
const bodyParser = require("body-parser")
const router = require("./routes/routes.js")
// const {createUser} = require('./controllers/users.js');
const db = require('./connections/connections.js');
const passport = require('passport');
const localStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt")
const methodOverride = require("method-override")
const port = process.env.PORT

dotenv.config();
 
// instance of express
const app = express()

// view engine to the folders and ejs files
app.set('view engine','ejs')
app.set('views','public/pages')

// using the use middleware to access all the libraries
app.use('/', express.static(__dirname+'/public'));
app.use('/', express.static(__dirname+'/public/pages'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());
app.use('/api',router);
app.use(flash())
app.use(methodOverride("_method"))

app.use(session({
  secret : "secret",
  resave : false,
  saveUninitialized : false,
}))

// using passport library for authentication and session also
app.use(passport.initialize())
app.use(passport.session())

//creating new strategy so that can be used in the passport.authenticate
passport.use(new localStrategy(
  // //getting the data from the database and comparing it with username and password which was sent by the client
  function(username, password, done) {
      db("users")
      .where({user_name : username})
      .then(user => {
        data = user
        if(user.length === 0){// if user.length is 0 means there is no such username in the data base so it will return a msg "User does not exist"
          console.log("user does not exist")
          return done(null,false,{message : "User does not exist"})
        }else{
          console.log("user exist")
        }

        if(bcrypt.compareSync(password,user[0].user_password)){/// if password matches so it will continue with the done function and redirect to another page
          console.log("password")
          return done(null,user[0])
        }else{// if does not match it will send a msg "Invalid password"
          return done(null,false,{message : "Invalid password"})
        }

      })
      
    }
  
))

// serializeUser is used to create an id for the user 
passport.serializeUser(function (user,done){
  console.log("user serialize")
  done(null,user.user_id)
})

// deserializeUser is used to 
passport.deserializeUser((user,done) => {
  console.log("user deserialize")
   db('users')
  .where({user_id: user})
  .then(([user]) => {
    if (!user) { done(new Error('User not found!'))}
    done(null, user)    
  })
})

// passport.authenticate will run the strategy that is created 
app.post('/login',checkNotAuthenticated,passport.authenticate("local", {
  failureRedirect : "/login",// if failed it will redirect to the same page
  successRedirect : "/dash",// if success it will redirect to the Dashboard
  failureFlash : true},// this is used for the msgs to show the client if username or password is incorrect (true means there is an error)
 ),() => { console.log("logged In")})// if success console.log logged In 

 // this api is used to logout of the page and redirect it to the login page
 app.delete("/logout", (req,res) => {
  req.logOut(() => {// this is a inbuild function of passport which takes a call back function
   console.log("logged Out")
  })
  res.redirect("/login")
 })

// api to render to the order.ejs file and giving it an object which will be used in the file, checkAuthenticated is used to check if the user is still Authenticated if he is it will continue if not it will redirect him to the login page
app.get("/dash",checkAuthenticated, (req, res) => {
  res.render('dash',{info1:data}) 
})

// api to render to the sign.ejs file and to check if he is authenticated, if he is it will redirect him to the /dash
app.get("/sign", checkNotAuthenticated,(req, res) => {
  let userName = req.flash("user")
  res.render('sign',{userName})
})


// using a post method create a user and send it to the database with this api
// createUser function in controllers/users.js'
app.post("/sign",checkNotAuthenticated, async (req,res) => {
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

})


// api to render to the index file if he is authenticated, if he is it will redirect him to the /dash
app.get('/login', checkNotAuthenticated,(req, res) => {
    res.render('index') 
})


//  functions to check if the user is still authenticated or not
function checkAuthenticated(req,res,next){
  if(req.isAuthenticated()){ // isAuthenticated() is a inbuild function in passport library
    return next() // nect is used to continue with the process
  }
  res.redirect("/login")// if not authenticated redirect to the /login
}

function checkNotAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return res.redirect("/dash") // if authenticated redirect to the /dash
  }
  next()
}

// server running on 4000
app.listen(port, () => {
  console.log(`listening to ${port}`)
})
