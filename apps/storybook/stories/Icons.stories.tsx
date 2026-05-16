import type { Meta } from '@storybook/react-vite';
import { Icon } from '@ui-construction-library/core';

const meta: Meta = {
  title: 'Design Tokens/Icons',
  tags: ['autodocs'],
};

export default meta;

export const Icons = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
    <Icon name="Check" size={48} color="#007bff" />
    <Icon name="Search" size={48} color="#28a745" />
    <Icon name="Settings" size={48} color="#dc3545" />
    <Icon name="Home" size={48} color="#6c757d" />
    <Icon name="User" size={48} color="#6c757d" />
    <Icon name="Heart" size={48} color="#4267B2" />
    <Icon name="Mail" size={48} color="#1DA1F2" />
  </div>
);
