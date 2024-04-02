const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")



let cart = [];


//Abrir modal
cartBtn.addEventListener("click", function(){
    updateCartModal();
    cartModal.style.display = "flex"
})

//fechar modal
cartModal.addEventListener("click", function(event) {
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

//fechar modal
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

menu.addEventListener("click", function(){
    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        addToCart(name, price)

    }
})

function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)

    if (existingItem) {
        existingItem.quantity += 1;
    }else{
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    Toastify({
        text: "Produto adicionado",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#00ff7f",
        },
    }).showToast();
    
    updateCartModal()

}


function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `     
        <div class="flex items-center justify-between">
            <div>
                <p class="font-bold">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-bold mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>

            <button class="remove-from-cart-btn bg-red-500 text-white px-4 py-1 rounded" data-name="${item.name}">
                X
            </button>

        </div>     
        `

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;

} 

// remover item

cartItemsContainer.addEventListener("click", function(event){
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name")
        
        removeItemCart(name);
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1 ) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

addressInput.addEventListener("input", function(event) {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }

})

checkoutBtn.addEventListener("click", function(){
    
    const isOpen = checkRestaurantOpen();
    if(!isOpen){ 
        Toastify({
            text: "Ops, Estamos fechado no momento!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
        }).showToast();

        return;
    }

    if(cart.length === 0) return;

    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }


    //Enviar para API do Whats

    const cartItems = cart.map((item) => {

        let precoTotal = item.price * item.quantity;

        return(
            `---------------------------
            ${item.name} 
            Quantidade: (${item.quantity})  
            Preço: R$${precoTotal.toFixed(2)}  
              
            `
        )
    }) .join("")

    const message = encodeURIComponent(cartItems)
    const phone = "11961916701"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`)

    cart = [];
    updateCartModal();

})

function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    
    return hora >= 18 && hora < 22;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
} else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}
