// view
let count = 0
let form = document.querySelector("#form")
let userName = document.querySelector("#user_name")
let password = document.querySelector("#user_password")
let address = document.querySelector("#address")
let number = document.querySelector("#phone_number")
let email = document.querySelector("#email")
let button = document.querySelector(".btn")

//model
// function to send the data and store in the data base
let sendData = () => {
  // inserting all of the data in an object
      let obj = {user_name:userName.value,user_password:password,user_address:address.value,user_number:number.value,user_email:email.value}
    fetch("http://localhost:4000/sign",{
      headers : {"Content-Type" : "application/json"},
      body : JSON.stringify(obj)
    })
  }
  

//controller
button.addEventListener("click",sendData)