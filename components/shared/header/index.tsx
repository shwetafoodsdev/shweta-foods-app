import Image from 'next/image';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import { getProductCategories } from '@/lib/actions/product.actions';
import { getCartItemCount } from '@/lib/actions/cart.actions';
import SearchBar from './search-bar';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import UserMenu from './user-menu';
import { auth } from '@/auth';


const Header = async () => {
    const [categories, session, cartCount] = await Promise.all([
        getProductCategories(),
        auth().catch(() => null),
        getCartItemCount(),
    ]);
    return (
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="wrapper flex min-h-20 items-center gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Link href="/" className="group flex items-center gap-3 transition-transform duration-300 hover:scale-[1.01]">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-white to-accent/20 shadow-sm ring-1 ring-primary/10">
                <Image
                  src="/images/logo.svg"
                  alt={`${APP_NAME} logo`}
                  height={36}
                  width={36}
                />
              </span>
              <div className="hidden sm:block">
                <span className="block text-2xl font-semibold tracking-tight text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                  {APP_NAME}
                </span>
                <span className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                  Homemade premium snacks
                </span>
              </div>
            </Link>
          </div>
          <div className="hidden min-w-0 flex-[1.4] md:block">
            <SearchBar categories={categories} />
          </div>
          <nav className="hidden items-center gap-1 lg:flex">
            <Link href="/" className="rounded-full px-4 py-2 text-sm font-medium text-foreground transition-all duration-300 hover:bg-primary/10 hover:text-primary">
              Home
            </Link>
            <Link href="/products" className="rounded-full px-4 py-2 text-sm font-medium text-foreground transition-all duration-300 hover:bg-primary/10 hover:text-primary">
              Shop
            </Link>
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="relative size-11 rounded-full border border-border/70 bg-card/70 text-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground"
              title="Cart"
            >
              <Link
                href="/cart"
                className="relative"
                aria-label={
                  cartCount > 0
                    ? `Shopping cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`
                    : 'Shopping cart'
                }
              >
                <ShoppingCart className="size-5" aria-hidden />
                {cartCount > 0 ? (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold leading-none text-accent-foreground tabular-nums">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                ) : null}
              </Link>
            </Button>
            <UserMenu session={session} />
          </div>
        </div>
        <div className="wrapper pb-3 md:hidden">
          <SearchBar categories={categories} />
        </div>
      </header>
    );
};

export default Header;