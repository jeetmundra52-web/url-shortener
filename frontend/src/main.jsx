import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import RedirectPage from './pages/RedirectPage';
import './index.css';
import './i18n';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/r/:alias" element={<RedirectPage />} />
    </Routes>
  </BrowserRouter>
);
