import React, { useState, useEffect } from 'react';
import ProductForm from './ProductForm';

function Products({ token }) {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:3005/products', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Ürünleri çekme hatası:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3005/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.error('Silme hatası:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h2>Ürünler</h2>
      <ProductForm token={token} onProductAdded={fetchProducts} />

      {products.length === 0 ? (
        <p>Henüz ürün yok.</p>
      ) : (
        <ul>
          {products.map(product => (
            <li key={product.id}>
              <strong>{product.name}</strong> — {product.sku} — {product.compatible_with} — {product.quantity} adet — €{product.price}
              <button onClick={() => handleDelete(product.id)} style={{ marginLeft: '1rem' }}>Sil</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Products;
