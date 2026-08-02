import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MenuLab } from './MenuLab';
import './menu-lab.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MenuLab />
  </StrictMode>,
);
