const productList = document.querySelector('#product-list');
const cartCount = document.querySelector('#cart-count');
const viewCartButton = document.querySelector('#view-cart-button');
const cartDialog = document.querySelector('#cart-dialog');
const checkoutDialog = document.querySelector('#checkout-dialog');
const closeCartButton = document.querySelector('#close-cart-button');
const checkoutButton = document.querySelector('#checkout-button');
const cartItemsContainer = document.querySelector('#cart-items');
const cartTotalElement = document.querySelector('#cart-total');
const checkoutForm = document.querySelector('#checkout-form');
const cancelCheckout = document.querySelector('#cancel-checkout');
const orderResponse = document.querySelector('#order-response');

let cart = [];

function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}

function saveCart() {
  localStorage.setItem('ecommerceCart', JSON.stringify(cart));
}

function loadCart() {
  const saved = localStorage.getItem('ecommerceCart');
  cart = saved ? JSON.parse(saved) : [];
  updateCartCount();
}

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
}

function renderProducts(products) {
  productList.innerHTML = '';

  products.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="https://via.placeholder.com/400x300?text=${encodeURIComponent(product.name)}" alt="${product.name}" />
      <div>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="price">${formatCurrency(product.price)}</div>
      </div>
      <button data-product-id="${product.id}">Add to Cart</button>
    `;

    const button = card.querySelector('button');
    button.addEventListener('click', () => addToCart(product.id));
    productList.appendChild(card);
  });
}

async function loadProducts() {
  const response = await fetch('/api/products');
  const products = await response.json();
  window.products = products;
  renderProducts(products);
}

function addToCart(productId) {
  const existing = cart.find((item) => item.productId === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ productId, quantity: 1 });
  }
  saveCart();
  updateCartCount();
}

function renderCartItems() {
  cartItemsContainer.innerHTML = '';
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    cartTotalElement.textContent = formatCurrency(0);
    return;
  }

  cart.forEach((item) => {
    const product = window.products.find((p) => p.id === item.productId);
    const itemRow = document.createElement('div');
    itemRow.className = 'cart-item';
    itemRow.innerHTML = `
      <div>
        <strong>${product?.name ?? 'Unknown item'}</strong>
        <p>${formatCurrency(product?.price ?? 0)} × ${item.quantity}</p>
      </div>
      <div>
        <button type="button" data-action="decrease" data-product-id="${item.productId}">−</button>
        <button type="button" data-action="increase" data-product-id="${item.productId}">+</button>
      </div>
    `;
    cartItemsContainer.appendChild(itemRow);
  });

  const total = cart.reduce((sum, item) => {
    const product = window.products.find((p) => p.id === item.productId);
    return sum + (product?.price || 0) * item.quantity;
  }, 0);
  cartTotalElement.textContent = formatCurrency(total);
}

function updateCartItem(productId, change) {
  const item = cart.find((entry) => entry.productId === productId);
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) {
    cart = cart.filter((entry) => entry.productId !== productId);
  }
  saveCart();
  updateCartCount();
  renderCartItems();
}

viewCartButton.addEventListener('click', async () => {
  if (!window.products) {
    await loadProducts();
  }
  renderCartItems();
  cartDialog.showModal();
});

closeCartButton.addEventListener('click', () => cartDialog.close());

checkoutButton.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Add at least one product before checkout.');
    return;
  }
  checkoutDialog.showModal();
});

cartItemsContainer.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  const productId = button.dataset.productId;
  const action = button.dataset.action;
  if (action === 'increase') {
    updateCartItem(productId, 1);
  } else if (action === 'decrease') {
    updateCartItem(productId, -1);
  }
});

checkoutForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(checkoutForm);
  const customer = {
    name: formData.get('name').trim(),
    email: formData.get('email').trim(),
    address: formData.get('address').trim()
  };

  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cart, customer })
  });

  const payload = await response.json();
  if (!response.ok) {
    orderResponse.textContent = payload.error || 'Checkout failed';
    orderResponse.classList.add('visible');
    orderResponse.style.background = '#fee2e2';
    orderResponse.style.color = '#991b1b';
    return;
  }

  orderResponse.textContent = `${payload.message} Order ID: ${payload.orderId}`;
  orderResponse.classList.add('visible');
  cart = [];
  saveCart();
  updateCartCount();
  renderCartItems();
  setTimeout(() => {
    checkoutDialog.close();
    orderResponse.classList.remove('visible');
    checkoutForm.reset();
  }, 3000);
});

cancelCheckout.addEventListener('click', () => checkoutDialog.close());

window.addEventListener('DOMContentLoaded', async () => {
  loadCart();
  await loadProducts();
});
