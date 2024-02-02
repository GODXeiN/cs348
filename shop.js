let productDetails = {};
let searchStr = "";
let basket = {};
//Each product is based on a 'card'; a box that contains information about that product.
//You can change the card template here. The [EVEGPRODUCT#] will always be subsituted for 
//the element in the imagesArr (see fruit.js)
//The classes can be styled using CSS
//The adjustDown and adjustUp buttons have their behaviour specified below, but you can change this if you like
//To change the quantity of a product, change the value of the input (with the class of buyInput), you can then recalculate the basket with refreshBasket()
//Or you can adjust the basket object via javascript and call updateQuantityInputs() and refreshBasket()

var cardTemplate = `<div class="card-deck">
<div class="shop-product card" data-num="[EVEGPRODUCT#]">
<div class="card__content" data-num="[EVEGPRODUCT#]">
<div class="shop-product-details bg-primary shop-product-img" data-field="img" data-num="[EVEGPRODUCT#]" style="border-radius: 5px;"></div>
<div class="card-body">
<div class="shop-product-details shop-product-title card__title list-group-item" data-field="title" data-num="[EVEGPRODUCT#]"></div>
</div>
<ul style="list-style-type: none;" class="list-group list-group-flush">
<li style="list-style-type: none;" class="list-group-item shop-product-details shop-product-price" data-field="price" data-num="[EVEGPRODUCT#]"></li>
<li style="list-style-type: none;" class="list-group-item shop-product-details shop-product-units" data-field="units" data-num="[EVEGPRODUCT#]"></li>
<li style="list-style-type: none;" class="shop-product-buying" data-num="[EVEGPRODUCT#]"></li>
<li class="adjustDiv center-block list-group-item"><button class="btn adjustDown btn btn-primary">-</button>
<input class="buyInput" data-num="[EVEGPRODUCT#]" min="0" value="0" type="number" style="width: 70%">
<button class="btn adjustUp btn btn-primary">+</button></li>
<li style="list-style-type: none;" class="list-group-item productBasketDiv"><button class="addToBasket btn btn-primary center-block"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-basket" viewBox="0 0 16 16">
<path d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1v4.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 13.5V9a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1.217L5.07 1.243a.5.5 0 0 1 .686-.172zM2 9v4.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V9zM1 7v1h14V7zm3 3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 4 10m2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 6 10m2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 8 10m2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5m2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5"/>
</svg>Add to Basket</button></li>
</ul></div></div></div>`;

  function init(){
    const toggleButton = document.getElementsByClassName('toggle-button')[0];
    const hero = document.getElementsByClassName('hero')[0];
    const navbarLinks = document.getElementsByClassName('navbar-links')[0];

    //When the toggle button is pressed (if visible by the screen size, the menu is shown)
    toggleButton.addEventListener('click',()=>{
      navbarLinks.classList.toggle('active');
      hero.classList.toggle('menuactive');
    });

    const searchBar = document.getElementsByClassName('search-bar')[0];
    //Show the search bar when the search link is pressed
    document.getElementById('search-link').addEventListener('click',()=>{
      searchBar.classList.toggle('active');
      document.getElementById('searchbox').focus();
    });

    //Close the search bar
    document.getElementById('searchbutton').addEventListener('click', ()=>{
      searchStr = document.getElementById('searchbox').value;
      redraw();
    });

    //Close the search bar
    document.getElementById('closesearchbutton').addEventListener('click', ()=>{
      searchStr = "";
      searchBar.classList.remove('active');
      redraw();
    });
    

    //Close the cookies message
    document.getElementById('acceptCookies').addEventListener('click', ()=>{
      setCookie('cookieMessageSeen', true);
      document.getElementById('cookieMessage').style.display = 'none';
    });

    //Close the cookies message
    document.getElementById('declineCookies').addEventListener('click', ()=>{
      setCookie('cookieMessageSeen', false);
      document.getElementById('cookieMessage').style.display = 'none';
    });

    document.getElementById('closeCookies').addEventListener('click', ()=>{
      setCookie('cookieMessageSeen', false);
      document.getElementById('cookieMessage').style.display = 'none';
    });

    if(getCookie("cookieMessageSeen") == "true"){
      document.getElementById('cookieMessage').style.display = 'none';
    }
    initProducts(redraw);
  }


  /*
  * When changing the page, you should make sure that each adjust button has exactly one click event
  * (otherwise it might trigger multiple times)
  * So this function loops through each adjustment button and removes any existing event listeners
  * Then it adds another event listener
  */
  function resetListeners(){
    var elements = document.getElementsByClassName("adjustUp");
    var eIn;
    for(eIn = 0; eIn < elements.length; eIn++){
      elements[eIn].removeEventListener("click",increment);
      elements[eIn].addEventListener("click",increment);
    }
    elements = document.getElementsByClassName("adjustDown");
    for(eIn = 0; eIn < elements.length; eIn++){
      elements[eIn].removeEventListener("click",decrement);
      elements[eIn].addEventListener("click",decrement);
    }
    elements = document.getElementsByClassName("buyInput");
    for(eIn = 0; eIn < elements.length; eIn++){
      elements[eIn].removeEventListener("change",inputchange);
      elements[eIn].addEventListener("change",inputchange);
    }
    elements = document.getElementsByClassName("addToBasket");
    for(eIn = 0; eIn < elements.length; eIn++){
      elements[eIn].removeEventListener("click",increment);
      elements[eIn].addEventListener("click",increment);
    }
  }


  //When the input changes, add a 'bought' class if more than one is added
  function inputchange(ev){
    var thisID = ev.target.parentElement.closest(".card__content").getAttribute("data-num");
    changeQuantity(thisID,ev.target.parentElement.closest(".shop-product-buying").getElementsByTagName("input")[0].value);
  }

  /*
  * Change the quantity of the product with productID
  */
  function changeQuantity(productID, newQuantity){
    basket[productID] = newQuantity;
    if(newQuantity == 0)
      delete basket[productID];
    document.querySelector(".buyInput[data-num='"+productID+"']").value = newQuantity;
    refreshBasket();
  }

  //Add 1 to the quantity
  function increment(ev){
    var thisID = ev.target.parentElement.closest(".card__content").getAttribute("data-num");
    if(basket[thisID] === undefined){
      basket[thisID] = 0;
    }
    changeQuantity(thisID,parseInt(basket[thisID])+1);
  }

  //Subtract 1 from the quantity
  function decrement(ev){
    var thisID = ev.target.parentElement.closest(".card__content").getAttribute("data-num");
    if(basket[thisID] === undefined){
      changeQuantity(thisID,0);
    }else{
      if(basket[thisID] > 0){
        changeQuantity(thisID,parseInt(basket[thisID])-1);
      }
    }
  }

  function filterFunction(a){
    /*This demonstrates how to filter based on the search term*/
    return a.name.toLowerCase().includes(searchStr.toLowerCase());

    //If you wanted to just filter based on fruit/veg you could do something like this:
    // return a.type == 'veg';
    // return a.type == 'fruit';
    // return true;
  }

  function filterFunctionFruit(a){
    /*This demonstrates how to filter based on the search term*/
    // return a.name.toLowerCase().includes(searchStr.toLowerCase());

    //If you wanted to just filter based on fruit/veg you could do something like this:
    // return a.type == 'veg';
    return a.type == 'fruit' && a.name.toLowerCase().includes(searchStr.toLowerCase());
    // return true;
  }

  function filterFunctionVeg(a){
    /*This demonstrates how to filter based on the search term*/
    // a.name.toLowerCase().includes(searchStr.toLowerCase());

    //If you wanted to just filter based on fruit/veg you could do something like this:
    return a.type == 'veg' && a.name.toLowerCase().includes(searchStr.toLowerCase());
    // return a.type == 'fruit';
    // return true;
  }

  function filterFunctionOther(a){
    /*This demonstrates how to filter based on the search term*/
    // a.name.toLowerCase().includes(searchStr.toLowerCase());

    //If you wanted to just filter based on fruit/veg you could do something like this:
    return a.type == 'other' && a.name.toLowerCase().includes(searchStr.toLowerCase());
    // return a.type == 'fruit';
    // return true;
  }



  function sortFunction(a,b){
    return a.name > b.name;
  }

  //Redraw all products based on the card template
  function redraw(){
    
    //Reset the product list (there are possibly more efficient ways of doing this, but this is simplest)
    document.querySelector('.productListVegetables').innerHTML = '';
    document.querySelector('.productListFruits').innerHTML = '';
    document.querySelector('.productListOther').innerHTML = '';

    var shownProductsFruit = productDetails.filter(filterFunctionFruit);
    var shownProductsVeg = productDetails.filter(filterFunctionVeg);
    var shownProductsOther = productDetails.filter(filterFunctionOther);

    // Object.assign(shownProducts, productDetails.filter(filterFunctionOther), productDetails.filter(filterFunctionVeg), productDetails.filter(filterFunctionFruit))

    var numProductsFruit = shownProductsFruit.length;
    var numProductsVeg = shownProductsVeg.length;
    var numProductsOther = shownProductsOther.length;
    
    if (numProductsFruit != 0) {
      document.querySelector('.productListFruits').innerHTML = '<div id="sectFruits"><span><h1 style="width: 100%;">Fruits</h1></span></div>'
    }
    if (numProductsVeg != 0) {
      document.querySelector('.productListVegetables').innerHTML = '<div id="sectVeg"><span><h1 style="width: 100%;">Vegetables<br></h1></span></div>'
    }
    if (numProductsOther != 0) {
      document.querySelector('.productListOther').innerHTML = '<div id="sectGroceries"><span><h1 style="width: 100%;">Groceries</h1></span></div>'
    }

    for(var i = 0; i < numProductsFruit; i++){
      var cardHTML = cardTemplate.replaceAll("[EVEGPRODUCT#]",shownProductsFruit[i].productID);
      var thisProduct = document.createElement("div");
      thisProduct.innerHTML = cardHTML;
      document.querySelector('.productListFruits').appendChild(thisProduct.firstChild);
    }

    for(var i = 0; i < numProductsVeg; i++){
      var cardHTML = cardTemplate.replaceAll("[EVEGPRODUCT#]",shownProductsVeg[i].productID);
      var thisProduct = document.createElement("div");
      thisProduct.innerHTML = cardHTML;
      document.querySelector('.productListVegetables').appendChild(thisProduct.firstChild);
    }

    for(var i = 0; i < numProductsOther; i++){
      var cardHTML = cardTemplate.replaceAll("[EVEGPRODUCT#]",shownProductsOther[i].productID);
      var thisProduct = document.createElement("div");
      thisProduct.innerHTML = cardHTML;
      document.querySelector('.productListOther').appendChild(thisProduct.firstChild);
    }

    document.querySelectorAll(".shop-product-details").forEach(function(element){
      var field = element.getAttribute("data-field");
      var num = element.getAttribute("data-num");
      switch(field){
        case "title":
          element.innerText = productDetails[num].name;
          break;
        case "img":
          element.innerHTML = "<span class=\"imgspacer\"></span><img src=\"images/"+productDetails[num].image + "\"></img>";
          break;
        case "price":
          element.innerHTML = "<span>£"+(productDetails[num].price/100).toFixed(2)+"</span>";
          break;
        case "units":
          element.innerHTML = "<span>"+productDetails[num].packsize + " " + productDetails[num].units+"</span>";
          break;
      }

    });
    resetListeners();
    updateQuantityInputs();
  }
  
  window.addEventListener("load", init);

  function updateQuantityInputs(){
    for(let buyInput of document.querySelectorAll(".buyInput")){
      let quantity = basket[buyInput.getAttribute("data-num")];
      if(isNaN(quantity))
        quantity = 0;

      buyInput.value = quantity;
    }
  }

  

  //Recalculate basket
  function refreshBasket(){
    let total = 0;
    for(const productID in basket){
      let quantity = basket[productID];
      let price = productDetails[productID].price;
      total = total + (price * quantity);
    }
    setCookie('basket', JSON.stringify(basket));
    try{
      document.querySelector("#basketNumTotal").innerHTML = (total / 100).toFixed(2);
    }catch(e){
      
    }
    return total;
  }

  

