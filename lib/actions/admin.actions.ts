"use server";

import { auth } from "@/auth";
import sampleData from "@/db/sample-data";
import { prisma } from "@/lib/prisma";
import { insertProductSchema } from "@/lib/validations";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

async function requireAdmin() {
  const session = await auth();
  if (session?.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
}

function isDatabaseInitializationError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientInitializationError ||
    (error instanceof Prisma.PrismaClientKnownRequestError &&
      (error.message.includes("prisma://") || error.code === "P1001"))
  );
}

function getFallbackAdminProducts() {
  return sampleData.products.map((product, index) => ({
    id: `${index + 1}`,
    name: product.name,
    slug: product.slug,
    price: product.price,
    description: product.description,
    stock: product.stock,
    category: product.category,
    brand: product.brand,
    images: product.images,
    banner: product.banner ?? undefined,
    rating: product.rating,
    isVisiable: product.isVisiable,
    isDealOfDay: product.isDealOfDay ?? false,
    dealEndsAt: product.dealEndsAt ?? null,
    createdAt: new Date(),
  }));
}

function parseImageEntries(entries: FormDataEntryValue[]) {
  return entries
    .map((entry) => entry.toString().trim())
    .filter(Boolean);
}

function getFirstValidationMessage(error: unknown) {
  if (typeof error === "object" && error && "issues" in error) {
    const issues = error.issues as Array<{ message?: string }>;
    return issues[0]?.message ?? "Invalid product data.";
  }
  return "Invalid product data.";
}

function isManagedProductImage(imagePath: string) {
  return /^\/images\/[^/]+-\d+\.jpg$/i.test(imagePath);
}

const supportedImageTypes = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/bmp",
]);

async function removeManagedProductImages(images: string[]) {
  await Promise.all(
    images.filter(isManagedProductImage).map(async (imagePath) => {
      const filePath = path.join(process.cwd(), "public", imagePath.replace(/^\//, ""));
      try {
        await unlink(filePath);
      } catch (error) {
        const fileError = error as NodeJS.ErrnoException;
        if (fileError.code !== "ENOENT") {
          throw error;
        }
      }
    })
  );
}

function getNextManagedImageIndex(images: string[]) {
  return images.reduce((maxIndex, imagePath) => {
    const match = imagePath.match(/-(\d+)\.jpg$/i);
    const index = match ? Number(match[1]) : 0;
    return Math.max(maxIndex, index);
  }, 0);
}

async function saveUploadedProductImages(slug: string, files: File[], existingImages: string[]) {
  const imagesDir = path.join(process.cwd(), "public", "images");
  await mkdir(imagesDir, { recursive: true });

  const savedImages: string[] = [];
  const startingIndex = getNextManagedImageIndex(existingImages);

  for (const [index, file] of files.entries()) {
    const nextIndex = startingIndex + index + 1;
    const filePath = path.join(imagesDir, `${slug}-${nextIndex}.jpg`);
    const bytes = Buffer.from(await file.arrayBuffer());
    const jpegBuffer = await sharp(bytes).jpeg({ quality: 90 }).toBuffer();
    await writeFile(filePath, jpegBuffer);
    savedImages.push(`/images/${slug}-${nextIndex}.jpg`);
  }

  return savedImages;
}

export async function getAdminDashboardStats() {
  await requireAdmin();
  const [products, users, orders] = await Promise.all([
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 6, include: { user: true } }),
  ]);
  const revenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
  return { products, users, orders, revenue };
}

export async function getAdminProducts() {
  await requireAdmin();
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
    return {
      products,
      isFallback: false,
    };
  } catch (error) {
    if (isDatabaseInitializationError(error)) {
      return {
        products: getFallbackAdminProducts(),
        isFallback: true,
      };
    }
    throw error;
  }
}

export async function getAdminProductById(id: string) {
  await requireAdmin();
  return prisma.product.findUnique({ where: { id } });
}

export async function saveAdminProduct(prevState: unknown, formData: FormData) {
  await requireAdmin();
  const id = formData.get("id")?.toString();
  const existingProduct = id
    ? await prisma.product.findUnique({
        where: { id },
        select: { images: true },
      })
    : null;

  const uploadedFiles = formData
    .getAll("imageFiles")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
  const retainedImages = parseImageEntries(formData.getAll("retainedImages"));
  const isDealOfDay = formData.get("isDealOfDay") === "on";
  const countdownHoursValue = Number(formData.get("dealCountdownHours") || 0);

  if (isDealOfDay && (!Number.isFinite(countdownHoursValue) || countdownHoursValue <= 0)) {
    return { success: false, message: "Enter a valid deal countdown in hours." };
  }

  if (
    uploadedFiles.some(
      (file) => file.type !== "" && !supportedImageTypes.has(file.type)
    )
  ) {
    return { success: false, message: "Only valid image files are supported for product uploads." };
  }

  const slug = formData.get("slug")?.toString().trim() ?? "";
  const generatedImages = uploadedFiles.length
    ? uploadedFiles.map((_, index) => `/images/${slug}-${getNextManagedImageIndex(retainedImages) + index + 1}.jpg`)
    : [];
  const candidateImages = [...retainedImages, ...generatedImages];
  const dealEndsAt = isDealOfDay
    ? new Date(Date.now() + countdownHoursValue * 60 * 60 * 1000)
    : null;

  const parsed = insertProductSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    category: formData.get("category"),
    description: formData.get("description"),
    images: candidateImages,
    price: Number(formData.get("price") || 0),
    brand: formData.get("brand"),
    rating: Number(formData.get("rating") || 5),
    stock: Number(formData.get("stock") || 0),
    isVisiable: formData.get("isVisiable") === "on",
    isDealOfDay,
    dealEndsAt,
    banner: formData.get("banner")?.toString() || undefined,
  });

  if (!parsed.success) {
    return { success: false, message: getFirstValidationMessage(parsed.error) };
  }

  const uploadedImages = uploadedFiles.length
    ? await saveUploadedProductImages(parsed.data.slug, uploadedFiles, retainedImages)
    : [];
  const images = [...retainedImages, ...uploadedImages];
  const removedImages = (existingProduct?.images ?? []).filter((image) => !retainedImages.includes(image));

  if (parsed.data.isDealOfDay) {
    await prisma.product.updateMany({
      where: {
        isDealOfDay: true,
        ...(id ? { NOT: { id } } : {}),
      },
      data: {
        isDealOfDay: false,
        dealEndsAt: null,
      },
    });
  }

  if (id) {
    await prisma.product.update({
      where: { id },
      data: {
        ...parsed.data,
        images,
      },
    });
  } else {
    await prisma.product.create({
      data: {
        ...parsed.data,
        images,
      },
    });
  }
  await removeManagedProductImages(removedImages);
  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

export async function deleteAdminProduct(id: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  return { success: true };
}

export async function getAdminUsers() {
  await requireAdmin();
  return prisma.user.findMany({ orderBy: { createdAt: "desc" } });
}

export async function updateUserRole(formData: FormData) {
  await requireAdmin();
  const userId = formData.get("userId")?.toString() ?? "";
  const role = formData.get("role")?.toString() ?? "user";
  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });
  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteUser(userId: string) {
  await requireAdmin();
  const session = await auth();
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return { success: false, message: "User not found." };
  }
  if (session?.user.id === userId) {
    return { success: false, message: "You cannot delete your own account." };
  }
  if (user.role === "admin") {
    const adminCount = await prisma.user.count({ where: { role: "admin" } });
    if (adminCount <= 1) {
      return { success: false, message: "At least one admin account must remain." };
    }
  }
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
  return { success: true };
}
