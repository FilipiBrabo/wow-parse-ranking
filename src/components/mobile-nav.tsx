'use client';

import {
  Button,
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui';
import { Menu } from 'lucide-react';
import { useState } from 'react';

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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="lg:hidden" variant="ghost" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="overflow-y-auto stable-scrollbar-gutter"
      >
        <SheetTitle className="flex gap-2 items-center">
          <SiteLogo />
          Ranking Brasileiro
        </SheetTitle>
        <ExpandableNavItems
          items={items}
          onItemClick={() => setIsOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
