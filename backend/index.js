const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ TEST ROUTE
app.get('/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (error) {
    console.error('DB error:', error);
    res.status(500).json({ error: 'Database not reachable' });
  }
});

// ✅ REGISTER ROUTE
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await db.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role, created_at',
      [name, email, hashedPassword]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ LOGIN ROUTE
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: user.rows[0].id,
        email: user.rows[0].email,
        role: user.rows[0].role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ PRODUCT CREATE ROUTE
app.post('/products', async (req, res) => {
  const { name, sku, compatible_with, quantity, price } = req.body;

  try {
    const newProduct = await db.query(
      `INSERT INTO products (name, sku, compatible_with, quantity, price)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, sku, compatible_with, quantity, price]
    );

    res.status(201).json(newProduct.rows[0]);
  } catch (err) {
    console.error('Product insert error:', err);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// ✅ ROOT ROUTE
app.get('/', (req, res) => {
  res.send('Hello Akif, API is working!');
});

//GET products 
app.get('/products', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Product fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

//DELETE products 
app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await db.query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [id]
    );

    if (deleted.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted', product: deleted.rows[0] });
  } catch (err) {
    console.error('Product delete error:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

//PUT products 
app.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, sku, compatible_with, quantity, price } = req.body;

  try {
    const updated = await db.query(
      `UPDATE products
       SET name = $1, sku = $2, compatible_with = $3, quantity = $4, price = $5
       WHERE id = $6
       RETURNING *`,
      [name, sku, compatible_with, quantity, price, id]
    );

    if (updated.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product updated', product: updated.rows[0] });
  } catch (err) {
    console.error('Product update error:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

const PORT = 3005;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
