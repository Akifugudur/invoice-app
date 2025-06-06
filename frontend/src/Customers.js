import React, { useEffect, useState } from 'react';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [editingId, setEditingId] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState({});

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const res = await fetch('http://localhost:3005/customers', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setCustomers(data);
  };

  const handleAdd = async () => {
    const res = await fetch('http://localhost:3005/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newCustomer),
    });

    if (res.ok) {
      setNewCustomer({ name: '', email: '', phone: '', address: '' });
      fetchCustomers();
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`http://localhost:3005/customers/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      fetchCustomers();
    }
  };

  const handleEdit = (customer) => {
    setEditingId(customer.id);
    setEditingCustomer(customer);
  };

  const handleUpdate = async () => {
    const res = await fetch(`http://localhost:3005/customers/${editingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editingCustomer),
    });

    if (res.ok) {
      setEditingId(null);
      setEditingCustomer({});
      fetchCustomers();
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Müşteri Listesi</h2>
      <ul>
        {customers.map((c) => (
          <li key={c.id}>
            <strong>{c.name}</strong> – {c.email} – {c.phone} – {c.address}
            <button onClick={() => handleDelete(c.id)}>Sil</button>
            <button onClick={() => handleEdit(c)}>Düzenle</button>
          </li>
        ))}
      </ul>

      <h3>Yeni Müşteri Ekle</h3>
      <input placeholder="İsim" value={newCustomer.name} onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })} /><br />
      <input placeholder="Email" value={newCustomer.email} onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })} /><br />
      <input placeholder="Telefon" value={newCustomer.phone} onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })} /><br />
      <input placeholder="Adres" value={newCustomer.address} onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })} /><br />
      <button onClick={handleAdd}>Ekle</button>

      {editingId && (
        <>
          <h3>Müşteri Güncelle</h3>
          <input value={editingCustomer.name} onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })} /><br />
          <input value={editingCustomer.email} onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })} /><br />
          <input value={editingCustomer.phone} onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })} /><br />
          <input value={editingCustomer.address} onChange={(e) => setEditingCustomer({ ...editingCustomer, address: e.target.value })} /><br />
          <button onClick={handleUpdate}>Güncelle</button>
        </>
      )}
    </div>
  );
}

export default Customers;
