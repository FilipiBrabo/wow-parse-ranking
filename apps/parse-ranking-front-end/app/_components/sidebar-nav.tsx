import { serverClient } from '../_trpc/server-client';
import {
  ExpandableNavItem,
  ExpandableNavItems,
  NavItem,
} from './nav-bar/nav-item';

export async function SidebarNav() {
  const expansions = await serverClient.expansions.getAll();

  const navItems: (NavItem | ExpandableNavItem)[] = expansions.map(
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
    <div>
      <ExpandableNavItems items={navItems} />
    </div>
  );
}
