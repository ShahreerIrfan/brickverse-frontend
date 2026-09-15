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


// A category tree node. Categories are self-referential now (parent can be
// any other category, to any depth) rather than a fixed Category/SubCategory
// split, so this one type covers both a top-level category and any of its
// nested children.
export type Category = {
  id: string;
  label: string;
  slug?: string;
  parent?: string | null;
  parentLabel?: string | null;
  color: string;
  icon_type?: string;
  category_icon?: string;
  categoryIcon?: string;
  category_icon_file?: string | null;
  featured?: boolean;
  order?: number;
  is_active?: boolean;
  show_in_mega_menu?: boolean;
  mega_menu_order?: number;
  subcategories?: Category[];
  childrenCount?: number;
  productCount?: number;
};

// Kept as an alias: a product's `subcategory` and a category's immediate
// `subcategories` are just Category rows one level down.
export type SubCategory = Category;

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

export const productSections: ProductSection[] = [];

export type HeroSlide = {
  id: number;
  title: string;
  subtitle?: string;
  button_text?: string;
  buttonText?: string;
  button_link?: string;
  buttonLink?: string;
  image?: string | null;
  order?: number;
  is_active?: boolean;
};

export const categories: Category[] = [];
