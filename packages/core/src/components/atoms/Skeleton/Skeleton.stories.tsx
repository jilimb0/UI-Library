import type { Meta } from '@storybook/react-vite';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Atoms/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
};
export default meta;

export const Default = () => <Skeleton className="h-8 w-48" />;
