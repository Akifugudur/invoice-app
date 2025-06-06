import React, { useState, useEffect } from 'react';
import Login from './Login';
import Products from './Products';
import Customers from './Customers';
import InvoiceForm from './InvoiceForm';

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken && savedToken !== 'null') {
      setToken(savedToken);
    }
  }, []);

  return (
    <div>
      <h1>Invoice App</h1>
      {token ? (
        <>
          <Products token={token} />
          <Customers token={token} />
          <InvoiceForm token={token} />
        </>
      ) : (
        <Login
          onLogin={(t) => {
            localStorage.setItem('token', t);
            setToken(t);
          }}
        />
      )}
    </div>
  );
}

export default App;