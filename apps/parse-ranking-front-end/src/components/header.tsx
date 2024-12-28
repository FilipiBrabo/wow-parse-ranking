import Link from 'next/link';

import {
  ExpandableNavItem,
  NavItem,
} from '../../app/_components/nav-bar/nav-item';
import { serverClient } from '../../app/_trpc/server-client';
import { GithubIcon } from './github-icon';
import { MobileNav } from './mobile-nav';
import { NavLink } from './nav-item';
import { SiteLogo } from './site-logo';
import { ThemeButton } from './theme-button';

export async function Header() {
  const navItems = [
    {
      href: 'https://github.com/FilipiBrabo/wow-parse-ranking',
      icon: <GithubIcon className="w-5 h-5" />,
    },
  ];

  // TODO: This was copied from Sidebar. Maybe it's a good idea to extract
  const expansions = await serverClient.expansions.getAll();

  const items: (NavItem | ExpandableNavItem)[] = expansions.map(
    (expansion) => ({
      to: '',
      title: expansion.name ?? '',
      items: expansion.raid.map((raid) => ({
        to: `/raids/${raid.slug}`,
        title: raid.name,
      })),
    })
  );

  return (
    <header className="sticky top-0 bg-background z-50 shadow-sm">
      <div className="container flex items-center justify-between max-w-screen-xl mx-auto h-16 px-4 sm:px-6 lg:px-8">
        <div className="lg:hidden w-20">
          <MobileNav items={items} />
        </div>
        <Link href="/" className="flex items-center gap-1">
          <SiteLogo />
          <span className="hidden md:block font-bold whitespace-nowrap">
            Ranking Brasileiro
          </span>
        </Link>

        <div className="flex gap-2 items-center w-20">
          <nav className="flex items-center">
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href} icon={item.icon} />
            ))}
          </nav>
          <ThemeButton />
        </div>
      </div>
    </header>
  );
}
