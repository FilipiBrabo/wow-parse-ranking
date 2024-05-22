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
        'pl-2 text-base text-slate-400 hover:text-foreground',
        isActive && 'text-blue-400 hover:text-blue-400'
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
              <AccordionTrigger className="font-bold text-lg">
                {item.title}
              </AccordionTrigger>
              <AccordionContent
                className="text-lg font-semibold"
                key={item.title}
              >
                <ExpandableNavItems
                  items={item.items}
                  onItemClick={onItemClick}
                />
              </AccordionContent>
            </AccordionItem>
          );
        }

        return (
          <div key={item.title} className="mb-2 last:mb-0">
            <LeafNavItem item={item} onClick={onItemClick} />
          </div>
        );
      })}
    </Accordion>
  );
}
