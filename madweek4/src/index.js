import React from 'react';
import ReactDOM from 'react-dom/client'; // ✅ createRoot 사용
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

// ✅ React 18 방식으로 변경
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
