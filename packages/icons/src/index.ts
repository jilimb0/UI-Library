import type { ComponentType, SVGProps } from 'react';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { BellIcon } from './icons/BellIcon';
import { CheckIcon } from './icons/CheckIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { ChevronUpIcon } from './icons/ChevronUpIcon';
import { CloseIcon } from './icons/CloseIcon';
import { HeartIcon } from './icons/HeartIcon';
import { HomeIcon } from './icons/HomeIcon';
import { MailIcon } from './icons/MailIcon';
import { SearchIcon } from './icons/SearchIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { StarIcon } from './icons/StarIcon';
import { UserIcon } from './icons/UserIcon';
import { UsersIcon } from './icons/UsersIcon';

export type IconProps = SVGProps<SVGSVGElement>;

export type IconName =
  | 'arrow-left'
  | 'arrow-right'
  | 'bell'
  | 'check'
  | 'chevron-down'
  | 'chevron-up'
  | 'close'
  | 'heart'
  | 'home'
  | 'mail'
  | 'search'
  | 'settings'
  | 'star'
  | 'user'
  | 'users'
  | 'x';

export const iconRegistry: Record<IconName, ComponentType<IconProps>> = {
  'arrow-left': ArrowLeftIcon,
  'arrow-right': ArrowRightIcon,
  bell: BellIcon,
  check: CheckIcon,
  'chevron-down': ChevronDownIcon,
  'chevron-up': ChevronUpIcon,
  close: CloseIcon,
  heart: HeartIcon,
  home: HomeIcon,
  mail: MailIcon,
  search: SearchIcon,
  settings: SettingsIcon,
  star: StarIcon,
  user: UserIcon,
  users: UsersIcon,
  x: CloseIcon,
};

export {
  ArrowLeftIcon,
  ArrowRightIcon,
  BellIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CloseIcon,
  HeartIcon,
  HomeIcon,
  MailIcon,
  SearchIcon,
  SettingsIcon,
  StarIcon,
  UserIcon,
  UsersIcon,
};

/** @deprecated Use IconName */
export type LucideIconName = IconName;
