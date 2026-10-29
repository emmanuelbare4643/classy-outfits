import React from 'react';
import { useStore } from '../context/StoreContext';
import { Phone, Copy, MessageSquare, ShieldCheck, Check } from 'lucide-react';
import { useState } from 'react';

export const PaymentBar: React.FC = () => {
  const { businessInfo, setIsPaymentModalOpen, showToast } = useStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(businessInfo.phone);
    setCopied(true);
    showToast(`Phone number ${businessInfo.phone} copied!`);
    setTimeout(() => setCopied(false), 2500);
  };

  const cleanWhatsappNumber = businessInfo.whatsapp.replace(/[^0-9]/g, '');

  return (
    <div className="w-full bg-[#0E1017] border-y border-white/10 py-3 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        
        {/* Left: Payment Phone Number highlight */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-4 text-center md:text-left">
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-lg text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold uppercase tracking-wider text-[11px]">Official Payment Mode:</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-zinc-400">Direct M-Pesa to:</span>
            <span className="font-mono font-bold text-white text-sm tracking-wide bg-[#181B26] px-2.5 py-0.5 rounded border border-white/10">
              {businessInfo.phone}
            </span>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
              title="Copy number"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <span className="hidden lg:inline text-zinc-500">|</span>
          <span className="hidden lg:inline text-zinc-400">
            Account Name: <strong className="text-zinc-200">{businessInfo.mpesaName}</strong>
          </span>
        </div>

        {/* Right: Quick action buttons */}
        <div className="flex items-center gap-2">
          <a
            href={`https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
              "Hi Classy Outfits! I'm browsing your website and I'd like to ask about an item / place an order."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat on WhatsApp</span>
          </a>

          <a
            href={`tel:${businessInfo.phone}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181B26] hover:bg-[#202534] border border-white/10 text-zinc-200 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-sky-400" />
            <span>Call Now</span>
          </a>

          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="text-zinc-400 hover:text-white underline underline-offset-4 pl-1"
          >
            How to Pay
          </button>
        </div>

      </div>
    </div>
  );
};
