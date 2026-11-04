import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import PriceTag from "@/components/PriceTag";
import StarRating from "@/components/StarRating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Eye } from "lucide-react";

export default function InfiniteProductFeed() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);

  const fetchProducts = async (pageNum) => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const data = await api(`/products?page=${pageNum}&limit=8`);
      const items = Array.isArray(data) ? data : data?.products || [];
      if (items.length === 0) {
        setHasMore(false);
      } else {
        setProducts((prev) => [...prev, ...items]);
        setPage(pageNum + 1);
      }
    } catch (err) {
      console.error("Failed to load products for infinite feed", err);
      // Fallback sample products if API doesn't return list
      if (pageNum === 1) {
        setProducts([
          { id: "1", title: "Short Denim Shorts", price: 45, rating: 4.5, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80", badge: "NEW" },
          { id: "2", title: "Men's Smooth Jacket", price: 120, rating: 4.8, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80", badge: "SALE" },
          { id: "3", title: "Satin Padded Jacket", price: 150, rating: 4.2, image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=600&q=80", badge: "SUBSCRIPTION ONLY" },
          { id: "4", title: "Classic White Sneakers", price: 85, rating: 4.7, image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80", badge: "NEW" },
        ]);
        setHasMore(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchProducts(page);
        }
      },
      { threshold: 1.0 }
    );
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [hasMore, loading, page]);

  return (
    <div className="my-10 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Explore All Products</h2>
          <p className="text-sm text-muted-foreground">Scroll down to discover more items seamlessly</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p, idx) => (
          <div key={`${p.id || idx}-${idx}`} className="group relative bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
            <div className="relative h-64 overflow-hidden bg-muted">
              {p.badge && (
                <Badge className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground font-semibold text-xs">
                  {p.badge}
                </Badge>
              )}
              <img
                src={p.image || p.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"}
                alt={p.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition flex gap-2 justify-center">
                <Button size="icon" variant="secondary" className="rounded-full shadow">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="secondary" className="rounded-full shadow">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="default" className="rounded-full shadow">
                  <ShoppingBag className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <h3 className="font-semibold text-base truncate">{p.title}</h3>
              <div className="flex justify-between items-center">
                <PriceTag price={p.price} />
                <StarRating rating={p.rating || 4.5} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div ref={loaderRef} className="py-8 text-center text-sm text-muted-foreground">
        {loading ? "Loading more products..." : hasMore ? "Scroll for more" : "You've reached the end of the catalog."}
      </div>
    </div>
  );
}
