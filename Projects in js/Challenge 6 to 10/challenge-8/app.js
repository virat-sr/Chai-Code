/**
 * Write your challenge solution here
 */
let cart = [];
function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name: name,
      price: price,
      quantity: 1,
    });
  }
  updateCartDisplay();
}

function updateCartDisplay() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="empty-cart">Cart is empty</div>';
    cartTotal.innerHTML = "<h3>Total: $0.00</h3>";
    return;
  }

  let total = 0;
  let cartHTML = "";

  cart.forEach((item) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    cartHTML += `<div class="cart-items">
  <span>${item.name}</span>
  <div>
    <button onclick="updateQuantity('${item.name}', -1)">-</button>
    <span>${item.quantity}</span>
    <button onclick="updateQuantity('${item.name}', 1)">+</button>
    <span>${subtotal.toFixed(2)}</span>
    <button onclick="removeFromCart('${item.name}')">Remove</button>
  </div>
</div>
                    
                    `;
  });
  cartItems.innerHTML = cartHTML;
  cartTotal.innerHTML = `<h3>Total : $${total.toFixed(2)}</h3>`;
}

function removeFromCart(name) {
  cart = cart.filter((item) => item.name !== name);
  updateCartDisplay();
}

function updateQuantity(name, change) {
  const item = cart.find((item) => item.name == name);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(name);
    } else {
      updateCartDisplay();
    }
  }
}
