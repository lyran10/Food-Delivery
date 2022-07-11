// view

let btn = document.querySelector("#form")
let input = document.querySelector("#input")
let body = document.querySelector("body")
let confirmButton = document.querySelector(".btn")
let cancel = document.querySelector("#cancel")
let update = document.querySelector("#update")
let updateDiv = document.querySelector("#updateDiv")
let updateCancel = document.querySelector("#updateCancel")
let cancelConfirm = document.querySelector("#cancelConfirm")
let notCancel = document.querySelector("#notCancel")
let cancellationDiv = document.querySelector("#cancellation")
let id = document.querySelector("#id")
let burgerButton = document.querySelector(".burgerButton")
let btnContainer = document.querySelector(".btnContainer")
let confirmed = document.querySelector("#confirmed")
//---------------------------------------------------------------------------
// created out of the class so that could manipulate them out of the class
let confirmBtn = document.createElement("button")
let container = document.createElement("div")
container.classList.add("d-flex","justify-content-center","align-items-center","flex-wrap","gap-5")
container.style.marginTop = "50px"
container.style.width = "100%"
//------------------------------------------------------------------------------


let listOfItemsSelected = []// this is to store the data that of the selected items
let cardsList = []// this is to store the cards 
let count = 0// this is used to do some data manipulation
let obj = {} // object to save data
let information = [] // this is the array with the information to send to the database
let updateList = []
let obj2


//model

// function to match the patterns with values
let patternsAndSendingDataToUpdate = () => {
  //putting all the input values inside  variables
  let updateName = document.querySelector("#updateName").value
  let updateAddress = document.querySelector("#updateAddress").value
  let updateNumber = document.querySelector("#updateNumber").value
  let updateEmail = document.querySelector("#updateEmail").value

  // this are the patterns to match the inputs
  let pattern = /[A-Z]/ig
  let numberPattern = /[0-9]{3}[0-9]{3}[0-9]{4}/
  let emailPattern =  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  // this are the conditions if they dont match the patterns so what to do
  if(pattern.test(updateName) != true && updateName != ""){
    alert("Enter User Name")
  }else if(numberPattern.test(updateNumber) != true && updateNumber != ""){
    alert("Enter a proper number")
  }else if(emailPattern.test(updateEmail) != true && updateEmail != ""){
      alert("enter proper email address")
    // this condition is to check if all the inputs are empty if they are send an alert fields are empty 
  }else if(updateAddress === "" && updateNumber === "" && updateEmail === ""){
    alert("Fields are empty")
  }else{
    updateDiv.classList.add("d-none") //  updateDiv disappear
let array = ["user_name","user_address","user_number","user_email"]
let userName = document.querySelector("#userName")
let updatedInfo = [userName.innerHTML,updateAddress,updateNumber,updateEmail]
let sliced = updatedInfo.reduce((acc,cur,index) => {
  if(cur != ""){
    return {...acc,[array[index]]: cur}
  }
  return acc
},{})
console.log(sliced)
// using fetch to send the data and update it
fetch("http://localhost:4000/api/update",{
    method:'PUT',
    headers: {
      'Content-Type':'application/json',
    },
    body: JSON.stringify(sliced)
    })
    .then(data => {
      data.json()
      alert("updated")
    })
    .catch(err => {
      console.log(err)
    })
  }
}


//function to get the data 
let getData = async () => {
  let dish = input.value.trim().toLowerCase()// created a variable to of the the value input to fetch what kind of sdish the user wants
  try {
    let response = await fetch(`https://api.spoonacular.com/food/menuItems/search?query=${dish}&number=25&apiKey=84a042c14d2b43c8a6aaa4e65e8435ca`)
   let data = await response.json(); // wait for th response
   return data;// return response
  } catch (error) {
    alert("Dish not found")// if any error alert dish not found
    console.log(error)
  }

}


// function to send the data to the database
let sendData = (data) => {
  fetch("http://localhost:4000/api/data",{
    method:"POST",
    headers:{
      'Content-Type':'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(data => {
    console.log(data);
  })
  .catch(err => {
    alert("please try again")
    console.log(err);
  })
}


// class to create instance manipulate the data
class order{
  constructor(img,title,restaurent,price){
    this.img = img
    this.title = title
    this.restaurent = restaurent
    this.price = price
  }


// method to make the card in which the information will be about the dish
  makeCard (){
    // if the cardlist is 25 then remove all the card and put new once if the user clikcs again
    if(cardsList.length === 25){
      cardsList.forEach(ele => ele.remove())
      cardsList.length = 0
    }
    // create card
    let div = document.createElement("div")
    div.classList.add("card")
    div.style.width = "25rem"
    div.style.height = "25rem"

    // img
    let img = document.createElement("img")
    img.src = this.img
    img.style.height = "15rem"
    div.append(img)

    // ul
    let ul = document.createElement("ul")
    ul.classList.add("d-flex","flex-column","justify-content-center","align-items-center")

    // li
    let li = document.createElement("li")
    li.innerHTML = `${this.title}`
    li.classList.add("title")
    let li3 = document.createElement("li")
    li3.classList.add("restaurent")
    li3.innerHTML = `By ${this.restaurent} Restaurent`
    let li1 = document.createElement("li")
    li1.classList.add("price")
    li1.innerHTML = `${this.price}$`

    // button for cart
    this.addToCartButton = document.createElement("button")
    this.addToCartButton.classList.add("btn1","btn-dark","bg-danger")
    this.addToCartButton.innerHTML = "Add to cart"
    this.addToCartButton.style.padding = "15px"
    this.addToCartButton.style.borderRadius = "5px"

    // appending
    ul.append(li,li3,li1)
    div.append(ul,this.addToCartButton)
    container.append(div)
    body.append(container)
    cardsList.push(div)

    // crearing object with arrays to manipulate the data
    let keys = ["btnList","title","price"]
    let values = [".btn1",".title",".price"]

    //creating object with reduce
  let data = keys.reduce((cur,pre,index) => {
  return {...cur,[keys[index]]:[...document.querySelectorAll(values[index])]}
},{})

// calling the add to cart function
  this.addToCart(data.btnList,data.title,data.price)
  }

// this function is to add the items selected by the user in the array created globally
  addToCart(btnList,title,price){

    btnList.forEach((ele,index) => {// looping through the buttons
        ele.addEventListener("click", () => { // adding a click listener on the button clicked
          if (count === 0){// this is used so that it will store the data only once. If count is equla to 0 than only it will insert the data

            obj = {title : title[index].innerHTML,// creating an object
            price : price[index].innerHTML}

            listOfItemsSelected.push(obj)// pushing it in the array to manipulate it later
            
            count++// adding count with one so that it will not enter in the next loop
            console.log(listOfItemsSelected)
            alert(`${listOfItemsSelected.length} items added to the cart`)// msg that is is added

            }else if(count === cardsList.length){// it will loop until the length of the buttonlist. so once it reaches it will make count 0 agai for next loop. index is used for which button is click the loop will start from there so it will  minus it with the index and it will start from there
                count = 0

            }else{// it will keep on increasing the count until it is equal to the cardsList.length-index
              count++
              console.log(count)
            }
          })
        })
  }

// this function is to show the confirmation div of the order
  static confirmation () {
  // this is the order id of the order. it is a random number
  let orderId = Math.floor(Math.random() * 1000) + 1000
  // creating a confirmation div and styling it
      this.confirmdiv = document.createElement("section")
      this.confirmdiv.classList.add("confirmdiv","d-flex","justify-content-center","align-items-center")

      // creating another div which will be in side the confirmation div and styling it
      let confirmorder = document.createElement("div")
      confirmorder.classList.add("confirmorder","d-flex","justify-content-center","align-items-center","flex-column")

      // creating an header for the confirmation div and giving it the orderid as the innerhtml
      let h2 = document.createElement("h2")
      h2.innerHTML = "Order Confirmation"
      let ul = document.createElement("ul")
       let li = document.createElement("li")
       ul.append(li)

      // listOfItemsSelected is the array where all the items chosen by the user are stored
      if(listOfItemsSelected.length > 1) {
        let string = ""
        let price = 0
        let li = document.createElement("li")// created two li
        let li1 = document.createElement("li")
        // if listOfItemsSelected is greater than one this for each is manipulating the data how to display it on the confirmation div
        listOfItemsSelected.forEach(ele => {
          string = string + ele.title + "/"// adding the title to the string with a slash so both the titles should not be together
          let filtered = ele.price.split("").filter(ele => ele != "$").join("")// remove the dollar sign so that can make it a number
          price = price + parseInt(filtered)//adding all the prices inside the price variable
        })

          let string1 = string.split("")//splitting the string
          string1[string1.length-1] === "/" ? string1.pop() : console.log("not equal to /")// if the last element is / than remove it with a pop method
          li.innerHTML = `Items : ${string1.join("")}`// join it and put it in the l
          li1.innerHTML = `Total price : ${price}$`//same with price
          ul.append(li,li1)// append both in the ul
          information.push(["order_id",orderId],["user_id",parseInt(id.innerHTML)],["item_name",string1.join("")],["price", ParseInt(price)])


          // if listOfItemsSelected is not greater than one, than do this
      }else{
        console.log(listOfItemsSelected[0])
        information.push(["order_id",orderId],["user_id",parseInt(id.innerHTML)],["item_name",listOfItemsSelected[0].title],["price",
        parseInt(listOfItemsSelected[0].price)])// pushing it in the information array so that can send it to the database

        information.forEach((ele,index) => {
          if(index === 0){
          let li = document.createElement("li")// putting the data inside an li
           li.innerHTML = `${information[index][0]} : ${information[index][1]}`
            ul.append(li)// appending it inside ul
          }
        })

        let keyValue = Object.entries(listOfItemsSelected[0]) 
        keyValue.forEach((ele,index) => {
          let li = document.createElement("li")
          li.innerHTML = `${ele[0]} : ${ele[1]}`
          ul.append(li)
        })
      }

      //creating buttons inside the confirmation div 
      let divBtn = document.createElement("div")
      divBtn.style.marginTop = "20px"
      divBtn.classList.add("d-flex","gap-5")
      confirmBtn.innerHTML = "Confirm"
      confirmBtn.classList.add("btn","btn-danger")
      this.cancelBtn = document.createElement("button")
      this.cancelBtn.innerHTML = "Cancel"
      this.cancelBtn.classList.add("btn","btn-danger")
      this.cancelBtn.style.padding = "10px 10px 10px 10px"
      divBtn.append(confirmBtn,this.cancelBtn)
      confirmorder.append(h2,ul,divBtn)
      this.confirmdiv.append(confirmorder)
      body.append(this.confirmdiv)

      this.confirmOrder()
}


// method to remove the confirmation div
static cancelbtn(){
// if clicked on cencelBtn than remove confirmdiv
this.cancelBtn.addEventListener("click", () => {
  this.confirmdiv.remove()
  listOfItemsSelected.length = 0// make the listOfItemsSelected.length to 0 for another order
  information.length = 0 // also make information.length to 0 for new data
})
}

// method to confirm the order
static confirmOrder(){
  console.log(information)
  //if clicked on confirmBtn send data to the databse
    confirmBtn.addEventListener("click", () => {
    this.confirmdiv.remove()// remove confirmdiv
    listOfItemsSelected.length = 0
    obj2 = information.reduce((acc,cur) => {// using reduce to put the data in an object 
      return {...acc,[cur[0]]:cur[1]}
  },{})
  console.log(obj2)
      try {
        if(information.length > 1){
          sendData(obj2)// sending data
        update.classList.remove("d-none")// showing the update button
        confirmed.classList.remove("d-none")// showing the update button
        setTimeout(() => {
          confirmed.classList.add("d-none")
        },2000)
        information.length = 0
        }
      } catch (error) {
        console.log("Not able to send the data")
        alert("please try again")
      }
  })
}
}


//controllers

let obj1 // created globally to be used out of the function
let price // created globally to be used out of the function

btn.addEventListener("submit", (e) => {//this button is to fetch the data with fetch GET request and then mapulation of it.
  let loading = document.querySelector("#loading")
  e.preventDefault() // prevent the refresh

  loading.classList.remove("d-none")
  setTimeout(() => {
    loading.classList.add("d-none")
  },1000)
  getData().then( data => { 
    data.menuItems.forEach(ele => {
      //getting the data and putting it in a class instance and making the card
    price = Math.floor(Math.random() * 31) + 50
    obj1 = new order(ele.image,ele.title,ele.restaurantChain,price)
    obj1.makeCard()
  })
  }).catch(err => {
    alert("dish not found")
    console.logg(err)
  })
})

// this button is for the confirmation of the order he will se all the information and confirm it
confirmButton.addEventListener("click", () => {
if(listOfItemsSelected.length === 0){// if listOfItemsSelected is empty means there is nothing is no item in the array
    alert("Nothing in the cart")
  }else{
    getData().then( data => {// manipulating the fetched data
      // obj1 = new order(data.image,data.title,data.restaurantChain,price)
      order.confirmation()
      order.cancelbtn()
    })
    .catch(() => {
      alert("please try again")
      console.log("something went wrong while confirmation")
    })
  }
})


// this button is to delete the order buy users request
cancel.addEventListener("click",() => {
  cancellationDiv.classList.remove("d-none")
})

// this is used to confirm the cancellation of the order
cancelConfirm.addEventListener("click",() => {
  cancellationDiv.classList.add("d-none")// show the cancellationDiv 
  let cancelOrder = document.querySelector("#cancelOrder")
  fetch("http://localhost:4000/api/cancel",{
    method:'DELETE',
    headers: {
      'Content-Type':'application/json',
    },
    body: JSON.stringify({order_id:cancelOrder.value})
    })
    .then(data => {
      data.json()
      alert("cancelled")
    })
    .catch(err => {
      alert("please try again")
      console.log(err)
    })
})

// remove the cancellation div
notCancel.addEventListener("click", () => {
  cancellationDiv.classList.add("d-none")
})

// if this is clicked it will show the update div
update.addEventListener("click", () => {
  updateDiv.classList.remove("d-none")
})

// this function is to get the new values and send it to the database
let updateConfirm = document.querySelector("#updateConfirm")
updateConfirm.addEventListener("click",()=> {

// calling the function
patternsAndSendingDataToUpdate()

})

// if not to update just remove the update div 
updateCancel.addEventListener("click", () => {
  updateDiv.classList.add("d-none")
})


// menu button 
burgerButton.addEventListener("click",() => {
    btnContainer.classList.toggle("d-none")
    updateDiv.classList.add("d-none")
    cancellationDiv.classList.add("d-none")
})

