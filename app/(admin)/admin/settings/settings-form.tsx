"use client";

import { updateSiteSettings } from "@/lib/actions/site-settings.actions";
import { useActionState } from "react";

const SettingsForm = ({
  shippingCharge,
  taxRate,
}: {
  shippingCharge: number;
  taxRate: number;
}) => {
  const [state, formAction, isPending] = useActionState(updateSiteSettings, null);

  return (
    <form action={formAction} className="max-w-xl space-y-5 rounded-lg border p-5">
      <div>
        <label className="text-sm font-medium">Shipping Charge (Rs) *</label>
        <input
          type="number"
          min="0"
          step="1"
          name="shippingCharge"
          className="mt-1 w-full rounded border px-3 py-2"
          defaultValue={shippingCharge}
          required
        />
        <p className="mt-1 text-xs text-muted-foreground">
          This fixed rupee charge will be added to each new order.
        </p>
      </div>
      <div>
        <label className="text-sm font-medium">Tax Rate (%) *</label>
        <input
          type="number"
          min="0"
          max="100"
          step="1"
          name="taxRate"
          className="mt-1 w-full rounded border px-3 py-2"
          defaultValue={taxRate}
          required
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Tax is calculated as a percentage of the item subtotal.
        </p>
      </div>
      {state ? (
        <p className={`text-sm ${state.success ? "text-green-600" : "text-destructive"}`}>
          {state.message}
        </p>
      ) : null}
      <button type="submit" className="rounded bg-slate-900 px-5 py-2 text-white disabled:opacity-70" disabled={isPending}>
        Save Charges
      </button>
    </form>
  );
};

export default SettingsForm;
