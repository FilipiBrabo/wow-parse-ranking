'use client';

import { cn } from '@parse-ranking/shadcn-ui';
import { UserIcon, UsersIcon, SwordsIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  {
    name: 'Characters',
    href: '/admin/characters',
    icon: UserIcon,
  },
  {
    name: 'Guilds',
    href: '/admin/guilds',
    icon: UsersIcon,
  },
  {
    name: 'Raids',
    href: '/admin/raids',
    icon: SwordsIcon,
  },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              'flex items-center px-3 h-9 rounded text-muted-foreground w-full hover:bg-muted hover:text-foreground transition-all',
              pathname === link.href && 'bg-muted text-foreground'
            )}
          >
            <LinkIcon className="w-4 h-4 mr-2" />
            <p>{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
