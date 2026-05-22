import type { Preview } from '@storybook/react';
import '../../../packages/core/src/styles/globals.css';

const DOCS_URL = '../docs/';
const DEMO_URL = '../';

const withSiteLinks: NonNullable<Preview['decorators']>[number] = (Story) => {
  const wrapper = document.createElement('div');
  wrapper.style.minHeight = '100vh';
  wrapper.style.background = '#f6f7fb';

  const nav = document.createElement('div');
  nav.style.display = 'flex';
  nav.style.justifyContent = 'space-between';
  nav.style.alignItems = 'center';
  nav.style.gap = '16px';
  nav.style.padding = '12px 16px';
  nav.style.background = '#ffffff';
  nav.style.borderBottom = '1px solid rgba(15, 23, 42, 0.08)';
  nav.style.position = 'sticky';
  nav.style.top = '0';
  nav.style.zIndex = '999';

  const label = document.createElement('span');
  label.textContent = 'UI Construction Library';
  label.style.font = '600 14px Inter, ui-sans-serif, system-ui, sans-serif';
  label.style.color = '#0f172a';

  const actions = document.createElement('div');
  actions.style.display = 'flex';
  actions.style.gap = '10px';
  actions.style.flexWrap = 'wrap';

  const createLink = (href: string, text: string) => {
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.textContent = text;
    anchor.style.font = '500 13px Inter, ui-sans-serif, system-ui, sans-serif';
    anchor.style.color = '#0f172a';
    anchor.style.textDecoration = 'none';
    anchor.style.padding = '8px 12px';
    anchor.style.borderRadius = '999px';
    anchor.style.border = '1px solid rgba(15, 23, 42, 0.12)';
    anchor.style.background = '#fff';
    return anchor;
  };

  actions.append(createLink(DEMO_URL, 'Open demo'));
  actions.append(createLink(DOCS_URL, 'Open docs'));

  nav.append(label, actions);
  wrapper.append(nav);

  const content = document.createElement('div');
  content.style.minHeight = 'calc(100vh - 57px)';
  wrapper.append(content);

  const story = Story();
  if (story instanceof HTMLElement) {
    content.append(story);
    return wrapper;
  }

  return story;
};

const preview: Preview = {
  decorators: [withSiteLinks],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: { expanded: true },
    a11y: { test: 'error' },
  },
};

export default preview;
