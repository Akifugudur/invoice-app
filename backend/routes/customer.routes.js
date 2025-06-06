const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/authenticateToken');

// ✅ Müşteri ekle
router.post('/', authenticateToken, async (req, res) => {
  const { name, email, phone, address } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO customers (name, email, phone, address)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, email, phone, address]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Müşteri ekleme hatası:', err);
    res.status(500).json({ error: 'Veritabanı hatası' });
  }
});

module.exports = router;