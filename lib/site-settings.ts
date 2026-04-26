import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const DEFAULT_SITE_SETTINGS = {
  shippingCharge: 0,
  taxRate: 15,
} as const;

function isSiteSettingsTableMissing(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.message.includes("SiteSettings");
}

export async function getSiteSettings() {
  try {
    return await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: {},
      create: {
        id: "default",
        ...DEFAULT_SITE_SETTINGS,
      },
    });
  } catch (error) {
    if (isSiteSettingsTableMissing(error)) {
      return {
        id: "default",
        ...DEFAULT_SITE_SETTINGS,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    throw error;
  }
}

export function calculateOrderCharges(subtotal: number, settings: { shippingCharge: number; taxRate: number }) {
  const shippingPrice = settings.shippingCharge;
  const taxPrice = Math.round((subtotal * settings.taxRate) / 100);
  const totalPrice = subtotal + shippingPrice + taxPrice;

  return {
    shippingPrice,
    taxPrice,
    totalPrice,
  };
}
