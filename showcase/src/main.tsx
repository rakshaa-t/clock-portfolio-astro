import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ShowcaseScreen } from './Showcase/ShowcaseScreen';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ShowcaseScreen />
  </StrictMode>,
);
