import type { Meta } from '@storybook/react';
import { Icon } from '@ui-construction-library/core';
import { StorybookSiteNav } from './StorybookSiteNav';

const meta: Meta = {
  title: 'Design Tokens/Icons',
  tags: ['autodocs'],
};

export default meta;

export const Icons = () => (
  <div style={{ display: 'grid', gap: 16 }}>
    <StorybookSiteNav />
    <p style={{ margin: 0, color: '#4b5563' }}>
      Representative icon set from the core package.
    </p>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      <Icon name="check" size={48} color="#007bff" />
      <Icon name="x" size={48} color="#0f766e" />
      <Icon name="search" size={48} color="#28a745" />
      <Icon name="settings" size={48} color="#dc3545" />
      <Icon name="home" size={48} color="#6c757d" />
      <Icon name="user" size={48} color="#6c757d" />
      <Icon name="heart" size={48} color="#4267B2" />
      <Icon name="mail" size={48} color="#1DA1F2" />
      <Icon name="star" size={48} color="#d97706" />
      <Icon name="bell" size={48} color="#9333ea" />
      <Icon name="arrow-left" size={48} color="#475569" />
      <Icon name="arrow-right" size={48} color="#475569" />
      <Icon name="chevron-down" size={48} color="#334155" />
      <Icon name="chevron-up" size={48} color="#334155" />
    </div>
  </div>
);
