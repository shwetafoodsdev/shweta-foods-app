"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { calculateOrderCharges, getSiteSettings } from "@/lib/site-settings";
import { Prisma } from "@prisma/client";
import { shippingAddressSchema } from "@/lib/validations";

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Authentication required");
  return session.user.id;
}

export async function saveShippingAddress(formData: FormData) {
  const userId = await requireUserId();
  const parsed = shippingAddressSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    address1: formData.get("address1"),
    address2: formData.get("address2"),
    city: formData.get("city"),
    state: formData.get("state"),
    postalCode: formData.get("postalCode"),
    country: formData.get("country"),
    countryCode: formData.get("countryCode"),
    phone: formData.get("phone"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid shipping details.",
    };
  }

  const {
    firstName,
    lastName,
    address1,
    address2,
    city,
    state,
    postalCode,
    country,
    countryCode,
    phone,
  } = parsed.data;

  const shipping = {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`.trim(),
    address1,
    address2: address2 ?? "",
    city,
    state,
    postalCode,
    country,
    countryCode,
    phone,
    phoneWithCode: `${countryCode} ${phone}`.trim(),
  };

  await prisma.user.update({
    where: { id: userId },
    data: { address: shipping },
  });

  return { success: true };
}

export async function savePaymentMethod(formData: FormData) {
  const userId = await requireUserId();
  const method = formData.get("paymentMethod")?.toString() === "cod" ? "cod" : "cod";
  await prisma.user.update({
    where: { id: userId },
    data: { paymentMethods: method },
  });
  return { success: true };
}

export async function getCheckoutState() {
  const userId = await requireUserId();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { address: true, paymentMethods: true, name: true, email: true },
  });
  return user;
}

export async function placeOrder() {
  const userId = await requireUserId();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { address: true, paymentMethods: true },
  });
  if (!user?.address) {
    return { success: false, message: "Shipping address missing." };
  }

  const shipping = user.address as Record<string, string>;
  const paymentMethod = (user.paymentMethods ?? "cod") as "cod" | "paypal" | "stripe";

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });
  if (!cartItems.length) {
    return { success: false, message: "Cart is empty." };
  }

  const itemsPrice = cartItems.reduce(
    (acc: number, item: { qty: number; product: { price: number } }) => acc + item.qty * item.product.price,
    0,
  );
  const settings = await getSiteSettings();
  const { shippingPrice, taxPrice, totalPrice } = calculateOrderCharges(itemsPrice, settings);

  const order = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    for (const item of cartItems) {
      if (item.qty > item.product.stock) {
        throw new Error(`Insufficient stock for ${item.product.name}`);
      }
    }

    const createdOrder = await tx.order.create({
      data: {
        userId,
        status: paymentMethod === "cod" ? "paid" : "pending",
        paymentMethod,
        paidAt: paymentMethod === "cod" ? new Date() : null,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        shippingFullName: shipping.fullName ?? "",
        shippingAddress1: shipping.address1 ?? "",
        shippingAddress2: shipping.address2 || null,
        shippingCity: shipping.city ?? "",
        shippingPostalCode: shipping.postalCode ?? "",
        shippingCountry: shipping.country ?? "",
        shippingPhone: shipping.phone || null,
        orderItems: {
          create: cartItems.map((item: { productId: string; qty: number; product: { price: number; name: string; images: string[] } }) => ({
            productId: item.productId,
            qty: item.qty,
            unitPrice: item.product.price,
            name: item.product.name,
            image: item.product.images[0] ?? "",
          })),
        },
      },
    });

    for (const item of cartItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.qty } },
      });
    }

    await tx.cartItem.deleteMany({ where: { userId } });
    return createdOrder;
  });

  revalidatePath("/cart");
  revalidatePath("/", "layout");
  return { success: true, orderId: order.id };
}

export async function getOrderById(orderId: string) {
  const userId = await requireUserId();
  const session = await auth();
  return prisma.order.findFirst({
    where: {
      id: orderId,
      ...(session?.user.role === "admin" ? {} : { userId }),
    },
    include: {
      orderItems: true,
      user: { select: { name: true, email: true } },
    },
  });
}

export async function getMyOrders() {
  const userId = await requireUserId();
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminOrders() {
  const session = await auth();
  if (session?.user.role !== "admin") return [];
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });
}

export async function getAdminOrderById(orderId: string) {
  const session = await auth();
  if (session?.user.role !== "admin") return null;
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: true,
      user: { select: { name: true, email: true } },
    },
  });
}

export async function markOrderDelivered(orderId: string) {
  const session = await auth();
  if (session?.user.role !== "admin") {
    return { success: false, message: "Unauthorized" };
  }
  await prisma.order.update({
    where: { id: orderId },
    data: { deliveredAt: new Date(), status: "shipped" },
  });
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}
