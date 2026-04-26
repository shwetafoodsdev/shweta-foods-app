import Image from 'next/image';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import { getProductCategories } from '@/lib/actions/product.actions';
import SearchBar from './search-bar';
import { Button } from '@/components/ui/button';
import ModeToggle from './mode-toggle';
import { ShoppingCart } from 'lucide-react';
import UserMenu from './user-menu';
import { auth } from '@/auth';


const Header = async () => {
    const [categories, session] = await Promise.all([getProductCategories(), auth()]);
    return (
        <header className="w-full border-b fixed top-0 left-0 bg-background z-50 h-16 flex ">
            <div className="wrapper flex-between">
                <div className="flex-start gap-3">
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
                <SearchBar categories={categories} />
                <div className="flex items-center gap-2">
                    <ModeToggle />
                    <Button asChild variant="ghost">
                        <Link href="/cart">
                            <ShoppingCart className="size-4" />
                            Cart
                        </Link>
                    </Button>
                    <UserMenu session={session} />
                </div>
            </div>
        </header>
    );
};

export default Header;