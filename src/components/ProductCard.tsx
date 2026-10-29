import React from 'react';
import { motion } from 'motion/react';
import { Product } from '../types/store';
import { useStore } from '../context/StoreContext';
import { Heart, ShoppingBag, Eye, MessageSquare, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails }) => {
  const { formatPrice, addToCart, toggleWishlist, isWishlisted, businessInfo } = useStore();
  const wishlisted = isWishlisted(product.id);

  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case 'Hot':
      case 'Best Seller':
        return 'bg-gradient-to-r from-[#FF3366] to-[#E11D48] text-white shadow-[#FF3366]/40';
      case 'Trending':
        return 'bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white shadow-[#8B5CF6]/40';
      case 'New Arrival':
        return 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/40';
      case 'Limited Stock':
        return 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-amber-500/40';
      default:
        return 'bg-[#1F2433] text-zinc-200 border border-white/10';
    }
  };

  const cleanWhatsapp = businessInfo.whatsapp.replace(/[^0-9]/g, '');

  const handleWhatsAppQuickOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultSize = product.sizes?.[0] || 'Standard';
    const text = `Hi Classy Outfits! I want to order this item directly:\n\n*Product:* ${product.title}\n*Category:* ${product.category.toUpperCase()}\n*Price:* ${formatPrice(product.price)}\n*Selected Size:* ${defaultSize}\n\nPlease confirm availability and payment details to ${businessInfo.phone}. Thank you!`;
    window.open(`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultSize = product.sizes?.[0] || 'Standard';
    addToCart(product, defaultSize);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      onClick={() => onOpenDetails(product)}
      className="group relative rounded-2xl bg-[#11131A] border border-white/10 hover:border-[#FF3366]/50 overflow-hidden cursor-pointer flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-[#FF3366]/10"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[4/4.5] w-full overflow-hidden bg-[#181B26]">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#11131A] via-transparent to-black/30 opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Badges on Top Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-md ${getBadgeStyle(product.badge)}`}>
              {product.badge}
            </span>
          )}
          {discountPercent && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FF3366] text-white">
              -{discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button on Top Right */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            wishlisted
              ? 'bg-[#FF3366] text-white shadow-lg shadow-[#FF3366]/50 scale-110'
              : 'bg-black/40 hover:bg-black/70 text-zinc-300 hover:text-white'
          }`}
          title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <span className="px-4 py-2 rounded-full bg-black/80 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 shadow-xl border border-white/20 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" /> Quick View
          </span>
        </div>

        {/* Stock status indicator */}
        {!product.inStock && (
          <div className="absolute bottom-2 left-2 right-2 bg-red-950/80 backdrop-blur-sm border border-red-500/40 text-red-200 text-[11px] font-bold uppercase tracking-wider py-1 px-2 rounded-md text-center">
            Sold Out / Next Batch Soon
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Gender */}
          <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium uppercase tracking-wider mb-1">
            <span className="text-[#A78BFA]">{product.category}</span>
            <span>{product.gender || 'women'}</span>
          </div>

          {/* Title */}
          <h3 className="font-heading text-base font-bold text-white group-hover:text-[#FF5376] transition-colors line-clamp-1">
            {product.title}
          </h3>

          {/* Sizes preview chips */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 mt-2">
              <span className="text-[10px] text-zinc-500 uppercase font-semibold mr-1">Sizes:</span>
              {product.sizes.slice(0, 4).map((size) => (
                <span
                  key={size}
                  className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#1A1D2B] text-zinc-300 border border-white/5"
                >
                  {size}
                </span>
              ))}
              {product.sizes.length > 4 && (
                <span className="text-[10px] text-zinc-500">+{product.sizes.length - 4}</span>
              )}
            </div>
          )}
        </div>

        {/* Pricing & Order Actions */}
        <div className="pt-2 border-t border-white/5 space-y-3">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-lg font-bold text-white tracking-tight">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="font-mono text-xs text-zinc-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-400 font-mono font-medium">
              M-Pesa Ready
            </span>
          </div>

          {/* Action Buttons: Add to Bag & Direct WhatsApp */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleQuickAdd}
              disabled={!product.inStock}
              className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                product.inStock
                  ? 'bg-[#181B26] hover:bg-[#FF3366] text-zinc-200 hover:text-white border border-white/10 hover:border-[#FF3366]'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-transparent'
              }`}
              title="Add default size to bag"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Bag</span>
            </button>

            <button
              onClick={handleWhatsAppQuickOrder}
              className="py-2 px-2 rounded-xl text-xs font-semibold bg-emerald-600/90 hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              title="Instant WhatsApp Order to +254 791389827"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Order Now</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
