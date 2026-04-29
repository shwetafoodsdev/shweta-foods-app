import { getProductBySlug } from "@/lib/actions/product.actions";
import ProductImages from "@/components/shared/product/product-images";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import AddToCartSection from "@/components/shared/product/add-to-cart-section";
import { formatCurrencyFromCents } from "@/lib/format";
import RatingStars from "@/components/shared/product/rating-stars";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canUserReviewProduct, createReview, getReviewsByProductId } from "@/lib/actions/review.actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PageBreadcrumb from "@/components/shared/page-breadcrumb";
import ReviewForm from "@/components/shared/product/review-form";
import DeleteReviewButton from "@/components/shared/product/delete-review-button";

type ProductReview = Awaited<ReturnType<typeof getReviewsByProductId>>[number];

const ProductDetailPage = async (props: PageProps<"/products/[slug]">) => {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) {
    notFound();
  }
  const session = await auth();
  const [reviews, cartItem, canReview] = await Promise.all([
    getReviewsByProductId(product.id),
    session?.user?.id
      ? prisma.cartItem.findUnique({
          where: { userId_productId: { userId: session.user.id, productId: product.id } },
        })
      : Promise.resolve(null),
    session?.user?.id ? canUserReviewProduct(session.user.id, product.id) : Promise.resolve(false),
  ]);

  async function onReviewSubmit(formData: FormData) {
    "use server";
    await createReview(formData);
  }

  return (
    <>
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: product.name },
        ]}
      />
      <section className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 items-start">
          <div className="w-full">
            <div className="w-full max-w-none rounded-lg md:max-w-xs">
              <ProductImages images={product.images} />
            </div>
          </div>
          <div className="md:py-10 md:space-y-6">
            <h1 className="h3-bold leading-tight mt-0">{product.name}</h1>
            <div className="flex flex-col gap-1 pt-3">
              <RatingStars value={Number(product.rating)} />
              <p className="text-sm text-muted-foreground">{reviews.length} reviews</p>

              {product.stock > 0 ? (
                <p className="inline-block bg-green-500/10 text-green-500 px-3 py-1 rounded-lg font-bold text-lg w-fit mt-1">
                  {formatCurrencyFromCents(Number(product.price))}
                </p>
              ) : (
                <p className="text-red-500 text-lg font-bold">Out of Stock</p>
              )}
            </div>
            <div className="pt-4 space-y-1">
              <h2 className="h4-bold">Product Description :</h2>
              <p>{product.description}</p>
            </div>
          </div>
          <div className="flex justify-start md:justify-end items-start mt-4 md:mt-10">
            <Card className="w-[260px] ">
              <CardContent className="p-3 space-y-3">
                <div className="mb-2 flex justify-between">
                  <div>Price</div>
                  <div>{formatCurrencyFromCents(Number(product.price))}</div>
                </div>
                <div className="mb-2 flex justify-between">
                  <div>Status</div>
                  <div>
                    {product.stock > 0 ? (
                      <Badge variant="outline">In Stock</Badge>
                    ) : (
                      <Badge variant="outline">Out of Stock</Badge>
                    )}
                  </div>
                </div>
                {product.stock > 0 ? (
                  <AddToCartSection
                    productId={product.id}
                    stock={product.stock}
                    currentQty={cartItem?.qty ?? 0}
                  />
                ) : null}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="mt-12">
        <h2 className="h2-bold mb-4">Customer Reviews</h2>
        {reviews.length ? (
          <div className="space-y-4">
            {reviews.map((review: ProductReview) => (
              <article key={review.id} className="theme-surface rounded-lg border p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                    <div className="font-semibold">{review.user.name || "Customer"}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  {session?.user?.id === review.userId ? (
                    <DeleteReviewButton reviewId={review.id} />
                  ) : null}
                </div>
                <div className="mt-1">
                  <RatingStars value={review.rating} />
                </div>
                {review.title ? <h3 className="mt-2 font-medium">{review.title}</h3> : null}
                {review.comment ? <p className="text-sm text-muted-foreground mt-1">{review.comment}</p> : null}
              </article>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No reviews yet.</p>
        )}
        {session?.user && canReview ? (
          <ReviewForm productId={product.id} action={onReviewSubmit} />
        ) : session?.user ? (
          <p className="mt-4 text-sm text-muted-foreground">
            You can write a review only after placing an order for this product.
          </p>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            Please <Link className="underline" href="/sign-in">sign in</Link> to write a review.
          </p>
        )}
      </section>
    </>
  );
};

export default ProductDetailPage;
