export type BlogCategoryRef = {
  id: number | string;
  name: string;
  slug: string;
};

export type BlogTagRef = {
  id: number | string;
  name: string;
  slug: string;
};

export type BlogAuthorRef = {
  id: number | string;
  name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
};

export type BlogBlockType =
  | "text"
  | "heading"
  | "image"
  | "gallery"
  | "quote"
  | "code"
  | "embed"
  | "button"
  | "product_grid"
  | "divider";

export type BlogBlock = {
  id?: number | string;
  order: number;
  blockType: BlogBlockType | string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
};

export type BlogPost = {
  id: number | string;
  title: string;
  slug: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  status: "draft" | "published";
  category?: BlogCategoryRef | null;
  tags?: BlogTagRef[];
  author?: BlogAuthorRef | null;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  blocks?: BlogBlock[];
};

export type BlogPostListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: BlogPost[];
};

// Normalized shape the admin editor works with in-memory; kept separate
// from BlogPost's read shape (nested category/tags objects) since writes
// need plain ids instead.
export type BlogPostDraft = {
  id?: number | string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  status: "draft" | "published";
  categoryId: string | number | null;
  tagIds: (string | number)[];
  blocks: BlogBlock[];
};
