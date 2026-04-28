import { CircleDollarSign, Headset, ShieldCheck, Truck } from "lucide-react";

const items = [
  { title: "Free Shipping", text: "Free shipping on orders above ₹1,000", icon: Truck },
  { title: "Money Back Guarantee", text: "Within 30 days of purchase", icon: CircleDollarSign },
  { title: "Secure Payment", text: "Pay with card, UPI or COD", icon: ShieldCheck },
  { title: "24/7 Support", text: "Get support at any time", icon: Headset },
];

const HomeFeatureStrip = ({ hidden = true }: { hidden?: boolean }) => {
  if (hidden) return null;

  return (
    <section className="section-shell mt-6 mb-12 grid gap-4 p-6 md:grid-cols-4">
      {items.map((item) => (
        <div key={item.title} className="soft-lift rounded-2xl bg-background/80 p-4">
          <div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <item.icon className="size-5" />
          </div>
          <div>
            <div className="font-semibold text-foreground">{item.title}</div>
            <div className="text-sm text-muted-foreground">{item.text}</div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default HomeFeatureStrip;
