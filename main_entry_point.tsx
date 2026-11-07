import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app_component';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);