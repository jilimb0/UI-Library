import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Import theme CSS — change to theme-light.css or theme-neutral.css as needed
import '@ui-construction-library/themes/theme-dark.css';
// Import Tailwind CSS (v4 — one import replaces all utilities)
import 'tailwindcss';

import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
