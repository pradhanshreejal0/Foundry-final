import ProductCarousel from "@/components/ProductCarousel";

export function ProductCarouselSection({ title = "Featured Products", subtitle = "Discover our top picks for this season" }) {
  return (
    <div className="my-10 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <ProductCarousel />
    </div>
  );
}
