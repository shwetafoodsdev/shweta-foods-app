import { Prisma } from "@prisma/client";
import sampleData from "@/db/sample-data";
import { LATEST_PRODUCTS_LIMIT } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

const visibleProductsFilter: Prisma.ProductWhereInput = { isVisiable: true };
const dealProductOrderBy: Prisma.ProductOrderByWithRelationInput = {
  dealEndsAt: "asc",
};

function getFallbackProducts() {
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

function isDatabaseInitializationError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientInitializationError ||
    (error instanceof Prisma.PrismaClientKnownRequestError && error.message.includes("prisma://"))
  );
}

//get latest products
export async function getLatestProducts() {
  try {
    const data = await prisma.product.findMany({
      where: visibleProductsFilter,
      orderBy: {
        createdAt: "desc",
      },
      take: Number(LATEST_PRODUCTS_LIMIT),
    });
    return data;
  } catch (error) {
    if (isDatabaseInitializationError(error)) {
      return getFallbackProducts()
        .filter((product) => product.isVisiable)
        .slice(0, Number(LATEST_PRODUCTS_LIMIT));
    }
    throw error;
  }
}

export async function getProductCategories() {
  try {
    const categories = await prisma.product.groupBy({
      where: visibleProductsFilter,
      by: ["category"],
      _count: true,
    });
    return categories.map((item: { category: string; _count: number }) => ({
      name: item.category,
      count: item._count,
    }));
  } catch (error) {
    if (isDatabaseInitializationError(error)) {
      const counts = new Map<string, number>();
      for (const product of sampleData.products.filter((item: { isVisiable: boolean }) => item.isVisiable)) {
        counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
      }
      return Array.from(counts.entries()).map(([name, count]) => ({ name, count }));
    }
    throw error;
  }
}

// Get single product by slug
export async function getProductBySlug(slug: string) {
  if (!slug) {
    return null;
  }

  try {
    const where: Prisma.ProductWhereInput = {
      slug,
      ...visibleProductsFilter,
    };
    const data = await prisma.product.findFirst({
      where,
    });
    return data;
  } catch (error) { 
    if (isDatabaseInitializationError(error)) {
      return getFallbackProducts().find((product) => product.slug === slug && product.isVisiable) ?? null;
    }
    throw error;
  }
}

export async function getFilteredProducts(params: {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort?: string;
  page?: number;
  pageSize?: number;
}) {
  const {
    q,
    category,
    minPrice,
    maxPrice,
    minRating,
    sort = "newest",
    page = 1,
    pageSize = 12,
  } = params;

  const where: Prisma.ProductWhereInput = {
    ...visibleProductsFilter,
    ...(q
      ? {
          OR: [
            {
              name: {
                contains: q,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              category: {
                contains: q,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              brand: {
                contains: q,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              slug: {
                contains: q.toLowerCase().replace(/\s+/g, "-"),
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        }
      : {}),
    ...(category && category !== "all" ? { category } : {}),
    ...(minRating ? { rating: { gte: minRating } } : {}),
    ...(minPrice !== undefined || maxPrice !== undefined
      ? {
          price: {
            ...(minPrice !== undefined ? { gte: minPrice } : {}),
            ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
          },
        }
      : {}),
  };

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (sort === "lowest") orderBy = { price: "asc" };
  if (sort === "highest") orderBy = { price: "desc" };
  if (sort === "rating") orderBy = { rating: "desc" };

  try {
    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  } catch (error) {
    if (isDatabaseInitializationError(error)) {
      const fallback = getFallbackProducts().filter((product) => {
        const normalizedQuery = q?.trim().toLowerCase() ?? "";
        const qMatch = normalizedQuery
          ? product.name.toLowerCase().includes(normalizedQuery) ||
            product.category.toLowerCase().includes(normalizedQuery) ||
            product.brand.toLowerCase().includes(normalizedQuery) ||
            product.slug.toLowerCase().includes(normalizedQuery.replace(/\s+/g, "-"))
          : true;
        const categoryMatch = category && category !== "all" ? product.category === category : true;
        const minPriceMatch = minPrice !== undefined ? product.price >= minPrice : true;
        const maxPriceMatch = maxPrice !== undefined ? product.price <= maxPrice : true;
        const minRatingMatch = minRating ? Number(product.rating) >= minRating : true;
        return product.isVisiable && qMatch && categoryMatch && minPriceMatch && maxPriceMatch && minRatingMatch;
      });
      return {
        data: fallback.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize),
        total: fallback.length,
        page,
        pageSize,
        totalPages: Math.max(1, Math.ceil(fallback.length / pageSize)),
      };
    }
    throw error;
  }
}

export async function getDealProduct() {
  try {
    const where: Prisma.ProductWhereInput = {
      ...visibleProductsFilter,
      isDealOfDay: true,
      dealEndsAt: { gt: new Date() },
    };
    const dealProduct = await prisma.product.findFirst({
      where,
      orderBy: dealProductOrderBy,
    });
    return dealProduct;
  } catch (error) {
    if (isDatabaseInitializationError(error)) {
      return (
        getFallbackProducts().find(
          (product) =>
            product.isVisiable && product.isDealOfDay && product.dealEndsAt && product.dealEndsAt > new Date()
        ) ?? null
      );
    }
    throw error;
  }
}
