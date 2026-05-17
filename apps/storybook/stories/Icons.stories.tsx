import type { Meta } from '@storybook/react';
import { Icon } from '@ui-construction-library/core';

const meta: Meta = {
  title: 'Design Tokens/Icons',
  tags: ['autodocs'],
};

export default meta;

export const Icons = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
    <Icon name="check" size={48} color="#007bff" />
    <Icon name="search" size={48} color="#28a745" />
    <Icon name="settings" size={48} color="#dc3545" />
    <Icon name="home" size={48} color="#6c757d" />
    <Icon name="user" size={48} color="#6c757d" />
    <Icon name="heart" size={48} color="#4267B2" />
    <Icon name="mail" size={48} color="#1DA1F2" />
  </div>
);
