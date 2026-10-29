import React, { useState } from 'react';
import { Product } from '../types/store';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  ShoppingBag, 
  Heart, 
  MessageSquare, 
  Check, 
  Copy, 
  PhoneCall, 
  Truck, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { 
    formatPrice, 
    addToCart, 
    toggleWishlist, 
    isWishlisted, 
    businessInfo, 
    showToast,
    setIsPaymentModalOpen,
    setIsCartOpen
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes?.[0] || 'Standard');
  const [selectedColor, setSelectedColor] = useState<string>(product?.colors?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [copiedPhone, setCopiedPhone] = useState(false);

  if (!product) return null;

  const wishlisted = isWishlisted(product.id);
  const cleanWhatsapp = businessInfo.whatsapp.replace(/[^0-9]/g, '');

  const copyPhone = () => {
    navigator.clipboard.writeText(businessInfo.phone);
    setCopiedPhone(true);
    showToast(`Copied ${businessInfo.phone}!`);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    onClose();
    setIsCartOpen(true);
  };

  const handleDirectWhatsApp = () => {
    const text = `Hello Classy Outfits! 🌟\n\nI want to order:\n• Product: *${product.title}*\n• Category: ${product.category.toUpperCase()}\n• Selected Size: *${selectedSize}*\n• Color: ${selectedColor || 'Standard'}\n• Quantity: ${quantity}\n• Total Amount: *${formatPrice(product.price * quantity)}*\n\nPlease confirm stock and payment details to *${businessInfo.phone}*. Looking forward to prompt delivery!`;
    window.open(`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const images = product.images && product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800'];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-4xl bg-[#11131A] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 text-zinc-300 hover:text-white hover:bg-black transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
            
            {/* Left: Product Images & Gallery */}
            <div className="md:col-span-6 bg-[#0E1017] p-4 sm:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#181B26] border border-white/10 shadow-inner">
                <img
                  src={images[activeImageIndex] || images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover transition-all duration-300"
                />

                {product.badge && (
                  <span className="absolute top-3 left-3 bg-[#FF3366] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                    {product.badge}
                  </span>
                )}

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all ${
                    wishlisted
                      ? 'bg-[#FF3366] text-white shadow-lg shadow-[#FF3366]/40'
                      : 'bg-black/50 hover:bg-black/80 text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Thumbnails if multiple images */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 mt-4 overflow-x-auto py-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        activeImageIndex === idx ? 'border-[#FF3366] scale-105' : 'border-white/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Guaranteed features */}
              <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-2 text-[11px] text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Quality Guaranteed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>Same-Day Nairobi</span>
                </div>
              </div>
            </div>

            {/* Right: Product Details, Sizing, and Order Actions */}
            <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              
              <div className="space-y-4">
                {/* Category & Stock */}
                <div className="flex items-center justify-between text-xs font-semibold tracking-wider uppercase">
                  <span className="text-[#A78BFA]">{product.category}</span>
                  <span className={product.inStock ? 'text-emerald-400' : 'text-red-400'}>
                    {product.inStock ? '● In Stock & Ready to Dispatch' : '● Sold Out'}
                  </span>
                </div>

                {/* Title */}
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white leading-tight">
                  {product.title}
                </h2>

                {/* Price Display */}
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-3xl font-extrabold text-white">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="font-mono text-base text-zinc-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      SAVE {formatPrice(product.originalPrice - product.price)}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-zinc-300 text-sm leading-relaxed">
                  {product.description}
                </p>

                {/* Size Selection */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                        Select Size: <strong className="text-white font-mono ml-1">{selectedSize}</strong>
                      </span>
                      <span className="text-[11px] text-zinc-500">True to size fit</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => {
                        const isSelected = selectedSize === size;
                        return (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`min-w-10 px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                              isSelected
                                ? 'bg-gradient-to-r from-[#FF3366] to-[#8B5CF6] text-white shadow-lg shadow-[#FF3366]/30'
                                : 'bg-[#181B26] text-zinc-300 hover:text-white border border-white/10 hover:border-white/30'
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Colors Selection if available */}
                {product.colors && product.colors.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 block">
                      Color Option: <strong className="text-white ml-1">{selectedColor}</strong>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            selectedColor === color
                              ? 'bg-white text-black font-semibold'
                              : 'bg-[#181B26] text-zinc-300 hover:text-white border border-white/10'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="flex items-center gap-4 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">Quantity:</span>
                  <div className="flex items-center rounded-xl bg-[#181B26] border border-white/10 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 font-mono text-base"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-mono font-bold text-white text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 font-mono text-base"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Payment method reminder box */}
                <div className="p-3.5 rounded-2xl bg-[#0E1017] border border-emerald-500/30 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wide">
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Direct Payment Phone Number:</span>
                    </div>
                    <button
                      onClick={copyPhone}
                      className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1"
                    >
                      {copiedPhone ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedPhone ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="font-mono text-sm font-bold text-white flex items-center justify-between">
                    <span>{businessInfo.phone}</span>
                    <span className="text-[11px] text-zinc-400 font-normal">M-Pesa / Send Money</span>
                  </div>
                </div>
              </div>

              {/* Order Actions */}
              <div className="space-y-2.5 pt-4 border-t border-white/10">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`w-full py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${
                    product.inStock
                      ? 'bg-gradient-to-r from-[#FF3366] to-[#8B5CF6] hover:from-[#ff4777] hover:to-[#9a6eff] text-white shadow-[#FF3366]/25 hover:shadow-[#FF3366]/40 cursor-pointer'
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag • {formatPrice(product.price * quantity)}</span>
                </button>

                <button
                  onClick={handleDirectWhatsApp}
                  className="w-full py-3.5 rounded-2xl text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Instant WhatsApp Order to {businessInfo.phone}</span>
                </button>
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
