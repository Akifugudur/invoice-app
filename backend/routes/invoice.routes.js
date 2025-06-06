const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/authenticateToken');

// ✅ Fatura oluştur
router.post('/', authenticateToken, async (req, res) => {
  const { customer_id, items } = req.body;

  try {
    await db.query('BEGIN');

    const invoiceResult = await db.query(
      `INSERT INTO invoices (customer_id, user_id, total)
       VALUES ($1, $2, 0)
       RETURNING *`,
      [customer_id, req.user.id]
    );

    const invoiceId = invoiceResult.rows[0].id;
    let total = 0;

    for (const item of items) {
      const product = await db.query('SELECT price, quantity FROM products WHERE id = $1', [item.product_id]);
      if (product.rows.length === 0) {
        throw new Error(`Product ID ${item.product_id} not found`);
      }

      const unitPrice = parseFloat(product.rows[0].price);
      const stock = parseInt(product.rows[0].quantity);
      if (item.quantity > stock) {
        throw new Error(`Insufficient stock for product ID ${item.product_id}`);
      }

      await db.query(
        `INSERT INTO invoice_items (invoice_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [invoiceId, item.product_id, item.quantity, unitPrice]
      );

      await db.query(
        `UPDATE products SET quantity = quantity - $1 WHERE id = $2`,
        [item.quantity, item.product_id]
      );

      total += unitPrice * item.quantity;
    }

    await db.query(`UPDATE invoices SET total = $1 WHERE id = $2`, [total, invoiceId]);

    await db.query('COMMIT');
    res.status(201).json({ message: 'Invoice created', invoice_id: invoiceId, total });
  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Fatura oluşturma hatası:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
