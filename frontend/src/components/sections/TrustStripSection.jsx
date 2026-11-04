import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";

export function TrustStripSection() {
  const items = [
    { icon: Truck, title: "Free Shipping", desc: "On all orders over $50" },
    { icon: RotateCcw, title: "Free Returns", desc: "30-day hassle-free returns" },
    { icon: ShieldCheck, title: "Secured Payments", desc: "100% protected checkout" },
    { icon: Headphones, title: "24/7 Support", desc: "Dedicated customer service" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-border my-6">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 shadow-sm">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">{item.title}</h4>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
