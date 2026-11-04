import { Button } from "@/components/ui/button";

export function PromoBannerSection() {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-primary text-primary-foreground p-8 md:p-12 my-10 shadow-xl">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80')] opacity-15 bg-cover bg-center" />
      <div className="relative z-10 max-w-xl space-y-4">
        <span className="bg-background text-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Limited Offer
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Season Sale - Up to 40% Off
        </h2>
        <p className="text-primary-foreground/80 text-sm md:text-base">
          Shop the biggest trends of the season with exclusive discounts and subscription-only privileges.
        </p>
        <div>
          <Button variant="secondary" size="lg" className="rounded-full px-8 font-semibold shadow" asChild>
            <a href="/shop">Shop the Sale</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
