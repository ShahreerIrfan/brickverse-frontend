import type { Product } from "@/components/productData";

export const SITE_URL = "https://kawaiisubete.com";

// ============================================================
// PART 1 — Homepage SEO
// ============================================================
export const HOMEPAGE_SEO = {
  title: "Kawaii Subete — Anime Figures & Brick Sets in Bangladesh",
  description:
    "Anime figures, cartoon collectibles and brick sets from ৳70. Cash on delivery across Bangladesh, shipped from Dhaka in 48 hours. 498 items in stock.",
  h1: "Anime Figures, Brick Sets & Collectibles in Bangladesh",
  introParagraph:
    "Kawaii Subete stocks anime figures, character brick sets and cartoon collectibles for buyers across Bangladesh. Everything ships from our Dhaka warehouse within 48 hours, and every price you see is the price you pay in taka — no import markup, no surprise shipping.",
  canonical: `${SITE_URL}/`,
};

// ============================================================
// PART 2 — Category SEO Map (11 Pages)
// ============================================================
export interface CategorySeoItem {
  slug: string;
  apiSlugs: string[];
  title: string;
  description: string;
  h1: string;
}

export const CATEGORY_SEO_MAP: Record<string, CategorySeoItem> = {
  "action-figures": {
    slug: "action-figures",
    apiSlugs: ["action-figures", "anime-action-figures", "anime-figures"],
    title: "Anime & Action Figure Price in Bangladesh | Kawaii Subete",
    description:
      "Shop 154 anime and action figures in Bangladesh from ৳250. Demon Slayer, Naruto, One Piece, Pokémon and more. Cash on delivery, ships from Dhaka in 48h.",
    h1: "Anime & Action Figures in Bangladesh",
  },
  "building-bricks": {
    slug: "building-bricks",
    apiSlugs: ["building-bricks", "bricks-blocks"],
    title: "Building Blocks Price in Bangladesh | Kawaii Subete",
    description:
      "64 building block sets from ৳250 — shops, cafés, treehouses and street-food carts. Compatible with major brick brands. Delivered from Dhaka in 48 hours.",
    h1: "Building Block Sets in Bangladesh",
  },
  "character-bricks": {
    slug: "character-bricks",
    apiSlugs: ["character-bricks"],
    title: "Character Brick Figures in Bangladesh | Kawaii Subete",
    description:
      "Build Disney, Sanrio, Tom & Jerry and anime characters from ৳200. 72 character brick figures in stock, shipped from Dhaka across Bangladesh in 48 hours.",
    h1: "Character Building Block Figures",
  },
  "flower-bricks": {
    slug: "flower-bricks",
    apiSlugs: ["flower-bricks"],
    title: "Flower Building Blocks in Bangladesh | Kawaii Subete",
    description:
      "41 flower and botanical building block sets from ৳200 — roses, sakura, orchids and bouquets that never wilt. Delivered across Bangladesh from Dhaka in 48h.",
    h1: "Flower & Botanical Building Blocks",
  },
  "cards-stickers": {
    slug: "cards-stickers",
    apiSlugs: ["cards-stickers", "cards-stickers-9ai7"],
    title: "Anime Cards & Stickers in Bangladesh | Kawaii Subete",
    description:
      "One Piece, Demon Slayer and anime card boxes, waterproof sticker packs and wanted posters from ৳70. 64 collectibles, shipped from Dhaka across Bangladesh.",
    h1: "Anime Cards, Stickers & Wanted Posters",
  },
  "accessories": {
    slug: "accessories",
    apiSlugs: ["accessories"],
    title: "Anime Keychains & Accessories BD | Kawaii Subete",
    description:
      "Anime keychains, charm bracelets and plush accessories from ৳180. 34 items — Demon Slayer, astronaut, starry bear and more. Delivered across Bangladesh.",
    h1: "Anime Keychains, Charms & Accessories",
  },
  "animal-bricks": {
    slug: "animal-bricks",
    apiSlugs: ["animal-bricks"],
    title: "Animal Building Blocks in Bangladesh | Kawaii Subete",
    description:
      "31 kawaii animal brick sets from ৳200 — cats, dogs, birds and pandas. Build a desk-sized pet that never needs feeding. Shipped from Dhaka in 48 hours.",
    h1: "Animal Building Block Sets",
  },
  "vehicle": {
    slug: "vehicle",
    apiSlugs: ["vehicle", "vehicle-bricks"],
    title: "Car & Truck Building Blocks BD | Kawaii Subete",
    description:
      "28 car and truck building block sets from ৳250 — formula racing cars, food trucks and more. Delivered across Bangladesh from Dhaka within 48 hours.",
    h1: "Vehicle Building Block Sets",
  },
  "premium-building-bricks": {
    slug: "premium-building-bricks",
    apiSlugs: ["premium-building-bricks", "premium-building-bricks-bh03"],
    title: "Premium Building Block Sets BD | Kawaii Subete",
    description:
      "Large premium building block sets from ৳1,800 for serious builders. High piece counts, detailed builds. Delivered across Bangladesh from Dhaka in 48 hours.",
    h1: "Premium Building Block Sets",
  },
  "bundle-deals": {
    slug: "bundle-deals",
    apiSlugs: ["bundle-deals"],
    title: "Bundle Deals on Brick Sets & Figures | Kawaii Subete",
    description:
      "Save more when you buy together. Bundle deals on brick sets, figures and collectibles at Kawaii Subete. Delivered across Bangladesh from Dhaka in 48 hours.",
    h1: "Bundle Deals",
  },
  "plushies": {
    slug: "plushies",
    apiSlugs: ["plushies"],
    title: "Plush Toys in Bangladesh | Kawaii Subete",
    description:
      "Soft plush toys and collectible plushies from ৳800, shipped from Dhaka across Bangladesh in 48 hours. Small range, hand-picked — restocked monthly.",
    h1: "Plush Toys & Soft Collectibles",
  },
};

// Aliases for slug normalization
const CATEGORY_ALIAS_MAP: Record<string, string> = {
  "cards-stickers-9ai7": "cards-stickers",
  "vehicle-bricks": "vehicle",
  "premium-building-bricks-bh03": "premium-building-bricks",
};

export function getCategorySeo(rawSlug: string): CategorySeoItem {
  const normalized = CATEGORY_ALIAS_MAP[rawSlug] || rawSlug;
  if (CATEGORY_SEO_MAP[normalized]) {
    return CATEGORY_SEO_MAP[normalized];
  }
  const cleanLabel = normalized
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    slug: normalized,
    apiSlugs: [normalized, rawSlug],
    title: `${cleanLabel} in Bangladesh | Kawaii Subete`,
    description: `Shop authentic ${cleanLabel.toLowerCase()} at Kawaii Subete. Delivered from Dhaka across Bangladesh in 48 hours.`,
    h1: `${cleanLabel} in Bangladesh`,
  };
}

// ============================================================
// PART 3 — Subcategory SEO Map (Top 10 Pages)
// ============================================================
export interface SubcategorySeoItem {
  parentSlug: string;
  subSlug: string;
  apiSubSlugs: string[];
  title: string;
  description: string;
  h1: string;
}

export const SUBCATEGORY_SEO_MAP: Record<string, SubcategorySeoItem> = {
  "action-figures/demon-slayer": {
    parentSlug: "action-figures",
    subSlug: "demon-slayer",
    apiSubSlugs: ["demon-slayer", "demon-slayer-series"],
    title: "Demon Slayer Figures in Bangladesh | Kawaii Subete",
    description:
      "31 Demon Slayer figures in Bangladesh from ৳350 — Tanjiro, Zenitsu, Akaza and more. In stock now, delivered from Dhaka across Bangladesh in 48 hours.",
    h1: "Demon Slayer Action Figures",
  },
  "action-figures/naruto": {
    parentSlug: "action-figures",
    subSlug: "naruto",
    apiSubSlugs: ["naruto", "naruto-shippuden", "naruto-kid-arc"],
    title: "Naruto Action Figures in Bangladesh | Kawaii Subete",
    description:
      "34 Naruto figures from ৳350 — Itachi, Obito and the Akatsuki series. In stock now, delivered from Dhaka across Bangladesh in 48 hours.",
    h1: "Naruto Shippuden Action Figures",
  },
  "action-figures/one-piece": {
    parentSlug: "action-figures",
    subSlug: "one-piece",
    apiSubSlugs: ["one-piece"],
    title: "One Piece Figures in Bangladesh | Kawaii Subete",
    description:
      "15 One Piece figures and card sets from ৳400 — Luffy, Zoro and the Straw Hat crew. Delivered from Dhaka across Bangladesh in 48 hours.",
    h1: "One Piece Action Figures & Collectibles",
  },
  "action-figures/pokemon": {
    parentSlug: "action-figures",
    subSlug: "pokemon",
    apiSubSlugs: ["pokemon", "pokmon"],
    title: "Pokémon Toys in Bangladesh | Kawaii Subete",
    description:
      "Pokémon figures and Poké Balls from ৳250 — Pikachu, Charmander and more. 13 items in stock, delivered from Dhaka across Bangladesh in 48 hours.",
    h1: "Pokémon Figures & Toys",
  },
  "action-figures/blue-lock": {
    parentSlug: "action-figures",
    subSlug: "blue-lock",
    apiSubSlugs: ["blue-lock"],
    title: "Blue Lock Figures in Bangladesh | Kawaii Subete",
    description:
      "24 Blue Lock figures and collectibles from ৳300. In stock now at Kawaii Subete, delivered from Dhaka across Bangladesh in 48 hours.",
    h1: "Blue Lock Figures & Collectibles",
  },
  "character-bricks/disney": {
    parentSlug: "character-bricks",
    subSlug: "disney",
    apiSubSlugs: ["disney"],
    title: "Disney Building Blocks in Bangladesh | Kawaii Subete",
    description:
      "17 Disney character brick figures from ৳200 — Mickey, Minnie, Donald, Ariel and Rapunzel. Delivered from Dhaka across Bangladesh in 48 hours.",
    h1: "Disney Character Building Blocks",
  },
  "character-bricks/sanrio": {
    parentSlug: "character-bricks",
    subSlug: "sanrio",
    apiSubSlugs: ["sanrio"],
    title: "Sanrio Building Blocks in Bangladesh | Kawaii Subete",
    description:
      "12 Sanrio character brick sets and buildings from ৳200. Hello Kitty and friends, delivered from Dhaka across Bangladesh in 48 hours.",
    h1: "Sanrio Character Building Blocks",
  },
  "accessories/keychains": {
    parentSlug: "accessories",
    subSlug: "keychains",
    apiSubSlugs: ["keychains"],
    title: "Anime Keychains in Bangladesh | Kawaii Subete",
    description:
      "24 anime keychains and charm accessories from ৳180 — astronaut, starry bear and Demon Slayer designs. Delivered across Bangladesh in 48 hours.",
    h1: "Anime Keychains & Wrist Straps",
  },
  "cards-stickers/wanted-posters": {
    parentSlug: "cards-stickers",
    subSlug: "wanted-posters",
    apiSubSlugs: ["wanted-posters"],
    title: "One Piece Wanted Posters BD | Kawaii Subete",
    description:
      "33 One Piece wanted posters at ৳70 each. Bounty poster sets for walls, dorms and desks. Delivered from Dhaka across Bangladesh in 48 hours.",
    h1: "One Piece Wanted Posters",
  },
  "building-bricks/shops-carts": {
    parentSlug: "building-bricks",
    subSlug: "shops-carts",
    apiSubSlugs: ["shops-carts", "mini-shops", "street-carts"],
    title: "Mini Shop & Cart Brick Sets BD | Kawaii Subete",
    description:
      "40 mini shop and street cart brick sets from ৳250 — cafés, pizzerias, food trucks and convenience stores. Delivered across Bangladesh in 48 hours.",
    h1: "Mini Shop & Street Cart Building Sets",
  },
};

export function getSubcategorySeo(parentSlug: string, subSlug: string): SubcategorySeoItem {
  const normParent = CATEGORY_ALIAS_MAP[parentSlug] || parentSlug;
  const key = `${normParent}/${subSlug}`;
  if (SUBCATEGORY_SEO_MAP[key]) {
    return SUBCATEGORY_SEO_MAP[key];
  }
  const cleanSub = subSlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    parentSlug: normParent,
    subSlug,
    apiSubSlugs: [subSlug],
    title: `${cleanSub} in Bangladesh | Kawaii Subete`,
    description: `Shop ${cleanSub} at Kawaii Subete. In stock in Dhaka, delivered across Bangladesh in 48 hours.`,
    h1: cleanSub,
  };
}

// ============================================================
// PART 4 — Static Pages SEO
// ============================================================
export const SHOP_SEO = {
  title: "Shop All Anime Figures & Brick Sets | Kawaii Subete",
  description:
    "Browse all 498 anime figures, brick sets and collectibles at Kawaii Subete. Prices from ৳70 with delivery across Bangladesh. Ships from Dhaka in 48 hours.",
  h1: "Shop All Products",
  canonical: `${SITE_URL}/shop`,
};

export const BLOG_SEO = {
  title: "Anime & Brick Collecting Guides | Kawaii Subete Blog",
  description:
    "Buying guides, restock alerts and collector notes on anime figures and brick sets in Bangladesh. Written by the team at Kawaii Subete, Dhaka.",
  h1: "Kawaii Subete Journal",
  canonical: `${SITE_URL}/blog`,
};

export const CONTACT_SEO = {
  title: "Contact Us | Kawaii Subete - Support, Phone & Store Location",
  description:
    "Get in touch with Kawaii Subete. Visit our Mohakhali DOHS Dhaka office, call our hotline 01402494401, or message us on WhatsApp for fast customer support.",
  h1: "Contact Kawaii Subete",
  canonical: `${SITE_URL}/contact`,
};

// ============================================================
// PART 5 — Blog Post Metadata Map (All 10 Posts)
// ============================================================
export const BLOG_POST_SEO_MAP: Record<string, { title: string; description: string }> = {
  "demon-slayer-collection-spotlight": {
    title: "Demon Slayer Collection Spotlight | Kawaii Subete",
    description:
      "A close look at our Demon Slayer figure lineup — Tanjiro, Zenitsu, Akaza and the pieces worth collecting first. In stock in Dhaka, delivered across BD.",
  },
  "one-piece-fan-guide-luffy-zoro-the-crew": {
    title: "One Piece Fan Guide: Luffy, Zoro & the Crew",
    description:
      "Which One Piece figures and card sets to start with, what they cost in Bangladesh, and how the Straw Hat lineup breaks down. From Kawaii Subete, Dhaka.",
  },
  "pokemon-corner-building-our-starter-lineup": {
    title: "Pokémon Corner: Building Our Starter Lineup",
    description:
      "How we picked our first Pokémon figures and Poké Balls, what is in stock now, and what we are restocking next. Prices in taka, delivered across Bangladesh.",
  },
  "jujutsu-kaisen-restock-gojo-sukuna-the-squad": {
    title: "Jujutsu Kaisen Restock: Gojo, Sukuna & the Squad",
    description:
      "Jujutsu Kaisen figures are back in stock in Dhaka. What arrived, what sold out first, and what is coming next. Delivered across Bangladesh in 48 hours.",
  },
  "attack-on-titan-figure-guide": {
    title: "Attack on Titan Figures: What to Collect First",
    description:
      "A guide to Attack on Titan figures — the 29cm Eren Attack Titan, scale differences, and what to check before buying. In stock in Dhaka, shipped across BD.",
  },
  "brick-building-101-your-first-custom-set": {
    title: "Brick Building 101: Your First Custom Set",
    description:
      "New to brick sets? Start here. Piece counts, difficulty, price bands in taka, and which sets to buy first. From Kawaii Subete, delivered across Bangladesh.",
  },
  "brick-built-icons-when-marvel-meets-anime": {
    title: "Brick-Built Icons: When Marvel Meets Anime",
    description:
      "Where superhero brick figures and anime brick figures overlap, and which crossover sets are worth the shelf space. In stock in Dhaka, delivered across BD.",
  },
  "inside-the-studio-how-we-pick-every-anime-figure": {
    title: "Inside the Studio: How We Pick Every Figure",
    description:
      "How we source anime figures for the Bangladesh market — quality checks, pricing, and why we reject more than we buy. From Kawaii Subete, Dhaka.",
  },
  "new-arrivals-this-seasons-drop": {
    title: "New Arrivals: This Season's Drop | Kawaii Subete",
    description:
      "Everything that landed this season — new figures, brick sets and collectibles now in stock in Dhaka. Delivered across Bangladesh in 48 hours.",
  },
  "doraemon-friends-cartoon-corner-restock": {
    title: "Doraemon & Friends Restock: Cartoon Corner",
    description:
      "Doraemon and classic cartoon brick figures are back in stock in Dhaka. What arrived, prices in taka, and delivery across Bangladesh in 48 hours.",
  },
};

export function getBlogPostSeo(slug: string, fallbackTitle?: string, fallbackDescription?: string) {
  if (BLOG_POST_SEO_MAP[slug]) {
    return BLOG_POST_SEO_MAP[slug];
  }
  return {
    title: fallbackTitle ? `${fallbackTitle} | Kawaii Subete Blog` : "Anime & Brick Collecting Guides | Kawaii Subete Blog",
    description:
      fallbackDescription ||
      "Buying guides, restock alerts and collector notes on anime figures and brick sets in Bangladesh. Written by the team at Kawaii Subete, Dhaka.",
  };
}

// ============================================================
// PART 6 — JSON-LD Structured Data Builders
// ============================================================

export function buildHomepageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Kawaii Subete",
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/logo.png`,
        },
        address: {
          "@type": "PostalAddress",
          streetAddress: "House No-412, Flat-3/A & 3/B, Road No-29, Mohakhali DOHS",
          addressLocality: "Dhaka",
          addressCountry: "BD",
        },
        telephone: "+8801402494401",
        sameAs: [
          "https://www.facebook.com/profile.php?id=61575469209698",
          "https://www.instagram.com/kawaii.subete/",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Kawaii Subete",
        publisher: { "@id": `${SITE_URL}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/shop?search={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
}

export function buildProductJsonLd(product: Product) {
  // Strip non-numeric currency characters
  const rawPrice = product.discountedPrice || product.price || "0";
  const numericPrice = String(rawPrice).replace(/[^0-9.]/g, "").trim() || "0";
  const isInStock = (product.stock ?? 1) > 0;
  const productSlug = product.slug || product.id;
  const imageUrl = product.image?.startsWith("http")
    ? product.image
    : `${SITE_URL}${product.image?.startsWith("/") ? "" : "/"}${product.image || "logo.png"}`;

  const cleanDescription = (product.description || `${product.name} at Kawaii Subete Bangladesh`)
    .replace(/<[^>]*>/g, "")
    .slice(0, 500)
    .trim();

  const breadcrumbElements: Array<{ "@type": string; position: number; name: string; item?: string }> = [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
  ];

  if (product.category) {
    const catSlug = product.category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const catSeo = getCategorySeo(catSlug);
    breadcrumbElements.push({
      "@type": "ListItem",
      position: 2,
      name: catSeo.h1,
      item: `${SITE_URL}/category/${catSeo.slug}`,
    });

    if (product.subcategory) {
      const subName = typeof product.subcategory === "string" ? product.subcategory : product.subcategory?.name || "";
      if (subName) {
        const subSlug = subName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        breadcrumbElements.push({
          "@type": "ListItem",
          position: 3,
          name: subName,
          item: `${SITE_URL}/category/${catSeo.slug}/${subSlug}`,
        });
        breadcrumbElements.push({
          "@type": "ListItem",
          position: 4,
          name: product.name,
        });
      } else {
        breadcrumbElements.push({
          "@type": "ListItem",
          position: 3,
          name: product.name,
        });
      }
    } else {
      breadcrumbElements.push({
        "@type": "ListItem",
        position: 3,
        name: product.name,
      });
    }
  } else {
    breadcrumbElements.push({
      "@type": "ListItem",
      position: 2,
      name: product.name,
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: product.name,
        image: [imageUrl],
        description: cleanDescription,
        sku: product.sku || `KS-${product.id}`,
        brand: { "@type": "Brand", name: "Kawaii Subete" },
        offers: {
          "@type": "Offer",
          url: `${SITE_URL}/product/${productSlug}`,
          priceCurrency: "BDT",
          price: numericPrice,
          availability: isInStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@id": `${SITE_URL}/#organization` },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbElements,
      },
    ],
  };
}

export function buildCategoryJsonLd(
  categoryName: string,
  categorySlug: string,
  count: number,
  products: Product[] = []
) {
  const itemElements = products.slice(0, 20).map((p, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${SITE_URL}/product/${p.slug || p.id}`,
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: categoryName, item: `${SITE_URL}/category/${categorySlug}` },
        ],
      },
      {
        "@type": "ItemList",
        name: categoryName,
        numberOfItems: count,
        itemListElement: itemElements,
      },
    ],
  };
}

export function buildContactFaqJsonLd() {
  const faqs = [
    {
      q: "How long does shipping take?",
      a: "Inside Dhaka city, deliveries are completed within 24 to 48 hours. For all other districts across Bangladesh, standard courier shipping takes 48 to 72 hours.",
    },
    {
      q: "Is Cash on Delivery (COD) supported?",
      a: "Yes. Cash on Delivery is available nationwide. You are welcome to inspect your package condition before completing payment.",
    },
    {
      q: "Are the anime figures and brick sets authentic?",
      a: "Yes. Every item in Kawaii Subete is 100% authentic, high quality, and securely packaged for safe delivery.",
    },
    {
      q: "What is your return and replacement policy?",
      a: "We offer a 7-day hassle-free replacement if any product is received damaged or with missing parts during transit.",
    },
    {
      q: "Can I visit your office in person?",
      a: "Yes, you can visit our Mohakhali DOHS office (House 412, Road 29, Dhaka). Please call us ahead at 01402494401 before visiting.",
    },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}

