import type { Product, DeliveryProof, BusinessInfo, CustomerReview } from '../types/store.ts';

export const INITIAL_PRODUCTS: Product[] = [
  // --- SHOES ---
  {
    id: 'prod-shoes-01',
    title: 'Aura Metallic Platform Stiletto Heels',
    category: 'shoes',
    price: 4800,
    originalPrice: 5800,
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['37', '38', '39', '40', '41'],
    colors: ['Champagne Gold', 'Liquid Silver', 'Onyx Black'],
    badge: 'Best Seller',
    inStock: true,
    description: 'Statement architectural stiletto heels designed for upscale galas, rooftop evenings, and elevated power outfits. Cushioned inner sole for day-to-night comfort.',
    gender: 'women',
    dateAdded: '2026-10-20',
    featured: true
  },
  {
    id: 'prod-shoes-02',
    title: 'Midnight Obsidian Chunky Low Kicks',
    category: 'shoes',
    price: 6200,
    originalPrice: 7000,
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['36', '37', '38', '39', '40', '41', '42'],
    colors: ['Onyx Charcoal', 'Ice White', 'Panda Noir'],
    badge: 'Trending',
    inStock: true,
    description: 'The definitive daily streetwear flex. Premium leather panelling, responsive dual-density midsole, and clean minimalist branding.',
    gender: 'women',
    dateAdded: '2026-10-22',
    featured: true
  },
  {
    id: 'prod-shoes-03',
    title: 'Cyber Edge High-Top Street Boots',
    category: 'shoes',
    price: 7500,
    originalPrice: 8500,
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['37', '38', '39', '40'],
    colors: ['Matte Black', 'Dark Olive'],
    badge: 'Limited Stock',
    inStock: true,
    description: 'Futuristic chunky lug tread platform boots made from weather-resistant vegan calfskin leather. Side-zip easy entry with rugged laces.',
    gender: 'women',
    dateAdded: '2026-10-25'
  },
  {
    id: 'prod-shoes-04',
    title: 'Neon Pulse Chunky Runner Sneakers',
    category: 'shoes',
    price: 5900,
    images: [
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['36', '37', '38', '39', '40'],
    colors: ['Coral Pop', 'Lilac Blast'],
    badge: 'New Arrival',
    inStock: true,
    description: 'Vibrant pops of neon accent high-performance breathable mesh. Ultra lightweight shock-absorbing bubble heel designed to elevate athletic chic fits.',
    gender: 'women',
    dateAdded: '2026-10-26'
  },

  // --- JERSEYS ---
  {
    id: 'prod-jersey-01',
    title: 'Paris Retro 90s Cropped Football Jersey',
    category: 'jerseys',
    price: 3400,
    originalPrice: 4000,
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Deep Navy / Crimson', 'Noir Gold'],
    badge: 'Hot',
    inStock: true,
    description: 'Vintage-inspired athletic knit cropped football jersey. Lightweight jacquard weave with custom embroidery and luxury contrast collar trim.',
    gender: 'women',
    dateAdded: '2026-10-18',
    featured: true
  },
  {
    id: 'prod-jersey-02',
    title: 'Tokyo Street Racing Monogram Jersey',
    category: 'jerseys',
    price: 3800,
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Cyber Black & Emerald', 'Hot Fuchsia'],
    badge: 'New Arrival',
    inStock: true,
    description: 'High-octane motorsport aesthetic jersey tailored for an effortless oversized drape or tuck. Breathable micro-mesh with reflective accents.',
    gender: 'unisex',
    dateAdded: '2026-10-24'
  },
  {
    id: 'prod-jersey-03',
    title: 'Milan Elite Vintage Striped Club Kit',
    category: 'jerseys',
    price: 3600,
    originalPrice: 4200,
    images: [
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['S', 'M', 'L'],
    colors: ['Rosso Nero', 'Chalk Gold'],
    badge: 'Trending',
    inStock: true,
    description: 'A timeless European classic reimagined for modern female street styling. Perfect paired with oversized denim, cargo skirts, or cycling shorts.',
    gender: 'women',
    dateAdded: '2026-10-19'
  },

  // --- JACKETS ---
  {
    id: 'prod-jacket-01',
    title: 'Obsidian Oversized Moto Biker Leather Jacket',
    category: 'jackets',
    price: 7800,
    originalPrice: 9200,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Glossy Onyx', 'Distressed Charcoal'],
    badge: 'Best Seller',
    inStock: true,
    description: 'Heavyweight premium faux-leather jacket with drop shoulders, chunky silver YKK-style hardware, buckle belt, and soft quilted lining.',
    gender: 'women',
    dateAdded: '2026-10-15',
    featured: true
  },
  {
    id: 'prod-jacket-02',
    title: 'Electric Lavender Cropped Down Puffer',
    category: 'jackets',
    price: 6600,
    originalPrice: 7500,
    images: [
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Electric Lavender', 'Midnight Black', 'Metallic Ice'],
    badge: 'Hot',
    inStock: true,
    description: 'High-fill down insulation with a sleek water-repellent shell. Features an exaggerated high-stand collar and adjustable bungee hem cinch.',
    gender: 'women',
    dateAdded: '2026-10-21',
    featured: true
  },
  {
    id: 'prod-jacket-03',
    title: 'Vintage Acid-Wash Distressed Denim Trucker',
    category: 'jackets',
    price: 5200,
    images: [
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['S', 'M', 'L'],
    colors: ['Washed Grey', 'Deep Indigo'],
    badge: 'Staff Pick',
    inStock: true,
    description: 'Custom stone-washed 14oz heavyweight denim with relaxed drop shoulders and distressed cuff details. Built to endure seasons of wear.',
    gender: 'unisex',
    dateAdded: '2026-10-16'
  },

  // --- CLOGS ---
  {
    id: 'prod-clog-01',
    title: 'Chunky Platform Molded Cloud Clogs',
    category: 'clogs',
    price: 3900,
    originalPrice: 4500,
    images: [
      'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['36', '37', '38', '39', '40', '41'],
    colors: ['Bone Sand', 'Pitch Black', 'Matcha Mist'],
    badge: 'Trending',
    inStock: true,
    description: 'Sculpted futuristic EVA foam clogs with an elevated 2.2-inch platform sole. Water-resistant, breathable port vents, and ultra cushioned footbed.',
    gender: 'women',
    dateAdded: '2026-10-23',
    featured: true
  },
  {
    id: 'prod-clog-02',
    title: 'Sherpa-Fleece Lined Suede Mule Clogs',
    category: 'clogs',
    price: 4600,
    images: [
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['37', '38', '39', '40'],
    colors: ['Mocha Taupe', 'Jet Suede'],
    badge: 'New Arrival',
    inStock: true,
    description: 'Plush teddy shearling lining wrapped in genuine split suede leather. Adjustable buckle strap and cork-infused ergonomic midsole.',
    gender: 'women',
    dateAdded: '2026-10-27'
  },

  // --- SLIDES FOR WOMEN ---
  {
    id: 'prod-slide-01',
    title: 'Pillow Puff Quilted Leather Slides',
    category: 'slides',
    price: 2900,
    originalPrice: 3500,
    images: [
      'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['36', '37', '38', '39', '40', '41'],
    colors: ['Onyx Black', 'Cream Butter', 'Blush Coral'],
    badge: 'Best Seller',
    inStock: true,
    description: 'Buttery-soft vegan leather with memory foam padded straps. The ultimate luxury slide for casual brunch, pool lounge, or off-duty glamour.',
    gender: 'women',
    dateAdded: '2026-10-20',
    featured: true
  },
  {
    id: 'prod-slide-02',
    title: 'Monogram Embossed Luxury Pool Slides',
    category: 'slides',
    price: 3200,
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['37', '38', '39', '40'],
    colors: ['Noir Gold', 'Electric Rose'],
    badge: 'Hot',
    inStock: true,
    description: 'High-shine embossed textured band with anti-slip contoured sole. Waterproof and effortlessly chic when paired with ankle bracelets.',
    gender: 'women',
    dateAdded: '2026-10-24'
  },
  {
    id: 'prod-slide-03',
    title: 'Faux Fur Fluffy Cloud Comfort Slides',
    category: 'slides',
    price: 2600,
    originalPrice: 3200,
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['36', '37', '38', '39', '40'],
    colors: ['Blush Pink', 'Smoke Grey', 'Midnight Raven'],
    badge: 'Trending',
    inStock: true,
    description: 'High-density ultra-plush faux fur strap on a lightweight rubber outsole. Indoors or outdoor ready, keeping feet warm with peak coziness.',
    gender: 'women',
    dateAdded: '2026-10-17'
  }
];

export const INITIAL_DELIVERIES: DeliveryProof[] = [
  {
    id: 'del-01',
    customerName: 'Brenda M.',
    location: 'Westlands, Nairobi',
    photoUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop',
    caption: '“Arrived in less than 3 hours to Westlands! The packaging was so sleek and the chunky kicks fit true to size. Classy Outfits is the real deal!”',
    productPurchased: 'Midnight Obsidian Chunky Low Kicks (Size 38)',
    date: 'Yesterday, 4:15 PM',
    verified: true
  },
  {
    id: 'del-02',
    customerName: 'Shantel K.',
    location: 'Kilimani, Nairobi',
    photoUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop',
    caption: '“The leather biker jacket quality blew my mind! Sent payment via M-Pesa to +254 791389827 and got instant confirmation on WhatsApp. 10/10 service!”',
    productPurchased: 'Obsidian Oversized Moto Biker Jacket (Size M)',
    date: '24 Oct 2026',
    verified: true
  },
  {
    id: 'del-03',
    customerName: 'Vanessa W.',
    location: 'Nyali, Mombasa',
    photoUrl: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=800&auto=format&fit=crop',
    caption: '“Dispatched via Fargo Courier to Mombasa, arrived the following morning in perfect condition! Pillow puff slides are so comfy.”',
    productPurchased: 'Pillow Puff Quilted Leather Slides (Size 39)',
    date: '22 Oct 2026',
    verified: true
  },
  {
    id: 'del-04',
    customerName: 'Joy A.',
    location: 'CBD, Nairobi',
    photoUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=800&auto=format&fit=crop',
    caption: '“The retro 90s jersey crop fits insanely well! Got so many compliments in town today. Ordering the black one next!”',
    productPurchased: 'Paris Retro 90s Cropped Jersey (Size S)',
    date: '20 Oct 2026',
    verified: true
  },
  {
    id: 'del-05',
    customerName: 'Cynthia N.',
    location: 'Eldoret Town',
    photoUrl: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=800&auto=format&fit=crop',
    caption: '“Safe delivery to Eldoret! Paid via M-Pesa smoothly. The cloud platform clogs are super trendy and featherweight.”',
    productPurchased: 'Chunky Platform Molded Cloud Clogs (Size 37)',
    date: '18 Oct 2026',
    verified: true
  }
];

export const INITIAL_BUSINESS_INFO: BusinessInfo = {
  brandName: 'Classy Outfits',
  tagline: 'Clothewear & Shoegame For Women Who Lead',
  founderBio: 'Welcome to Classy Outfits! We are a boutique fashion house dedicated to curating the most distinctive, head-turning women\'s footwear and streetwear in Kenya and beyond. From runway-inspired heels and statement sneakers to vintage jerseys, premium biker jackets, luxury clogs, and pillow-soft slides — we bridge haute-couture attitudes with authentic urban street culture.',
  phone: '+254 791389827',
  whatsapp: '+254791389827',
  email: 'classyoutfits.ke@gmail.com',
  pickupHub: 'Nairobi CBD & Westlands Dispatch Hub, Kenya',
  openingHours: 'Mon - Sat: 8:00 AM - 8:30 PM | Sun: 10:00 AM - 6:00 PM',
  announcement: '🔥 FLASH SALE: Free Same-Day Nairobi Delivery on all orders over KES 7,000! Direct M-Pesa to +254 791389827',
  mpesaName: 'EMMANUEL / CLASSY OUTFITS',
  instagram: '@classy_outfits_ke',
  tiktok: '@classyoutfitske',
  principles: [
    {
      id: 'p-1',
      title: '100% Quality Inspected',
      description: 'Every sole, zipper, embroidery stitch, and seam is personally verified before handoff. We never compromise on standard.',
      iconName: 'ShieldCheck'
    },
    {
      id: 'p-2',
      title: 'Direct & Safe M-Pesa Payments',
      description: 'Zero transaction friction. Pay securely directly to our verified personal phone number (+254 791389827) with immediate SMS & WhatsApp acknowledgement.',
      iconName: 'Smartphone'
    },
    {
      id: 'p-3',
      title: 'Rapid Doorstep Delivery',
      description: 'Same-day instant bike rider dispatch across Nairobi within 2-3 hours. Reliable nationwide 24-hour parcel courier to Mombasa, Nakuru, Eldoret, Kisumu & beyond.',
      iconName: 'Truck'
    },
    {
      id: 'p-4',
      title: 'Real Delivery Proof & Transparency',
      description: 'We show real parcel unboxings, live client mirror selfies, and genuine feedback so you shop with absolute peace of mind.',
      iconName: 'Camera'
    },
    {
      id: 'p-5',
      title: 'Hassle-Free Size Swaps',
      description: 'Shoe or jacket sizing not fitting right? We provide quick, smooth size replacements within 48 hours in Nairobi.',
      iconName: 'RefreshCw'
    }
  ]
};

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-01',
    customerName: 'Faith Wanjiku',
    rating: 5,
    location: 'Westlands, Nairobi',
    productPurchased: 'Midnight Obsidian Chunky Low Kicks (Size 38)',
    comment: 'Emmanuel delivered directly to my office in Westlands within 2 hours of sending payment via M-Pesa! The shoe quality is top tier, exactly as described. Legit shoegame!',
    date: 'Yesterday',
    verifiedPurchase: true,
    likes: 12
  },
  {
    id: 'rev-02',
    customerName: 'Amina Hassan',
    rating: 5,
    location: 'Old Town, Mombasa',
    productPurchased: 'Obsidian Oversized Moto Biker Jacket (Size M)',
    comment: 'Was hesitant about paying upfront to +254 791389827, but Emmanuel sent video proof before courier handoff. Received it safely the following morning in Mombasa. 10/10 service!',
    date: '3 days ago',
    verifiedPurchase: true,
    likes: 9
  },
  {
    id: 'rev-03',
    customerName: 'Mercy Chebet',
    rating: 5,
    location: 'Eldoret Town',
    productPurchased: 'Paris Retro 90s Cropped Jersey',
    comment: 'The fit on this cropped jersey is insane! Matched with my baggy denim and got non-stop compliments in Eldoret. Smooth WhatsApp customer care throughout.',
    date: '5 days ago',
    verifiedPurchase: true,
    likes: 7
  },
  {
    id: 'rev-04',
    customerName: 'Stacy Akinyi',
    rating: 5,
    location: 'Kilimani, Nairobi',
    productPurchased: 'Pillow Puff Quilted Leather Slides (Size 39)',
    comment: 'Super comfortable memory foam slides! Walking in them feels like clouds. Sent money to Emmanuel at +254 791389827 and got instant confirmation.',
    date: '1 week ago',
    verifiedPurchase: true,
    likes: 14
  },
  {
    id: 'rev-05',
    customerName: 'Diana Nyambura',
    rating: 5,
    location: 'Nakuru City',
    productPurchased: 'Chunky Platform Molded Cloud Clogs',
    comment: 'Featherweight and stylish clogs! Delivered by 24h shuttle to Nakuru. Emmanuel is very trustworthy and updates you every step of the journey.',
    date: '2 weeks ago',
    verifiedPurchase: true,
    likes: 5
  }
];

