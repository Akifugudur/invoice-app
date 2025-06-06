import React, { useEffect, useState } from 'react';

function InvoiceForm() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:3005/customers', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setCustomers);

    fetch('http://localhost:3005/products', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  const handleAddItem = () => {
    setItems([...items, { productId: '', quantity: 1 }]);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const product = products.find((p) => p.id === parseInt(item.productId));
      if (!product) return sum;
      return sum + parseInt(item.quantity) * parseFloat(product.price);
    }, 0).toFixed(2);
  };

  const handleSubmit = async () => {
    const body = {
      customer_id: selectedCustomerId,
      items: items.map((item) => ({
        product_id: item.productId,
        quantity: parseInt(item.quantity),
      })),
    };

    const res = await fetch('http://localhost:3005/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setMessage('Fatura başarıyla oluşturuldu ✅');
      setSelectedCustomerId('');
      setItems([]);
    } else {
      setMessage('Fatura oluşturulamadı ❌');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Yeni Fatura Oluştur</h2>

      <label>Müşteri:</label><br />
      <select value={selectedCustomerId} onChange={(e) => setSelectedCustomerId(e.target.value)}>
        <option value="">-- Seçiniz --</option>
        {customers.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select><br /><br />

      <h4>Ürünler:</h4>
      {items.map((item, i) => (
        <div key={i}>
          <select value={item.productId} onChange={(e) => handleItemChange(i, 'productId', e.target.value)}>
            <option value="">-- Ürün Seç --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => handleItemChange(i, 'quantity', e.target.value)}
          />
        </div>
      ))}
      <button onClick={handleAddItem}>+ Ürün Ekle</button>

      <h3>Toplam: € {calculateTotal()}</h3>

      <button onClick={handleSubmit}>Fatura Oluştur</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default InvoiceForm;
