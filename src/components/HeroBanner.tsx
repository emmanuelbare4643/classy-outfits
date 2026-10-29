import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { ProductCategory } from '../types/store';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  PhoneCall, 
  Flame, 
  CheckCircle2,
  Copy,
  Lock
} from 'lucide-react';

interface HeroBannerProps {
  onSelectCategory: (cat: ProductCategory) => void;
  onOpenDeliveries: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onSelectCategory, onOpenDeliveries }) => {
  const { businessInfo, setIsPaymentModalOpen, showToast, openModifyWebsiteProtected, authSession } = useStore();

  const copyPhoneNumber = () => {
    navigator.clipboard.writeText(businessInfo.phone);
    showToast(`Copied ${businessInfo.phone} to clipboard!`);
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-14 md:py-16">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-[#FF3366]/20 via-[#8B5CF6]/20 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -top-12 -right-12 w-96 h-96 bg-[#8B5CF6]/15 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 -left-12 w-80 h-80 bg-[#FF3366]/15 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Hero Text & Badges */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Top pill badge */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181B26] border border-[#FF3366]/30 shadow-lg shadow-[#FF3366]/10 text-xs font-medium"
            >
              <Flame className="w-4 h-4 text-[#FF3366] animate-pulse" />
              <span className="text-zinc-200">Exclusive Women's Drip &amp; Footwear</span>
              <span className="text-zinc-500">•</span>
              <span className="text-[#FF5376] font-semibold">New Drops Live</span>
            </motion.div>

            {/* Main Catchy Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-2"
            >
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
                CLASSY OUTFITS
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FF3366] via-[#C084FC] to-[#38BDF8]">
                  CLOTHEWEAR &amp; SHOEGAME
                </span>
              </h1>
              <p className="text-base sm:text-lg text-zinc-300 font-normal max-w-xl leading-relaxed pt-2">
                Curating high-end statement shoes, custom retro jerseys, luxury jackets, platform clogs, and pillow slides for women who lead in style.
              </p>
            </motion.div>

            {/* Payment & Contact Quick Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-4 rounded-2xl bg-gradient-to-r from-[#141722] to-[#1A1D2C] border border-white/10 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">Direct Payment Phone Number</span>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded font-mono">M-PESA</span>
                  </div>
                  <div className="font-mono text-lg font-bold text-white tracking-wide flex items-center gap-2">
                    <span>{businessInfo.phone}</span>
                    <button 
                      onClick={copyPhoneNumber}
                      className="text-zinc-400 hover:text-white p-1 rounded transition-colors"
                      title="Copy Phone Number"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold tracking-wide transition-all text-center"
                >
                  Payment Guide &rarr;
                </button>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              <button
                onClick={() => onSelectCategory('all')}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#FF3366] to-[#8B5CF6] hover:from-[#ff4777] hover:to-[#9a6eff] text-white text-sm font-bold shadow-lg shadow-[#FF3366]/25 hover:shadow-[#FF3366]/40 transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenDeliveries}
                className="px-5 py-3 rounded-full bg-[#181B26] hover:bg-[#202534] border border-white/10 hover:border-white/20 text-white text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Real Delivered Photos</span>
              </button>

              <button
                onClick={() => openModifyWebsiteProtected('products')}
                className="px-4 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                title="Post new products with real photos, upload delivered proofs, or edit bio"
              >
                {authSession.isAuthenticated ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-zinc-400" />}
                <span>{authSession.isAuthenticated ? 'Owner Studio' : 'Owner Portal'}</span>
              </button>
            </motion.div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/5 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Same-Day Nairobi &amp; 24h Countrywide</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Quality Inspected</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF5376] shrink-0" />
                <span>Real Unboxings &amp; Swaps</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Category Showcase Mosaic */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="grid grid-cols-2 gap-3 relative"
            >
              {/* Category card 1: Shoes */}
              <div 
                onClick={() => onSelectCategory('shoes')}
                className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-[#FF3366]/50 transition-all shadow-xl"
              >
                <img
                  src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop"
                  alt="Shoes and Kicks"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3.5 flex flex-col justify-end">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#FF5376]">Shoegame</span>
                  <span className="font-heading font-bold text-white text-base">Heels &amp; Kicks</span>
                </div>
              </div>

              {/* Category card 2: Jerseys */}
              <div 
                onClick={() => onSelectCategory('jerseys')}
                className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-[#8B5CF6]/50 transition-all shadow-xl"
              >
                <img
                  src="https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=600&auto=format&fit=crop"
                  alt="Retro Jerseys"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3.5 flex flex-col justify-end">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#A78BFA]">Streetwear</span>
                  <span className="font-heading font-bold text-white text-base">Cropped Jerseys</span>
                </div>
              </div>

              {/* Category card 3: Jackets */}
              <div 
                onClick={() => onSelectCategory('jackets')}
                className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-[#38BDF8]/50 transition-all shadow-xl"
              >
                <img
                  src="https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop"
                  alt="Leather & Puffer Jackets"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3.5 flex flex-col justify-end">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-sky-400">Outerwear</span>
                  <span className="font-heading font-bold text-white text-base">Moto &amp; Puffers</span>
                </div>
              </div>

              {/* Category card 4: Clogs & Slides */}
              <div 
                onClick={() => onSelectCategory('slides')}
                className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-amber-400/50 transition-all shadow-xl"
              >
                <img
                  src="https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=600&auto=format&fit=crop"
                  alt="Clogs & Slides"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3.5 flex flex-col justify-end">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">Casual Luxury</span>
                  <span className="font-heading font-bold text-white text-base">Clogs &amp; Slides</span>
                </div>
              </div>

              {/* Central Floating Badge */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0E1017]/95 border border-[#FF3366]/40 px-3.5 py-2 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-2 pointer-events-none">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF3366] animate-ping" />
                <span className="text-xs font-bold font-mono text-white tracking-wider">KENYA-WIDE DISPATCH</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
