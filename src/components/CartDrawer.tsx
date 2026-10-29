import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  MessageSquare, 
  Truck, 
  PhoneCall, 
  Copy, 
  Check,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart, 
    cartTotal, 
    cartCount,
    formatPrice,
    businessInfo,
    showToast,
    setIsPaymentModalOpen
  } = useStore();

  const [deliveryOption, setDeliveryOption] = useState<'nairobi-express' | 'cbd-pickup' | 'countrywide'>('nairobi-express');
  const [customerName, setCustomerName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isCartOpen) return null;

  const getDeliveryFee = () => {
    switch (deliveryOption) {
      case 'nairobi-express':
        return 300;
      case 'cbd-pickup':
        return 0;
      case 'countrywide':
        return 500;
      default:
        return 300;
    }
  };

  const finalTotal = cartTotal + getDeliveryFee();

  const cleanWhatsapp = businessInfo.whatsapp.replace(/[^0-9]/g, '');

  const copyPhone = () => {
    navigator.clipboard.writeText(businessInfo.phone);
    setCopied(true);
    showToast(`Copied ${businessInfo.phone}!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCheckoutViaWhatsApp = () => {
    if (cart.length === 0) return;

    const deliveryLabels = {
      'nairobi-express': 'Nairobi Same-Day Express Rider (KES 300)',
      'cbd-pickup': 'Nairobi CBD Pickup Hub (FREE)',
      'countrywide': 'Countrywide Courier to Upcountry (KES 500)',
    };

    const itemsList = cart
      .map(
        (item, idx) =>
          `${idx + 1}. *${item.product.title}*\n   Size: ${item.selectedSize} | Qty: ${item.quantity} | Subtotal: ${formatPrice(item.product.price * item.quantity)}`
      )
      .join('\n\n');

    const message = `*NEW ORDER FROM CLASSY OUTFITS WEBSITE*\n\n` +
      `*Client Name:* ${customerName || 'Shopper'}\n` +
      `*Delivery Location:* ${deliveryAddress || 'To be specified'}\n` +
      `*Delivery Method:* ${deliveryLabels[deliveryOption]}\n\n` +
      `*ITEMS ORDERED:*\n${itemsList}\n\n` +
      `*Products Total:* ${formatPrice(cartTotal)}\n` +
      `*Delivery Fee:* ${formatPrice(getDeliveryFee())}\n` +
      `*GRAND TOTAL:* *${formatPrice(finalTotal)}*\n\n` +
      `*Payment Method:* Direct M-Pesa to *${businessInfo.phone}* (${businessInfo.mpesaName})\n\n` +
      `Please confirm receipt and send me the dispatch details!`;

    window.open(`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-md bg-[#11131A] border-l border-white/10 h-full flex flex-col shadow-2xl"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 bg-[#0E1017] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FF3366]/20 border border-[#FF3366]/40 flex items-center justify-center text-[#FF5376]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white">Your Shopping Bag</h3>
              <p className="text-[11px] text-zinc-400 font-mono">{cartCount} items selected</p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Cart Items */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {cart.length > 0 ? (
            <>
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}`}
                    className="p-3 rounded-2xl bg-[#141722] border border-white/5 flex gap-3 items-start"
                  >
                    <img
                      src={item.product.images[0] || 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=300'}
                      alt={item.product.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10"
                    />

                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="font-heading text-xs font-bold text-white truncate">
                        {item.product.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                        <span className="bg-[#1C2030] px-1.5 py-0.5 rounded text-zinc-300 font-mono">
                          Size: {item.selectedSize}
                        </span>
                        {item.selectedColor && (
                          <span className="text-zinc-500">• {item.selectedColor}</span>
                        )}
                      </div>
                      <div className="font-mono text-xs font-bold text-white">
                        {formatPrice(item.product.price * item.quantity)}
                      </div>
                    </div>

                    {/* Qty & Remove */}
                    <div className="flex flex-col items-end justify-between self-stretch">
                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                        className="text-zinc-500 hover:text-red-400 p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center rounded-lg bg-[#0E1017] border border-white/10 px-1 py-0.5">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.selectedSize, -1)}
                          className="w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-white text-xs font-mono"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-mono text-white font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.selectedSize, 1)}
                          className="w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-white text-xs font-mono"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Destination Options */}
              <div className="p-3.5 rounded-2xl bg-[#141722] border border-white/5 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-sky-400" />
                  Delivery Options:
                </span>

                <div className="space-y-1.5 text-xs">
                  <label className="flex items-center justify-between p-2 rounded-xl bg-[#181B26] border border-white/5 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryOption === 'nairobi-express'}
                        onChange={() => setDeliveryOption('nairobi-express')}
                        className="text-[#FF3366] focus:ring-0"
                      />
                      <span className="text-zinc-200">Nairobi Express Rider</span>
                    </div>
                    <span className="font-mono text-zinc-400">+KES 300</span>
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-xl bg-[#181B26] border border-white/5 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryOption === 'cbd-pickup'}
                        onChange={() => setDeliveryOption('cbd-pickup')}
                        className="text-[#FF3366] focus:ring-0"
                      />
                      <span className="text-zinc-200">CBD Hub Pickup</span>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold">FREE</span>
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-xl bg-[#181B26] border border-white/5 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryOption === 'countrywide'}
                        onChange={() => setDeliveryOption('countrywide')}
                        className="text-[#FF3366] focus:ring-0"
                      />
                      <span className="text-zinc-200">Countrywide Courier</span>
                    </div>
                    <span className="font-mono text-zinc-400">+KES 500</span>
                  </label>
                </div>
              </div>

              {/* Delivery Details Inputs */}
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Your Full Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#141722] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500"
                />
                <input
                  type="text"
                  placeholder="Delivery Address / Estate / Town (e.g. Kilimani, Nairobi)"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full bg-[#141722] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500"
                />
              </div>

              {/* Payment Info Banner */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <PhoneCall className="w-3 h-3" />
                    Pay via M-Pesa To:
                  </span>
                  <button
                    onClick={copyPhone}
                    className="text-[10px] text-zinc-400 hover:text-white flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono text-base font-bold text-white flex items-center justify-between">
                  <span>{businessInfo.phone}</span>
                  <span className="text-xs text-zinc-400 font-normal">({businessInfo.mpesaName})</span>
                </div>
              </div>
            </>
          ) : (
            <div className="py-20 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-white/5 mx-auto flex items-center justify-center text-zinc-500">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-heading font-bold text-base text-white">Your bag is empty</h4>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                Explore our curated heels, sneakers, retro jerseys, jackets, clogs, and slides to start shopping!
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF3366] to-[#8B5CF6] text-white text-xs font-bold"
              >
                Start Browsing
              </button>
            </div>
          )}
        </div>

        {/* Drawer Footer Checkout */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 bg-[#0E1017] border-t border-white/10 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Items Subtotal:</span>
                <span className="font-mono text-white">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Delivery Fee:</span>
                <span className="font-mono text-white">
                  {getDeliveryFee() === 0 ? 'FREE' : formatPrice(getDeliveryFee())}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                <span>Total Amount:</span>
                <span className="font-mono text-emerald-400">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckoutViaWhatsApp}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Checkout via WhatsApp &amp; M-Pesa</span>
            </button>

            <div className="flex justify-between items-center text-[10px] text-zinc-500 pt-1">
              <button
                onClick={clearCart}
                className="hover:text-red-400 transition-colors"
              >
                Clear Entire Bag
              </button>
              <span>Instant order dispatch</span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
