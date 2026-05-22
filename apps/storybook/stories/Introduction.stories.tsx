import type { Meta, StoryObj } from '@storybook/react';

function Introduction() {
  return (
    <div
      style={{
        fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
        maxWidth: 1080,
        margin: '0 auto',
        padding: '48px 32px',
        color: '#28251d',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          gap: 8,
          alignItems: 'center',
          padding: '6px 12px',
          borderRadius: 999,
          background: 'rgba(1, 105, 111, 0.08)',
          color: '#01696f',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}
      >
        Public entrypoint
      </div>

      <h1
        style={{
          margin: '20px 0 12px',
          fontSize: 'clamp(40px, 8vw, 72px)',
          lineHeight: 0.96,
          letterSpacing: '-0.05em',
        }}
      >
        UI Construction Library Storybook
      </h1>

      <p
        style={{
          margin: 0,
          maxWidth: 760,
          fontSize: 18,
          lineHeight: 1.7,
          color: '#5f5b53',
        }}
      >
        Explore the component system, token stories and public design language
        that now power the showcase demo and documentation site.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          marginTop: 32,
        }}
      >
        {[
          [
            'Components',
            'Atoms, molecules, organisms and templates for product UI.',
          ],
          ['Themes', 'ThemeProvider and token-based light/dark foundations.'],
          [
            'Documentation',
            'Reference stories that support docs and adoption.',
          ],
          [
            'Validation',
            'A11y checks and visual review via Storybook and Chromatic.',
          ],
        ].map(([title, description]) => (
          <div
            key={title}
            style={{
              border: '1px solid rgba(40, 37, 29, 0.08)',
              borderRadius: 20,
              padding: 20,
              background: 'rgba(249, 248, 245, 0.92)',
              boxShadow: '0 18px 48px rgba(40, 37, 29, 0.08)',
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#01696f',
                marginBottom: 10,
              }}
            >
              {title}
            </div>
            <p style={{ margin: 0, lineHeight: 1.6, color: '#5f5b53' }}>
              {description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const meta: Meta<typeof Introduction> = {
  title: 'Design System/Introduction',
  component: Introduction,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Introduction>;

export const Default: Story = {};
