import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Star, ShoppingBag, X } from 'lucide-react';
import { useThemeSettings } from '../context/ThemeSettingsContext';
import { getFinalPrice } from '../lib/utils';

export default function QuickViewModal({ product, isOpen, onClose, onAddToCart }) {
  const { formatPrice } = useThemeSettings();

  if (!product) return null;

  const price = getFinalPrice(product);
  const originalPrice = Number(product.price);
  const image = product?.images?.[0]?.url || product?.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card text-card-foreground p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden relative">
            <img src={image} alt={product.title} className="w-full h-full object-cover" />
            <span className="absolute top-2 left-2 bg-black text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-widest">
              {product.featured ? 'NEW' : 'SEIKO'}
            </span>
          </div>
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                {product.category?.name || product.category || 'Seiko Collection'}
              </span>
              <DialogTitle className="text-xl font-bold mt-1 text-foreground">
                {product.title}
              </DialogTitle>
              <div className="flex items-center gap-1 my-2 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
                <span className="text-xs text-muted-foreground ml-2">(4.9 / 5.0)</span>
              </div>
              <div className="flex items-center gap-3 my-3">
                <span className="text-2xl font-extrabold text-foreground">
                  {formatPrice(price)}
                </span>
                {originalPrice > price && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(originalPrice)}
                  </span>
                )}
              </div>
              <DialogDescription className="text-sm text-muted-foreground line-clamp-3">
                {product.description || 'Precision-crafted luxury timepiece designed for elegance and durability.'}
              </DialogDescription>
            </div>
            <div className="space-y-2 pt-4 border-t border-border">
              <Button
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="w-full bg-black text-white hover:bg-neutral-800 flex items-center justify-center gap-2 py-6 rounded-none font-semibold"
              >
                <ShoppingBag className="w-5 h-5" /> Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
