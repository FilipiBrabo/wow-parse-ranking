import { cn } from '@/lib/utils';

type ExternalLinkProps = {
  href: string;
  title: string;
  className?: string;
};

export function ExternalLink({ href, title, className }: ExternalLinkProps) {
  return (
    <a
      className={cn('flex items-center gap-0.5 hover:underline', className)}
      target="_blank"
      href={href}
    >
      {title}
      {/* <ExternalLinkIcon size="12" /> */}
    </a>
  );
}
