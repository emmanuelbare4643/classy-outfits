import React from 'react';
import { useStore } from '../context/StoreContext';
import { DeliveryProof } from '../types/store';
import { Camera, Plus, CheckCircle2, MapPin, ShieldCheck, Sparkles, Upload } from 'lucide-react';
import { motion } from 'motion/react';

interface RealDeliveriesSectionProps {
  onSelectProof: (proof: DeliveryProof) => void;
}

export const RealDeliveriesSection: React.FC<RealDeliveriesSectionProps> = ({ onSelectProof }) => {
  const { visibleDeliveries, openModifyWebsiteProtected, businessInfo, onlyShowOwnerUploads, authSession } = useStore();

  const handleAddDeliveryPhoto = () => {
    openModifyWebsiteProtected('deliveries');
  };

  return (
    <section id="deliveries-section" className="py-16 bg-[#0B0D13] border-t border-white/10 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#8B5CF6]/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FF3366]/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Authentic Client Deliveries</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              REAL DELIVERIES &amp; CLIENT PROOFS
            </h2>
            <p className="text-zinc-400 text-sm max-w-2xl mt-1">
              Real parcels delivered to clients in Nairobi, Mombasa, Eldoret, Nakuru &amp; across Kenya. Paid directly via M-Pesa to {businessInfo.phone}.
            </p>
          </div>

          <button
            onClick={handleAddDeliveryPhoto}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#181B26] hover:bg-[#202534] border border-[#A78BFA]/40 hover:border-[#A78BFA] text-[#C4B5FD] text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
          >
            <Camera className="w-4 h-4 text-[#A78BFA]" />
            <span>Upload Real Delivered Photo</span>
          </button>
        </div>

        {/* Deliveries Grid */}
        {visibleDeliveries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
            {visibleDeliveries.map((delivery, index) => (
              <motion.div
                key={delivery.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => onSelectProof(delivery)}
                className="group relative rounded-2xl bg-[#11131A] border border-white/10 hover:border-[#8B5CF6]/50 overflow-hidden cursor-pointer flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-[#8B5CF6]/10"
              >
                {/* Photo */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#181B26]">
                  <img
                    src={delivery.photoUrl}
                    alt={`Delivered to ${delivery.customerName}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-[#11131A] via-transparent to-black/30 opacity-70 group-hover:opacity-40 transition-opacity" />

                  {/* Location Badge */}
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-white text-[11px] font-medium flex items-center gap-1.5 shadow-md">
                    <MapPin className="w-3 h-3 text-[#FF5376]" />
                    <span>{delivery.location}</span>
                  </div>

                  {/* Verified Delivery Badge */}
                  <div className="absolute top-3 right-3 bg-emerald-500/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified Drop</span>
                  </div>

                  {/* Date */}
                  <div className="absolute bottom-2 right-3 text-[10px] font-mono text-zinc-300 bg-black/60 px-2 py-0.5 rounded">
                    {delivery.date}
                  </div>
                </div>

                {/* Caption & Client Info */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <p className="text-sm text-zinc-300 italic leading-relaxed line-clamp-3">
                      {delivery.caption}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-heading font-bold text-white block">
                        {delivery.customerName}
                      </span>
                      <span className="text-[11px] text-[#A78BFA] block truncate max-w-[200px]">
                        {delivery.productPurchased}
                      </span>
                    </div>

                    <span className="text-[11px] text-zinc-400 group-hover:text-white transition-colors underline underline-offset-2">
                      View Photo &rarr;
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-14 text-center rounded-3xl bg-[#11131A] border border-white/10 p-8 space-y-4 my-8 max-w-xl mx-auto shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 mx-auto flex items-center justify-center text-[#A78BFA]">
              <Camera className="w-7 h-7" />
            </div>
            
            <div className="space-y-1">
              <h3 className="font-heading text-lg font-bold text-white">
                No Delivery Photos Yet
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                AI sample delivery photos are hidden as requested. Only real delivered parcel photos uploaded by Emmanuel will appear here!
              </p>
            </div>

            <button
              onClick={handleAddDeliveryPhoto}
              className="px-5 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7c4deb] text-white text-xs font-bold transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>{authSession.isAuthenticated ? 'Upload Real Delivery Photo' : 'Sign In as Emmanuel to Upload'}</span>
            </button>
          </div>
        )}

        {/* Trust Guarantee Footer */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-[#141722] via-[#1A1D2B] to-[#141722] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF3366] to-[#8B5CF6] flex items-center justify-center shrink-0 shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-base text-white">
                Never Pay for Blind Drops. Full Transparency Always.
              </h4>
              <p className="text-xs text-zinc-400">
                You can request video proof of your exact pair or jacket before final dispatch. WhatsApp {businessInfo.phone}.
              </p>
            </div>
          </div>

          <button
            onClick={handleAddDeliveryPhoto}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all shrink-0 cursor-pointer"
          >
            + Add Client Drop Proof
          </button>
        </div>

      </div>
    </section>
  );
};
