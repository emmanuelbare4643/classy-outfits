import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Lock, 
  Mail, 
  KeyRound, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const OwnerAuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    loginAsOwnerOrManager 
  } = useStore();

  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanEmail = email.trim();
    const cleanPin = pin.trim();

    if (!cleanEmail) {
      setErrorMsg('Please enter your authorized email address.');
      return;
    }

    if (!cleanPin) {
      setErrorMsg('Please enter your secret access PIN.');
      return;
    }

    setIsSubmitting(true);
    const success = loginAsOwnerOrManager(cleanEmail, cleanPin);
    setIsSubmitting(false);

    if (!success) {
      setErrorMsg('Invalid email or PIN. Access is strictly restricted to owner Emmanuel and authorized personnel.');
    } else {
      // Clear inputs upon successful login
      setEmail('');
      setPin('');
    }
  };

  const handleClose = () => {
    setErrorMsg(null);
    setEmail('');
    setPin('');
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-md bg-[#11131A] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto p-6 sm:p-8"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Security Shield Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF3366] to-[#8B5CF6] flex items-center justify-center mx-auto text-white shadow-lg shadow-[#FF3366]/20">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight">
            Owner &amp; Staff Portal
          </h2>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
            Administrative access is restricted. Enter your private credentials to modify store items and upload authentic photos.
          </p>
        </div>

        {/* Error Alert Box */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-start gap-2.5 mb-5 leading-relaxed"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Secure Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Authorized Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="Enter authorized email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#181B26] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#FF3366] transition-colors"
              />
            </div>
          </div>

          {/* Secret PIN Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Access PIN
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPin ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full bg-[#181B26] border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-white font-mono text-sm tracking-widest focus:outline-none focus:border-[#FF3366] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1"
                aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF3366] to-[#8B5CF6] hover:from-[#ff4777] hover:to-[#9a6eff] text-white font-bold text-xs shadow-lg shadow-[#FF3366]/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
          >
            <span>Sign In to Owner Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Confidential Protection Notice */}
        <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-center gap-2 text-zinc-500 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Protected Store Management • Credentials Confidential</span>
        </div>
      </motion.div>
    </div>
  );
};
