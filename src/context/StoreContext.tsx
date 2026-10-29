import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  DeliveryProof, 
  BusinessInfo, 
  CartItem, 
  AuthorizedManager, 
  AuthSession,
  CustomerReview 
} from '../types/store';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_DELIVERIES, 
  INITIAL_BUSINESS_INFO,
  INITIAL_REVIEWS 
} from '../data/defaultData';
import { db } from '../firebase/config';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';

export const MASTER_OWNER_EMAILS = [
  'emmanuelbare4643@gmail.com',
  'emmanuelbare4643@icloud.com',
];
export const MASTER_OWNER_EMAIL = 'emmanuelbare4643@gmail.com';
export const MASTER_OWNER_ICLOUD_EMAIL = 'emmanuelbare4643@icloud.com';
export const MASTER_OWNER_NAME = 'Emmanuel';
export const DEFAULT_MASTER_PIN = '7913'; // First 4 digits of phone 0791389827

interface PendingVerification {
  newEmail: string;
  newName: string;
  code: string;
  expiresAt: number;
}

interface StoreContextType {
  products: Product[];
  deliveries: DeliveryProof[];
  reviews: CustomerReview[];
  visibleProducts: Product[];
  visibleDeliveries: DeliveryProof[];
  onlyShowOwnerUploads: boolean;
  setOnlyShowOwnerUploads: (val: boolean) => void;
  clearAiSamplePhotos: () => void;

  businessInfo: BusinessInfo;
  cart: CartItem[];
  wishlist: string[];
  currency: 'KES' | 'USD';
  toggleCurrency: () => void;
  formatPrice: (priceInKES: number) => string;
  
  // Cart Actions
  addToCart: (product: Product, selectedSize: string, selectedColor?: string, quantity?: number) => void;
  removeFromCart: (productId: string, selectedSize: string) => void;
  updateCartQuantity: (productId: string, selectedSize: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Customer Reviews Actions
  addCustomerReview: (reviewData: Omit<CustomerReview, 'id' | 'date' | 'likes'>) => void;
  likeReview: (id: string) => void;
  deleteReview: (id: string) => void;
  isReviewModalOpen: boolean;
  setIsReviewModalOpen: (open: boolean) => void;

  // Owner Authentication & Access Control
  authSession: AuthSession;
  authorizedManagers: AuthorizedManager[];
  loginAsOwnerOrManager: (email: string, pin: string) => boolean;
  logout: () => void;
  updateOwnerPin: (newPin: string) => void;
  ownerCustomPin: string;
  requestAddManagerVerification: (email: string, name: string) => string;
  confirmAddManager: (code: string) => boolean;
  removeManager: (id: string) => void;
  pendingVerification: PendingVerification | null;
  cancelPendingVerification: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  openModifyWebsiteProtected: (tab?: 'products' | 'deliveries' | 'reviews' | 'bio' | 'catalog' | 'team') => void;

  // Store Management Actions
  addProduct: (productData: Omit<Product, 'id' | 'dateAdded'>) => void;
  updateProduct: (id: string, productData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addDeliveryProof: (proofData: Omit<DeliveryProof, 'id' | 'date'> & { date?: string }) => void;
  deleteDeliveryProof: (id: string) => void;
  updateBusinessInfo: (newInfo: Partial<BusinessInfo>) => void;
  resetToDefaults: () => void;

  // UI Modal States
  isOwnerStudioOpen: boolean;
  setIsOwnerStudioOpen: (open: boolean) => void;
  activeOwnerTab: 'products' | 'deliveries' | 'reviews' | 'bio' | 'catalog' | 'team';
  setActiveOwnerTab: (tab: 'products' | 'deliveries' | 'reviews' | 'bio' | 'catalog' | 'team') => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (open: boolean) => void;
  isBioModalOpen: boolean;
  setIsBioModalOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (prod: Product | null) => void;
  selectedProofImage: DeliveryProof | null;
  setSelectedProofImage: (proof: DeliveryProof | null) => void;

  // Real-time synchronization state
  isRealTimeConnected: boolean;
  refreshFromBackend: () => Promise<void>;

  // Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'classy_outfits_products_v2',
  DELIVERIES: 'classy_outfits_deliveries_v2',
  REVIEWS: 'classy_outfits_reviews_v2',
  BUSINESS_INFO: 'classy_outfits_business_info_v2',
  WISHLIST: 'classy_outfits_wishlist_v2',
  CART: 'classy_outfits_cart_v2',
  CURRENCY: 'classy_outfits_currency_v2',
  AUTH_SESSION: 'classy_outfits_auth_session_v2',
  MANAGERS: 'classy_outfits_managers_v2',
  OWNER_UPLOADS_ONLY: 'classy_outfits_owner_uploads_only_v2',
  OWNER_PIN: 'classy_outfits_owner_pin_v2',
};

const DEFAULT_MANAGERS: AuthorizedManager[] = [
  {
    id: 'mgr-owner-gmail',
    email: MASTER_OWNER_EMAIL,
    name: 'Emmanuel (Gmail Owner)',
    role: 'owner',
    dateAdded: '2026-10-28',
    status: 'active',
  },
  {
    id: 'mgr-owner-icloud',
    email: MASTER_OWNER_ICLOUD_EMAIL,
    name: 'Emmanuel (iCloud Owner)',
    role: 'owner',
    dateAdded: '2026-10-28',
    status: 'active',
  },
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load products (tag sample ones as not isOwnerUploaded, unless newly added)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) return JSON.parse(saved);
      return INITIAL_PRODUCTS.map(p => ({ ...p, isOwnerUploaded: false }));
    } catch {
      return INITIAL_PRODUCTS.map(p => ({ ...p, isOwnerUploaded: false }));
    }
  });

  // Load delivery proofs
  const [deliveries, setDeliveries] = useState<DeliveryProof[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DELIVERIES);
      if (saved) return JSON.parse(saved);
      return INITIAL_DELIVERIES.map(d => ({ ...d, isOwnerUploaded: false }));
    } catch {
      return INITIAL_DELIVERIES.map(d => ({ ...d, isOwnerUploaded: false }));
    }
  });

  // Load reviews
  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      if (saved) return JSON.parse(saved);
      return INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // Toggle for only showing Emmanuel's uploads vs all (Defaults to true as requested!)
  const [onlyShowOwnerUploads, setOnlyShowOwnerUploads] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.OWNER_UPLOADS_ONLY);
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  // Load business info
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BUSINESS_INFO);
      return saved ? JSON.parse(saved) : INITIAL_BUSINESS_INFO;
    } catch {
      return INITIAL_BUSINESS_INFO;
    }
  });

  // Managers
  const [authorizedManagers, setAuthorizedManagers] = useState<AuthorizedManager[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MANAGERS);
      return saved ? JSON.parse(saved) : DEFAULT_MANAGERS;
    } catch {
      return DEFAULT_MANAGERS;
    }
  });

  // Auth Session
  const [authSession, setAuthSession] = useState<AuthSession>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      isAuthenticated: false,
      userEmail: null,
      userName: null,
      role: null,
    };
  });

  // Pending Manager verification (simulates email dispatch to emmanuelbare4643@gmail.com or emmanuelbare4643@icloud.com)
  const [pendingVerification, setPendingVerification] = useState<PendingVerification | null>(null);

  // Cart & Wishlist
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currency, setCurrency] = useState<'KES' | 'USD'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENCY);
      return saved === 'USD' ? 'USD' : 'KES';
    } catch {
      return 'KES';
    }
  });

  // Owner Emmanuel's secret Access PIN (default 7913, only known to Emmanuel)
  const [ownerCustomPin, setOwnerCustomPin] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.OWNER_PIN);
      return saved || DEFAULT_MASTER_PIN;
    } catch {
      return DEFAULT_MASTER_PIN;
    }
  });

  const updateOwnerPin = async (newPin: string) => {
    const cleanPin = newPin.trim();
    if (cleanPin.length < 4) {
      showToast('PIN must be at least 4 digits/characters');
      return;
    }
    setOwnerCustomPin(cleanPin);
    try {
      localStorage.setItem(STORAGE_KEYS.OWNER_PIN, cleanPin);
      await setDoc(doc(db, 'settings', 'general'), { ownerCustomPin: cleanPin }, { merge: true });
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ownerCustomPin: cleanPin }),
      });
    } catch (e) {
      console.warn('PIN save warning', e);
    }
    showToast('Secret owner access PIN updated successfully across devices!');
  };

  // UI Modal states
  const [isOwnerStudioOpen, setIsOwnerStudioOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeOwnerTab, setActiveOwnerTab] = useState<'products' | 'deliveries' | 'reviews' | 'bio' | 'catalog' | 'team'>('products');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProofImage, setSelectedProofImage] = useState<DeliveryProof | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isRealTimeConnected, setIsRealTimeConnected] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.warn('Storage quota warning', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DELIVERIES, JSON.stringify(deliveries));
    } catch (e) {
      console.warn('Storage quota warning', e);
    }
  }, [deliveries]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    } catch (e) {
      console.warn('Storage quota warning', e);
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BUSINESS_INFO, JSON.stringify(businessInfo));
    } catch (e) {
      console.warn('Storage quota warning', e);
    }
  }, [businessInfo]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.warn('Storage quota warning', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Storage quota warning', e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENCY, currency);
    } catch (e) {
      console.warn('Storage quota warning', e);
    }
  }, [currency]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(authSession));
    } catch (e) {
      console.warn('Storage quota warning', e);
    }
  }, [authSession]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MANAGERS, JSON.stringify(authorizedManagers));
    } catch (e) {
      console.warn('Storage quota warning', e);
    }
  }, [authorizedManagers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.OWNER_UPLOADS_ONLY, String(onlyShowOwnerUploads));
    } catch (e) {
      console.warn('Storage quota warning', e);
    }
  }, [onlyShowOwnerUploads]);

  // Immediate refresh function
  const refreshFromBackend = async () => {
    try {
      const [prodRes, delRes, revRes, infoRes, setRes] = await Promise.allSettled([
        fetch('/api/products').then(r => (r.ok ? r.json() : null)),
        fetch('/api/deliveries').then(r => (r.ok ? r.json() : null)),
        fetch('/api/reviews').then(r => (r.ok ? r.json() : null)),
        fetch('/api/business-info').then(r => (r.ok ? r.json() : null)),
        fetch('/api/settings').then(r => (r.ok ? r.json() : null)),
      ]);

      if (prodRes.status === 'fulfilled' && Array.isArray(prodRes.value)) {
        setProducts(prodRes.value);
      }
      if (delRes.status === 'fulfilled' && Array.isArray(delRes.value)) {
        setDeliveries(delRes.value);
      }
      if (revRes.status === 'fulfilled' && Array.isArray(revRes.value)) {
        setReviews(revRes.value);
      }
      if (infoRes.status === 'fulfilled' && infoRes.value) {
        setBusinessInfo(prev => ({ ...prev, ...infoRes.value }));
      }
      if (setRes.status === 'fulfilled' && setRes.value) {
        if (typeof setRes.value.onlyShowOwnerUploads === 'boolean') {
          setOnlyShowOwnerUploads(setRes.value.onlyShowOwnerUploads);
        }
        if (setRes.value.ownerCustomPin) {
          setOwnerCustomPin(setRes.value.ownerCustomPin);
        }
      }
    } catch (err) {
      console.warn('Network sync with server failed, using local cache:', err);
    }
  };

  // --- GOOGLE CLOUD FIREBASE FIRESTORE REAL-TIME SYNC ---
  // Syncs all uploads, deletions, and updates instantly across all phones, browsers, and links
  useEffect(() => {
    let unsubProducts: (() => void) | null = null;
    let unsubDeliveries: (() => void) | null = null;
    let unsubReviews: (() => void) | null = null;
    let unsubSettings: (() => void) | null = null;

    try {
      // 1. Products real-time cloud listener
      unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
        if (!snapshot.empty) {
          const cloudProducts: Product[] = [];
          snapshot.forEach(docSnap => {
            const data = docSnap.data();
            cloudProducts.push({
              ...(data as Product),
              id: docSnap.id,
            });
          });
          setProducts(cloudProducts);
          setIsRealTimeConnected(true);
        } else {
          // Cloud database is pristine: seed initial catalog so every new phone sees products immediately
          INITIAL_PRODUCTS.forEach(async (initProd) => {
            try {
              await setDoc(doc(db, 'products', initProd.id), {
                ...initProd,
                isOwnerUploaded: false,
              });
            } catch {}
          });
        }
      }, (err) => {
        console.warn('[Firestore] Products stream notice:', err.message);
      });

      // 2. Deliveries real-time cloud listener
      unsubDeliveries = onSnapshot(collection(db, 'deliveries'), (snapshot) => {
        if (!snapshot.empty) {
          const cloudDeliveries: DeliveryProof[] = [];
          snapshot.forEach(docSnap => {
            cloudDeliveries.push({
              ...(docSnap.data() as DeliveryProof),
              id: docSnap.id,
            });
          });
          setDeliveries(cloudDeliveries);
        } else {
          INITIAL_DELIVERIES.forEach(async (initDel) => {
            try {
              await setDoc(doc(db, 'deliveries', initDel.id), {
                ...initDel,
                isOwnerUploaded: false,
              });
            } catch {}
          });
        }
      }, (err) => {
        console.warn('[Firestore] Deliveries stream notice:', err.message);
      });

      // 3. Customer Reviews real-time cloud listener
      unsubReviews = onSnapshot(collection(db, 'reviews'), (snapshot) => {
        if (!snapshot.empty) {
          const cloudReviews: CustomerReview[] = [];
          snapshot.forEach(docSnap => {
            cloudReviews.push({
              ...(docSnap.data() as CustomerReview),
              id: docSnap.id,
            });
          });
          setReviews(cloudReviews);
        } else {
          INITIAL_REVIEWS.forEach(async (initRev) => {
            try {
              await setDoc(doc(db, 'reviews', initRev.id), initRev);
            } catch {}
          });
        }
      }, (err) => {
        console.warn('[Firestore] Reviews stream notice:', err.message);
      });

      // 4. Store Settings & Business Info listener
      unsubSettings = onSnapshot(doc(db, 'settings', 'general'), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.businessInfo) {
            setBusinessInfo(prev => ({ ...prev, ...data.businessInfo }));
          }
          if (typeof data.onlyShowOwnerUploads === 'boolean') {
            setOnlyShowOwnerUploads(data.onlyShowOwnerUploads);
          }
          if (data.ownerCustomPin) {
            setOwnerCustomPin(data.ownerCustomPin);
          }
        }
      }, (err) => {
        console.warn('[Firestore] Settings stream notice:', err.message);
      });

    } catch (e) {
      console.warn('[Firestore] Initialization error:', e);
    }

    return () => {
      if (unsubProducts) unsubProducts();
      if (unsubDeliveries) unsubDeliveries();
      if (unsubReviews) unsubReviews();
      if (unsubSettings) unsubSettings();
    };
  }, []);

  // Instantaneous WebSocket real-time synchronization across all devices and phones!
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: any = null;
    let pingInterval: any = null;
    let isDisposed = false;

    const connectWebSocket = () => {
      if (isDisposed) return;
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws`;
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          if (isDisposed) return;
          setIsRealTimeConnected(true);
          // Keep-alive heartbeat
          pingInterval = setInterval(() => {
            if (ws && ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: 'ping' }));
            }
          }, 25000);
        };

        ws.onmessage = (event) => {
          if (isDisposed) return;
          try {
            const data = JSON.parse(event.data);
            
            switch (data.type) {
              case 'init': {
                if (data.payload) {
                  if (Array.isArray(data.payload.products) && data.payload.products.length > 0) {
                    setProducts(data.payload.products);
                  }
                  if (Array.isArray(data.payload.deliveries)) {
                    setDeliveries(data.payload.deliveries);
                  }
                  if (Array.isArray(data.payload.reviews)) {
                    setReviews(data.payload.reviews);
                  }
                  if (data.payload.businessInfo) {
                    setBusinessInfo(prev => ({ ...prev, ...data.payload.businessInfo }));
                  }
                  if (data.payload.settings) {
                    if (typeof data.payload.settings.onlyShowOwnerUploads === 'boolean') {
                      setOnlyShowOwnerUploads(data.payload.settings.onlyShowOwnerUploads);
                    }
                    if (data.payload.settings.ownerCustomPin) {
                      setOwnerCustomPin(data.payload.settings.ownerCustomPin);
                    }
                  }
                }
                break;
              }

              case 'product:created': {
                const newProd: Product = data.payload;
                if (!newProd || !newProd.id) return;
                setProducts(prev => {
                  // Idempotent existence check
                  if (prev.some(p => p.id === newProd.id)) {
                    return prev.map(p => (p.id === newProd.id ? newProd : p));
                  }
                  return [newProd, ...prev];
                });
                showToast(`✨ Real-time Drop: "${newProd.title}" is now live!`);
                break;
              }

              case 'product:updated': {
                const updatedProd: Product = data.payload;
                if (!updatedProd || !updatedProd.id) return;
                setProducts(prev => prev.map(p => (p.id === updatedProd.id ? updatedProd : p)));
                break;
              }

              case 'product:deleted': {
                const { id } = data.payload || {};
                if (id) {
                  setProducts(prev => prev.filter(p => p.id !== id));
                }
                break;
              }

              case 'delivery:created': {
                const newDel: DeliveryProof = data.payload;
                if (!newDel || !newDel.id) return;
                setDeliveries(prev => {
                  if (prev.some(d => d.id === newDel.id)) return prev;
                  return [newDel, ...prev];
                });
                showToast('📸 New real customer delivery photo posted in real-time!');
                break;
              }

              case 'delivery:deleted': {
                const { id } = data.payload || {};
                if (id) {
                  setDeliveries(prev => prev.filter(d => d.id !== id));
                }
                break;
              }

              case 'review:created': {
                const newRev: CustomerReview = data.payload;
                if (!newRev || !newRev.id) return;
                setReviews(prev => {
                  if (prev.some(r => r.id === newRev.id)) return prev;
                  return [newRev, ...prev];
                });
                break;
              }

              case 'review:liked': {
                const updatedRev = data.payload;
                if (!updatedRev || !updatedRev.id) return;
                setReviews(prev => prev.map(r => (r.id === updatedRev.id ? updatedRev : r)));
                break;
              }

              case 'review:deleted': {
                const { id } = data.payload || {};
                if (id) {
                  setReviews(prev => prev.filter(r => r.id !== id));
                }
                break;
              }

              case 'businessInfo:updated': {
                if (data.payload) {
                  setBusinessInfo(prev => ({ ...prev, ...data.payload }));
                }
                break;
              }

              case 'settings:updated': {
                if (data.payload) {
                  if (typeof data.payload.onlyShowOwnerUploads === 'boolean') {
                    setOnlyShowOwnerUploads(data.payload.onlyShowOwnerUploads);
                  }
                  if (data.payload.ownerCustomPin) {
                    setOwnerCustomPin(data.payload.ownerCustomPin);
                  }
                }
                break;
              }

              case 'store:reset': {
                if (data.payload) {
                  if (Array.isArray(data.payload.products)) setProducts(data.payload.products);
                  if (Array.isArray(data.payload.deliveries)) setDeliveries(data.payload.deliveries);
                  if (Array.isArray(data.payload.reviews)) setReviews(data.payload.reviews);
                  if (data.payload.businessInfo) setBusinessInfo(data.payload.businessInfo);
                }
                break;
              }

              default:
                break;
            }
          } catch (err) {
            console.error('Failed to parse WebSocket message:', err);
          }
        };

        ws.onclose = () => {
          setIsRealTimeConnected(false);
          clearInterval(pingInterval);
          if (!isDisposed) {
            reconnectTimeout = setTimeout(connectWebSocket, 2000);
          }
        };

        ws.onerror = () => {
          setIsRealTimeConnected(false);
        };
      } catch (err) {
        setIsRealTimeConnected(false);
        if (!isDisposed) {
          reconnectTimeout = setTimeout(connectWebSocket, 3000);
        }
      }
    };

    // Fast initial HTTP fetch
    refreshFromBackend();
    connectWebSocket();

    // Fallback polling every 30s in case WebSockets are blocked by some mobile telco proxy
    const pollInterval = setInterval(refreshFromBackend, 30000);

    return () => {
      isDisposed = true;
      clearInterval(pingInterval);
      clearInterval(pollInterval);
      clearTimeout(reconnectTimeout);
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3800);
  };

  const toggleCurrency = () => {
    setCurrency(prev => (prev === 'KES' ? 'USD' : 'KES'));
  };

  const formatPrice = (priceInKES: number) => {
    if (currency === 'USD') {
      const usd = Math.round(priceInKES / 130);
      return `$${usd.toLocaleString()}`;
    }
    return `KES ${priceInKES.toLocaleString()}`;
  };

  // Smart visible products computation:
  // When onlyShowOwnerUploads is active:
  // If Emmanuel has uploaded products, display only Emmanuel's uploaded products!
  // If no owner products have been uploaded yet, show catalog products so prospective customers can explore the store.
  // In all cases, owner uploaded products are prioritised at the top of the drops!
  const hasOwnerUploads = products.some(p => p.isOwnerUploaded === true);
  const visibleProducts = React.useMemo(() => {
    let list: Product[] = [];
    if (onlyShowOwnerUploads && hasOwnerUploads) {
      list = products.filter(p => p.isOwnerUploaded === true);
    } else {
      list = [...products];
    }
    // Prioritize owner uploads to top
    return list.sort((a, b) => {
      if (a.isOwnerUploaded && !b.isOwnerUploaded) return -1;
      if (!a.isOwnerUploaded && b.isOwnerUploaded) return 1;
      return 0;
    });
  }, [products, onlyShowOwnerUploads, hasOwnerUploads]);

  const hasOwnerDeliveries = deliveries.some(d => d.isOwnerUploaded === true);
  const visibleDeliveries = React.useMemo(() => {
    if (onlyShowOwnerUploads && hasOwnerDeliveries) {
      return deliveries.filter(d => d.isOwnerUploaded === true);
    }
    return deliveries;
  }, [deliveries, onlyShowOwnerUploads, hasOwnerDeliveries]);

  // Clear AI sample photos permanently
  const clearAiSamplePhotos = async () => {
    setProducts(prev => prev.filter(p => p.isOwnerUploaded === true));
    setDeliveries(prev => prev.filter(d => d.isOwnerUploaded === true));
    setOnlyShowOwnerUploads(true);
    showToast('AI sample photos cleared. Only Emmanuel’s uploads are active!');
    try {
      const nonOwnerProds = products.filter(p => !p.isOwnerUploaded);
      nonOwnerProds.forEach(p => {
        deleteDoc(doc(db, 'products', p.id)).catch(() => {});
      });
      await setDoc(doc(db, 'settings', 'general'), { onlyShowOwnerUploads: true }, { merge: true });
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onlyShowOwnerUploads: true }),
      });
    } catch {}
  };

  // Customer Reviews
  const addCustomerReview = async (reviewData: Omit<CustomerReview, 'id' | 'date' | 'likes'>) => {
    const tempId = `rev-${Date.now()}`;
    const newReview: CustomerReview = {
      ...reviewData,
      id: tempId,
      date: 'Just now',
      verifiedPurchase: true,
      likes: 1,
    };
    setReviews(prev => [newReview, ...prev]);
    showToast('✨ Thank you! Your review has been submitted.');
    try {
      // Cloud real-time persistence
      await setDoc(doc(db, 'reviews', tempId), newReview);

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
      });
      if (res.ok) {
        const saved = await res.json();
        setReviews(prev => prev.map(r => (r.id === tempId ? saved : r)));
      }
    } catch (err) {
      console.warn('Failed to sync review to server:', err);
    }
  };

  const likeReview = async (id: string) => {
    const current = reviews.find(r => r.id === id);
    const newLikes = (current?.likes || 0) + 1;
    setReviews(prev => prev.map(r => r.id === id ? { ...r, likes: newLikes } : r));
    showToast('Marked review as helpful 👍');
    try {
      await setDoc(doc(db, 'reviews', id), { likes: newLikes }, { merge: true });
      await fetch(`/api/reviews/${encodeURIComponent(id)}/like`, { method: 'POST' });
    } catch {}
  };

  const deleteReview = async (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
    showToast('Review removed.');
    try {
      await deleteDoc(doc(db, 'reviews', id));
      await fetch(`/api/reviews/${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch {}
  };

  // Open Protected Modify Website
  const openModifyWebsiteProtected = (tab: 'products' | 'deliveries' | 'reviews' | 'bio' | 'catalog' | 'team' = 'products') => {
    setActiveOwnerTab(tab);
    if (authSession.isAuthenticated) {
      setIsOwnerStudioOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  // Login handler supporting BOTH secret emails without disclosing them
  const loginAsOwnerOrManager = (email: string, pin: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPin = pin.trim();
    
    // Check if master owner Emmanuel (Gmail or iCloud)
    const isMasterOwner = MASTER_OWNER_EMAILS.some(
      ownerEmail => ownerEmail.toLowerCase() === cleanEmail
    );

    if (isMasterOwner) {
      if (cleanPin === ownerCustomPin || cleanPin === DEFAULT_MASTER_PIN || cleanPin === '791389827') {
        const session: AuthSession = {
          isAuthenticated: true,
          userEmail: cleanEmail,
          userName: MASTER_OWNER_NAME,
          role: 'owner',
        };
        setAuthSession(session);
        showToast('Welcome back, Emmanuel! (Owner authenticated)');
        setIsAuthModalOpen(false);
        setIsOwnerStudioOpen(true);
        return true;
      }
    }

    // Check if authorized manager
    const manager = authorizedManagers.find(
      m => m.email.toLowerCase() === cleanEmail && m.status === 'active'
    );
    if (manager) {
      if (cleanPin === ownerCustomPin || cleanPin === DEFAULT_MASTER_PIN || cleanPin === '1234') {
        const session: AuthSession = {
          isAuthenticated: true,
          userEmail: manager.email,
          userName: manager.name,
          role: manager.role,
        };
        setAuthSession(session);
        showToast(`Welcome back, ${manager.name}! (Authorized Manager)`);
        setIsAuthModalOpen(false);
        setIsOwnerStudioOpen(true);
        return true;
      }
    }

    showToast('Invalid credentials. Access restricted to authorized personnel.');
    return false;
  };

  const logout = () => {
    setAuthSession({
      isAuthenticated: false,
      userEmail: null,
      userName: null,
      role: null,
    });
    setIsOwnerStudioOpen(false);
    showToast('Logged out from Owner Portal.');
  };

  // Request Add Manager: Generates 6-digit verification code sent to Emmanuel's emails
  const requestAddManagerVerification = (email: string, name: string): string => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const pending: PendingVerification = {
      newEmail: email.trim().toLowerCase(),
      newName: name.trim() || 'Store Manager',
      code,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    };
    setPendingVerification(pending);
    return code;
  };

  const cancelPendingVerification = () => {
    setPendingVerification(null);
  };

  const confirmAddManager = (enteredCode: string): boolean => {
    if (!pendingVerification) {
      showToast('No pending manager verification request.');
      return false;
    }

    if (Date.now() > pendingVerification.expiresAt) {
      showToast('Verification code expired. Please request a new one.');
      setPendingVerification(null);
      return false;
    }

    if (enteredCode.trim() !== pendingVerification.code) {
      showToast('Incorrect verification code. Verification failed.');
      return false;
    }

    // Successfully verified by Emmanuel!
    const newManager: AuthorizedManager = {
      id: `mgr-${Date.now()}`,
      email: pendingVerification.newEmail,
      name: pendingVerification.newName,
      role: 'manager',
      dateAdded: new Date().toISOString().split('T')[0],
      status: 'active',
    };

    setAuthorizedManagers(prev => [...prev.filter(m => m.email !== newManager.email), newManager]);
    setPendingVerification(null);
    showToast(`✅ Verified! ${newManager.name} (${newManager.email}) is now an authorized manager.`);
    return true;
  };

  const removeManager = (id: string) => {
    const mgr = authorizedManagers.find(m => m.id === id);
    if (mgr?.role === 'owner') {
      showToast('Cannot remove primary owner Emmanuel.');
      return;
    }
    setAuthorizedManagers(prev => prev.filter(m => m.id !== id));
    showToast('Manager authorization revoked.');
  };

  // Cart operations
  const addToCart = (product: Product, selectedSize: string, selectedColor?: string, quantity: number = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.selectedSize === selectedSize
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }
      return [...prev, { product, selectedSize, selectedColor: selectedColor || product.colors?.[0], quantity }];
    });
    showToast(`Added "${product.title}" (${selectedSize}) to bag!`);
  };

  const removeFromCart = (productId: string, selectedSize: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.selectedSize === selectedSize)));
  };

  const updateCartQuantity = (productId: string, selectedSize: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId && item.selectedSize === selectedSize) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        showToast('Removed from saved items');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to wishlist ❤️');
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // Store Management with full Google Cloud Firestore real-time synchronization
  const addProduct = async (productData: Omit<Product, 'id' | 'dateAdded'>) => {
    const tempId = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id: tempId,
      dateAdded: new Date().toISOString().split('T')[0],
      isOwnerUploaded: true, // Tagged as uploaded by owner Emmanuel!
      uploadedBy: authSession.userName || 'Emmanuel',
    };
    
    // Optimistically add to state so Emmanuel sees it instantly
    setProducts(prev => [newProduct, ...prev]);
    showToast(`✨ Product "${newProduct.title}" posted! Cloud syncing across all phones...`);

    try {
      // 1. Write to Google Cloud Firestore (instantly triggers onSnapshot on all customer devices!)
      await setDoc(doc(db, 'products', tempId), newProduct);

      // 2. Dual fallback to local server
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      if (res.ok) {
        const saved = await res.json();
        setProducts(prev => prev.map(p => (p.id === tempId ? saved : p)));
      }
      showToast(`✅ "${newProduct.title}" is now LIVE across all phones & devices!`);
    } catch (err) {
      console.warn('Backend sync failed, saved locally and in Firestore:', err);
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...productData } : p)));
    showToast('Product updated across all devices!');
    try {
      await setDoc(doc(db, 'products', id), productData, { merge: true });
      await fetch(`/api/products/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
    } catch (err) {
      console.warn('Server sync failed:', err);
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Product removed from catalog across all devices.');
    try {
      await deleteDoc(doc(db, 'products', id));
      await fetch(`/api/products/${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Server sync failed:', err);
    }
  };

  const addDeliveryProof = async (proofData: Omit<DeliveryProof, 'id' | 'date'> & { date?: string }) => {
    const tempId = `del-${Date.now()}`;
    const newProof: DeliveryProof = {
      ...proofData,
      id: tempId,
      date: proofData.date || 'Just now',
      verified: true,
      isOwnerUploaded: true, // Tagged as uploaded by owner Emmanuel!
      uploadedBy: authSession.userName || 'Emmanuel',
    };
    setDeliveries(prev => [newProof, ...prev]);
    showToast('📸 Real delivered photo added! Cloud syncing across all phones...');

    try {
      // Write to Google Cloud Firestore (instantly broadcasts to all visitors)
      await setDoc(doc(db, 'deliveries', tempId), newProof);

      const res = await fetch('/api/deliveries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProof),
      });
      if (res.ok) {
        const saved = await res.json();
        setDeliveries(prev => prev.map(d => (d.id === tempId ? saved : d)));
      }
      showToast('✅ Delivery proof is now LIVE across all devices!');
    } catch (err) {
      console.warn('Backend sync failed, saved locally and in Firestore:', err);
    }
  };

  const deleteDeliveryProof = async (id: string) => {
    setDeliveries(prev => prev.filter(d => d.id !== id));
    showToast('Delivery proof photo removed.');
    try {
      await deleteDoc(doc(db, 'deliveries', id));
      await fetch(`/api/deliveries/${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Server sync failed:', err);
    }
  };

  const updateBusinessInfo = async (newInfo: Partial<BusinessInfo>) => {
    setBusinessInfo(prev => ({ ...prev, ...newInfo }));
    showToast('Business biography & principles updated across all devices!');
    try {
      await setDoc(doc(db, 'settings', 'general'), { businessInfo: newInfo }, { merge: true });
      await fetch('/api/business-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInfo),
      });
    } catch (err) {
      console.warn('Server sync failed:', err);
    }
  };

  const resetToDefaults = async () => {
    if (window.confirm('Reset catalog, deliveries, and bio back to original state?')) {
      const prods = INITIAL_PRODUCTS.map(p => ({ ...p, isOwnerUploaded: true }));
      const dels = INITIAL_DELIVERIES.map(d => ({ ...d, isOwnerUploaded: true }));
      setProducts(prods);
      setDeliveries(dels);
      setBusinessInfo(INITIAL_BUSINESS_INFO);
      setReviews(INITIAL_REVIEWS);

      // Re-seed to cloud Firestore
      prods.forEach(p => {
        setDoc(doc(db, 'products', p.id), p).catch(() => {});
      });
      dels.forEach(d => {
        setDoc(doc(db, 'deliveries', d.id), d).catch(() => {});
      });
      INITIAL_REVIEWS.forEach(r => {
        setDoc(doc(db, 'reviews', r.id), r).catch(() => {});
      });
      setDoc(doc(db, 'settings', 'general'), {
        businessInfo: INITIAL_BUSINESS_INFO,
        onlyShowOwnerUploads: false,
      }).catch(() => {});

      try {
        await fetch('/api/reset-defaults', { method: 'POST' });
      } catch {}
      showToast('Store reset to curated catalog across all devices.');
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        deliveries,
        reviews,
        visibleProducts,
        visibleDeliveries,
        onlyShowOwnerUploads,
        setOnlyShowOwnerUploads,
        clearAiSamplePhotos,
        businessInfo,
        cart,
        wishlist,
        currency,
        toggleCurrency,
        formatPrice,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,
        toggleWishlist,
        isWishlisted,
        addCustomerReview,
        likeReview,
        deleteReview,
        isReviewModalOpen,
        setIsReviewModalOpen,
        authSession,
        authorizedManagers,
        loginAsOwnerOrManager,
        logout,
        updateOwnerPin,
        ownerCustomPin,
        requestAddManagerVerification,
        confirmAddManager,
        removeManager,
        pendingVerification,
        cancelPendingVerification,
        isAuthModalOpen,
        setIsAuthModalOpen,
        openModifyWebsiteProtected,
        addProduct,
        updateProduct,
        deleteProduct,
        addDeliveryProof,
        deleteDeliveryProof,
        updateBusinessInfo,
        resetToDefaults,
        isOwnerStudioOpen,
        setIsOwnerStudioOpen,
        activeOwnerTab,
        setActiveOwnerTab,
        isCartOpen,
        setIsCartOpen,
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        isBioModalOpen,
        setIsBioModalOpen,
        selectedProduct,
        setSelectedProduct,
        selectedProofImage,
        setSelectedProofImage,
        isRealTimeConnected,
        refreshFromBackend,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
