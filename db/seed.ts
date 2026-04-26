import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-settings";
import shwetaFoodsData from "./shweta-foods-data";

const prisma: PrismaClient = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

/**
 * Resets and seeds the Shweta Foods demo: namkeen (Tara, Sitara, besan puri), snacks
 * (mini kachori, mini samosa), and khakhra (assorted + coin). Also restores default
 * tax/shipping site settings and admin + sample users.
 */
async function main() {
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.product.createMany({ data: shwetaFoodsData.products });

  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.user.createMany({ data: shwetaFoodsData.user });

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: { ...DEFAULT_SITE_SETTINGS },
    create: { id: "default", ...DEFAULT_SITE_SETTINGS },
  });
}

main()
  .then(() => console.log("✅ Shweta Foods seed complete"))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
