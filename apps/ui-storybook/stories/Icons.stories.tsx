import React from 'react';
import type { Meta } from '@storybook/react';
import { SaveIcon, EditIcon, DeleteIcon } from '@ui/core/src/icons';
import { ArrowIcon, ChevronIcon } from '@ui/core/src/icons';
import { FacebookIcon, TwitterIcon } from '@ui/core/src/icons';

const meta: Meta = {
  title: 'Design Tokens/Icons',
  tags: ['autodocs'],
};

export default meta;

export const Icons = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
    <SaveIcon style={{ width: 48, height: 48, color: '#007bff' }} />
    <EditIcon style={{ width: 48, height: 48, color: '#28a745' }} />
    <DeleteIcon style={{ width: 48, height: 48, color: '#dc3545' }} />
    <ArrowIcon style={{ width: 48, height: 48, color: '#6c757d' }} />
    <ChevronIcon style={{ width: 48, height: 48, color: '#6c757d' }} />
    <FacebookIcon style={{ width: 48, height: 48, color: '#4267B2' }} />
    <TwitterIcon style={{ width: 48, height: 48, color: '#1DA1F2' }} />
  </div>
);
