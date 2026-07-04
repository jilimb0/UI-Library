import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { AlertTriangleIcon } from '../icons/AlertTriangleIcon';
import { ArrowRightIcon } from '../icons/ArrowRightIcon';
import { BellIcon } from '../icons/BellIcon';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { HeartIcon } from '../icons/HeartIcon';
import { HomeIcon } from '../icons/HomeIcon';
import { SearchIcon } from '../icons/SearchIcon';
import { SettingsIcon } from '../icons/SettingsIcon';
import { UserIcon } from '../icons/UserIcon';
import type { IconName } from '../index';
import { iconRegistry } from '../index';

// ---------------------------------------------------------------------------
// Icon Grid — shows all available icons
// ---------------------------------------------------------------------------

const iconNames = Object.keys(iconRegistry) as IconName[];

function IconGrid({ size = 24, color }: { size?: number; color?: string }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: 16,
      }}
    >
      {iconNames.map((name) => {
        const Icon = iconRegistry[name];
        return (
          <div
            key={name}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              padding: 12,
              border: '1px solid #eee',
              borderRadius: 8,
              fontSize: 11,
              color: '#666',
            }}
          >
            <Icon width={size} height={size} color={color} />
            <span style={{ textAlign: 'center', wordBreak: 'break-all' }}>
              {name}
            </span>
          </div>
        );
      })}
    </div>
  );
}

const IconsGridMeta: Meta = {
  title: 'Icons/Grid',
  tags: ['autodocs'],
};

export default IconsGridMeta;

export const AllIcons: StoryObj = {
  name: 'All Icons (default size)',
  render: () => <IconGrid />,
};

export const AllIconsSmall: StoryObj = {
  name: 'All Icons (small, 16px)',
  render: () => <IconGrid size={16} />,
};

export const AllIconsLarge: StoryObj = {
  name: 'All Icons (large, 40px)',
  render: () => <IconGrid size={40} />,
};

export const AllIconsColored: StoryObj = {
  name: 'All Icons (custom color)',
  render: () => <IconGrid color="#1976d2" />,
};

// ---------------------------------------------------------------------------
// Individual Icon Stories
// ---------------------------------------------------------------------------

export const Search: StoryObj = {
  render: () => <SearchIcon width={24} height={24} />,
};

export const Heart: StoryObj<typeof HeartIcon> = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <HeartIcon width={16} height={16} color="#e91e63" />
      <HeartIcon width={24} height={24} color="#e91e63" />
      <HeartIcon width={32} height={32} color="#e91e63" />
      <HeartIcon width={48} height={48} color="#e91e63" />
    </div>
  ),
};

export const AlertTriangle: StoryObj<typeof AlertTriangleIcon> = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <AlertTriangleIcon width={24} height={24} color="#f57c00" />
      <AlertTriangleIcon width={24} height={24} color="#d32f2f" />
      <AlertTriangleIcon width={24} height={24} color="#fbc02d" />
    </div>
  ),
};

export const CheckCircle: StoryObj<typeof CheckCircleIcon> = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <CheckCircleIcon width={24} height={24} color="#4caf50" />
      <span style={{ color: '#4caf50', fontWeight: 600 }}>Verified</span>
    </div>
  ),
};

export const UserSettings: StoryObj = {
  name: 'User + Settings (side-by-side)',
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <UserIcon width={20} height={20} />
        <span>User</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <SettingsIcon width={20} height={20} />
        <span>Settings</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <ArrowRightIcon width={20} height={20} />
        <span>Next</span>
      </div>
    </div>
  ),
};

// ---------------------------------------------------------------------------
// Size Comparison
// ---------------------------------------------------------------------------

export const SizeComparison: StoryObj = {
  name: 'Size Comparison',
  render: () => {
    const sizes: { label: string; px: number }[] = [
      { label: 'sm', px: 16 },
      { label: 'md', px: 24 },
      { label: 'lg', px: 32 },
      { label: 'xl', px: 48 },
    ];
    return (
      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-end' }}>
        {sizes.map(({ label, px }) => (
          <div
            key={px}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <SettingsIcon width={px} height={px} />
            <span style={{ fontSize: 12, color: '#666' }}>
              {label} ({px}px)
            </span>
          </div>
        ))}
      </div>
    );
  },
};

// ---------------------------------------------------------------------------
// Color Palette
// ---------------------------------------------------------------------------

export const ColorPalette: StoryObj = {
  name: 'Color Palette',
  render: () => {
    const colors = [
      { name: 'Default', color: undefined },
      { name: 'Primary', color: '#1976d2' },
      { name: 'Success', color: '#388e3c' },
      { name: 'Warning', color: '#f57c00' },
      { name: 'Error', color: '#d32f2f' },
      { name: 'White', color: '#fff' },
    ];

    return (
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        {colors.map(({ name, color }) => (
          <div
            key={name}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              padding: 12,
              background: color === '#fff' ? '#333' : 'transparent',
              borderRadius: 8,
            }}
          >
            <BellIcon width={24} height={24} color={color} />
            <span style={{ fontSize: 11, color: '#666' }}>{name}</span>
          </div>
        ))}
      </div>
    );
  },
};

// ---------------------------------------------------------------------------
// Icons with Labels
// ---------------------------------------------------------------------------

const iconExamples: {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
}[] = [
  { Icon: HomeIcon, label: 'Home' },
  { Icon: SearchIcon, label: 'Search' },
  { Icon: SettingsIcon, label: 'Settings' },
  { Icon: UserIcon, label: 'Profile' },
  { Icon: HeartIcon, label: 'Favorites' },
  { Icon: AlertTriangleIcon, label: 'Warning' },
];

export const WithLabels: StoryObj = {
  name: 'With Labels',
  render: () => {
    const containerStyle: CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    };
    const rowStyle: CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '8px 12px',
      borderRadius: 6,
      border: '1px solid #f0f0f0',
    };

    return (
      <div style={containerStyle}>
        {iconExamples.map(({ Icon, label }) => (
          <div key={label} style={rowStyle}>
            <Icon width={20} height={20} />
            <span style={{ fontSize: 14 }}>{label}</span>
          </div>
        ))}
      </div>
    );
  },
};
