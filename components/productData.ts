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
  category_icon?: string;
  categoryIcon?: string;
  category_icon_file?: string | null;
  featured?: boolean;
  order?: number;
  subcategories?: SubCategory[];
  productCount?: number;
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

export const productSections: ProductSection[] = [];

export const categories: Category[] = [];
