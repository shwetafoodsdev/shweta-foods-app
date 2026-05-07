"use server";

import { auth } from "@/auth";
import sampleData from "@/db/sample-data";
import {
  deleteCloudinaryAssetByPublicId,
  getCloudinaryManagedFolder,
  getCloudinaryPublicIdFromUrl,
  isCloudinaryConfigured,
  uploadProductImageToCloudinary,
} from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { insertProductSchema } from "@/lib/validations";
import { Prisma } from "@prisma/client";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";

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
  if (/^\/images\/[^/]+-\d+\.[a-z0-9]+$/i.test(imagePath)) {
    return true;
  }

  if (/^\/uploads\/products\/[^/]+$/i.test(imagePath)) {
    return true;
  }

  const publicId = getCloudinaryPublicIdFromUrl(imagePath);
  if (!publicId) {
    return false;
  }

  return publicId.startsWith(`${getCloudinaryManagedFolder()}/`);
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
      if (imagePath.startsWith("/uploads/products/")) {
        const localFilePath = join(process.cwd(), "public", imagePath.replace(/^\//, ""));
        try {
          await unlink(localFilePath);
        } catch {
          // Ignore missing files.
        }
        return;
      }

      const publicId = getCloudinaryPublicIdFromUrl(imagePath);
      if (!publicId) {
        return;
      }

      await deleteCloudinaryAssetByPublicId(publicId);
    }),
  );
}

function getNextManagedImageIndex(images: string[]) {
  return images.reduce((maxIndex, imagePath) => {
    const match = imagePath.match(/-(\d+)\.[a-z0-9]+$/i);
    const index = match ? Number(match[1]) : 0;
    return Math.max(maxIndex, index);
  }, 0);
}

function extensionForMimeType(mimeType: string) {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
    "image/bmp": "bmp",
  };
  return map[mimeType] ?? "jpg";
}

async function saveUploadedProductImages(slug: string, files: File[], existingImages: string[]) {
  const savedImages: string[] = [];
  const startingIndex = getNextManagedImageIndex(existingImages);

  for (const [index, file] of files.entries()) {
    const nextIndex = startingIndex + index + 1;
    const bytes = Buffer.from(await file.arrayBuffer());
    const imageUrl = await uploadProductImageToCloudinary({
      bytes,
      slug,
      index: nextIndex,
    });
    savedImages.push(imageUrl);
  }

  return savedImages;
}

async function saveUploadedProductImagesLocally(slug: string, files: File[], existingImages: string[]) {
  const savedImages: string[] = [];
  const uploadDir = join(process.cwd(), "public", "uploads", "products");
  await mkdir(uploadDir, { recursive: true });
  const startingIndex = getNextManagedImageIndex(existingImages);
  const uploadBatchId = Date.now().toString(36);

  for (const [index, file] of files.entries()) {
    const nextIndex = startingIndex + index + 1;
    const ext = extensionForMimeType(file.type);
    const filename = `${slug}-${uploadBatchId}-${nextIndex}.${ext}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(join(uploadDir, filename), bytes);
    savedImages.push(`/uploads/products/${filename}`);
  }

  return savedImages;
}

export async function getAdminDashboardStats() {
  noStore();
  await requireAdmin();
  const [products, users, orders, orderStats] = await Promise.all([
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 6, include: { user: true } }),
    prisma.order.aggregate({
      where: { deliveredAt: { not: null } },
      _sum: { totalPrice: true },
      _count: true,
    }),
  ]);
  const revenue = orderStats._sum.totalPrice ?? 0;
  const salesCount = orderStats._count;
  return { products, users, orders, revenue, salesCount };
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

  const rawSlug = formData.get("slug")?.toString() ?? "";
  const slug = rawSlug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  const generatedImages = uploadedFiles.length
    ? uploadedFiles.map(
        (_, index) =>
          `https://res.cloudinary.com/placeholder/image/upload/${getCloudinaryManagedFolder()}/${slug}-${getNextManagedImageIndex(retainedImages) + index + 1}.jpg`,
      )
    : [];
  const candidateImages = Array.from(new Set([...retainedImages, ...generatedImages]));
  const dealEndsAt = isDealOfDay
    ? new Date(Date.now() + countdownHoursValue * 60 * 60 * 1000)
    : null;

  const parsed = insertProductSchema.safeParse({
    name: formData.get("name"),
    slug,
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
    ? isCloudinaryConfigured()
      ? await saveUploadedProductImages(parsed.data.slug, uploadedFiles, retainedImages)
      : await saveUploadedProductImagesLocally(parsed.data.slug, uploadedFiles, retainedImages)
    : [];
  const images = Array.from(new Set([...retainedImages, ...uploadedImages]));
  const removedImages = (existingProduct?.images ?? []).filter((image: string) => !retainedImages.includes(image));

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
