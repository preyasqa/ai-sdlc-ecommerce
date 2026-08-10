const path = require('path');
const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

const productsPath = path.join(__dirname, 'data', 'products.json');
const ordersPath = path.join(__dirname, 'data', 'orders.json');

function loadProducts() {
  return JSON.parse(fs.readFileSync(productsPath, 'utf8'));
}

function loadOrders() {
  try {
    return JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
  } catch (error) {
    return [];
  }
}

function saveOrders(orders) {
  fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2), 'utf8');
}

app.get('/api/products', (req, res) => {
  res.json(loadProducts());
});

app.get('/api/orders', (req, res) => {
  res.json(loadOrders());
});

app.post('/api/checkout', (req, res) => {
  const cart = Array.isArray(req.body.cart) ? req.body.cart : [];
  const customer = req.body.customer || {};

  if (cart.length === 0) {
    return res.status(400).json({ error: 'Cart cannot be empty.' });
  }

  if (!customer.name || !customer.email || !customer.address) {
    return res.status(400).json({ error: 'Customer name, email, and address are required.' });
  }

  const products = loadProducts();
  const lineItems = [];

  for (const item of cart) {
    if (!item || typeof item.productId !== 'string' || typeof item.quantity !== 'number' || item.quantity < 1) {
      return res.status(400).json({ error: 'Each cart item must include a valid productId and a quantity of at least 1.' });
    }

    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      return res.status(400).json({ error: `Product not found: ${item.productId}` });
    }

    lineItems.push({
      productId: item.productId,
      quantity: item.quantity,
      name: product.name,
      price: product.price,
      total: product.price * item.quantity
    });
  }

  const total = lineItems.reduce((sum, item) => sum + item.total, 0);
  if (total <= 0) {
    return res.status(400).json({ error: 'Order total must be greater than zero.' });
  }

  const order = {
    orderId: `ORD-${Date.now()}`,
    createdAt: new Date().toISOString(),
    customer,
    lineItems,
    total
  };

  const orders = loadOrders();
  orders.push(order);
  saveOrders(orders);

  res.json({
    ...order,
    message: `Thank you, ${customer.name}! Your order has been placed.`
  });
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(port, () => {
  console.log(`AI SDLC ecommerce app listening at http://localhost:${port}`);
});
