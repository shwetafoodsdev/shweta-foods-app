"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireUserId() {
  const session = await auth();
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
  const totalItems = items.reduce((acc, item) => acc + item.qty, 0);
  const subtotal = items.reduce((acc, item) => acc + item.qty * item.product.price, 0);
  return { items, totalItems, subtotal };
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
    revalidatePath("/cart");
    revalidatePath(`/products/${product.slug}`);
    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to add to cart right now.";
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
      revalidatePath("/cart");
      revalidatePath(`/products/${existing.product.slug}`);
      return { success: true };
    }

    const nextQty = Math.min(qty, existing.product.stock);
    await prisma.cartItem.update({
      where: { userId_productId: { userId, productId } },
      data: { qty: nextQty },
    });
    revalidatePath("/cart");
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
    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to remove cart item.";
    return { success: false, message };
  }
}
