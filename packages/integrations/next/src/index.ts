import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const NextLink = Link;
export const NextImage = Image;

export function useNextNavigation() {
  const router = useRouter();
  return {
    push: router.push,
    replace: router.replace,
    back: router.back,
    refresh: router.refresh,
  };
}
