const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

// Route dosyalarını içeri al
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const customerRoutes = require('./routes/customer.routes');
const invoiceRoutes = require('./routes/invoice.routes');

const app = express();
app.use(cors());
app.use(express.json());

// Route'ları kullan
app.use('/auth', authRoutes);          // örn: POST /auth/register
app.use('/products', productRoutes);   // örn: GET /products
app.use('/customers', customerRoutes); // örn: GET /customers
app.use('/invoices', invoiceRoutes);   // örn: POST /invoices

// Test route
app.get('/', (req, res) => {
  res.send('Hello Akif, API is working!');
});

app.get('/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (error) {
    console.error('DB error:', error);
    res.status(500).json({ error: 'Database not reachable' });
  }
});

const PORT = 3005;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});