const db = {
    methods: {
        find: (id) => {
            return db.items.find(item => item.id === id);
        },
        remove: (items) => {
            items.forEach(item => {
                const product = db.methods.find(item.id);
                product.qty = product.qty - item.qty;
            });
        },
    },
    items: [
        {
            id: 0,
            title: 'iphone xr',
            price: 250,
            qty: 5,
        },
        {
            id: 1,
            title: 'smart tv',
            price: 345,
            qty: 50,
        },
        {
            id: 2,
            title: 'silla gamer',
            price: 1300,
            qty: 80,
        },
    ],
};



const shoppingCart = {
    items: [],
    methods: {
        add: (id, qty) => {
            const cartItem = shoppingCart.methods.get(id);

            if(cartItem){
                if(shoppingCart.methods.hasInventory(id, qty + cartItem.qty)){
                   cartItem.qty += qty; 
                }else{
                    alert("No hay inventaro suficiente")
                }
            }else{
                shoppingCart.items.push({id, qty});
            }
        },
        remove: (id, qty) => {
            const cartItem = shoppingCart.methods.get(id);
            if (cartItem.qty - qty > 0) {
                cartItem.qty -= qty;
            }else {
                shoppingCart.items = shoppingCart.items.filter(item => item.id !== id);
            }
        },
        count: () => {
            return shoppingCart.items.reduce((acc, item) => acc + item.qty, 0);
            return index >= 0 ? shoppingCart.items[index] : null;
        },
        get: (id) => {
            const index = shoppingCart.items.findIndex(item => item.id === id);
            return index >= 0 ? shoppingCart.items[index] : null;
        },
        getTotal: () => {
            const total = shoppingCart.items.reduce((acc, item) =>{
                const found = db.methods.find(item.id);
                return acc + (found.price * item.qty); // Sumar el subtotal de cada elemento al acumulador
            }, 0);
            return total;
        },
        hasInventory: (id, qty) => {
            return db.items.find(item => item.id === id).qty - qty >= 0;
        },
        purchase: () => {
            db.methods.remove(shoppingCart.items);
            shoppingCart.items = [];
        },
    },
};

renderStore();

function renderStore(){
    const html = db.items.map((item) => {
        return `
        <div class="item">
            <div class="title">${item.title}</div>
            <div class="price">${item.price}</div>
            <div class="qty">${item.qty} units</div>

            <div class="actions">
                <button class="add" data-id="${item.id}">
                    Agregar al carrito
                </button>
            </div>
        </div>
        `;
    });

    document.querySelector('#store-container').innerHTML = html.join("");

    document.querySelectorAll('.item .actions .add').forEach(button => {
        button.addEventListener('click', e => {
            const id = parseInt(button.getAttribute('data-id'));
            const item = db.methods.find(id);

            if(item && item.qty > 0){
                shoppingCart.methods.add(id, 1);
                renderShoppingCart();
            }else{
                console.log('Ya no hay inventario');
            }
        });
    });
}

function renderShoppingCart() {
     const html = shoppingCart.items.map(item => {
        const dbItem = db.methods.find(item.id);
        return `
                <div class="item">
                <div class="title">${dbItem.title}</div>
                <div class="price">${dbItem.price}</div>
                <div class="qty">${item.qty} units</div>
                <div class="subtotal">
                    Subtotal: ${item.qty * dbItem.price}
                 </div>
                 <div class="actions">
                    <button class="addOne" data-id="${item.id}">+</button>
                    <button class="removeOne" data-id="${item.id}">-</button>
                 </div>
            </div>
        `;
     });


     const closeButton =`
        <div class="cart-header">
            <button class="bClose">Close</button>
        </div>
     `;
     const purchaseButton = 
     shoppingCart.items.length > 0? `
        <div class="cart-actions">
            <button id="bPurchase">Purchase</button>
        </div>
     `
     : "";

     const total = shoppingCart.methods.getTotal();
     const totalContainer = `<div class="total">Total: ${total}</div>`

     const shoppingCartContainer = document.querySelector("#shopping-cart-container");
     shoppingCartContainer.classList.remove("hide");
     shoppingCartContainer.classList.add("show");

     shoppingCartContainer.innerHTML = 
     closeButton + html.join("") + totalContainer + purchaseButton;


     document.querySelectorAll('.addOne').forEach(button => {
        button.addEventListener('click', e => {
            const id = parseInt(button.getAttribute("data-id"));
            shoppingCart.methods.add(id, 1);
            renderShoppingCart();
        });
     });

     document.querySelectorAll(".removeOne").forEach((button) =>{
        button.addEventListener("click", (e) => {
            const id = parseInt(button.getAttribute("data-id"));
            shoppingCart.methods.remove(id, 1);
            renderShoppingCart();
        });
     });

     document.querySelector('.bClose').addEventListener('click', e => {
        shoppingCartContainer.classList.remove("show");
        shoppingCartContainer.classList.add("hide");
     });

     const bPurchase = document.querySelector('#bPurchase');
     if(bPurchase){
        bPurchase.addEventListener("click", (e) => {
            shoppingCart.methods.purchase();
            renderStore();
            renderShoppingCart();
        });
     }
     
}

renderStore();

// function renderStore(){
//     const html = db.items.map((item) => {
//         return `
//         <div class="item">
//             <div class="title">${item.title}</div>
//             <div class="price">${item.price}</div>
//             <div class="qty">${item.qty} units</div>

//             <div class="actions">
//                 <button class="add" data-id="${item.id}">
//                     Agregar al carrito
//                 </button>
//             </div>
//         </div>
//         `;
//     });

//     document.querySelector('#store-container').innerHTML = html.join("");

//     document.querySelectorAll('.item .ations .add').forEach(button => {
//         button.addEventListener('click', e => {
//             const id = parseInt(button.getAttribute("data-id"));
//             const item = db.methods.find(id);

//             if(item && item.qty -1 > 0){
//                 shoppingCart.methods.add(id, 1);
//                 renderShoppingCart();
//             }else{
//                 console.log('ya no hay inventario');
//             }
//         });
//     });
// }

// function renderShoppingCart() {
//      const html = shoppingCart.items.map(item => {
//         const dbItem = db.methods.finds(item.id);
//         return `
//                 <div class="item">
//                 <div class="title">${dbItem.title}</div>
//                 <div class="price">${dbItem.price}</div>
//                 <div class="qty">${item.qty} units</div>
//                 <div class="subtotal">
//                     subtotal:${item.qty * dbItem.price}
//                  </div>
//                  <div class="actions">
//                     <button class="addOne" data-id="${item.id}">+</button>
//                     <button class="removeOne" data-id="${item.id}">-</button>
//                  </div>
//             </div>
//         `;
//      });


//      const claseButton =`
//         <div class="cart-header">
//             <button class="bclose">Close</button>
//         </div>
//      `;
//      const purchaseButton = 
//      shoppingCart.items.length > 0? `
//         <div class="cart-actions">
//             <button id="bPurchase">purchase</button>
//         </div>
//      `
//      : "";

//      const total = shoppingCart.methods.getTotal();
//      const totalContainer = `<div class="total">Total:${total}</div>`

//      const shoppingCartContainer = document.querySelector("#shopping-cart-container");
//      shoppingCartContainer.classList.remove("hide");
//      shoppingCartContainer.classList.add("show");

//      shoppingCartContainer.innerHTML = 
//      closeButton + html.join("") + totalContainer + purchaseButton;


//      document.querySelectorAll('.addOne').forEach(button => {
//         button.addEventListener('click', e => {
//             const id = parseInt(button.getAttribute("data-id"));
//             shoppingCart.methods.add(id, 1);
//             renderShoppingCart();
//         });
//      });

//      document.querySelectorAll(".removeOne").forEach((button) =>{
//         button.addEventListener("click", (e) => {
//             const id = parseInt(button.getAttribute("data-id"));
//             shoppingCart.methods.remove(id, 1);
//             renderShoppingCart();
//         });
//      });

//      document.querySelector('.bClose').addEventListener('click', e => {
//         shoppingCartContainer.classList.remove("show");
//         shoppingCartContainer.classList.add("hide");
//      });

//      const bPurchase = document.querySelector('#bPurchase');
//      if(bPurchase){
//         bPurchase.addEventListener("click", (e) => {
//             shoppingCart.methods.purchase();
//             renderStore();
//             renderShoppingCart();
//         });
//      }
     
// }

