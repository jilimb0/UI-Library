import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from '../../atoms/Link';
import { MenuItem } from '../../molecules/MenuItem';
import { Navigation } from './Navigation';

const meta: Meta<typeof Navigation> = {
  title: 'Components/Organisms/Navigation',
  component: Navigation,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Navigation>;

export const Default: Story = {
  args: {
    children: (
      <div className="flex gap-4">
        <MenuItem active>Home</MenuItem>
        <MenuItem>About</MenuItem>
        <MenuItem>Services</MenuItem>
        <MenuItem>Contact</MenuItem>
      </div>
    ),
  },
};

export const WithLinks: Story = {
  args: {
    children: (
      <div className="flex gap-4">
        <Link href="#home">Home</Link>
        <Link href="#about">About</Link>
        <Link href="#services">Services</Link>
        <Link href="#contact">Contact</Link>
      </div>
    ),
  },
};

export const Vertical: Story = {
  args: {
    className: 'flex flex-col gap-2 w-48',
    children: (
      <>
        <MenuItem active>Dashboard</MenuItem>
        <MenuItem>Projects</MenuItem>
        <MenuItem>Settings</MenuItem>
        <MenuItem>Profile</MenuItem>
      </>
    ),
  },
};
