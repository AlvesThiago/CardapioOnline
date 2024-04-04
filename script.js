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
const cepInput = document.getElementById("cep")
const cepWarn = document.getElementById("cep-warn")
const nameInput = document.getElementById("name-input")


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
          background: "#65B741",
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

cepInput.addEventListener("input", function(event){
    let inputValueCep = event.target.value;

    if (inputValueCep !== "") {
        cepInput.classList.remove("border-red-500")
        cepWarn.classList.add("hidden")
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

    if(cepInput.value === ""){
        cepWarn.classList.remove("hidden")
        cepInput.classList.add("border-red-500")
        return;
    }



    // Calcular o total do valor de todos os produtos escolhidos
    const total = cart.reduce((acc, item) => {
    return acc + (item.price * item.quantity);
    }, 0);

    //Enviar para API do Whats

    const cartItems = cart.map((item) => {

        let precoTotal = item.price * item.quantity;

        return(
            `${item.name}\n` +
            `Quantidade: (${item.quantity})\n` +
            `Preço: R$${precoTotal.toFixed(2)}\n\n`
        );

    }) .join("");

    const totalMessage = `*Total: R$${total.toFixed(2)}*\n\n`;

    const nameInputValue = `Nome: ${nameInput.value} \n`;
    
    const endereco = `Endereço: ${addressInput.value}\n`;
    const cep = `CEP: ${cepInput.value}`;

    const message = encodeURIComponent(`${cartItems}${totalMessage}${nameInputValue}${endereco}${cep}`);

    const phone = "5511961916701";

    window.open(`https://wa.me/${phone}?text=${message}`);

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
