import { getAdminProductById, getAdminProductCategories } from "@/lib/actions/admin.actions";
import ProductForm from "../../product-form";
import { notFound } from "next/navigation";

const AdminEditProductPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const [product, categories] = await Promise.all([getAdminProductById(id), getAdminProductCategories()]);
  if (!product) notFound();

  const productForForm = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: product.category,
    brand: product.brand,
    price: product.price,
    stock: product.stock,
    images: product.images,
    isVisiable: product.isVisiable,
    isDealOfDay: product.isDealOfDay,
    dealEndsAt: product.dealEndsAt?.toISOString() ?? null,
    description: product.description,
    banner: product.banner,
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
    seoKeywords: product.seoKeywords,
    rating: Number(product.rating),
  };

  return (
    <div>
      <h1 className="h2-bold mb-4">Edit Product</h1>
      <ProductForm product={productForForm} categories={categories} />
    </div>
  );
};

export default AdminEditProductPage;
