import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  PhoneCall, 
  Copy, 
  Check, 
  MessageSquare, 
  ShieldCheck, 
  Smartphone, 
  ArrowRight,
  HelpCircle,
  Truck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const PaymentMethodModal: React.FC = () => {
  const { isPaymentModalOpen, setIsPaymentModalOpen, businessInfo, showToast } = useStore();
  const [copied, setCopied] = useState(false);

  if (!isPaymentModalOpen) return null;

  const copyNumber = () => {
    navigator.clipboard.writeText(businessInfo.phone);
    setCopied(true);
    showToast(`Copied ${businessInfo.phone} to clipboard!`);
    setTimeout(() => setCopied(false), 2500);
  };

  const cleanWhatsapp = businessInfo.whatsapp.replace(/[^0-9]/g, '');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-lg bg-[#11131A] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto p-6 sm:p-8"
      >
        {/* Close Button */}
        <button
          onClick={() => setIsPaymentModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/10">
            <Smartphone className="w-7 h-7" />
          </div>
          <h2 className="font-heading text-2xl font-extrabold text-white">
            Official Payment Details
          </h2>
          <p className="text-xs text-zinc-400">
            Direct, safe, and transparent M-Pesa payments for {businessInfo.brandName}
          </p>
        </div>

        {/* Primary Phone Box */}
        <div className="p-4 rounded-2xl bg-[#161A26] border border-emerald-500/40 relative overflow-hidden space-y-3 mb-6">
          <div className="flex items-center justify-between text-xs">
            <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              M-Pesa Recipient Number
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
              VERIFIED ACCOUNT
            </span>
          </div>

          <div className="flex items-center justify-between bg-[#0E1017] p-3 rounded-xl border border-white/10">
            <div className="font-mono text-xl sm:text-2xl font-extrabold text-white tracking-wider">
              {businessInfo.phone}
            </div>
            <button
              onClick={copyNumber}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-xs font-bold transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
            <span>Registered Name:</span>
            <strong className="text-white font-mono">{businessInfo.mpesaName}</strong>
          </div>
        </div>

        {/* Step by Step instructions */}
        <div className="space-y-3 mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            How to Complete Your Order:
          </h3>

          <ol className="space-y-2 text-xs text-zinc-300">
            <li className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5">
              <span className="w-5 h-5 rounded-full bg-[#FF3366] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                1
              </span>
              <span>Open <strong>M-Pesa</strong> &rarr; Select <strong>Send Money</strong> on your phone.</span>
            </li>
            <li className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5">
              <span className="w-5 h-5 rounded-full bg-[#FF3366] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                2
              </span>
              <span>Enter Phone: <strong className="text-white font-mono">{businessInfo.phone}</strong></span>
            </li>
            <li className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5">
              <span className="w-5 h-5 rounded-full bg-[#FF3366] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                3
              </span>
              <span>Enter the item amount, key in your PIN, and confirm recipient name is <strong>{businessInfo.mpesaName}</strong>.</span>
            </li>
            <li className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5">
              <span className="w-5 h-5 rounded-full bg-[#FF3366] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                4
              </span>
              <span>Send the M-Pesa SMS confirmation code or screenshot to WhatsApp for immediate bike/courier dispatch!</span>
            </li>
          </ol>
        </div>

        {/* Quick Contact CTAs */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
              "Hi Classy Outfits! I've made/would like to make an M-Pesa payment to " + businessInfo.phone + ". Here are my order details:"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md text-center"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Confirm on WhatsApp</span>
          </a>

          <a
            href={`tel:${businessInfo.phone}`}
            className="py-3 px-3 rounded-xl bg-[#181B26] hover:bg-[#202534] border border-white/10 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors text-center"
          >
            <PhoneCall className="w-4 h-4 text-sky-400" />
            <span>Call {businessInfo.phone}</span>
          </a>
        </div>

      </motion.div>
    </div>
  );
};
