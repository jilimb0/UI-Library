import type { Meta } from '@storybook/react-vite';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Atoms/Skeleton',
  component: Skeleton,
};
export default meta;

export const Default = () => <Skeleton className="h-8 w-48" />;
