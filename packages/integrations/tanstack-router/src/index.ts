export {
  Link as TanStackLink,
  useNavigate as useTanStackNavigate,
} from '@tanstack/react-router';

export interface BreadcrumbItem {
  label: string;
  to: string;
}
