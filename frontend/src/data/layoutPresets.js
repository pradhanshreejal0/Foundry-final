export const LAYOUT_PRESETS = [
  {
    id: "seiko-lumia",
    name: "Seiko Lumia Minimalist",
    description: "Clean Shopify 2.0 layout with Hero Carousel, Trust Strip, Category Grid, and Curated Products.",
    sections: [
      { id: "hero-1", type: "hero", title: "Hero Carousel", visible: true, order: 0 },
      { id: "trust-1", type: "trust", title: "Trust Strip", visible: true, order: 1 },
      { id: "categories-1", type: "categories", title: "Categories Grid", visible: true, order: 2 },
      { id: "featured-1", type: "featured", title: "Featured Products", visible: true, order: 3 },
      { id: "promo-1", type: "promo", title: "Promo Banner", visible: true, order: 4 },
      { id: "bestsellers-1", type: "bestsellers", title: "Bestsellers", visible: true, order: 5 },
    ]
  },
  {
    id: "high-impact-sale",
    name: "High-Impact Sale",
    description: "Promo banner first, followed by bestsellers and infinite product feed for maximum conversion.",
    sections: [
      { id: "promo-1", type: "promo", title: "Promo Banner", visible: true, order: 0 },
      { id: "trust-1", type: "trust", title: "Trust Strip", visible: true, order: 1 },
      { id: "bestsellers-1", type: "bestsellers", title: "Bestsellers", visible: true, order: 2 },
      { id: "featured-1", type: "featured", title: "Featured Products", visible: true, order: 3 },
      { id: "categories-1", type: "categories", title: "Categories Grid", visible: true, order: 4 },
    ]
  },
  {
    id: "curated-boutique",
    name: "Curated Boutique",
    description: "Category-focused layout starting with Category Grid and Hero Carousel.",
    sections: [
      { id: "categories-1", type: "categories", title: "Categories Grid", visible: true, order: 0 },
      { id: "hero-1", type: "hero", title: "Hero Carousel", visible: true, order: 1 },
      { id: "featured-1", type: "featured", title: "Featured Products", visible: true, order: 2 },
      { id: "trust-1", type: "trust", title: "Trust Strip", visible: true, order: 3 },
    ]
  }
];
