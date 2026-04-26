import { getAdminProductById } from "@/lib/actions/admin.actions";
import ProductForm from "../../product-form";
import { notFound } from "next/navigation";

const AdminEditProductPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const product = await getAdminProductById(id);
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
    rating: Number(product.rating),
  };

  return (
    <div>
      <h1 className="h2-bold mb-4">Edit Product</h1>
      <ProductForm product={productForForm} />
    </div>
  );
};

export default AdminEditProductPage;
