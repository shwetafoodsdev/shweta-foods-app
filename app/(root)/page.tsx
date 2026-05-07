import { getDealProduct, getLatestProducts } from "@/lib/actions/product.actions";
import { getCartQtyByProductIds } from "@/lib/actions/cart.actions";
import ProductList from "@/components/shared/product/product-list";
import Link from "next/link";
import DealOfTheMonth from "@/components/shared/home/deal-of-the-month";
import HomeFeatureStrip from "@/components/shared/home/home-feature-strip";
import Image from "next/image";
import { Star } from "lucide-react";
import { getFeaturedReviews } from "@/lib/actions/review.actions";

type LatestProduct = Awaited<ReturnType<typeof getLatestProducts>>[number];
type FeaturedReview = Awaited<ReturnType<typeof getFeaturedReviews>>[number];

const whyChooseUs = [
  {
    title: "Authentic family recipes",
    text: "Snacks inspired by home kitchens, crafted for rich flavor and honest ingredients.",
  },
  {
    title: "Freshly packed quality",
    text: "Premium savory treats packed with care so every order feels fresh and festive.",
  },
  {
    title: "Thoughtful gifting worthy",
    text: "From everyday cravings to festive hampers, our packs feel elevated and memorable.",
  },
];

const Homepage = async () => {
  const products = await getLatestProducts();
  const [dealProduct, cartQtyByProductId, featuredReviews] = await Promise.all([
    getDealProduct(),
    getCartQtyByProductIds(products.map((p: LatestProduct) => p.id)),
    getFeaturedReviews(),
  ]);
  const dealProductData = dealProduct
    ? {
        slug: dealProduct.slug,
        name: dealProduct.name,
        brand: dealProduct.brand,
        rating: Number(dealProduct.rating),
        images: dealProduct.images,
        price: Number(dealProduct.price),
        dealEndsAt: dealProduct.dealEndsAt,
      }
    : null;
  const bestSellers = products.slice(0, 4);
  const festiveSpecials = dealProduct
    ? [dealProduct as LatestProduct, ...products.filter((p: LatestProduct) => p.id !== dealProduct.id).slice(0, 3)]
    : products.slice(0, 4);

  return (
    <>
      <section className="warm-gradient relative mb-10 overflow-hidden rounded-[1.75rem] border border-border/60 px-5 py-7 shadow-[0_24px_80px_rgba(93,64,55,0.12)] sm:py-9 md:mb-14 md:rounded-[2.5rem] md:px-10 md:py-12 dark:border-white/10 dark:shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.42),transparent_55%)] dark:bg-[radial-gradient(circle_at_center,rgba(230,126,34,0.18),transparent_58%)]" />
        <div className="grid items-center gap-8 md:grid-cols-[1.1fr_0.9fr] md:gap-10">
          <div className="relative z-10 max-w-2xl space-y-5 md:space-y-6">
            <div className="section-heading">Premium homemade snacks</div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl" style={{ fontFamily: "var(--font-heading)" }}>
                Shweta Foods
              </h1>
              <p className="max-w-xl text-lg leading-8 text-foreground/85 sm:text-xl md:text-2xl">
                Authentic Homemade Taste Delivered
              </p>
              <p className="max-w-xl text-base leading-7 text-muted-foreground dark:text-foreground/75">
                Curated namkeen, khakhra, mini kachori, and festive favorites designed to feel homemade, elegant, and gift-worthy.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="rounded-full bg-primary px-7 py-3 font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary">
                Shop Now
              </Link>
              <Link href="#why-choose-us" className="rounded-full border border-secondary/20 bg-background/70 px-7 py-3 font-medium text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary dark:border-white/20 dark:bg-black/25 dark:text-foreground">
                Why Choose Us
              </Link>
            </div>
          </div>
          <div className="relative z-10">
            <div className="overflow-hidden rounded-[1.75rem]">
              <Image
                src={dealProductData?.images[0] ?? "/images/sample-product.jpg"}
                alt={dealProductData?.name ?? "Shweta Foods assortment"}
                width={620}
                height={460}
                className="mx-auto h-[300px] w-full object-cover md:h-[360px]"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <ProductList
        data={bestSellers}
        title="Best Sellers"
        cartQtyByProductId={cartQtyByProductId}
        compactMobile
      />

      <DealOfTheMonth product={dealProductData} />

      <ProductList
        data={festiveSpecials}
        title="Festive Specials"
        cartQtyByProductId={cartQtyByProductId}
        compactMobile
      />

      <ProductList
        data={products}
        title="Shop snacks & savouries"
        cartQtyByProductId={cartQtyByProductId}
        compactMobile
      />
      <div className="flex justify-center">
        <Link href="/products" className="rounded-full bg-secondary px-7 py-3 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary">
          View All Products
        </Link>
      </div>
      <HomeFeatureStrip hidden />

      <section id="why-choose-us" className="section-shell my-14 p-8 md:p-10">
        <div className="section-heading">Why choose us</div>
        <div className="mb-8 flex flex-col gap-3 md:max-w-2xl">
          <h2 className="h2-bold text-foreground">A warm, premium food experience rooted in home-style comfort</h2>
          <p className="text-base leading-7 text-muted-foreground">
            Every pack is designed to feel thoughtful, fresh, and authentic, from the first bite to festive table sharing.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {whyChooseUs.map((item) => (
            <div key={item.title} className="theme-surface soft-lift rounded-[1.75rem] border border-border/60 p-6">
              <h3 className="mb-3 text-2xl font-semibold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                {item.title}
              </h3>
              <p className="text-sm leading-7 text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell my-14 p-8 md:p-10">
        <div className="section-heading">Customer Reviews</div>
        <div className="mb-8 flex flex-col gap-3 md:max-w-2xl">
          <h2 className="h2-bold text-foreground">Loved for their homemade warmth and premium finish</h2>
          <p className="text-base leading-7 text-muted-foreground">
            Real feedback from snack lovers who wanted authenticity without compromising on presentation or quality.
          </p>
        </div>
        {featuredReviews.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-3">
            {featuredReviews.map((review: FeaturedReview) => (
              <div key={review.id} className="theme-surface soft-lift rounded-[1.75rem] border border-border/60 p-6">
              <div className="mb-4 flex gap-1 text-primary">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={`${review.id}-${index}`}
                    className={`size-4 ${index < review.rating ? "fill-current" : ""}`}
                  />
                ))}
              </div>
                <p className="mb-5 text-sm leading-7 text-muted-foreground">
                  "
                  {review.comment?.trim() || review.title?.trim() || `${review.product.name} has become one of our household favorites.`}
                  "
                </p>
                <div className="text-base font-semibold text-foreground">{review.user.name || "Verified customer"}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.2em] text-primary/80">{review.product.name}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="theme-surface rounded-[1.75rem] border border-border/60 p-6 text-sm leading-7 text-muted-foreground">
            Customer reviews with 4+ stars will appear here automatically once they are added.
          </div>
        )}
      </section>
    </>
  );
};

export default Homepage;
