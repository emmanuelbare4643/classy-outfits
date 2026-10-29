export type ProductCategory = 'all' | 'shoes' | 'jerseys' | 'jackets' | 'clogs' | 'slides';

export interface Product {
  id: string;
  title: string;
  category: 'shoes' | 'jerseys' | 'jackets' | 'clogs' | 'slides';
  price: number; // in KES
  originalPrice?: number; // for discount display
  images: string[];
  sizes: string[];
  colors?: string[];
  badge?: 'New Arrival' | 'Hot' | 'Trending' | 'Limited Stock' | 'Best Seller' | 'Staff Pick' | null;
  inStock: boolean;
  description: string;
  gender?: 'women' | 'unisex';
  dateAdded: string;
  featured?: boolean;
  isOwnerUploaded?: boolean; // True when uploaded by Emmanuel or authorized manager
  uploadedBy?: string;
}

export interface DeliveryProof {
  id: string;
  customerName: string;
  location: string;
  photoUrl: string;
  caption: string;
  productPurchased: string;
  date: string;
  verified: boolean;
  isOwnerUploaded?: boolean;
  uploadedBy?: string;
}

export interface CustomerReview {
  id: string;
  customerName: string;
  rating: number; // 1 to 5
  location: string; // e.g. Nairobi, Mombasa, Eldoret, etc.
  productPurchased: string;
  comment: string;
  date: string;
  photoUrl?: string; // Optional customer photo
  verifiedPurchase: boolean;
  likes?: number;
}

export interface Principle {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface AuthorizedManager {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'manager';
  dateAdded: string;
  status: 'active' | 'pending_verification';
  verificationCode?: string;
}

export interface AuthSession {
  isAuthenticated: boolean;
  userEmail: string | null;
  userName: string | null;
  role: 'owner' | 'manager' | null;
}

export interface BusinessInfo {
  brandName: string;
  tagline: string;
  founderBio: string;
  phone: string;
  whatsapp: string;
  email: string;
  pickupHub: string;
  openingHours: string;
  announcement: string;
  mpesaName: string;
  instagram: string;
  tiktok: string;
  principles: Principle[];
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor?: string;
  quantity: number;
}
