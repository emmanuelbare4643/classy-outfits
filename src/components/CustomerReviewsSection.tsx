import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Star, 
  MessageSquarePlus, 
  ThumbsUp, 
  ShieldCheck, 
  MapPin, 
  Sparkles, 
  CheckCircle2,
  Calendar,
  Filter
} from 'lucide-react';
import { motion } from 'motion/react';

export const CustomerReviewsSection: React.FC = () => {
  const { reviews, likeReview, setIsReviewModalOpen, businessInfo } = useStore();
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');

  // Compute average rating
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  const filteredReviews = filterRating === 'all'
    ? reviews
    : reviews.filter(r => r.rating === filterRating);

  return (
    <section id="reviews-section" className="py-16 bg-[#090A0F] border-t border-white/10 relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FF3366]/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Customer Voice &amp; Experiences</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              WHAT OUR CLIENTS ARE SAYING
            </h2>
            <p className="text-zinc-400 text-sm max-w-xl mt-1">
              Genuine feedback from fashion lovers who bought shoes, jerseys, jackets, clogs &amp; slides from {businessInfo.brandName}.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black text-xs font-bold shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Rating Summary Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-8 p-6 rounded-3xl bg-[#11131A] border border-white/10 items-center">
          
          {/* Big Score */}
          <div className="md:col-span-4 text-center md:text-left flex flex-col md:flex-row items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/40 flex flex-col items-center justify-center shrink-0">
              <span className="font-mono text-3xl font-extrabold text-amber-400 leading-none">
                {averageRating}
              </span>
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest mt-1">out of 5</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1 justify-center md:justify-start text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-white font-semibold">
                Based on {reviews.length} Verified Client Reviews
              </p>
              <p className="text-[11px] text-zinc-400">
                100% genuine Kenyan customer experiences
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="md:col-span-5 grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#181B26] border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>True To Size</span>
              </div>
              <p className="text-[11px] text-zinc-400">98% of buyers report perfect shoe &amp; jacket fit</p>
            </div>

            <div className="p-3 rounded-xl bg-[#181B26] border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-sky-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Fast Dispatch</span>
              </div>
              <p className="text-[11px] text-zinc-400">Same-day rider dispatch across Nairobi</p>
            </div>
          </div>

          {/* Star Filter Buttons */}
          <div className="md:col-span-3 flex flex-wrap gap-1.5 justify-center md:justify-end">
            <button
              onClick={() => setFilterRating('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                filterRating === 'all'
                  ? 'bg-amber-400 text-black'
                  : 'bg-white/5 text-zinc-300 hover:text-white'
              }`}
            >
              All ({reviews.length})
            </button>
            <button
              onClick={() => setFilterRating(5)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                filterRating === 5
                  ? 'bg-amber-400 text-black'
                  : 'bg-white/5 text-zinc-300 hover:text-white'
              }`}
            >
              <span>5★</span>
              <span>({reviews.filter(r => r.rating === 5).length})</span>
            </button>
          </div>

        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {filteredReviews.map((rev, index) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="p-5 sm:p-6 rounded-2xl bg-[#11131A] border border-white/10 hover:border-amber-400/40 transition-all flex flex-col justify-between space-y-4 hover:shadow-xl hover:shadow-amber-500/5"
            >
              <div className="space-y-3">
                
                {/* Header: Stars & Date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${star <= rev.rating ? 'fill-current' : 'text-zinc-700'}`}
                      />
                    ))}
                  </div>

                  <span className="text-[10px] text-zinc-500 font-mono">
                    {rev.date}
                  </span>
                </div>

                {/* Comment */}
                <p className="text-zinc-200 text-xs sm:text-sm leading-relaxed italic">
                  "{rev.comment}"
                </p>

                {/* Optional Photo */}
                {rev.photoUrl && (
                  <div className="relative w-full h-32 rounded-xl overflow-hidden border border-white/10">
                    <img
                      src={rev.photoUrl}
                      alt="Customer review attachment"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Client Info & Product Purchased */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-heading font-bold text-white">
                      {rev.customerName}
                    </span>
                    {rev.verifiedPurchase && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1 rounded flex items-center gap-0.5">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-zinc-400 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#FF5376]" />
                    <span>{rev.location}</span>
                  </div>
                  {rev.productPurchased && (
                    <span className="text-[10px] text-[#A78BFA] block truncate max-w-[190px] mt-0.5">
                      Item: {rev.productPurchased}
                    </span>
                  )}
                </div>

                {/* Helpful Button */}
                <button
                  onClick={() => likeReview(rev.id)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                  title="Helpful review"
                >
                  <ThumbsUp className="w-3 h-3 text-amber-400" />
                  <span className="font-mono text-[11px]">{rev.likes || 1}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Review Submission Invitation */}
        <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-[#141722] to-[#1A1D2B] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-white">
                Recently ordered shoes, jerseys or jackets?
              </h4>
              <p className="text-xs text-zinc-400">
                Leave a quick review and get featured on our official client wall!
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-all shrink-0 cursor-pointer"
          >
            Share My Feedback &rarr;
          </button>
        </div>

      </div>
    </section>
  );
};
