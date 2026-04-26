import { redirect } from "next/navigation";

const AdminSettingsPage = async () => {
  redirect("/admin/charges");
};

export default AdminSettingsPage;
