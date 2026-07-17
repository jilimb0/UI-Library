import { type ReactNode, StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

// Import theme CSS from @ui-construction-library/themes
import '@ui-construction-library/themes/theme-dark.css';

import './index.css';
import App from './App.tsx';

type Theme = 'dark' | 'light' | 'neutral';

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('showcase-theme');
    if (stored === 'light' || stored === 'dark' || stored === 'neutral') {
      return stored;
    }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('showcase-theme', theme);
  }, [theme]);

  return (
    <>
      {/* Theme switcher in top-right corner */}
      <div className="theme-switcher">
        {(['dark', 'light', 'neutral'] as Theme[]).map((t) => (
          <button
            key={t}
            type="button"
            className={`theme-btn${theme === t ? ' theme-btn--active' : ''}`}
            onClick={() => setTheme(t)}
            aria-label={`Switch to ${t} theme`}
          >
            {t === 'dark' ? '🌙' : t === 'light' ? '☀️' : '⚪'}
          </button>
        ))}
      </div>
      {children}
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
