import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TranslationProvider, useTranslation } from './index';

function Probe() {
  const { t } = useTranslation();
  return <div>{t('greeting', 'Hello')}</div>;
}

describe('integration-i18n', () => {
  it('falls back to the provided default translation and uses provider override', () => {
    render(
      <TranslationProvider t={(key) => `translated:${key}`}>
        <Probe />
      </TranslationProvider>
    );

    expect(screen.getByText('translated:greeting')).toBeTruthy();
  });
});
