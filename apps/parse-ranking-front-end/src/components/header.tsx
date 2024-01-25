import { SiDiscord, SiGithub } from '@icons-pack/react-simple-icons';
import Link from 'next/link';

import { NavItem } from './nav-item';
import { ThemeButton } from './theme-button';

export function Header() {
  const navItems = [
    {
      href: 'https://github.com/filipibrabo',
      icon: <SiGithub size="20" />,
    },
    {
      href: 'https://discord.com/users/248966937428623360',
      icon: <SiDiscord size="20" />,
    },
  ];

  return (
    <header className="sticky top-0 bg-background z-50 w-full shadow-sm">
      <div className="container flex items-center justify-between max-w-screen-xl mx-auto h-16 px-4">
        <Link href="#">Ranking Brasileiro</Link>

        <div className="flex gap-2 items-center">
          <nav className="flex items-center">
            {navItems.map((item) => (
              <NavItem key={item.href} href={item.href} icon={item.icon} />
            ))}
          </nav>
          <ThemeButton />
        </div>
      </div>
    </header>
  );
}
