export type Product = {
  id: string;
  slug?: string;
  sku?: string;
  category: string;
  categoryColor?: string;
  subcategory?: any;
  subcategoryId?: string;
  name: string;
  subtitle?: string;
  series?: string;
  image: string;
  image_file?: string | null;
  gallery_images?: {
    id: number;
    image_file?: string | null;
    image_url?: string;
    imageUrl?: string;
    order?: number;
  }[];
  cardBg?: string;
  badge?: string;
  badgeColor?: string;
  rating?: number;
  reviews?: number;
  price: string;
  originalPrice?: string;
  regularPrice?: string;
  discountedPrice?: string;
  tradePrice?: string;
  discountPercent?: number;
  accent?: string;
  description?: string;
  stock?: number;
  thumbnails?: string[];
  reviews_list?: {
    id: number;
    author: string;
    rating: number;
    comment: string;
    date: string;
  }[];
};


export type SubCategory = {
  id: string;
  categoryId?: string;
  label: string;
  slug?: string;
  description?: string;
  image?: string;
  order?: number;
};

export type Category = {
  id: string;
  label: string;
  color: string;
  icon_type?: string;
  featured?: boolean;
  order?: number;
  subcategories?: SubCategory[];
};

export type UserRole = "admin" | "customer";

export type User = {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  is_verified?: boolean;
  created_at?: string;
};

export type ProductSection = {
  id: string;
  eyebrow: string;
  eyebrowColor: string;
  title: string;
  itemCount: string;
  accent: string;
  products: Product[];
};

export const productSections: ProductSection[] = [
  {
    id: "anime-action-figures",
    eyebrow: "Collect them all",
    eyebrowColor: "#FF4D6D",
    title: "Anime action figures",
    itemCount: "128 items",
    accent: "#FF4D6D",
    products: [
      {
        id: "neo-samurai",
        category: "Anime figures",
        categoryColor: "#FF4D6D",
        name: "Neo Samurai",
        subtitle: "Ronin edition · 1/7 scale",
        image: "/images/figure-samurai-red.svg",
        cardBg: "#FFEAF0",
        badge: "NEW",
        badgeColor: "#FF4D6D",
        rating: 4.8,
        reviews: 128,
        price: "৳34.99",
        originalPrice: "৳46.00",
        accent: "#FF4D6D",
      },
      {
        id: "mecha-pilot",
        category: "Anime figures",
        categoryColor: "#13BFC9",
        name: "Mecha Pilot",
        subtitle: "Zero deluxe box set",
        image: "/images/figure-mecha-teal.svg",
        cardBg: "#E4F7F8",
        badge: "HOT",
        badgeColor: "#13BFC9",
        rating: 4.9,
        reviews: 94,
        price: "৳58.00",
        accent: "#13BFC9",
      },
      {
        id: "sky-ninja",
        category: "Anime figures",
        categoryColor: "#E8A317",
        name: "Sky Ninja",
        subtitle: "Kage limited colourway",
        image: "/images/figure-ninja-gold.svg",
        cardBg: "#FFF4DA",
        badge: "-25%",
        badgeColor: "#E8A317",
        rating: 4.6,
        reviews: 212,
        price: "৳29.50",
        originalPrice: "৳39.00",
        accent: "#E8A317",
      },
      {
        id: "star-mage",
        category: "Anime figures",
        categoryColor: "#7B5CFF",
        name: "Star Mage",
        subtitle: "Luna glow-in-the-dark",
        image: "/images/figure-mage-purple.svg",
        cardBg: "#EFE9FF",
        badge: "LIMITED",
        badgeColor: "#7B5CFF",
        rating: 4.7,
        reviews: 76,
        price: "৳42.00",
        accent: "#7B5CFF",
      },
    ],
  },
  {
    id: "bricks-building-sets",
    eyebrow: "Build your world",
    eyebrowColor: "#13BFC9",
    title: "Bricks & building sets",
    itemCount: "96 items",
    accent: "#13BFC9",
    products: [
      {
        id: "galaxy-station",
        category: "Building sets",
        categoryColor: "#FF4D6D",
        name: "Galaxy Station",
        subtitle: "1,240 pieces · ages 9+",
        image: "/images/bricks-stack-navy.svg",
        cardBg: "#FFEAF0",
        badge: "-20%",
        badgeColor: "#FF4D6D",
        rating: 4.9,
        reviews: 341,
        price: "৳79.99",
        originalPrice: "৳99.00",
        accent: "#FF4D6D",
      },
      {
        id: "speed-racer",
        category: "Building sets",
        categoryColor: "#13BFC9",
        name: "Speed Racer",
        subtitle: "Turbo pull-back kit",
        image: "/images/bricks-car-teal.svg",
        cardBg: "#E4F7F8",
        badge: "NEW",
        badgeColor: "#13BFC9",
        rating: 4.5,
        reviews: 87,
        price: "৳34.00",
        accent: "#13BFC9",
      },
      {
        id: "castle-fortress",
        category: "Building sets",
        categoryColor: "#E8A317",
        name: "Castle Fortress",
        subtitle: "860 pieces · 4 minifigs",
        image: "/images/bricks-castle-navy.svg",
        cardBg: "#FFF4DA",
        badge: "HOT",
        badgeColor: "#E8A317",
        rating: 4.8,
        reviews: 156,
        price: "৳64.50",
        originalPrice: "৳82.00",
        accent: "#E8A317",
      },
      {
        id: "micro-city",
        category: "Building sets",
        categoryColor: "#7B5CFF",
        name: "Micro City",
        subtitle: "Starter blocks · ages 5+",
        image: "/images/bricks-city-navy.svg",
        cardBg: "#EFE9FF",
        badge: "SALE",
        badgeColor: "#7B5CFF",
        rating: 4.4,
        reviews: 203,
        price: "৳24.99",
        originalPrice: "৳32.00",
        accent: "#7B5CFF",
      },
    ],
  },
  {
    id: "coding-stem-kits",
    eyebrow: "Learn by playing",
    eyebrowColor: "#7B5CFF",
    title: "Coding & STEM kits",
    itemCount: "54 items",
    accent: "#7B5CFF",
    products: [
      {
        id: "robo-coder",
        category: "Coding kits",
        categoryColor: "#FF4D6D",
        name: "Robo Coder",
        subtitle: "Starter robot · block coding",
        image: "/images/robot-teal.svg",
        cardBg: "#FFEAF0",
        badge: "TOP",
        badgeColor: "#FF4D6D",
        rating: 4.9,
        reviews: 118,
        price: "৳89.00",
        accent: "#FF4D6D",
      },
      {
        id: "circuit-lab",
        category: "Coding kits",
        categoryColor: "#13BFC9",
        name: "Circuit Lab",
        subtitle: "40 build-along projects",
        image: "/images/robot-pink.svg",
        cardBg: "#E4F7F8",
        badge: "-23%",
        badgeColor: "#13BFC9",
        rating: 4.6,
        reviews: 264,
        price: "৳49.99",
        originalPrice: "৳65.00",
        accent: "#13BFC9",
      },
      {
        id: "pixel-bot",
        category: "Coding kits",
        categoryColor: "#E8A317",
        name: "Pixel Bot",
        subtitle: "Screen-free logic toy",
        image: "/images/robot-gold.svg",
        cardBg: "#FFF4DA",
        badge: "NEW",
        badgeColor: "#E8A317",
        rating: 4.7,
        reviews: 62,
        price: "৳39.00",
        accent: "#E8A317",
      },
      {
        id: "drone-builder",
        category: "Coding kits",
        categoryColor: "#7B5CFF",
        name: "Drone Builder",
        subtitle: "Python-ready STEM edition",
        image: "/images/robot-purple.svg",
        cardBg: "#EFE9FF",
        badge: "PRO",
        badgeColor: "#7B5CFF",
        rating: 4.8,
        reviews: 45,
        price: "৳119.00",
        originalPrice: "৳139.00",
        accent: "#7B5CFF",
      },
    ],
  },
];

export const categories = [
  { id: "figure", label: "Anime figures", color: "#FF4D6D", featured: true },
  { id: "toon", label: "Cartoon characters", color: "#7B5CFF" },
  { id: "brick", label: "Bricks & building sets", color: "#13BFC9" },
  { id: "code", label: "Coding & STEM kits", color: "#FFC93C" },
  { id: "robot", label: "Robotics", color: "#4B7BFF" },
  { id: "model", label: "Model kits", color: "#FF4D6D" },
  { id: "plush", label: "Plush toys", color: "#FF8A5B" },
  { id: "statue", label: "Collectible statues", color: "#7B5CFF" },
  { id: "puzzle", label: "Puzzles", color: "#13BFC9" },
  { id: "game", label: "Board games", color: "#2ECC8F" },
  { id: "acc", label: "Parts & accessories", color: "#736E9B" },
];
