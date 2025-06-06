const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/authenticateToken');

// ✅ Ürün ekle
router.post('/', authenticateToken, async (req, res) => {
  const { name, sku, compatible_with, quantity, price } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO products (name, sku, compatible_with, quantity, price)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, sku, compatible_with, quantity, price]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Ürün ekleme hatası:', err);
    res.status(500).json({ error: 'Veritabanı hatası' });
  }
});

// ✅ Ürünleri listele
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Ürün listeleme hatası:', err);
    res.status(500).json({ error: 'Veritabanı hatası' });
  }
});



module.exports = router;