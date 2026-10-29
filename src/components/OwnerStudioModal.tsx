import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCategory, Product, DeliveryProof, BusinessInfo, Principle } from '../types/store';
import { 
  X, 
  Upload, 
  Plus, 
  Trash2, 
  Save, 
  Image as ImageIcon, 
  Check, 
  Tag, 
  SlidersHorizontal, 
  Camera, 
  BookOpen, 
  ShoppingBag, 
  RotateCcw, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  Mail, 
  LogOut, 
  CheckCircle2, 
  AlertTriangle,
  Eye,
  KeyRound,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const OwnerStudioModal: React.FC = () => {
  const {
    isOwnerStudioOpen,
    setIsOwnerStudioOpen,
    activeOwnerTab,
    setActiveOwnerTab,
    products,
    deliveries,
    reviews,
    deleteReview,
    visibleProducts,
    visibleDeliveries,
    onlyShowOwnerUploads,
    setOnlyShowOwnerUploads,
    clearAiSamplePhotos,
    businessInfo,
    addProduct,
    updateProduct,
    deleteProduct,
    addDeliveryProof,
    deleteDeliveryProof,
    updateBusinessInfo,
    resetToDefaults,
    formatPrice,
    showToast,
    authSession,
    logout,
    updateOwnerPin,
    ownerCustomPin,
    authorizedManagers,
    requestAddManagerVerification,
    confirmAddManager,
    removeManager,
    pendingVerification,
    cancelPendingVerification
  } = useStore();

  // --- TAB 1: Product Form State ---
  const [productTitle, setProductTitle] = useState('');
  const [productCategory, setProductCategory] = useState<'shoes' | 'jerseys' | 'jackets' | 'clogs' | 'slides'>('shoes');
  const [productPrice, setProductPrice] = useState<number | ''>('');
  const [productOriginalPrice, setProductOriginalPrice] = useState<number | ''>('');
  const [productSizes, setProductSizes] = useState('37, 38, 39, 40');
  const [productColors, setProductColors] = useState('Onyx Black, Silver');
  const [productBadge, setProductBadge] = useState<Product['badge']>('New Arrival');
  const [productInStock, setProductInStock] = useState(true);
  const [productDescription, setProductDescription] = useState('');
  const [productImages, setProductImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');

  // --- TAB 2: Delivery Proof Form State ---
  const [delCustomerName, setDelCustomerName] = useState('');
  const [delLocation, setDelLocation] = useState('Nairobi, Kenya');
  const [delPhotoUrl, setDelPhotoUrl] = useState('');
  const [delCaption, setDelCaption] = useState('');
  const [delProductPurchased, setDelProductPurchased] = useState('');
  const [delDate, setDelDate] = useState('Today, Just now');

  // --- TAB 3: Business Bio State ---
  const [bioState, setBioState] = useState<BusinessInfo>({ ...businessInfo });
  const [customPinInput, setCustomPinInput] = useState('');

  // --- TAB 5: Add Manager State ---
  const [newManagerEmail, setNewManagerEmail] = useState('');
  const [newManagerName, setNewManagerName] = useState('');
  const [verificationInputCode, setVerificationInputCode] = useState('');
  const [latestGeneratedCode, setLatestGeneratedCode] = useState<string | null>(null);

  if (!isOwnerStudioOpen) return null;

  // Client-side image optimization helper to make high-res phone photos upload in milliseconds
  const optimizeImageFile = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1500;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.86));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  // Handle local file upload for product image with instant compression & optimization
  const handleProductFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    showToast('Optimizing photo for instant real-time live sync...');
    const fileList = Array.from(files);
    for (const file of fileList) {
      try {
        const optimized = await optimizeImageFile(file);
        if (optimized) {
          setProductImages((prev) => [...prev, optimized]);
        }
      } catch (err) {
        console.error('Failed to optimize product image:', err);
      }
    }
    e.target.value = '';
    showToast('Photo ready! Complete details and tap Post Product.');
  };

  const addImageUrlToProduct = () => {
    if (!imageUrlInput.trim()) return;
    setProductImages((prev) => [...prev, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  const removeProductImage = (index: number) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit New Product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productTitle.trim()) {
      showToast('Please enter a product title');
      return;
    }
    if (!productPrice || Number(productPrice) <= 0) {
      showToast('Please enter a valid price in KES');
      return;
    }
    if (productImages.length === 0) {
      showToast('Please upload or insert at least one photo of the product you sell!');
      return;
    }

    const sizesArr = productSizes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const colorsArr = productColors
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    addProduct({
      title: productTitle.trim(),
      category: productCategory,
      price: Number(productPrice),
      originalPrice: productOriginalPrice ? Number(productOriginalPrice) : undefined,
      sizes: sizesArr.length > 0 ? sizesArr : ['Standard'],
      colors: colorsArr,
      badge: productBadge || undefined,
      inStock: productInStock,
      description: productDescription.trim() || 'Curated high-fashion piece from Classy Outfits.',
      images: productImages,
      gender: 'women',
    });

    // Reset Form
    setProductTitle('');
    setProductPrice('');
    setProductOriginalPrice('');
    setProductDescription('');
    setProductImages([]);
    setActiveOwnerTab('catalog');
  };

  // Handle local file upload for delivery photo
  const handleDeliveryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    showToast('Optimizing delivery photo for real-time sync...');
    try {
      const optimized = await optimizeImageFile(file);
      if (optimized) {
        setDelPhotoUrl(optimized);
        showToast('Delivery photo ready!');
      }
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setDelPhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  // Submit New Delivery Proof
  const handleSaveDeliveryProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!delPhotoUrl) {
      showToast('Please upload a photo of the delivered product!');
      return;
    }
    if (!delCustomerName.trim()) {
      showToast('Please provide a client name or nickname');
      return;
    }

    addDeliveryProof({
      customerName: delCustomerName.trim(),
      location: delLocation.trim() || 'Nairobi, Kenya',
      photoUrl: delPhotoUrl,
      caption: delCaption.trim() || '“Parcel delivered safely and fast! Perfect fit.”',
      productPurchased: delProductPurchased.trim() || 'Classy Outfits Item',
      date: delDate.trim() || 'Recently',
      verified: true,
    });

    // Reset form
    setDelCustomerName('');
    setDelPhotoUrl('');
    setDelCaption('');
    setDelProductPurchased('');
    setIsOwnerStudioOpen(false);
  };

  // Submit Bio & Principles
  const handleSaveBio = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessInfo(bioState);
  };

  const handlePrincipleChange = (index: number, field: 'title' | 'description', value: string) => {
    const updated = [...bioState.principles];
    updated[index] = { ...updated[index], [field]: value };
    setBioState({ ...bioState, principles: updated });
  };

  // Team Verification: Request Code
  const handleRequestManagerCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newManagerEmail.trim()) {
      showToast('Please provide the email address to authorize.');
      return;
    }
    const code = requestAddManagerVerification(newManagerEmail, newManagerName);
    setLatestGeneratedCode(code);
    showToast("Verification code dispatched to Emmanuel's private owner inbox!");
  };

  // Team Verification: Confirm Code
  const handleConfirmVerification = (e: React.FormEvent) => {
    e.preventDefault();
    const success = confirmAddManager(verificationInputCode);
    if (success) {
      setNewManagerEmail('');
      setNewManagerName('');
      setVerificationInputCode('');
      setLatestGeneratedCode(null);
    }
  };

  const isMasterOwner = authSession.role === 'owner';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="relative w-full max-w-5xl bg-[#11131A] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
      >
        {/* Header Bar with Owner Status */}
        <div className="p-4 sm:p-6 bg-[#0E1017] border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#FF3366] to-[#8B5CF6] flex items-center justify-center text-white shadow-md">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-lg sm:text-xl font-bold text-white">
                  Owner Studio &amp; Store Customizer
                </h2>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {isMasterOwner ? 'Emmanuel (Master Owner)' : 'Authorized Manager'}
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Logged in as <strong className="text-zinc-200">{isMasterOwner ? 'Emmanuel (Private Owner Account)' : (authSession.userName || 'Authorized Manager')}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-semibold transition-colors"
              title="Log out of Owner Portal"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span>Logout</span>
            </button>
            <button
              onClick={() => setIsOwnerStudioOpen(false)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-4 sm:px-6 pt-3 border-b border-white/10 bg-[#0E1017] overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setActiveOwnerTab('products')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeOwnerTab === 'products'
                ? 'bg-[#181B26] text-[#FF5376] border-t-2 border-[#FF3366]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Post New Product &amp; Photos</span>
          </button>

          <button
            onClick={() => setActiveOwnerTab('deliveries')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeOwnerTab === 'deliveries'
                ? 'bg-[#181B26] text-[#A78BFA] border-t-2 border-[#8B5CF6]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Upload Real Delivered Photo</span>
          </button>

          <button
            onClick={() => setActiveOwnerTab('team')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeOwnerTab === 'team'
                ? 'bg-[#181B26] text-emerald-400 border-t-2 border-emerald-400'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Authorized Managers ({authorizedManagers.length})</span>
          </button>

          <button
            onClick={() => setActiveOwnerTab('reviews')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeOwnerTab === 'reviews'
                ? 'bg-[#181B26] text-amber-400 border-t-2 border-amber-400'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Customer Reviews ({reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveOwnerTab('bio')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeOwnerTab === 'bio'
                ? 'bg-[#181B26] text-rose-400 border-t-2 border-rose-400'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Edit Bio &amp; Principles</span>
          </button>

          <button
            onClick={() => setActiveOwnerTab('catalog')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeOwnerTab === 'catalog'
                ? 'bg-[#181B26] text-white border-t-2 border-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Manage Catalog ({visibleProducts.length})</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: ADD NEW PRODUCT */}
          {activeOwnerTab === 'products' && (
            <form onSubmit={handleSaveProduct} className="space-y-6 max-w-3xl mx-auto">
              
              {/* Photo Display Mode Notice */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong>Owner Uploads Mode Active:</strong> Only photos that you upload will appear on the storefront.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={clearAiSamplePhotos}
                  className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold transition-colors shrink-0"
                >
                  Clear AI Sample Photos
                </button>
              </div>

              {/* Product Information */}
              <div className="bg-[#141722] p-5 rounded-2xl border border-white/10 space-y-4">
                <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#FF3366]" />
                  Product Information &amp; Pricing
                </h3>

                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aura Metallic High Heels, Retro Paris Jersey, Cloud Platform Clogs..."
                    value={productTitle}
                    onChange={(e) => setProductTitle(e.target.value)}
                    className="w-full bg-[#1A1D2B] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#FF3366]"
                  />
                </div>

                {/* Category & Badge */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Category *
                    </label>
                    <select
                      value={productCategory}
                      onChange={(e) => setProductCategory(e.target.value as any)}
                      className="w-full bg-[#1A1D2B] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#FF3366] cursor-pointer"
                    >
                      <option value="shoes">Shoes &amp; Kicks</option>
                      <option value="jerseys">Jerseys (Retro / Custom / Cropped)</option>
                      <option value="jackets">Jackets &amp; Coats (Leather / Puffer / Denim)</option>
                      <option value="clogs">Clogs (Platform &amp; Shearling)</option>
                      <option value="slides">Slides for Women (Pillow &amp; Pool Luxury)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Badge / Tag
                    </label>
                    <select
                      value={productBadge || ''}
                      onChange={(e) => setProductBadge(e.target.value as any)}
                      className="w-full bg-[#1A1D2B] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#FF3366] cursor-pointer"
                    >
                      <option value="New Arrival">New Arrival</option>
                      <option value="Hot">Hot</option>
                      <option value="Trending">Trending</option>
                      <option value="Best Seller">Best Seller</option>
                      <option value="Limited Stock">Limited Stock</option>
                      <option value="Staff Pick">Staff Pick</option>
                      <option value="">No Badge</option>
                    </select>
                  </div>
                </div>

                {/* Prices */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Selling Price in KES *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-zinc-400">
                        KES
                      </span>
                      <input
                        type="number"
                        required
                        min="100"
                        placeholder="4500"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-[#1A1D2B] border border-white/10 rounded-xl pl-14 pr-4 py-2.5 text-white placeholder-zinc-500 font-mono text-sm focus:outline-none focus:border-[#FF3366]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Original Price in KES (Optional Discount)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-500">
                        KES
                      </span>
                      <input
                        type="number"
                        min="100"
                        placeholder="5500"
                        value={productOriginalPrice}
                        onChange={(e) => setProductOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-[#1A1D2B] border border-white/10 rounded-xl pl-14 pr-4 py-2.5 text-white placeholder-zinc-500 font-mono text-sm focus:outline-none focus:border-[#FF3366]"
                      />
                    </div>
                  </div>
                </div>

                {/* Sizes and Colors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Available Sizes (comma-separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 37, 38, 39, 40, 41 or S, M, L"
                      value={productSizes}
                      onChange={(e) => setProductSizes(e.target.value)}
                      className="w-full bg-[#1A1D2B] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#FF3366]"
                    />
                    <div className="flex gap-1.5 mt-2">
                      <button
                        type="button"
                        onClick={() => setProductSizes('36, 37, 38, 39, 40, 41')}
                        className="text-[10px] bg-white/5 hover:bg-white/10 text-zinc-400 px-2 py-0.5 rounded"
                      >
                        Shoes: 36-41
                      </button>
                      <button
                        type="button"
                        onClick={() => setProductSizes('S, M, L, XL')}
                        className="text-[10px] bg-white/5 hover:bg-white/10 text-zinc-400 px-2 py-0.5 rounded"
                      >
                        Clothes: S, M, L, XL
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Color Options (comma-separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Onyx Black, Champagne Gold, Silver"
                      value={productColors}
                      onChange={(e) => setProductColors(e.target.value)}
                      className="w-full bg-[#1A1D2B] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#FF3366]"
                    />
                  </div>
                </div>

                {/* In Stock toggle */}
                <div className="flex items-center gap-3 pt-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productInStock}
                      onChange={(e) => setProductInStock(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                  <span className="text-xs font-semibold text-zinc-200">
                    {productInStock ? 'Item is In Stock & Ready for Delivery' : 'Mark as Sold Out'}
                  </span>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Product Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe material, fit, styling tips, etc."
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    className="w-full bg-[#1A1D2B] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#FF3366]"
                  />
                </div>
              </div>

              {/* Product Photos Upload Area */}
              <div className="bg-[#141722] p-5 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#8B5CF6]" />
                    Upload Your Authentic Product Photos *
                  </h3>
                  <span className="text-[11px] text-emerald-400 font-mono">
                    Stamped as Emmanuel's Upload
                  </span>
                </div>

                {/* Upload Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="p-4 rounded-xl border-2 border-dashed border-[#FF3366]/40 hover:border-[#FF3366] bg-[#181B26] hover:bg-[#1E2333] transition-all flex flex-col items-center justify-center cursor-pointer text-center">
                    <Upload className="w-6 h-6 text-[#FF5376] mb-1" />
                    <span className="text-xs font-bold text-white">Choose Photos from Phone / PC</span>
                    <span className="text-[10px] text-zinc-400">JPG, PNG, WebP from camera or gallery</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleProductFileUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="p-3 rounded-xl bg-[#181B26] border border-white/10 flex flex-col justify-between">
                    <span className="text-xs font-semibold text-zinc-300 block mb-1">Or Paste Image URL</span>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://..."
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        className="flex-1 bg-[#12141D] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={addImageUrlToProduct}
                        className="px-3 py-1.5 bg-[#8B5CF6] hover:bg-[#7c4deb] text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <span className="text-[10px] text-zinc-500 mt-1">Direct image links also supported</span>
                  </div>
                </div>

                {/* Previews */}
                {productImages.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-zinc-400 block mb-2">
                      Attached Photos ({productImages.length}):
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {productImages.map((img, idx) => (
                        <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border border-emerald-500/50 group">
                          <img src={img} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeProductImage(idx)}
                            className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white hover:bg-red-700"
                            title="Remove photo"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOwnerStudioOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF3366] to-[#8B5CF6] hover:from-[#ff4777] hover:to-[#9a6eff] text-white text-xs font-bold shadow-lg shadow-[#FF3366]/30 flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish My Product with Photo</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: UPLOAD REAL DELIVERED PHOTOS */}
          {activeOwnerTab === 'deliveries' && (
            <form onSubmit={handleSaveDeliveryProof} className="space-y-6 max-w-2xl mx-auto">
              <div className="bg-[#141722] p-5 rounded-2xl border border-white/10 space-y-4">
                <div>
                  <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#A78BFA]" />
                    Insert Real Delivery Proof / Unboxing Photo
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Upload real photos of parcels delivered, rider dispatches, or clients wearing items to prove authenticity.
                  </p>
                </div>

                {/* Client Name & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Client Name / Identifier *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Stacy M., Client from Westlands..."
                      value={delCustomerName}
                      onChange={(e) => setDelCustomerName(e.target.value)}
                      className="w-full bg-[#1A1D2B] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#8B5CF6]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Delivery Location / City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Westlands Nairobi, Mombasa, Eldoret..."
                      value={delLocation}
                      onChange={(e) => setDelLocation(e.target.value)}
                      className="w-full bg-[#1A1D2B] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#8B5CF6]"
                    />
                  </div>
                </div>

                {/* Product Purchased & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Item Delivered
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Chunky Low Kicks (Size 38)"
                      value={delProductPurchased}
                      onChange={(e) => setDelProductPurchased(e.target.value)}
                      className="w-full bg-[#1A1D2B] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#8B5CF6]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Delivery Timeframe
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Today 2:30 PM, Yesterday..."
                      value={delDate}
                      onChange={(e) => setDelDate(e.target.value)}
                      className="w-full bg-[#1A1D2B] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#8B5CF6]"
                    />
                  </div>
                </div>

                {/* Photo Upload for Delivery */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Real Photo of Parcel / Product Delivered *
                  </label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <label className="p-4 rounded-xl border-2 border-dashed border-[#8B5CF6]/40 hover:border-[#8B5CF6] bg-[#181B26] hover:bg-[#1E2333] transition-all flex flex-col items-center justify-center cursor-pointer text-center">
                      <Upload className="w-5 h-5 text-[#A78BFA] mb-1" />
                      <span className="text-xs font-bold text-white">Upload Real Photo from Phone</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleDeliveryFileUpload}
                        className="hidden"
                      />
                    </label>

                    <div className="p-3 rounded-xl bg-[#181B26] border border-white/10 flex flex-col justify-center">
                      <span className="text-xs text-zinc-300 mb-1">Or Paste Image URL</span>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={delPhotoUrl}
                        onChange={(e) => setDelPhotoUrl(e.target.value)}
                        className="w-full bg-[#12141D] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Photo Preview */}
                  {delPhotoUrl && (
                    <div className="relative w-full h-44 rounded-xl overflow-hidden border border-emerald-500/50">
                      <img src={delPhotoUrl} alt="Delivery preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setDelPhotoUrl('')}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Feedback / Review quote */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Customer Feedback / Unboxing Quote
                  </label>
                  <textarea
                    rows={2}
                    placeholder="“Received my kicks in perfect condition within 2 hours in Nairobi! Highly recommend.”"
                    value={delCaption}
                    onChange={(e) => setDelCaption(e.target.value)}
                    className="w-full bg-[#1A1D2B] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7c4deb] text-white text-xs font-bold shadow-lg shadow-[#8B5CF6]/30 flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Publish Real Delivery Photo</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: AUTHORIZED MANAGERS & EMAIL VERIFICATION */}
          {activeOwnerTab === 'team' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              
              {/* Primary Owner Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#181B26] to-[#1F2436] border border-emerald-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-lg">
                      EB
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-heading font-bold text-white text-base">Emmanuel</h4>
                        <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          Super Admin &amp; Owner
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 font-medium">Confidential Owner Account (Verified)</p>
                    </div>
                  </div>

                  <span className="text-xs text-emerald-400 font-medium">Permanent Access</span>
                </div>

                <p className="text-xs text-zinc-400 pt-1 border-t border-white/5">
                  All store permissions and manager authorizations must be verified through <strong className="text-zinc-200">Emmanuel's private owner email</strong>.
                </p>
              </div>

              {/* Add New Manager with Email Verification */}
              <div className="p-5 rounded-2xl bg-[#141722] border border-white/10 space-y-4">
                <div>
                  <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#8B5CF6]" />
                    Authorize New Store Manager
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Add a trusted colleague or assistant to help upload photos and manage orders. An authorization code is dispatched to <strong className="text-zinc-200">Emmanuel's private owner inbox</strong> to confirm your approval.
                  </p>
                </div>

                {/* Step 1: Request Code Form */}
                {!pendingVerification ? (
                  <form onSubmit={handleRequestManagerCode} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                          Manager Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sarah / Store Assistant"
                          value={newManagerName}
                          onChange={(e) => setNewManagerName(e.target.value)}
                          className="w-full bg-[#1A1D2B] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#8B5CF6]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                          Manager Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. sarah@gmail.com"
                          value={newManagerEmail}
                          onChange={(e) => setNewManagerEmail(e.target.value)}
                          className="w-full bg-[#1A1D2B] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#8B5CF6]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7c4deb] text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Send Authorization Code to Owner's Private Email</span>
                    </button>
                  </form>
                ) : (
                  /* Step 2: Verification Code Input */
                  <form onSubmit={handleConfirmVerification} className="space-y-4 p-4 rounded-xl bg-[#181B26] border border-amber-500/40">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                          <KeyRound className="w-4 h-4" />
                          <span>Owner Email Verification Required</span>
                        </div>
                        <p className="text-xs text-zinc-300 mt-1">
                          A 6-digit confirmation code was sent to <strong className="text-white">Emmanuel's private owner inbox</strong> to authorize <strong>{pendingVerification.newEmail}</strong>.
                        </p>
                      </div>

                      {latestGeneratedCode && (
                        <div className="text-right bg-black/60 px-3 py-1.5 rounded-lg border border-amber-500/40">
                          <span className="text-[10px] text-zinc-400 block">Verification Code:</span>
                          <span className="font-mono text-sm font-bold text-amber-400 tracking-wider">
                            {latestGeneratedCode}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="Enter 6-digit code"
                        value={verificationInputCode}
                        onChange={(e) => setVerificationInputCode(e.target.value)}
                        className="bg-[#10121A] border border-white/20 rounded-xl px-4 py-2 text-white font-mono text-base tracking-widest text-center focus:border-amber-400 sm:w-48"
                      />

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Verify &amp; Authorize Manager</span>
                        </button>

                        <button
                          type="button"
                          onClick={cancelPendingVerification}
                          className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 text-xs font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>

              {/* List of currently authorized managers */}
              <div className="p-5 rounded-2xl bg-[#141722] border border-white/10 space-y-3">
                <h4 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
                  Active Authorized Managers ({authorizedManagers.length})
                </h4>

                <div className="space-y-2">
                  {authorizedManagers.map((mgr) => (
                    <div
                      key={mgr.id}
                      className="p-3.5 rounded-xl bg-[#181B26] border border-white/5 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-bold text-zinc-300">
                          {mgr.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{mgr.name}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                              mgr.role === 'owner' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'
                            }`}>
                              {mgr.role.toUpperCase()}
                            </span>
                          </div>
                          <span className="text-zinc-400 font-mono text-[11px]">
                            {mgr.role === 'owner' ? '[Confidential Owner Address]' : mgr.email}
                          </span>
                        </div>
                      </div>

                      {mgr.role !== 'owner' && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Revoke manager privileges for ${mgr.email}?`)) {
                              removeManager(mgr.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Revoke manager"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB: CUSTOMER REVIEWS MANAGEMENT */}
          {activeOwnerTab === 'reviews' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="p-5 rounded-2xl bg-[#141722] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400 fill-current" />
                    Customer Reviews &amp; Experiences ({reviews.length})
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Manage client reviews submitted on your website. Delete inappropriate or spam reviews anytime.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-[#141722] border border-white/5 flex flex-col sm:flex-row items-start justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center text-amber-400">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-current' : 'text-zinc-700'}`}
                            />
                          ))}
                        </div>
                        <span className="font-heading font-bold text-white text-xs">
                          {rev.customerName}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          • {rev.location}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          • {rev.date}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-200 italic leading-relaxed">
                        "{rev.comment}"
                      </p>

                      {rev.productPurchased && (
                        <span className="text-[11px] text-[#A78BFA] font-mono block">
                          Purchased: {rev.productPurchased}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete review from "${rev.customerName}"?`)) {
                          deleteReview(rev.id);
                        }
                      }}
                      className="p-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                      title="Delete review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: EDIT BIOGRAPHY & PRINCIPLES */}
          {activeOwnerTab === 'bio' && (
            <form onSubmit={handleSaveBio} className="space-y-6 max-w-3xl mx-auto">
              <div className="bg-[#141722] p-5 rounded-2xl border border-white/10 space-y-4">
                <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  Business Biography &amp; Brand Identity
                </h3>

                {/* Brand Name & Tagline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      value={bioState.brandName}
                      onChange={(e) => setBioState({ ...bioState, brandName: e.target.value })}
                      className="w-full bg-[#1A1D2B] border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Tagline / Slogan
                    </label>
                    <input
                      type="text"
                      value={bioState.tagline}
                      onChange={(e) => setBioState({ ...bioState, tagline: e.target.value })}
                      className="w-full bg-[#1A1D2B] border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Payment Phone Number & Account Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                  <div>
                    <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1.5">
                      Payment Phone Number *
                    </label>
                    <input
                      type="text"
                      value={bioState.phone}
                      onChange={(e) => setBioState({ ...bioState, phone: e.target.value, whatsapp: e.target.value })}
                      className="w-full bg-[#12141D] border border-emerald-500/40 rounded-xl px-4 py-2 text-white font-mono text-sm focus:border-emerald-400"
                    />
                    <span className="text-[10px] text-zinc-400 block mt-1">Direct M-Pesa recipient</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1.5">
                      M-Pesa Account Name
                    </label>
                    <input
                      type="text"
                      value={bioState.mpesaName}
                      onChange={(e) => setBioState({ ...bioState, mpesaName: e.target.value })}
                      className="w-full bg-[#12141D] border border-emerald-500/40 rounded-xl px-4 py-2 text-white font-mono text-sm focus:border-emerald-400"
                    />
                  </div>
                </div>

                {/* Announcement Bar Text */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Top Announcement Bar
                  </label>
                  <input
                    type="text"
                    value={bioState.announcement}
                    onChange={(e) => setBioState({ ...bioState, announcement: e.target.value })}
                    className="w-full bg-[#1A1D2B] border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:border-amber-400"
                  />
                </div>

                {/* Founder Bio */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Founder Story &amp; Business Biography
                  </label>
                  <textarea
                    rows={4}
                    value={bioState.founderBio}
                    onChange={(e) => setBioState({ ...bioState, founderBio: e.target.value })}
                    className="w-full bg-[#1A1D2B] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-amber-400 leading-relaxed"
                  />
                </div>

                {/* Pickup Hub & Hours */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Dispatch Hub / Pickup Point
                    </label>
                    <input
                      type="text"
                      value={bioState.pickupHub}
                      onChange={(e) => setBioState({ ...bioState, pickupHub: e.target.value })}
                      className="w-full bg-[#1A1D2B] border border-white/10 rounded-xl px-4 py-2 text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Opening &amp; Dispatch Hours
                    </label>
                    <input
                      type="text"
                      value={bioState.openingHours}
                      onChange={(e) => setBioState({ ...bioState, openingHours: e.target.value })}
                      className="w-full bg-[#1A1D2B] border border-white/10 rounded-xl px-4 py-2 text-white text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Private Owner PIN Management (Only visible when logged in as Owner) */}
              {isMasterOwner && (
                <div className="bg-[#141722] p-5 rounded-2xl border border-purple-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-sm font-bold text-white flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-purple-400" />
                      <span>Owner Access PIN (Confidential to Emmanuel)</span>
                    </h3>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-mono font-bold">
                      Owner Only
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    This PIN is completely hidden from the public website and known only to you. You can change your secret access PIN at any time.
                  </p>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                    <input
                      type="password"
                      value={customPinInput}
                      onChange={(e) => setCustomPinInput(e.target.value)}
                      placeholder="Enter new secret PIN (min 4 characters)"
                      className="bg-[#10121A] border border-white/10 rounded-xl px-4 py-2 text-white font-mono text-sm tracking-widest focus:border-purple-400 sm:w-72"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!customPinInput.trim() || customPinInput.trim().length < 4) {
                          showToast('PIN must be at least 4 digits/characters');
                          return;
                        }
                        updateOwnerPin(customPinInput.trim());
                        setCustomPinInput('');
                      }}
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Update Secret PIN</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Editable Core Principles */}
              <div className="bg-[#141722] p-5 rounded-2xl border border-white/10 space-y-4">
                <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FF5376]" />
                  Core Business Principles ({bioState.principles.length})
                </h3>

                <div className="space-y-4">
                  {bioState.principles.map((pr, idx) => (
                    <div key={pr.id || idx} className="p-3.5 rounded-xl bg-[#181B26] border border-white/5 space-y-2">
                      <span className="text-[11px] font-mono text-zinc-400 font-bold block">Principle #{idx + 1}</span>
                      <input
                        type="text"
                        value={pr.title}
                        onChange={(e) => handlePrincipleChange(idx, 'title', e.target.value)}
                        placeholder="Principle Title"
                        className="w-full bg-[#12141D] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-bold"
                      />
                      <textarea
                        rows={2}
                        value={pr.description}
                        onChange={(e) => handlePrincipleChange(idx, 'description', e.target.value)}
                        placeholder="Description of this principle"
                        className="w-full bg-[#12141D] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-zinc-300"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={resetToDefaults}
                  className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Factory Defaults</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Biography &amp; Principles</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 5: MANAGE CATALOG */}
          {activeOwnerTab === 'catalog' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-heading text-base font-bold text-white">
                    Catalog Items ({visibleProducts.length})
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Update prices, toggle stock availability, or delete items.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={clearAiSamplePhotos}
                    className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition-colors"
                  >
                    Clear AI Photos
                  </button>

                  <button
                    onClick={() => setActiveOwnerTab('products')}
                    className="px-3.5 py-1.5 rounded-xl bg-[#FF3366] hover:bg-[#ff4777] text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload Product</span>
                  </button>
                </div>
              </div>

              {visibleProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  {visibleProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="p-3.5 rounded-2xl bg-[#141722] border border-white/10 flex items-start gap-3 justify-between"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={prod.images[0] || 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=400'}
                          alt={prod.title}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-[#A78BFA]">
                              {prod.category}
                            </span>
                            {prod.isOwnerUploaded && (
                              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1 rounded">
                                Emmanuel's Upload
                              </span>
                            )}
                          </div>
                          <h4 className="font-heading text-xs font-bold text-white line-clamp-1">
                            {prod.title}
                          </h4>
                          <div className="font-mono text-xs text-emerald-400 font-bold">
                            {formatPrice(prod.price)}
                          </div>
                          <button
                            onClick={() => updateProduct(prod.id, { inStock: !prod.inStock })}
                            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold transition-colors ${
                              prod.inStock
                                ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'
                                : 'bg-red-500/15 text-red-400 hover:bg-red-500/25'
                            }`}
                          >
                            {prod.inStock ? '● In Stock' : '○ Sold Out'}
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (window.confirm(`Delete "${prod.title}" from store?`)) {
                            deleteProduct(prod.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center rounded-2xl bg-[#141722] border border-white/10 p-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-white/5 mx-auto flex items-center justify-center text-zinc-400">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h4 className="font-heading font-bold text-white">No products yet</h4>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                    You have chosen to display only photos uploaded by you (Emmanuel). Click below to post your first shoes, jerseys, jackets, clogs, or slides!
                  </p>
                  <button
                    onClick={() => setActiveOwnerTab('products')}
                    className="px-4 py-2 rounded-xl bg-[#FF3366] text-white text-xs font-bold"
                  >
                    Upload First Product
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
};
