export {
  Link as TanStackLink,
  useNavigate as useTanStackNavigate,
} from '@tanstack/react-router';

export interface BreadcrumbItem {
  label: string;
  to: string;
}

export type {
  BreadcrumbSegment,
  RouterBreadcrumbsProps,
} from './RouterBreadcrumbs';
export { RouterBreadcrumbs } from './RouterBreadcrumbs';
export type { RouterLinkProps } from './RouterLink';
export { RouterLink } from './RouterLink';
export type {
  SidebarNavGroup,
  SidebarNavItem,
  SidebarNavProps,
} from './SidebarNav';
export { SidebarNav } from './SidebarNav';
