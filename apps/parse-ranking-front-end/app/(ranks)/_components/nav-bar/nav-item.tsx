'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  cn,
} from '@parse-ranking/shadcn-ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface NavItem {
  title: string;
  to: string;
  image?: string;
}

export interface ExpandableNavItem extends NavItem {
  items?: ExpandableNavItem[];
}

interface LeafNavItemProps {
  item: NavItem;
  onClick?: () => void;
}

function LeafNavItem({ item, onClick }: LeafNavItemProps) {
  const pathname = usePathname();

  const isActive = pathname === item.to;

  return (
    <Link
      href={item.to}
      className={cn(
        'flex items-center px-3 h-9 rounded text-muted-foreground w-full hover:bg-muted hover:text-foreground transition-all',
        isActive && 'bg-muted text-foreground'
      )}
      onClick={() => onClick?.()}
    >
      {item.title}
    </Link>
  );
}
interface ExpandableNavItemsProps {
  items?: (ExpandableNavItem | NavItem)[];
  onItemClick?: () => void;
}

export function ExpandableNavItems({
  items,
  onItemClick,
}: ExpandableNavItemsProps) {
  const pathname = usePathname();

  // TODO: Refactor, this will need to support N layers of nested items.
  // Maybe recursion can be a possible solution?
  const activeItemsTitles = items
    ?.filter((i) => {
      if (i.to === pathname) return true;

      return 'items' in i && !!i.items?.find((ii) => ii.to === pathname);
    })
    .map((item) => item.title);

  return (
    <Accordion type="multiple" defaultValue={activeItemsTitles}>
      {items?.map((item) => {
        const isExpandable = 'items' in item;

        if (isExpandable) {
          return (
            <AccordionItem key={item.title} value={item.title}>
              <AccordionTrigger className="font-bold text-md px-0 py-4">
                {item.title}
              </AccordionTrigger>
              <AccordionContent className="font-semibold pb-2" key={item.title}>
                <ExpandableNavItems
                  items={item.items}
                  onItemClick={onItemClick}
                />
              </AccordionContent>
            </AccordionItem>
          );
        }

        return (
          <div key={item.title} className="mb-1 last:mb-0 p-0">
            <LeafNavItem item={item} onClick={onItemClick} />
          </div>
        );
      })}
    </Accordion>
  );
}
