import { getAdminProductCategories } from "@/lib/actions/admin.actions";
import ProductForm from "../product-form";

const AdminCreateProductPage = async () => {
  const categories = await getAdminProductCategories();
  return (
    <div>
      <h1 className="h2-bold mb-4">Create Product</h1>
      <ProductForm categories={categories} />
    </div>
  );
};

export default AdminCreateProductPage;
