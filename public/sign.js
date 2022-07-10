// view
let form = document.querySelector("#form")
let userName = document.querySelector("#user_name")
let password = document.querySelector("#user_password")
let address = document.querySelector("#address")
let number = document.querySelector("#phone_number")
let email = document.querySelector("#email")

//model
// function to send the data and store in the data base
let sendData = () => {
  // inserting all of the data in an object
      let obj = {user_name:userName.value,user_password:password,user_address:address.value,user_number:number.value,user_email:email.value}
    fetch("http://localhost:4000/sign",{
      method : "POST",
      headers : {"Content-Type" : "application/json"},
      body : JSON.stringify(obj)
    })
  }
  

//controller
form.addEventListener("submit", sendData)