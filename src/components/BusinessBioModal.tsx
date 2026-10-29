import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Sparkles, 
  Edit3, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Smartphone, 
  Truck, 
  Camera, 
  RefreshCw,
  PhoneCall
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const BusinessBioModal: React.FC = () => {
  const { 
    isBioModalOpen, 
    setIsBioModalOpen, 
    businessInfo, 
    setIsOwnerStudioOpen, 
    setActiveOwnerTab,
    setIsPaymentModalOpen 
  } = useStore();

  if (!isBioModalOpen) return null;

  const handleEditClick = () => {
    setIsBioModalOpen(false);
    setActiveOwnerTab('bio');
    setIsOwnerStudioOpen(true);
  };

  const getPrincipleIcon = (name: string) => {
    switch (name) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'Smartphone':
        return <Smartphone className="w-5 h-5 text-sky-400" />;
      case 'Truck':
        return <Truck className="w-5 h-5 text-[#FF5376]" />;
      case 'Camera':
        return <Camera className="w-5 h-5 text-[#A78BFA]" />;
      case 'RefreshCw':
        return <RefreshCw className="w-5 h-5 text-amber-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#FF5376]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-3xl bg-[#11131A] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#0E1017] border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF3366] to-[#8B5CF6] flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg sm:text-xl font-bold text-white">
                {businessInfo.brandName}
              </h2>
              <p className="text-xs text-zinc-400">{businessInfo.tagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleEditClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-semibold transition-colors"
              title="Edit Biography & Principles"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#FF5376]" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => setIsBioModalOpen(false)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* Biography */}
          <div className="space-y-3">
            <h3 className="font-heading text-base font-bold text-white uppercase tracking-wider text-xs text-[#FF5376]">
              Founder Story &amp; Brand Heritage
            </h3>
            <p className="text-zinc-200 text-sm leading-relaxed whitespace-pre-line bg-[#141722] p-5 rounded-2xl border border-white/5">
              {businessInfo.founderBio}
            </p>
          </div>

          {/* Core Principles */}
          <div className="space-y-3">
            <h3 className="font-heading text-base font-bold text-white uppercase tracking-wider text-xs text-[#A78BFA]">
              Our Guiding Principles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {businessInfo.principles.map((pr, idx) => (
                <div key={pr.id || idx} className="p-4 rounded-xl bg-[#141722] border border-white/5 space-y-1">
                  <div className="flex items-center gap-2">
                    {getPrincipleIcon(pr.iconName)}
                    <h4 className="font-heading font-bold text-sm text-white">{pr.title}</h4>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed pt-1">{pr.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Logistics & Payment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#141722] border border-white/5 space-y-1 text-xs">
              <div className="flex items-center gap-1.5 text-zinc-400">
                <MapPin className="w-3.5 h-3.5 text-[#FF5376]" />
                <span className="font-semibold uppercase tracking-wider">Dispatch Hub</span>
              </div>
              <p className="text-white font-medium">{businessInfo.pickupHub}</p>
              <div className="flex items-center gap-1.5 text-zinc-400 pt-2">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold uppercase tracking-wider">Hours</span>
              </div>
              <p className="text-white font-medium">{businessInfo.openingHours}</p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col justify-between text-xs space-y-2">
              <div>
                <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5" />
                  Official Payment Phone
                </span>
                <p className="font-mono text-base font-bold text-white mt-1">
                  {businessInfo.phone}
                </p>
                <p className="text-zinc-400 text-[11px]">Account: {businessInfo.mpesaName}</p>
              </div>

              <button
                onClick={() => {
                  setIsBioModalOpen(false);
                  setIsPaymentModalOpen(true);
                }}
                className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors"
              >
                View Payment Instructions &rarr;
              </button>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
};
