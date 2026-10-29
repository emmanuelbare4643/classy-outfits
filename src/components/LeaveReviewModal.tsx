import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Star, 
  Upload, 
  Check, 
  MessageSquare, 
  MapPin, 
  ShieldCheck, 
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const LeaveReviewModal: React.FC = () => {
  const { isReviewModalOpen, setIsReviewModalOpen, addCustomerReview, showToast, businessInfo } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [location, setLocation] = useState('Nairobi, Kenya');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [productPurchased, setProductPurchased] = useState('Shoes / Footwear');
  const [comment, setComment] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  if (!isReviewModalOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPhotoUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      showToast('Please provide your name');
      return;
    }
    if (!comment.trim()) {
      showToast('Please share a few words about your experience');
      return;
    }

    addCustomerReview({
      customerName: customerName.trim(),
      location: location.trim() || 'Kenya',
      rating,
      productPurchased: productPurchased.trim() || 'Classy Outfits',
      comment: comment.trim(),
      photoUrl: photoUrl || undefined,
      verifiedPurchase: true,
    });

    // Reset
    setCustomerName('');
    setComment('');
    setPhotoUrl('');
    setIsReviewModalOpen(false);
  };

  const ratingDescriptions: Record<number, string> = {
    5: '⭐⭐⭐⭐⭐ Phenomenal - Top tier quality & fast delivery!',
    4: '⭐⭐⭐⭐ Very Good - Great fit and smooth service',
    3: '⭐⭐⭐ Average - Product is fine',
    2: '⭐⭐ Below Expectations',
    1: '⭐ Unsatisfactory'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-lg bg-[#11131A] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto p-6 sm:p-8"
      >
        {/* Close Button */}
        <button
          onClick={() => setIsReviewModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-lg shadow-amber-500/10">
            <Star className="w-6 h-6 fill-current" />
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
            Rate Your Experience
          </h2>
          <p className="text-xs text-zinc-400">
            Share genuine feedback on your order from {businessInfo.brandName}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Star Rating Selector */}
          <div className="bg-[#141722] p-4 rounded-2xl border border-white/5 text-center space-y-2">
            <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
              Your Rating:
            </span>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = (hoverRating !== null ? hoverRating : rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-125 transition-transform cursor-pointer focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        isFilled
                          ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                          : 'text-zinc-600'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <span className="text-[11px] font-medium text-amber-300 block">
              {ratingDescriptions[hoverRating !== null ? hoverRating : rating]}
            </span>
          </div>

          {/* Name & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Your Name / Nickname *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Cynthia M."
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-[#181B26] border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-zinc-500 text-xs focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Location / Town *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Westlands, Nairobi"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#181B26] border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-zinc-500 text-xs focus:border-amber-400"
              />
            </div>
          </div>

          {/* Item Purchased */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
              Item Purchased
            </label>
            <input
              type="text"
              placeholder="e.g. Chunky Low Kicks (Size 38), Biker Leather Jacket..."
              value={productPurchased}
              onChange={(e) => setProductPurchased(e.target.value)}
              className="w-full bg-[#181B26] border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-zinc-500 text-xs focus:border-amber-400"
            />
          </div>

          {/* Feedback Text */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
              Your Review &amp; Feedback *
            </label>
            <textarea
              rows={3}
              required
              placeholder="How was the fit, material quality, delivery speed, and customer care with Emmanuel?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-[#181B26] border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-zinc-500 text-xs focus:border-amber-400 leading-relaxed"
            />
          </div>

          {/* Optional Photo Attachment */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Attach Outfit / Unboxing Photo (Optional)
            </label>
            <div className="flex gap-2">
              <label className="flex-1 p-2.5 rounded-xl border border-dashed border-white/20 hover:border-amber-400 bg-[#181B26] flex items-center justify-center gap-2 cursor-pointer text-xs text-zinc-300 transition-colors">
                <Upload className="w-4 h-4 text-amber-400" />
                <span>{photoUrl ? 'Photo Attached' : 'Upload from Device'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {photoUrl && (
                <button
                  type="button"
                  onClick={() => setPhotoUrl('')}
                  className="px-3 py-1 rounded-xl bg-red-600/30 text-red-300 text-xs hover:bg-red-600/50"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Submit My Review</span>
            </button>
          </div>
        </form>

      </motion.div>
    </div>
  );
};
