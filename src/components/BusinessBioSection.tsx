import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShieldCheck, 
  Smartphone, 
  Truck, 
  Camera, 
  RefreshCw, 
  Edit3, 
  MapPin, 
  Clock, 
  Sparkles,
  PhoneCall,
  CheckCircle2
} from 'lucide-react';

export const BusinessBioSection: React.FC = () => {
  const { businessInfo, openModifyWebsiteProtected, setIsPaymentModalOpen } = useStore();

  const handleEditBio = () => {
    openModifyWebsiteProtected('bio');
  };

  const getIcon = (name: string) => {
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
    <section id="bio-section" className="py-16 bg-[#090A0F] border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#FF5376] uppercase">About Our Brand</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
              THE STORY &amp; PRINCIPLES BEHIND {businessInfo.brandName.toUpperCase()}
            </h2>
            <p className="text-zinc-400 text-sm max-w-xl mt-1">
              {businessInfo.tagline}
            </p>
          </div>

          <button
            onClick={handleEditBio}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#141722] hover:bg-[#1E2333] border border-white/10 hover:border-[#FF3366] text-white text-xs font-semibold transition-all shadow-md shrink-0 cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-[#FF5376]" />
            <span>Edit Bio &amp; Principles</span>
          </button>
        </div>

        {/* Bio Story & Hub Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-start">
          
          {/* Biography Text */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#11131A] border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF3366]/5 blur-2xl rounded-full" />
              
              <h3 className="font-heading text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FF3366]" />
                Our Heritage &amp; Mission
              </h3>
              
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {businessInfo.founderBio}
              </p>

              {/* Verified Contact Details within Story */}
              <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#FF5376] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-zinc-400 block font-medium">Dispatch Hub:</span>
                    <span className="text-white font-semibold">{businessInfo.pickupHub}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-zinc-400 block font-medium">Customer Support Hours:</span>
                    <span className="text-white font-semibold">{businessInfo.openingHours}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment highlight reminder */}
            <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Direct Payment Phone Number
                  </div>
                  <div className="text-sm font-mono font-bold text-white">
                    {businessInfo.phone} ({businessInfo.mpesaName})
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-colors shrink-0"
              >
                Payment Steps &rarr;
              </button>
            </div>
          </div>

          {/* Core Principles Grid */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-heading text-lg font-bold text-white tracking-wide">
                Our Core Business Principles
              </h3>
              <span className="text-[11px] text-[#A78BFA] font-medium">Non-Negotiable</span>
            </div>

            <div className="space-y-3">
              {businessInfo.principles.map((principle, idx) => (
                <div
                  key={principle.id || idx}
                  className="p-4 rounded-xl bg-[#141722] border border-white/5 hover:border-white/20 transition-all flex items-start gap-3.5"
                >
                  <div className="p-2 rounded-lg bg-white/5 shrink-0 mt-0.5">
                    {getIcon(principle.iconName)}
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-white flex items-center gap-1.5">
                      {principle.title}
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      {principle.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
