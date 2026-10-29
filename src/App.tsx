/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { ProductCategory, Product, DeliveryProof } from './types/store';
import { Navbar } from './components/Navbar';
import { PaymentBar } from './components/PaymentBar';
import { HeroBanner } from './components/HeroBanner';
import { ProductGrid } from './components/ProductGrid';
import { RealDeliveriesSection } from './components/RealDeliveriesSection';
import { CustomerReviewsSection } from './components/CustomerReviewsSection';
import { BusinessBioSection } from './components/BusinessBioSection';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { OwnerStudioModal } from './components/OwnerStudioModal';
import { OwnerAuthModal } from './components/OwnerAuthModal';
import { LeaveReviewModal } from './components/LeaveReviewModal';
import { CartDrawer } from './components/CartDrawer';
import { PaymentMethodModal } from './components/PaymentMethodModal';
import { BusinessBioModal } from './components/BusinessBioModal';
import { DeliveryProofLightbox } from './components/DeliveryProofLightbox';
import { Sparkles, CheckCircle2, Lock, ShieldCheck, ShoppingBag } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

function StoreMain() {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const {
    selectedProduct,
    setSelectedProduct,
    selectedProofImage,
    setSelectedProofImage,
    isBioModalOpen,
    setIsBioModalOpen,
    toastMessage,
    cartCount,
    setIsCartOpen,
    openModifyWebsiteProtected,
    authSession,
  } = useStore();

  const handleSelectCategory = (cat: ProductCategory) => {
    setActiveCategory(cat);
    // Smooth scroll to catalog section
    const catalogElem = document.getElementById('catalog-section');
    if (catalogElem) {
      catalogElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenDeliveries = () => {
    const delElem = document.getElementById('deliveries-section');
    if (delElem) {
      delElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenReviews = () => {
    const revElem = document.getElementById('reviews-section');
    if (revElem) {
      revElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenBio = () => {
    setIsBioModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F3F4F6] flex flex-col selection:bg-[#FF3366] selection:text-white">
      {/* Sleek Minimalist Navbar */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenDeliveries={handleOpenDeliveries}
        onOpenReviews={handleOpenReviews}
        onOpenBio={handleOpenBio}
      />

      {/* Prominent Payment Banner highlighting phone number +254 791389827 */}
      <PaymentBar />

      <main className="flex-1">
        {/* Product Catalog FIRST: Visitors and prospective customers see the drops immediately */}
        <ProductGrid
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenDetails={(prod) => setSelectedProduct(prod)}
        />

        {/* Dynamic Dark Luxury Hero & Brand Story */}
        <HeroBanner
          onSelectCategory={handleSelectCategory}
          onOpenDeliveries={handleOpenDeliveries}
        />

        {/* Real Delivered Customer Proofs Gallery */}
        <RealDeliveriesSection
          onSelectProof={(proof) => setSelectedProofImage(proof)}
        />

        {/* Customer Reviews & Feedback Section */}
        <CustomerReviewsSection />

        {/* Business Biography & Guiding Principles */}
        <BusinessBioSection />
      </main>

      {/* Luxury Footer */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onOpenDeliveries={handleOpenDeliveries}
        onOpenReviews={handleOpenReviews}
        onOpenBio={handleOpenBio}
      />

      {/* Modals & Overlays */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <OwnerStudioModal />

      <OwnerAuthModal />

      <LeaveReviewModal />

      <CartDrawer />

      <PaymentMethodModal />

      <BusinessBioModal />

      <DeliveryProofLightbox />

      {/* Floating Action Buttons for quick access */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
        {/* Quick Cart button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="p-3.5 rounded-full bg-gradient-to-r from-[#FF3366] to-[#8B5CF6] text-white shadow-2xl shadow-[#FF3366]/40 hover:scale-110 active:scale-95 transition-all flex items-center justify-center relative cursor-pointer"
          title="Open Shopping Bag"
        >
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-white text-black font-mono font-black text-xs rounded-full w-5 h-5 flex items-center justify-center shadow">
              {cartCount}
            </span>
          )}
        </button>

        {/* Owner Settings Quick Button (Protected) */}
        <button
          onClick={() => openModifyWebsiteProtected('products')}
          className={`px-3.5 py-2 rounded-full border text-xs font-semibold backdrop-blur-md shadow-xl flex items-center gap-1.5 transition-all cursor-pointer ${
            authSession.isAuthenticated
              ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/80'
              : 'bg-[#181B26]/90 hover:bg-[#202534] border-white/20 text-white hover:border-[#FF3366]'
          }`}
          title={authSession.isAuthenticated ? 'Owner Studio (Emmanuel)' : 'Owner Portal (Restricted)'}
        >
          {authSession.isAuthenticated ? (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Lock className="w-3.5 h-3.5 text-[#FF5376]" />
          )}
          <span className="hidden sm:inline">
            {authSession.isAuthenticated ? 'Owner Studio' : 'Owner Portal'}
          </span>
        </button>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#161925]/95 backdrop-blur-md border border-[#FF3366]/40 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-medium max-w-md pointer-events-none"
          >
            <CheckCircle2 className="w-4 h-4 text-[#FF5376] shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <StoreMain />
    </StoreProvider>
  );
}
