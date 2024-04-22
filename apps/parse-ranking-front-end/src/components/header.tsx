import { SiGithub } from '@icons-pack/react-simple-icons';
import Image from 'next/image';
import Link from 'next/link';

import { NavItem } from './nav-item';
import { ThemeButton } from './theme-button';

export function Header() {
  const navItems = [
    {
      href: 'https://github.com/FilipiBrabo/wow-parse-ranking',
      icon: <SiGithub size="20" />,
    },
  ];

  return (
    <header className="sticky top-0 bg-background z-50 w-full shadow-sm">
      <div className="container flex items-center justify-between max-w-screen-xl mx-auto h-16 px-4">
        <Link href="#" className="flex items-center gap-1">
          <div className="w-8 h-8 md:w-10 md:h-10 relative">
            <Image
              src="/images/wow-token.png"
              fill={true}
              sizes="(max-width: 768px) 2rem, 2.5rem"
              alt="Logo"
            />
          </div>
          <div className="font-bold">Ranking Brasileiro</div>
        </Link>

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
