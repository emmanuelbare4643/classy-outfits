import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, MapPin, ShieldCheck, Calendar, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const DeliveryProofLightbox: React.FC = () => {
  const { selectedProofImage, setSelectedProofImage, deleteDeliveryProof } = useStore();

  if (!selectedProofImage) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-[#11131A] border border-white/20 rounded-3xl overflow-hidden shadow-2xl my-auto"
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedProofImage(null)}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* High-res Image */}
        <div className="relative aspect-[4/3] w-full bg-[#090A0F] overflow-hidden">
          <img
            src={selectedProofImage.photoUrl}
            alt={selectedProofImage.customerName}
            className="w-full h-full object-cover"
          />

          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-white text-xs font-medium flex items-center gap-1.5 shadow-md">
            <MapPin className="w-3.5 h-3.5 text-[#FF5376]" />
            <span>{selectedProofImage.location}</span>
          </div>

          <div className="absolute top-3 right-16 bg-emerald-500/90 text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Customer Drop</span>
          </div>
        </div>

        {/* Content & Feedback */}
        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <span className="text-xs text-[#A78BFA] font-mono block">
              Item: {selectedProofImage.productPurchased}
            </span>
            <h3 className="font-heading text-lg font-bold text-white">
              Customer: {selectedProofImage.customerName}
            </h3>
          </div>

          <p className="text-zinc-200 text-sm italic bg-[#181B26] p-4 rounded-2xl border border-white/5 leading-relaxed">
            {selectedProofImage.caption}
          </p>

          <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-white/10">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{selectedProofImage.date}</span>
            </div>

            <button
              onClick={() => {
                if (window.confirm('Delete this delivery proof from the website?')) {
                  deleteDeliveryProof(selectedProofImage.id);
                  setSelectedProofImage(null);
                }
              }}
              className="text-zinc-500 hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Photo</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
