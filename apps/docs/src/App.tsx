import { lazy, Suspense } from 'react';

const DocsApp = lazy(() => import('./components/DocsApp'));

function App() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading docs...</div>}>
      <DocsApp />
    </Suspense>
  );
}

export default App;