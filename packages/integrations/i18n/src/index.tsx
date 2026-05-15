import { createContext, type ReactNode, useContext } from 'react';

type TranslateFn = (key: string, fallback?: string) => string;

const TranslationContext = createContext<TranslateFn>(
  (key, fallback) => fallback ?? key
);

export function TranslationProvider({
  t,
  children,
}: {
  t: TranslateFn;
  children: ReactNode;
}) {
  return (
    <TranslationContext.Provider value={t}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const t = useContext(TranslationContext);
  return { t };
}
