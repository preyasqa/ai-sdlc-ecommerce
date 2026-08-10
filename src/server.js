const path = require('path');
const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

function loadProducts() {
  const dataPath = path.join(__dirname, 'data', 'products.json');
  return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

app.get('/api/products', (req, res) => {
  res.json(loadProducts());
});

app.post('/api/checkout', (req, res) => {
  const { cart, customer } = req.body;

  if (!Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: 'Cart cannot be empty.' });
  }

  if (!customer || !customer.name || !customer.email) {
    return res.status(400).json({ error: 'Customer name and email are required.' });
  }

  const products = loadProducts();
  const lineItems = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      productId: item.productId,
      quantity: item.quantity,
      name: product ? product.name : 'Unknown product',
      price: product ? product.price : 0,
      total: product ? product.price * item.quantity : 0
    };
  });

  const total = lineItems.reduce((sum, item) => sum + item.total, 0);

  res.json({
    orderId: `ORD-${Date.now()}`,
    customer,
    lineItems,
    total,
    message: `Thank you, ${customer.name}! Your order has been placed.`
  });
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(port, () => {
  console.log(`AI SDLC ecommerce app listening at http://localhost:${port}`);
});
