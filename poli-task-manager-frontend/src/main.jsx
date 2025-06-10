
// src/main.jsx
import React from 'react'; // Import React
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Estilos globales y Tailwind

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
