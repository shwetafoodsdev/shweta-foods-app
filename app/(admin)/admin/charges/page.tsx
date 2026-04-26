import SettingsForm from "../settings/settings-form";
import { getSiteSettings } from "@/lib/site-settings";

const AdminChargesPage = async () => {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="h2-bold">Charges</h1>
        <p className="text-sm text-muted-foreground">
          Manage the default shipping charge in rupees and the tax percentage used for new orders.
        </p>
      </div>
      <SettingsForm shippingCharge={settings.shippingCharge} taxRate={settings.taxRate} />
    </div>
  );
};

export default AdminChargesPage;
