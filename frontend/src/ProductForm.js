import React, { useState } from 'react';

function ProductForm({ token, onProductAdded }) {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [compatibleWith, setCompatibleWith] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3005/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          sku,
          compatible_with: compatibleWith,
          quantity: parseInt(quantity),
          price: parseFloat(price)
        })
      });

      if (response.ok) {
        const newProduct = await response.json();
        onProductAdded(newProduct);
        setName('');
        setSku('');
        setCompatibleWith('');
        setQuantity('');
        setPrice('');
      } else {
        console.error('API Error:', await response.text());
        alert("Ürün eklenemedi 😔");
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Bağlantı hatası 😵");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required /><br />
      <input placeholder="SKU" value={sku} onChange={(e) => setSku(e.target.value)} required /><br />
      <input placeholder="Compatible With" value={compatibleWith} onChange={(e) => setCompatibleWith(e.target.value)} required /><br />
      <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required /><br />
      <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required /><br />
      <button type="submit">Ürün Ekle</button>
    </form>
  );
}

export default ProductForm;
