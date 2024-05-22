import {
  Button,
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@parse-ranking/shadcn-ui';
import { Menu } from 'lucide-react';

import {
  ExpandableNavItem,
  ExpandableNavItems,
  NavItem,
} from '../../app/_components/nav-bar/nav-item';
import { SiteLogo } from './site-logo';

interface MobileNavProps {
  items: (NavItem | ExpandableNavItem)[];
}
export function MobileNav({ items }: MobileNavProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="lg:hidden" variant="ghost" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetTitle className="flex gap-2 items-center">
          <SiteLogo />
          Ranking Brasileiro
        </SheetTitle>
        <ExpandableNavItems items={items} />
      </SheetContent>
    </Sheet>
  );
}
