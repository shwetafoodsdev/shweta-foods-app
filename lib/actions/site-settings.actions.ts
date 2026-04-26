"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { siteSettingsSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (session?.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
}

function getFirstValidationMessage(error: unknown) {
  if (typeof error === "object" && error && "issues" in error) {
    const issues = error.issues as Array<{ message?: string }>;
    return issues[0]?.message ?? "Invalid settings data.";
  }
  return "Invalid settings data.";
}

export async function updateSiteSettings(prevState: unknown, formData: FormData) {
  await requireAdmin();

  const parsed = siteSettingsSchema.safeParse({
    shippingCharge: Number(formData.get("shippingCharge") || 0),
    taxRate: Number(formData.get("taxRate") || 0),
  });

  if (!parsed.success) {
    return { success: false, message: getFirstValidationMessage(parsed.error) };
  }

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: parsed.data,
    create: {
      id: "default",
      ...parsed.data,
    },
  });

  revalidatePath("/admin/charges");
  revalidatePath("/checkout/place-order");
  revalidatePath("/cart");

  return { success: true, message: "Settings saved." };
}
