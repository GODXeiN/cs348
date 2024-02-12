let productDetails = {};
let creditCardShown = false;

/*
* When the page is loaded, initialise the products and reset the listeners
*/
function init(){
  //initProducts takes a callback function - when the products are loaded the basket will be recalculated
  $('document').ready(function(){
    let buttons = document.getElementsByClassName("buyInput");
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("change", function () {
        try {
          basket=JSON.parse(getCookie("basket"));
        }
        catch(err) {error = 1}
        if (Object.keys(basket).length == 0){
          error = 1
        }
        console.log(buttons[i]);
        productid = this.dataset.num;
        test = this.value;
        if (test != null && productid != null) {
          basket[productid] = test;
          setCookie('basket', JSON.stringify(basket));
        }
        init();
      });
    }
  })
  initProducts(calculateBasket);
  resetListeners();
}

//When changing the page, you should make sure that each adjust button has exactly one click event
//(otherwise it might trigger multiple times)
function resetListeners(){
document.getElementById("paycreditcard").removeEventListener("click",showCreditCardPage);
document.getElementById("paycreditcard").addEventListener('click',showCreditCardPage);
}

//When the pay by credit card link is clicked, show the creditcard.html in an iframe
function showCreditCardPage(){
  if(!creditCardShown){
    var payIFrame = document.createElement("iframe");
    payIFrame.src = "creditcard.html";
    payIFrame.width = "50%";
  
    document.querySelector('#customerDetails').appendChild(payIFrame);
  }
}


/*
* Calculate the totals and show the basket
*/
function calculateBasket(inputID, newNumber){
  let total = 0;
  let basket = 0;
  let error = 0;
  let labelHTML = "";
  try {
    basket=JSON.parse(getCookie("basket"));
  }
  catch(err) {error = 1}
  if (Object.keys(basket).length == 0){
    error = 1
  }
  if (newNumber == null && inputID != null) {
  delete basket[inputID];
  setCookie('basket', JSON.stringify(basket));
  init();
  }
  if (!(error == 1 || Object.keys(basket).length == 0)) {
  for(const productID in basket) {
    labelHTML = labelHTML + "<label for=\""+productID+"\">"
  }
  labelHTML = labelHTML + "Remove"
  for(const productID in basket) {
    labelHTML = labelHTML + "</label>"
  }
  }
  if (error == 0) {
  document.querySelector('.checkoutList').innerHTML = '<tr><td><p style="font-size: 16px;">'+labelHTML+'</p></td><td colspan="1"> <p style="font-size: 16px;">Product</p></td><td><p style="font-size: 16px;">Quantity</p></td> <td><p style="font-size: 16px;">Price/unit</p</td> <td><p style="font-size: 16px;">Subtotal</p></td></tr>';
  }
  if (Object.keys(basket).length == 0) {
    document.querySelector('.checkoutList').innerHTML = '';
  }
  if (!(error == 1 || Object.keys(basket).length == 0)) {
  for(const productID in basket){
    let quantity = basket[productID];
    if (quantity == 0) {
      delete basket[productID];
      setCookie('basket', JSON.stringify(basket));
      continue;
    }
    let price = productDetails[productID].price;
    let productTotal = price * quantity;
    total = total + productTotal;
    let rowHTML = `<td style="max-width:10px;"><button id="${productID}" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="Remove product(s)" onClick="reply_click(this.id)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
  <title>Trash Bin</title></svg></button></td><td style="max-width:110px"><img src=\"images/${productDetails[productID].image}\" style="max-width:191px; max-height:175px;" alt="${productDetails[productID].name}"></img><p style="font-size: 18px;">${productDetails[productID].name}</p></td><td><p style="font-size: 16px;" id="months"><input name="quantity${productDetails[productID].name.split(" ").join("")}" id="quantity${productDetails[productID].name.split(" ").join("")}" class="buyInput" data-num="${productDetails[productID].productID}" min="0" value="${quantity}" type="number" style="width: 70%; text-align:center"></input></p></td><td><p style="font-size: 16px;">${(price / 100).toFixed(2)}</p></td><td><p style="font-size: 16px;">£${(productTotal / 100).toFixed(2)}</p</td>`;
    var thisProduct = document.createElement("tr");
    thisProduct.innerHTML = rowHTML;
    document.querySelector('.checkoutList').appendChild(thisProduct);
  }}
  let rowHTML = `<td colspan="4" style="text-align:right"><p style="font-size: 20px;">Total:</p></td><td><p style="font-size: 20px;">£${(total / 100).toFixed(2)}</p></td>`;
  if (error == 1 || Object.keys(basket).length == 0) {
    rowHTML = `<h2 style="color: red">Your basket is empty!</h2>`
  }
  var thisProduct = document.createElement("tr");
  thisProduct.innerHTML = rowHTML;
  document.querySelector('.checkoutList').appendChild(thisProduct);
}

function reply_click(clicked_id)
  {
      calculateBasket(clicked_id);
  }

window.addEventListener("load", init);