import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type BreadcrumbItem = { label: string; href?: string };

type Props = { items: BreadcrumbItem[] };

const PageBreadcrumb = ({ items }: Props) => {
  if (items.length === 0) return null;

  return (
    <nav className="mb-6" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex max-w-full items-center gap-1">
              {index > 0 && (
                <ChevronRight className="size-3.5 shrink-0 opacity-60" aria-hidden />
              )}
              {isLast || !item.href ? (
                <span className="line-clamp-1 font-medium text-foreground" aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="line-clamp-1 rounded-sm hover:text-foreground hover:underline"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default PageBreadcrumb;
