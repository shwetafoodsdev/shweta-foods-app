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
        auth(),
        getCartItemCount(),
    ]);
    return (
        <header className="w-full border-b fixed top-0 left-0 bg-background z-50 h-16 flex ">
            <div className="wrapper flex-between">
                <div className="flex-start shrink-0 gap-3">
                    <Link href="/" className="flex-start">
                        <Image
                            src="/images/logo.svg"
                            alt={`${APP_NAME} logo`}
                            height={36}
                            width={36}
                        />
                        <span className="hidden lg:block font-bold text-2xl ml-3">
                            {APP_NAME}
                        </span>
                    </Link>
                </div>
                <div className="min-w-0 flex-1 px-1.5 sm:px-3">
                    <SearchBar categories={categories} />
                </div>
                <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                    <Button asChild variant="ghost" size="icon" className="relative shrink-0" title="Cart">
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
                                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-slate-900 px-0.5 text-[10px] font-semibold leading-none text-white tabular-nums dark:bg-slate-100 dark:text-slate-900">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            ) : null}
                        </Link>
                    </Button>
                    <UserMenu session={session} />
                </div>
            </div>
        </header>
    );
};

export default Header;