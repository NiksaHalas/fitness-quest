// frontend/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'; // OVA LINIJA JE KLJUČNA

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* OVAJ BLOK JE KLJUČAN */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);