import { buttonVariants } from '@/components/ui';
import { ReactNode } from 'react';

type NavItemProps = {
  href: string;
  icon: ReactNode;
};

export function NavLink({ href, icon }: NavItemProps) {
  return (
    <a
      target="_blank"
      className={buttonVariants({ variant: 'ghost', size: 'icon' })}
      href={href}
    >
      {icon}
    </a>
  );
}
