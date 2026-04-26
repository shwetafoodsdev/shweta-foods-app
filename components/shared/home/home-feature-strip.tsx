import { CircleDollarSign, Headset, ShieldCheck, Truck } from "lucide-react";

const items = [
  { title: "Free Shipping", text: "Free shipping on orders above ₹1,000", icon: Truck },
  { title: "Money Back Guarantee", text: "Within 30 days of purchase", icon: CircleDollarSign },
  { title: "Secure Payment", text: "Pay with card, UPI or COD", icon: ShieldCheck },
  { title: "24/7 Support", text: "Get support at any time", icon: Headset },
];

const HomeFeatureStrip = () => {
  return (
    <section className="mt-6 mb-8 grid gap-4 rounded-lg border p-4 md:grid-cols-4">
      {items.map((item) => (
        <div key={item.title} className="flex items-start gap-3">
          <item.icon className="mt-1 size-4" />
          <div>
            <div className="font-semibold">{item.title}</div>
            <div className="text-sm text-muted-foreground">{item.text}</div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default HomeFeatureStrip;
