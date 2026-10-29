import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCategory } from '../types/store';
import { 
  PhoneCall, 
  MessageSquare, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  SlidersHorizontal, 
  Sparkles,
  Heart,
  Copy,
  Check,
  Lock
} from 'lucide-react';
import { useState } from 'react';

interface FooterProps {
  onSelectCategory: (cat: ProductCategory) => void;
  onOpenDeliveries: () => void;
  onOpenReviews: () => void;
  onOpenBio: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenDeliveries, onOpenReviews, onOpenBio }) => {
  const { businessInfo, setIsPaymentModalOpen, openModifyWebsiteProtected, authSession, showToast } = useStore();
  const [copied, setCopied] = useState(false);

  const cleanWhatsapp = businessInfo.whatsapp.replace(/[^0-9]/g, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(businessInfo.phone);
    setCopied(true);
    showToast(`Copied ${businessInfo.phone} to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="bg-[#07080C] border-t border-white/10 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF3366] to-[#8B5CF6] flex items-center justify-center font-heading font-extrabold text-white text-lg">
                CO
              </div>
              <div>
                <h3 className="font-heading text-lg font-extrabold text-white tracking-tight">
                  {businessInfo.brandName.toUpperCase()}
                </h3>
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest">
                  Clothewear &amp; Shoegame
                </p>
              </div>
            </div>

            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
              Your premier Kenyan destination for hand-curated women's footwear and streetwear. Featuring high-end shoes, retro club jerseys, tailored moto &amp; puffer jackets, chunky platform clogs, and luxury slides.
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-zinc-300">
                <MapPin className="w-3.5 h-3.5 text-[#FF5376] shrink-0" />
                <span>{businessInfo.pickupHub}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{businessInfo.openingHours}</span>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              Browse Categories
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectCategory('shoes')}
                  className="hover:text-white transition-colors"
                >
                  Shoes &amp; Heels
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('jerseys')}
                  className="hover:text-white transition-colors"
                >
                  Cropped &amp; Retro Jerseys
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('jackets')}
                  className="hover:text-white transition-colors"
                >
                  Biker &amp; Puffer Jackets
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('clogs')}
                  className="hover:text-white transition-colors"
                >
                  Platform &amp; Winter Clogs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('slides')}
                  className="hover:text-white transition-colors"
                >
                  Women's Luxury Slides
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Trust & Store Links */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              About &amp; Proofs
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenDeliveries}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>Real Delivered Photos</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded">Proof</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenReviews}
                  className="hover:text-white transition-colors"
                >
                  Customer Reviews &amp; Feedback
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenBio}
                  className="hover:text-white transition-colors"
                >
                  Biography &amp; Core Principles
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="hover:text-white transition-colors"
                >
                  M-Pesa Payment Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => openModifyWebsiteProtected('products')}
                  className="text-[#FF5376] hover:text-[#ff7594] transition-colors flex items-center gap-1 font-semibold"
                >
                  {authSession.isAuthenticated ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>{authSession.isAuthenticated ? 'Owner Studio (Emmanuel)' : 'Owner Portal (Restricted)'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Payment & Contact Card */}
          <div className="space-y-3 p-4 rounded-2xl bg-[#0E1017] border border-white/10">
            <h4 className="font-heading font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Official Payment
            </h4>
            
            <p className="text-[11px] text-zinc-400">
              Direct payments accepted via M-Pesa to personal line:
            </p>

            <div className="p-2.5 rounded-xl bg-[#141722] border border-emerald-500/30 flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-white">
                {businessInfo.phone}
              </span>
              <button
                onClick={handleCopy}
                className="text-zinc-400 hover:text-white p-1"
                title="Copy phone"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="space-y-1.5 pt-1">
              <a
                href={`https://wa.me/${cleanWhatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-center block font-semibold transition-colors"
              >
                WhatsApp Us
              </a>
              <a
                href={`tel:${businessInfo.phone}`}
                className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-200 text-center block font-medium transition-colors"
              >
                Direct Call
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>
            &copy; {new Date().getFullYear()} {businessInfo.brandName} • Clothewear &amp; Shoegame. All rights reserved.
          </p>

          <div className="flex items-center gap-2">
            <span>Powered with smooth drip &amp; style</span>
            <span className="text-[#FF3366]">&hearts;</span>
            <span>Nairobi, Kenya</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
