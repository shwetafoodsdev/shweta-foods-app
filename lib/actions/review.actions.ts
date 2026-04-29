"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const createReviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().optional(),
});

export async function canUserReviewProduct(userId: string, productId: string) {
  const order = await prisma.order.findFirst({
    where: {
      userId,
      status: { not: "cancelled" },
      orderItems: {
        some: { productId },
      },
    },
    select: { id: true },
  });

  return Boolean(order);
}

export async function getReviewsByProductId(productId: string) {
  return prisma.review.findMany({
    where: { productId },
    include: {
      user: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getFeaturedReviews(limit = 3) {
  return prisma.review.findMany({
    where: { rating: { gte: 4 } },
    include: {
      user: {
        select: { name: true },
      },
      product: {
        select: { name: true, slug: true },
      },
    },
    orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
    take: limit,
  });
}

export async function createReview(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Please sign in to write a review." };
  }

  const parsed = createReviewSchema.safeParse({
    productId: formData.get("productId"),
    rating: formData.get("rating"),
    title: formData.get("title")?.toString(),
    comment: formData.get("comment")?.toString(),
  });

  if (!parsed.success) {
    return { success: false, message: "Invalid review data." };
  }

  const { productId, rating, title, comment } = parsed.data;
  const canReview = await canUserReviewProduct(session.user.id, productId);

  if (!canReview) {
    return {
      success: false,
      message: "You can review this product only after ordering it.",
    };
  }

  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.review.upsert({
        where: { productId_userId: { productId, userId: session.user.id } },
        update: { rating, title, comment },
        create: {
          productId,
          userId: session.user.id,
          rating,
          title,
          comment,
        },
      });

      const aggregate = await tx.review.aggregate({
        where: { productId },
        _avg: { rating: true },
        _count: true,
      });

      await tx.product.update({
        where: { id: productId },
        data: {
          numReviews: aggregate._count,
          rating: aggregate._avg.rating ?? 0,
        },
      });
    });

    const product = await prisma.product.findUnique({ where: { id: productId }, select: { slug: true } });
    if (product) {
      revalidatePath(`/products/${product.slug}`);
    }
    return { success: true, message: "Review saved." };
  } catch {
    return { success: false, message: "Unable to save review." };
  }
}

const reviewIdSchema = z.string().uuid("Invalid review.");

export async function deleteReview(reviewId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false as const, message: "Please sign in." };
  }

  const idParsed = reviewIdSchema.safeParse(reviewId);
  if (!idParsed.success) {
    return { success: false as const, message: "Invalid review." };
  }

  const review = await prisma.review.findUnique({
    where: { id: idParsed.data },
    select: {
      userId: true,
      productId: true,
      product: { select: { slug: true } },
    },
  });

  if (!review || review.userId !== session.user.id) {
    return { success: false as const, message: "You can only delete your own review." };
  }

  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.review.delete({ where: { id: idParsed.data } });

      const aggregate = await tx.review.aggregate({
        where: { productId: review.productId },
        _avg: { rating: true },
        _count: true,
      });

      await tx.product.update({
        where: { id: review.productId },
        data: {
          numReviews: aggregate._count,
          rating: aggregate._avg.rating ?? 0,
        },
      });
    });

    revalidatePath(`/products/${review.product.slug}`);
    revalidatePath("/");

    return { success: true as const, message: "Review deleted." };
  } catch {
    return { success: false as const, message: "Unable to delete review." };
  }
}
