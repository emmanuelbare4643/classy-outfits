import React, { useState, useMemo } from 'react';
import { ProductCategory, Product } from '../types/store';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { 
  SlidersHorizontal, 
  Plus, 
  Search, 
  Sparkles, 
  Upload, 
  ShieldCheck, 
  Radio, 
  Zap, 
  Flame, 
  ShoppingBag, 
  Copy, 
  Check, 
  PhoneCall, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProductGridProps {
  activeCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenDetails: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onOpenDetails,
}) => {
  const { 
    visibleProducts, 
    openModifyWebsiteProtected, 
    onlyShowOwnerUploads, 
    authSession,
    isRealTimeConnected,
    refreshFromBackend,
    showToast,
    businessInfo
  } = useStore();

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const categories: { label: string; value: ProductCategory; count: number; icon: string }[] = useMemo(() => {
    return [
      { label: 'All Collection', value: 'all', count: visibleProducts.length, icon: '✨' },
      { label: 'Shoes & Kicks', value: 'shoes', count: visibleProducts.filter(p => p.category === 'shoes').length, icon: '👠' },
      { label: 'Retro Jerseys', value: 'jerseys', count: visibleProducts.filter(p => p.category === 'jerseys').length, icon: '⚽' },
      { label: 'Luxury Jackets', value: 'jackets', count: visibleProducts.filter(p => p.category === 'jackets').length, icon: '🧥' },
      { label: 'Platform Clogs', value: 'clogs', count: visibleProducts.filter(p => p.category === 'clogs').length, icon: '👡' },
      { label: 'Slides for Women', value: 'slides', count: visibleProducts.filter(p => p.category === 'slides').length, icon: '🩴' },
    ];
  }, [visibleProducts]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return visibleProducts
      .filter((p) => {
        // Category filter
        if (activeCategory !== 'all' && p.category !== activeCategory) {
          return false;
        }
        // In-stock filter
        if (onlyInStock && !p.inStock) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = p.title.toLowerCase().includes(q);
          const matchesDesc = p.description.toLowerCase().includes(q);
          const matchesCat = p.category.toLowerCase().includes(q);
          const matchesColors = p.colors?.some(c => c.toLowerCase().includes(q));
          if (!matchesTitle && !matchesDesc && !matchesCat && !matchesColors) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'newest') return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        // default featured
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
  }, [visibleProducts, activeCategory, onlyInStock, searchQuery, sortBy]);

  const handleOpenAddProduct = () => {
    openModifyWebsiteProtected('products');
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(businessInfo.phone);
    setCopiedPhone(true);
    showToast(`Copied ${businessInfo.phone} to clipboard for M-Pesa payment!`);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshFromBackend();
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('⚡ Live catalog refreshed with latest server updates!');
    }, 400);
  };

  return (
    <section id="catalog-section" className="pt-4 pb-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Top Banner Tag for first-time visitors */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141722] border border-[#FF3366]/30 shadow-lg text-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#FF3366]" />
          <span className="font-heading tracking-wide uppercase text-zinc-200 font-bold">Classy Outfits, Clothewear &amp; Shoegame</span>
          <span className="text-zinc-600">•</span>
          <span className="text-[#FF5376] font-semibold">Official Boutique Catalog</span>
        </div>

        {/* Real-Time Live Sync Status Indicator */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#12141E] border border-white/10 text-[11px] font-mono text-zinc-300">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isRealTimeConnected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isRealTimeConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            </span>
            <span>{isRealTimeConnected ? 'Live Cloud & Phone Sync' : 'Connecting Cloud...'}</span>
          </div>

          <button
            onClick={handleManualRefresh}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Force refresh catalog"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#FF3366]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Catalogue Header at Start of Portal */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#12141D] via-[#161925] to-[#12141D] border border-white/10 shadow-2xl relative overflow-hidden mb-6">
        {/* Glow Effects */}
        <div className="absolute -top-16 -right-16 w-60 h-60 bg-[#FF3366]/15 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-60 h-60 bg-[#8B5CF6]/15 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF3366] animate-pulse" />
              <span className="text-[11px] font-bold font-mono text-[#FF5376] tracking-widest uppercase">
                Curated Fashion &amp; Footwear
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              CATALOGUE &amp; LATEST DROPS
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Explore authentic footwear, club jerseys, jackets, platform clogs, and slides for women. Instant order via M-Pesa to{' '}
              <button 
                onClick={handleCopyPhone}
                className="inline-flex items-center gap-1 font-mono font-bold text-white bg-white/10 hover:bg-[#FF3366]/30 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                title="Tap to copy phone number"
              >
                <span>{businessInfo.phone}</span>
                {copiedPhone ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-zinc-400" />}
              </button>
            </p>
          </div>

          {/* Action Buttons for Owner and Customers */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleOpenAddProduct}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#FF3366] to-[#8B5CF6] hover:from-[#ff4777] hover:to-[#9a6eff] text-white text-xs sm:text-sm font-bold shadow-xl shadow-[#FF3366]/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{authSession.isAuthenticated ? 'Upload Product Photo' : 'Owner Portal Upload'}</span>
            </button>

            <button
              onClick={handleCopyPhone}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#1D2130] hover:bg-[#252A3D] border border-white/10 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>Pay via M-Pesa</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 pb-3 overflow-x-auto no-scrollbar">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => onSelectCategory(cat.value)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-semibold tracking-wide transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-white to-zinc-200 text-black shadow-lg shadow-white/15 scale-102'
                  : 'bg-[#131622] text-zinc-400 hover:text-white hover:bg-[#1B1F2D] border border-white/5'
              }`}
            >
              <span className="text-sm">{cat.icon}</span>
              <span>{cat.label}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${isActive ? 'bg-black text-white' : 'bg-white/10 text-zinc-400'}`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Controls Bar: Search, In-stock Toggle & Sorting */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 py-3 border-y border-white/10 my-2 text-xs text-zinc-400">
        
        {/* Search input in catalog */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search shoes, jerseys, jackets, clogs, colors..."
            className="w-full bg-[#131622] border border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF3366] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs px-1"
            >
              ×
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between md:justify-end gap-3">
          <div className="flex items-center gap-2">
            <span>Showing <strong className="text-white font-mono">{filteredProducts.length}</strong> items</span>
            {onlyShowOwnerUploads && (
              <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 text-[10px] font-mono">
                <ShieldCheck className="w-3 h-3" />
                Owner Uploads
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* In-Stock Only Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none text-zinc-300 hover:text-white">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded bg-[#141722] border-white/20 text-[#FF3366] focus:ring-0 focus:ring-offset-0"
              />
              <span>In-Stock Only</span>
            </label>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-[#141722] border border-white/10 rounded-xl px-2.5 py-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-zinc-200 text-xs focus:outline-none cursor-pointer"
              >
                <option value="featured" className="bg-[#141722] text-white">Featured</option>
                <option value="price-asc" className="bg-[#141722] text-white">Price: Low to High</option>
                <option value="price-desc" className="bg-[#141722] text-white">Price: High to Low</option>
                <option value="newest" className="bg-[#141722] text-white">Newest Drops</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length > 0 ? (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4"
        >
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetails={onOpenDetails}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Empty State */
        <div className="py-16 text-center rounded-3xl bg-[#11131A] border border-white/10 p-8 space-y-4 my-6 max-w-2xl mx-auto shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF3366]/20 to-[#8B5CF6]/20 border border-[#FF3366]/30 mx-auto flex items-center justify-center text-[#FF5376]">
            <Upload className="w-8 h-8" />
          </div>
          
          <div className="space-y-1">
            <h3 className="font-heading text-xl font-bold text-white">
              {searchQuery ? 'No matching items found' : 'Ready For Your Authentic Photos'}
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              {searchQuery
                ? `No items match "${searchQuery}". Try clearing your search keyword.`
                : 'As requested by owner Emmanuel, authentic photos you upload appear here in real-time across all customer phones!'}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {searchQuery ? (
              <button
                onClick={() => onSearchChange('')}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer"
              >
                Clear Search
              </button>
            ) : null}

            <button
              onClick={handleOpenAddProduct}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF3366] to-[#8B5CF6] hover:from-[#ff4777] hover:to-[#9a6eff] text-white text-xs font-bold shadow-lg shadow-[#FF3366]/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{authSession.isAuthenticated ? 'Upload Product Photo Now' : 'Sign in as Emmanuel & Upload'}</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
