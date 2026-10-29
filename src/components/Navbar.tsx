import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCategory } from '../types/store';
import { 
  ShoppingBag, 
  Heart, 
  Sparkles, 
  PhoneCall, 
  Menu, 
  X, 
  SlidersHorizontal, 
  Search,
  BookOpen,
  Camera,
  Coins,
  Lock,
  ShieldCheck,
  Star
} from 'lucide-react';

interface NavbarProps {
  activeCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenDeliveries: () => void;
  onOpenReviews: () => void;
  onOpenBio: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onOpenDeliveries,
  onOpenReviews,
  onOpenBio,
}) => {
  const { 
    businessInfo, 
    cartCount, 
    wishlist, 
    setIsCartOpen, 
    setIsPaymentModalOpen, 
    openModifyWebsiteProtected,
    authSession,
    currency,
    toggleCurrency
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const categories: { label: string; value: ProductCategory }[] = [
    { label: 'All Collection', value: 'all' },
    { label: 'Shoes & Kicks', value: 'shoes' },
    { label: 'Jerseys', value: 'jerseys' },
    { label: 'Jackets & Coats', value: 'jackets' },
    { label: 'Platform Clogs', value: 'clogs' },
    { label: 'Women’s Slides', value: 'slides' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#090A0F]/85 border-b border-white/10 transition-colors">
      {/* Top Announcement Bar */}
      {businessInfo.announcement && (
        <div className="bg-gradient-to-r from-[#FF3366] via-[#8B5CF6] to-[#FF3366] bg-[length:200%_auto] text-white text-xs sm:text-sm font-semibold tracking-wide py-1.5 px-4 text-center flex items-center justify-center gap-2 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 shrink-0 animate-pulse text-amber-200" />
          <span className="truncate">{businessInfo.announcement}</span>
          <span className="hidden md:inline-block font-mono bg-black/30 px-2 py-0.5 rounded text-[11px] text-amber-300">
            Pay: {businessInfo.phone}
          </span>
        </div>
      )}

      {/* Main Nav Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectCategory('all')}
              className="text-left group flex items-center gap-2.5 focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF3366] to-[#8B5CF6] p-[2px] shadow-lg shadow-[#FF3366]/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#0E1017] rounded-[10px] flex items-center justify-center font-heading font-extrabold text-lg text-white">
                  CO
                </div>
              </div>
              <div>
                <h1 className="font-heading text-lg sm:text-xl font-extrabold tracking-tight text-white group-hover:text-[#FF3366] transition-colors leading-none">
                  {businessInfo.brandName.toUpperCase()}
                </h1>
                <p className="text-[10px] sm:text-[11px] text-[#A0A5B5] tracking-widest uppercase font-medium mt-1">
                  Clothewear &amp; Shoegame
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search shoes, retro jerseys, jackets, slides..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-[#141722] border border-white/10 text-white placeholder-zinc-500 text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:border-[#FF3366] focus:ring-1 focus:ring-[#FF3366] transition-all"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Right Action Icons & Payment Badge */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Currency Switcher */}
            <button
              onClick={toggleCurrency}
              title={`Switch currency (Current: ${currency})`}
              className="px-2.5 py-1.5 rounded-lg bg-[#141722] border border-white/10 hover:border-white/25 text-xs font-mono font-medium text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>{currency}</span>
            </button>

            {/* Direct Payment Highlight Button */}
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141722] border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/10 transition-all shadow-sm"
              title="Click for M-Pesa & Payment Details"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="font-mono">{businessInfo.phone}</span>
            </button>

            {/* Real Deliveries proof shortcut */}
            <button
              onClick={onOpenDeliveries}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141722] border border-white/10 hover:border-[#8B5CF6]/50 text-zinc-300 hover:text-[#A78BFA] text-xs font-medium transition-colors"
            >
              <Camera className="w-3.5 h-3.5 text-[#A78BFA]" />
              <span>Real Deliveries</span>
            </button>

            {/* Customer Reviews shortcut */}
            <button
              onClick={onOpenReviews}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141722] border border-white/10 hover:border-amber-400/50 text-zinc-300 hover:text-amber-300 text-xs font-medium transition-colors"
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Reviews</span>
            </button>

            {/* About & Principles */}
            <button
              onClick={onOpenBio}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141722] border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white text-xs font-medium transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
              <span>Bio &amp; Principles</span>
            </button>

            {/* Owner Studio / Modify Website Button (Protected for Emmanuel) */}
            <button
              onClick={() => openModifyWebsiteProtected('products')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all shadow-sm ${
                authSession.isAuthenticated
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25'
                  : 'bg-gradient-to-r from-[#FF3366]/20 to-[#8B5CF6]/20 border-[#FF3366]/40 hover:border-[#FF3366] text-[#FF5376] hover:text-white'
              }`}
              title={authSession.isAuthenticated ? 'Owner Emmanuel Studio (Logged in)' : 'Owner Portal (Restricted to Emmanuel & Authorized Managers)'}
            >
              {authSession.isAuthenticated ? <ShieldCheck className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">
                {authSession.isAuthenticated ? 'Owner Studio' : 'Modify Store'}
              </span>
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-[#141722] border border-white/10 hover:border-[#FF3366]/50 text-white hover:text-[#FF3366] transition-colors focus:outline-none"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#FF3366] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-[#FF3366]/40 animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-[#141722] border border-white/10 text-zinc-300 hover:text-white md:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Minimalist Horizontal Category Tabs (Desktop) */}
        <div className="hidden md:flex items-center gap-1.5 py-2.5 border-t border-white/5 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => onSelectCategory(cat.value)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF3366] to-[#8B5CF6] text-white font-semibold shadow-md shadow-[#FF3366]/20'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0E1017] border-b border-white/10 px-4 pt-3 pb-6 space-y-4">
          {/* Mobile Search */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search shoes, jerseys, jackets, clogs..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-[#181B26] border border-white/10 text-white placeholder-zinc-500 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#FF3366]"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Categories */}
          <div>
            <p className="text-[11px] font-semibold uppercase text-zinc-400 tracking-wider mb-2">Browse Categories</p>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => {
                      onSelectCategory(cat.value);
                      setMobileMenuOpen(false);
                    }}
                    className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-[#FF3366] text-white font-semibold'
                        : 'bg-[#141722] text-zinc-300 hover:bg-[#1C2030]'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                setIsPaymentModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Pay: {businessInfo.phone}</span>
            </button>

            <button
              onClick={() => {
                onOpenDeliveries();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#141722] border border-white/10 text-zinc-200"
            >
              <Camera className="w-3.5 h-3.5 text-[#A78BFA]" />
              <span>Real Deliveries</span>
            </button>

            <button
              onClick={() => {
                onOpenReviews();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#141722] border border-white/10 text-zinc-200"
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Customer Reviews</span>
            </button>

            <button
              onClick={() => {
                onOpenBio();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#141722] border border-white/10 text-zinc-200"
            >
              <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
              <span>Bio &amp; Principles</span>
            </button>

            <button
              onClick={() => {
                openModifyWebsiteProtected('products');
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#FF3366]/20 border border-[#FF3366]/40 text-[#FF5376] font-medium"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Owner Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
