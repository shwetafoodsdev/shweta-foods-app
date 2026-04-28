"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

function revalidateCartAndHeader() {
  revalidatePath("/cart");
  revalidatePath("/", "layout");
}

const getSafeSession = cache(async () => {
  try {
    return await auth();
  } catch {
    return null;
  }
});

async function requireUserId() {
  const session = await getSafeSession();
  if (!session?.user?.id) {
    throw new Error("You must be signed in.");
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true },
  });
  if (!user) {
    throw new Error("Your session is stale. Please sign in again.");
  }
  return user.id;
}

export async function getMyCartItems() {
  const userId = await requireUserId();
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });
  return items;
}

export async function getCartSummary() {
  const items = await getMyCartItems();
  const totalItems = items.reduce((acc: number, item: { qty: number }) => acc + item.qty, 0);
  const subtotal = items.reduce(
    (acc: number, item: { qty: number; product: { price: number } }) => acc + item.qty * item.product.price,
    0,
  );
  return { items, totalItems, subtotal };
}

/** Total number of product units in the signed-in user’s cart; 0 if not signed in. */
export async function getCartItemCount(): Promise<number> {
  const session = await getSafeSession();
  if (!session?.user?.id) return 0;
  const result = await prisma.cartItem.aggregate({
    where: { userId: session.user.id },
    _sum: { qty: true },
  });
  return result._sum.qty ?? 0;
}

/** For listing pages: per-product line quantities for the current user. */
export async function getCartQtyByProductIds(productIds: string[]): Promise<Record<string, number>> {
  if (productIds.length === 0) return {};
  const session = await getSafeSession();
  if (!session?.user?.id) return {};
  const rows = await prisma.cartItem.findMany({
    where: { userId: session.user.id, productId: { in: productIds } },
    select: { productId: true, qty: true },
  });
  return Object.fromEntries(rows.map((r: { productId: string; qty: number }) => [r.productId, r.qty]));
}

export async function addToCart(productId: string, qty = 1) {
  try {
    const userId = await requireUserId();
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.stock < 1) {
      return { success: false, message: "Product is unavailable." };
    }

    const existing = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    const nextQty = Math.min((existing?.qty ?? 0) + qty, product.stock);
    if (existing) {
      await prisma.cartItem.update({
        where: { userId_productId: { userId, productId } },
        data: { qty: nextQty },
      });
    } else {
      await prisma.cartItem.create({
        data: { userId, productId, qty: Math.max(1, Math.min(qty, product.stock)) },
      });
    }
    revalidateCartAndHeader();
    revalidatePath(`/products/${product.slug}`);
    return { success: true };
  } catch (error) {
    const prismaErrorCode =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      typeof (error as { code?: unknown }).code === "string"
        ? (error as { code: string }).code
        : null;
    const message =
      prismaErrorCode === "P2003"
        ? "Your session is stale. Please sign in again."
        : error instanceof Error
          ? error.message
          : "Unable to add to cart right now.";
    const requiresSignIn =
      message === "You must be signed in." || message === "Your session is stale. Please sign in again.";
    return { success: false, message, requiresSignIn };
  }
}

export async function updateCartItemQty(productId: string, qty: number) {
  try {
    const userId = await requireUserId();
    const existing = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId } },
      include: { product: true },
    });
    if (!existing) return { success: false, message: "Cart item not found." };

    if (qty <= 0) {
      await prisma.cartItem.delete({
        where: { userId_productId: { userId, productId } },
      });
      revalidateCartAndHeader();
      revalidatePath(`/products/${existing.product.slug}`);
      return { success: true };
    }

    const nextQty = Math.min(qty, existing.product.stock);
    await prisma.cartItem.update({
      where: { userId_productId: { userId, productId } },
      data: { qty: nextQty },
    });
    revalidateCartAndHeader();
    revalidatePath(`/products/${existing.product.slug}`);
    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update cart.";
    return { success: false, message };
  }
}

export async function removeFromCart(productId: string) {
  try {
    const userId = await requireUserId();
    await prisma.cartItem.delete({
      where: { userId_productId: { userId, productId } },
    });
    revalidateCartAndHeader();
    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to remove cart item.";
    return { success: false, message };
  }
}
