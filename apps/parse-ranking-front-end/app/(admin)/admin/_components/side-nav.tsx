import Link from 'next/link';

import { SiteLogo } from '../../../../src/components/site-logo';
import { NavLinks } from './nav-links';

export function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex items-center justify-start rounded-md p-4 gap-2"
        href="/admin/characters"
      >
        <SiteLogo />
        <h2 className="text-lg font-bold">Wow Ranking</h2>
      </Link>
      <div className="flex grow flex-row space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
      </div>
    </div>
  );
}
