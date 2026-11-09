import type { Product } from "@/components/productData";

export const SITE_URL = "https://kawaiisubete.com";

// ============================================================
// PART 1 — Homepage SEO
// ============================================================
export const HOMEPAGE_SEO = {
  title: "Kawaii Subete — Anime Figures & Brick Sets in Bangladesh",
  description:
    "Anime figures, cartoon collectibles and brick sets from ৳70. Cash on delivery across Bangladesh, shipped from Dhaka in 48 hours. 472 items in stock.",
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
  introText?: string;
}

export const CATEGORY_SEO_MAP: Record<string, CategorySeoItem> = {
  "action-figures": {
    slug: "action-figures",
    apiSlugs: ["action-figures", "anime-action-figures", "anime-figures"],
    title: "Anime & Action Figure Price in Bangladesh | Kawaii Subete",
    description: "Shop over 150 anime and action figures in Bangladesh from ৳250. Demon Slayer, Naruto, One Piece, Pokémon and more. Cash on delivery, ships from Dhaka in 48h.",
    h1: "Anime & Action Figures in Bangladesh",
    introText: "Our action figure range is the largest part of the shop — 186 pieces at the last count, priced from ৳250 for a Poké Ball up to ৳5,500 for a 29cm Attack Titan. If you are building a shelf from scratch, this is where to start.\n\nThe lineup leans heavily on shonen. Demon Slayer accounts for 31 figures, including the 17cm Zenitsu Vibration Stars and the 26cm Akaza & Koyuki pair. Naruto Shippuden runs to 34 pieces across the Akatsuki and Tailed Beast series — Itachi at 29cm and Obito at 27cm are the anchors. One Piece, Blue Lock, Haikyuu and Pokémon fill out most of the rest, with smaller runs from Jujutsu Kaisen, The Apothecary Diaries, Death Note, Attack on Titan, Kuroko's Basketball, Spy × Family and My Hero Academia.\n\nScale matters more than anything else when you are buying your first figure. Anything under 20cm sits comfortably on a desk or a monitor stand. The 26–29cm pieces are shelf pieces — they need vertical clearance and they look wrong crammed next to smaller figures. Every listing states the height in the title, so check it before you commit.\n\nStock moves fast on the popular characters. Around a fifth of the range is out of stock at any given time, and Demon Slayer and Naruto restock most often. Everything ships from our Dhaka warehouse within 48 hours, cash on delivery available nationwide.",
  },
  "building-bricks": {
    slug: "building-bricks",
    apiSlugs: ["building-bricks", "bricks-blocks"],
    title: "Building Blocks Price in Bangladesh | Kawaii Subete",
    description: "Over 60 building block sets from ৳250 — shops, cafés, treehouses and street-food carts. Compatible with major brick brands. Delivered from Dhaka in 48 hours.",
    h1: "Building Block Sets in Bangladesh",
    introText: "Sixty-four brick sets, priced from ৳250 to ৳900, and the range splits cleanly into two types: small display builds and larger architectural models.\n\nThe small builds are the bulk of it — 40 sets covering mini shops and street carts. A pizzeria, a seafood market, a coffee shop, a convenience store, a hot dog cart, a takoyaki stall, a flower boutique. Each runs ৳250–350 and takes an evening to build. They are the easiest entry point if you have never built a set before, and they line up nicely on a shelf as a street scene if you buy several.\n\nThe larger models are a step up in both piece count and price. Windmill cottages at ৳350, sakura treehouses at ৳900 in orange, white, blue or pink. These take longer, hold together better as display pieces, and photograph well — which is why they are the ones people tend to post.\n\nA note on compatibility: these are standard brick sets that work with the major international brick brands. If you already have a collection, the pieces will interlock. We do not sell or claim any affiliation with those brands — these are independent sets built to the same system.\n\nEverything ships from Dhaka within 48 hours with cash on delivery across Bangladesh.",
  },
  "character-bricks": {
    slug: "character-bricks",
    apiSlugs: ["character-bricks"],
    title: "Character Brick Figures in Bangladesh | Kawaii Subete",
    description: "Build Disney, Sanrio, Tom & Jerry and anime characters from ৳200. Over 70 character brick figures in stock, shipped from Dhaka across Bangladesh in 48 hours.",
    h1: "Character Building Block Figures",
    introText: "Seventy-three character brick figures, all between ৳200 and ৳450. These are small builds — a character in brick form, usually 100–200 pieces, sitting somewhere between a toy and a desk ornament.\n\nFour groups dominate. Anime characters account for 39 pieces, drawn mostly from One Piece, Demon Slayer, Pokémon and Naruto. Disney contributes 17: Mickey, Minnie, Donald, Daisy, Scrooge McDuck, Winnie the Pooh, plus the princess line with Ariel and Rapunzel. Sanrio adds 12, including character buildings as well as standalone figures. A further 5 are superheroes — Batman, Spider-Man, Iron Man, Deadpool and Venom.\n\nThese are the cheapest way into the hobby if you are buying for someone else and are not sure what they are into. At ৳200 a figure, you can buy three or four characters from different series and let the recipient pick a favourite. They also work as a set: the Disney figures are designed to sit together as a group.\n\nBuild time is short — most of these are done in under an hour, which makes them a reasonable first set for a teenager who has not built anything before. Note that these are collector-oriented display pieces, not toys for small children; several have small parts.\n\nAll 73 are in stock. Ships from Dhaka, 48 hours, cash on delivery across Bangladesh.",
  },
  "flower-bricks": {
    slug: "flower-bricks",
    apiSlugs: ["flower-bricks"],
    title: "Flower Building Blocks in Bangladesh | Kawaii Subete",
    description: "Over 40 flower and botanical building block sets from ৳200 — roses, sakura, orchids and bouquets that never wilt. Delivered across Bangladesh from Dhaka in 48h.",
    h1: "Flower & Botanical Building Blocks",
    introText: "Forty-three botanical sets from ৳200, and this is the part of the shop that surprises people. Flower brick sets have become one of the fastest-growing categories in the hobby internationally, and almost nobody in Bangladesh stocks them properly.\n\nThe range covers single stems at ৳200 — roses, tulips, sunflowers, datura, water lilies — up through potted arrangements at ৳350 and covered display models at ৳550, to full baskets at ৳400. There are orchids, sakura branches, hydrangeas, a red rose basket, a purple fantasy flower model. There are also nine flower-camera builds, which take the same floral pieces into a retro camera form that has become the most photographed set we sell.\n\nThe appeal is obvious once you see one built. Cut flowers last a week. These last. They sit on a desk or a dining table and read as a real arrangement from a metre away, then reward a closer look. Several customers buy them specifically as gifts for people who are difficult to buy for.\n\nBuild difficulty varies more here than in any other category. A single stem is 20 minutes and maybe 60 pieces. A basket is an evening and several hundred. Check the piece count on the listing before you choose.\n\nNothing in this category is currently out of stock. Delivered from Dhaka within 48 hours, cash on delivery available.",
  },
  "cards-stickers": {
    slug: "cards-stickers",
    apiSlugs: ["cards-stickers", "cards-stickers-9ai7"],
    title: "Anime Cards & Stickers in Bangladesh | Kawaii Subete",
    description: "One Piece, Demon Slayer and anime card boxes, waterproof sticker packs and wanted posters from ৳70. Over 60 collectibles, shipped from Dhaka across Bangladesh.",
    h1: "Anime Cards, Stickers & Wanted Posters",
    introText: "Sixty-six paper collectibles starting at ৳70 — the cheapest things we sell, and the ones that sell out fastest.\n\nThree types. Wanted posters make up the largest group at 33 designs, all One Piece bounty posters at ৳70 each. These are the classic wall-poster format: aged paper look, bounty amount, character portrait. Students buy them in sets of five or six and cover a wall.\n\nCard boxes account for 25 products, ৳300–500. These are LOMO-style collectible sets — 96 cards per box, covering One Piece, Demon Slayer, Naruto, Solo Leveling, Spy × Family and more. They are trading-card-adjacent rather than official TCG product, so do not expect tournament-legal cards; expect a large, good-looking set to sort through and trade with friends.\n\nStickers are the smallest group at 8, including 50-piece waterproof anime packs and character-specific sheets. Waterproof matters more than it sounds — these survive on a laptop lid, a water bottle, or a scooter panel, which is where most of them end up.\n\nFifteen of the 66 are out of stock at any given time, usually the card boxes. At this price point people tend to buy several at once, so restocks clear quickly.\n\nShipped flat from Dhaka within 48 hours. Cash on delivery across Bangladesh.",
  },
  "accessories": {
    slug: "accessories",
    apiSlugs: ["accessories"],
    title: "Anime Keychains & Accessories BD | Kawaii Subete",
    description: "Anime keychains, charm bracelets and plush accessories from ৳180. 34 items — Demon Slayer, astronaut, starry bear and more. Delivered across Bangladesh.",
    h1: "Anime Keychains, Charms & Accessories",
    introText: "Thirty-four accessories from ৳180 — the small stuff, and the highest-conversion category in the shop. Cheap enough to add to an order without thinking about it, useful enough that people come back for a second one.\n\nKeychains are 24 of the 34. The astronaut and starry bear ranges are the ones that move — coloured figures on a wrist strap, at ৳180–250. There are also Demon Slayer charm bracelets in the Tanjiro and Zenitsu designs at ৳700, which sell as pairs more often than singly. The remaining seven are compact cat-design faux leather wallets in six colours at ৳250.\n\nTwo things worth knowing. First, the wrist strap styles are genuinely useful rather than decorative — the strap loops over your wrist so the figure hangs free, which means it survives being pulled out of a pocket a hundred times a day. Second, these are the item most often bought as a gift for someone whose taste you only half know. A keychain is a low-stakes guess. A ৳4,000 figure is not.\n\nThree items are currently out of stock. Delivery from Dhaka in 48 hours, cash on delivery across Bangladesh.",
  },
  "animal-bricks": {
    slug: "animal-bricks",
    apiSlugs: ["animal-bricks"],
    title: "Animal Building Blocks in Bangladesh | Kawaii Subete",
    description: "31 kawaii animal brick sets from ৳200 — cats, dogs, birds and pandas. Build a desk-sized pet that never needs feeding. Shipped from Dhaka in 48 hours.",
    h1: "Animal Building Block Sets",
    introText: "Thirty-one animal brick sets from ৳200, and the most consistently popular gift category we carry.\n\nBirds are the largest group at 14 — parrots perched on branches, ৳250 each, in six colourways. The pet range follows: a munchkin cat, a black cat, a Bengal, a Napoleon, a corgi, a husky, a Maltese, a border collie, a beagle. All ৳300, all comparable in size, all designed to sit on a desk as a small animal figurine. People buy one, then come back for the matching breed for a friend who owns the real thing.\n\nThen five pandas at ৳200–400, and three sea-life sets — a crab, a blue whale, an octopus — at ৳250.\n\nThe appeal here is different from the anime side. Nobody is buying a brick corgi because of a show. They buy it because it is a small, well-made object that looks good on a desk and takes 40 minutes to build. That makes it the safest gift in the entire shop — there is no taste to get wrong.\n\nOnly one set is currently out of stock. Delivered from Dhaka within 48 hours with cash on delivery across Bangladesh.",
  },
  "vehicle": {
    slug: "vehicle",
    apiSlugs: ["vehicle", "vehicle-bricks"],
    title: "Car & Truck Building Blocks BD | Kawaii Subete",
    description: "28 car and truck building block sets from ৳250 — formula racing cars, food trucks and more. Delivered across Bangladesh from Dhaka within 48 hours.",
    h1: "Vehicle Building Block Sets",
    introText: "Twenty-eight vehicle sets from ৳250, split between cars, trucks and ships.\n\nThe car range is the formula racing series — twelve F1-style cars at ৳250–350 in yellow, green, orange, red, blue and white. Buy several and you have a grid. They are small, quick builds; an evening for one, a weekend for a set.\n\nTrucks run to twelve and split two ways. Six are food vehicles: a coffee truck, a fast-food truck, a dessert truck. Six are floral delivery trucks in rose, hydrangea and similar colourways. These pair directly with the mini shop sets in our building bricks category — a coffee shop, a coffee truck and a hot dog cart on the same shelf look like a street rather than three unrelated models.\n\nShips are the smallest group at four: pirate vessels from the Caribbean series at ৳300, in red, brown and black.\n\nAt ৳250–350 these are the cheapest brick sets we sell with real mechanical detail, which makes them the usual recommendation for someone buying their first set for a child old enough to follow instructions. Small parts apply, so check the age suitability on each listing.\n\nTwo items are out of stock right now. Shipped from Dhaka within 48 hours, cash on delivery available across Bangladesh.",
  },
  "premium-building-bricks": {
    slug: "premium-building-bricks",
    apiSlugs: ["premium-building-bricks", "premium-building-bricks-bh03"],
    title: "Premium Building Block Sets BD | Kawaii Subete",
    description: "Large premium building block sets from ৳1,800 for serious builders. High piece counts, detailed builds. Delivered across Bangladesh from Dhaka in 48 hours.",
    h1: "Premium Building Block Sets",
    introText: "Four sets, ৳1,800 to ৳3,500. This is the smallest category in the shop by design — we only stock a premium set when the piece count and the build quality justify the price.\n\nThese are large builds. High piece counts, detailed instruction books, and finished models that hold up as display pieces rather than desk ornaments. They take multiple sessions, not an evening. If you have built through the standard range and want something that lasts a fortnight, this is the shelf.\n\nThe honest caveat: this category is not for a first purchase. If you have not built a brick set before, start with a ৳300 shop or a ৳250 vehicle. Get a feel for whether you enjoy the process before spending ৳3,500 on a set that will take you three weeks. The hobby is genuinely not for everyone, and the premium tier is where that becomes an expensive lesson.\n\nFor anyone who already builds regularly, the value is straightforward — the piece-to-taka ratio here is the best in the shop.\n\nOne set is currently out of stock. Delivered from Dhaka within 48 hours, cash on delivery across Bangladesh.",
  },
  "bundle-deals": {
    slug: "bundle-deals",
    apiSlugs: ["bundle-deals"],
    title: "Bundle Deals on Brick Sets & Figures | Kawaii Subete",
    description: "Save more when you buy together. Bundle deals on brick sets, figures and collectibles at Kawaii Subete. Delivered across Bangladesh from Dhaka in 48 hours.",
    h1: "Bundle Deals",
    introText: "Our current bundle offer: buy any two brick sets and get a mini figure free.\n\nThe offer exists because the brick range is designed to be built as groups. Two mini shop sets sit together as a street. A coffee shop plus a coffee truck reads as a scene. Two character figures from the same series look intentional; one looks like you stopped halfway. Bundling is how these sets are meant to be bought, so the discount follows the behaviour rather than fighting it.\n\nTo use it, add any two products from the building bricks, character bricks, animal bricks, vehicle or flower categories to your cart — the mini figure is added automatically at checkout. Mixing categories counts. A flower set plus a vehicle set qualifies.\n\nWe also run a launch discount — code `LAUNCH10` for 10% off — on top of the bundle. The code is time-limited and we will pull it when the launch period ends, so check the banner on the homepage for the current status.\n\nWorth knowing: bundle pricing applies to items in stock. If one of your two sets is out of stock it will not reach the cart, so pick a second from the in-stock range.\n\nDelivered from Dhaka in 48 hours, cash on delivery across Bangladesh.",
  },
  "plushies": {
    slug: "plushies",
    apiSlugs: ["plushies"],
    title: "Plush Toys in Bangladesh | Kawaii Subete",
    description: "Soft plush toys and collectible plushies from ৳800, shipped from Dhaka across Bangladesh in 48 hours. Small range, hand-picked — restocked monthly.",
    h1: "Plush Toys & Soft Collectibles",
    introText: "Six plushies, ৳800–900. This is the smallest category we carry and it is deliberately small — we would rather stock four good ones than forty mediocre ones.\n\nThe current range is built around the cat-with-bell-collar design in grey, orange and white, plus a rose bouquet lamb in red and blue. They are mid-sized, soft rather than firm, and finished properly — stitched details rather than printed ones, which is the difference that shows after a few months of handling.\n\nThree of the six are out of stock at any given time, which tells you something about the demand relative to how many we bring in. If a colour is showing in stock, it is worth not waiting on it.\n\nBe clear on what this category is not: it is not a children's toy range. These are collectible plushies for adult collectors and older teenagers, in the same way the figures are. If you are buying for a young child, the brick sets in our animal category are a better fit and considerably cheaper.\n\nWe restock plushies roughly monthly in small batches. Delivered from Dhaka within 48 hours, cash on delivery available across Bangladesh.",
  },
};

// Aliases for slug normalization
const CATEGORY_ALIAS_MAP: Record<string, string> = {
  "cards-stickers-9ai7": "cards-stickers",
  "vehicle-bricks": "vehicle",
  "premium-building-bricks-bh03": "premium-building-bricks",
  "anime": "anime-character-figures",
  "sanrio-buildings-": "sanrio-buildings",
  "bags-bags": "bags",
};

export const VALID_CATEGORY_SLUGS = new Set([
  "action-figures",
  "building-bricks",
  "character-bricks",
  "flower-bricks",
  "cards-stickers",
  "accessories",
  "animal-bricks",
  "vehicle",
  "premium-building-bricks",
  "bundle-deals",
  "plushies",
]);

export function isValidCategorySlug(slug: string): boolean {
  const norm = CATEGORY_ALIAS_MAP[slug] || slug;
  return VALID_CATEGORY_SLUGS.has(norm);
}

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
// PART 3 — Subcategory SEO Map (44 Pages)
// ============================================================
export interface SubcategorySeoItem {
  parentSlug: string;
  subSlug: string;
  apiSubSlugs: string[];
  title: string;
  description: string;
  h1: string;
  introText?: string;
}

export const SUBCATEGORY_SEO_MAP: Record<string, SubcategorySeoItem> = {
  "action-figures/naruto": {
    parentSlug: "action-figures",
    subSlug: "naruto",
    apiSubSlugs: ["naruto"],
    title: "Naruto Action Figures in Bangladesh | Kawaii Subete",
    description: "34 Naruto figures from ৳350 — Itachi, Obito and the Akatsuki series. In stock now, delivered from Dhaka across Bangladesh in 48 hours.",
    h1: "",
    introText: "Thirty-four Naruto figures, the largest single-series group in the shop, built mostly around the Akatsuki and the Tailed Beast line.\n\nItachi Uchiha at 29cm and ৳4,000 and Obito Uchiha at 27cm and ৳4,000 are the anchors. Both are designed as display pieces and both hold the Akatsuki cloak shape properly — which is the thing that usually goes wrong on cheaper Naruto figures. The cloak is a hard silhouette to get right in a static pose and these manage it.\n\nBelow that sits the Tailed Beast Costume series at ৳350 — Gaara with Shukaku, Itachi with Crow, Kakashi with Pakkun, Sakura with Katsuyu. These are the small, characterful ones, and they sell faster than the large figures because the price point is easy.\n\nOne practical note: the 27cm and 29cm figures are heavy enough that the base matters. Both ship with weighted stands; do not substitute a generic stand.\n\nNine of the 34 are currently out of stock. Shipped from Dhaka within 48 hours, cash on delivery across Bangladesh.",
  },
  "action-figures/demon-slayer": {
    parentSlug: "action-figures",
    subSlug: "demon-slayer",
    apiSubSlugs: ["demon-slayer"],
    title: "Demon Slayer Figures in Bangladesh | Kawaii Subete",
    description: "31 Demon Slayer figures in Bangladesh from ৳350 — Tanjiro, Zenitsu, Akaza and more. In stock now, delivered from Dhaka across Bangladesh in 48 hours.",
    h1: "",
    introText: "Thirty-one Demon Slayer figures, ৳350 to ৳4,500, covering the main cast across four price tiers.\n\nThe entry tier is the PalVerse chibi line at ৳350 — Tanjiro, Zenitsu, Nezuko, Giyu and more, small enough to line up as a full set on one shelf. Above it sits the Vibration Stars Zenitsu at 17cm for ৳800, in his mid-air combat pose with the yellow haori and triangle pattern picked out properly.\n\nTanjiro carrying Nezuko at ৳1,100 is the single most-recommended first Demon Slayer purchase we sell: two characters, one piece, and the composition is better than either figure alone.\n\nThe upper tier is where the detail lives. Akaza & Koyuki at 26cm and ৳4,500 is the centrepiece — a two-figure base composition rather than a standalone pose. At that size and price it is a shelf piece, not a desk piece.\n\nWorth knowing: the 17cm and 26cm figures do not display well together. Scale is consistent within each line, not across them. Pick a tier and stay in it.\n\nEight are out of stock right now. Shipped from Dhaka in 48 hours.",
  },
  "action-figures/blue-lock": {
    parentSlug: "action-figures",
    subSlug: "blue-lock",
    apiSubSlugs: ["blue-lock"],
    title: "Blue Lock Figures in Bangladesh | Kawaii Subete",
    description: "24 Blue Lock figures and collectibles from ৳300. In stock now at Kawaii Subete, delivered from Dhaka across Bangladesh in 48 hours.",
    h1: "",
    introText: "Twenty-four Blue Lock figures, ৳300 to ৳1,500, and one of the few series where we carry the full spread from chibi sets up to display figures.\n\nThe core is the Katazun line at the low end — Bachira, Reo Mikage, Nagi, Isagi — small, expressive, designed to sit together. Above them, the Chibi Action Figure series runs to ৳1,500 with casual and jersey variants of the same character, which is unusual: you can buy Nagi in his street clothes and Nagi in his kit and display them as a pair.\n\nBlue Lock is a newer series than most of what we stock, which cuts both ways. On one hand the collector base is younger and still forming, so nothing here has the secondary-market inflation you see on older shonen lines. On the other, the range is smaller — you are buying from what exists rather than choosing from everything.\n\nIf you are buying for someone who is into the anime rather than the hobby, the lower band is the right call. If they already collect figures, the upper band is where the difference shows.\n\nOnly one is out of stock. Shipped from Dhaka in 48 hours.",
  },
  "action-figures/haikyu": {
    parentSlug: "action-figures",
    subSlug: "haikyu",
    apiSubSlugs: ["haikyu"],
    title: "Haikyuu Figure Price in Bangladesh | Kawaii Subete",
    description: "Shop authentic  at Kawaii Subete. Shipped from our Dhaka warehouse across Bangladesh within 24-48 hours with cash on delivery.",
    h1: "",
    introText: "Twenty chibi volleyball figures, all at ৳300–350, all 7.5cm. This is the most consistent range we carry — same scale, same price band, same build, across twenty characters.\n\nThat consistency is the point. The full set is designed to be displayed together as a team lineup, and at this price you can buy five or six without it becoming a decision. Hinata, Kageyama, Tsukishima, Bokuto, Kenma, Akaashi and the rest of the Karasuno and Nekoma squads are all here.\n\nAt 7.5cm they are genuinely small — smaller than most people expect from the product photos. They sit on a monitor stand or a narrow shelf rather than a proper display case. If you want something with presence, this is not that range; if you want the whole team, this is exactly it.\n\nBuild quality is good for the price. The volleyball poses are distinct per character rather than reused, which is not always true at this price point.\n\nNothing in this category is currently out of stock — unusual for us, and worth taking advantage of. Delivered from Dhaka within 48 hours.",
  },
  "action-figures/one-piece": {
    parentSlug: "action-figures",
    subSlug: "one-piece",
    apiSubSlugs: ["one-piece"],
    title: "One Piece Figures in Bangladesh | Kawaii Subete",
    description: "15 One Piece figures and card sets from ৳400 — Luffy, Zoro and the Straw Hat crew. Delivered from Dhaka across Bangladesh in 48 hours.",
    h1: "",
    introText: "Fifteen One Piece figures, ৳400 to ৳1,700, and unusually for this shop the range leans heavily on one character.\n\nSix of the fifteen are Gear 5 Luffy — the Sun God Nika form — in variants V1 through V6. Different poses, different finishes, same character. If you are a Luffy collector this is the deepest single-character run we stock anywhere. If you are not, it is worth knowing that before you browse.\n\nThe rest of the crew fills out the range: Zoro, Sanji, Law, Shanks and others at ৳400–1,700. These are the standard collector scale rather than chibi, and the price difference between characters reflects size and detail rather than rarity.\n\nOne Piece also dominates our paper category — 33 wanted posters at ৳70 each and LOMO card boxes at ৳400–500. The combination is why One Piece buyers tend to place larger orders than average: a figure plus a card box plus four posters is a coherent purchase, not a random one.\n\nOne figure is currently out of stock. Delivered from Dhaka in 48 hours, cash on delivery across Bangladesh.",
  },
  "action-figures/pokemon": {
    parentSlug: "action-figures",
    subSlug: "pokemon",
    apiSubSlugs: ["pokemon"],
    title: "Pokémon Toys in Bangladesh | Kawaii Subete",
    description: "Pokémon figures and Poké Balls from ৳250 — Pikachu, Charmander and more. 13 items in stock, delivered from Dhaka across Bangladesh in 48 hours.",
    h1: "",
    introText: "Thirteen Pokémon products from ৳250 — a small range, deliberately, because Pokémon merchandise is heavily counterfeited and we only stock what we can verify.\n\nThe core is the Classic Character Series in high-quality version at ৳380: Pikachu, Charmander, Squirtle, Psyduck, Jigglypuff and more. These are the standard collector scale, painted rather than moulded in colour, and the difference is visible at arm's length. Below them sits the Poké Ball at ৳250 — the cheapest Pokémon item we sell, and the standard gift purchase.\n\nAbove that, the range moves into paper rather than larger figures: Pokémon LOMO card boxes and sticker packs in the same band as the rest of our collectibles.\n\nWorth being direct about: if you want a large Pokémon figure, we do not currently stock one, and we would rather say so than sell you a ৳380 figure described as something it is not. The range is small figures, cards and accessories.\n\nThree are out of stock. Restocked regularly. Shipped from Dhaka within 48 hours across Bangladesh.",
  },
  "action-figures/jujutsu-kaisen": {
    parentSlug: "action-figures",
    subSlug: "jujutsu-kaisen",
    apiSubSlugs: ["jujutsu-kaisen"],
    title: "Jujutsu Kaisen Figures in Bangladesh | Kawaii Subete",
    description: "Shop authentic  at Kawaii Subete. Shipped from our Dhaka warehouse across Bangladesh within 24-48 hours with cash on delivery.",
    h1: "",
    introText: "Ten Jujutsu Kaisen figures, ৳600 to ৳900, in two distinct formats.\n\nThe Sitting Action Figure line is the bulk of it — Yuji Itadori, Megumi Fushiguro, Nobara Kugisaki and Gojo Satoru, all posed seated. The seated pose is a deliberate design choice: it makes them stable on any flat surface without a stand, and it means they can sit on a desk edge or a bookshelf lip where a standing figure would fall. If you have limited display space, this format is genuinely more practical.\n\nThe Look Up Series is the other half — Gojo and Kento Nanami, in the upward-looking pose that has become the signature of that line. These are shorter but more characterful, and they photograph better than they display.\n\nAt ৳600–900 this sits in the middle of our price range: more than a chibi, less than a display piece. Good for a first proper figure.\n\nTwo are currently out of stock. Delivered from Dhaka within 48 hours, cash on delivery across Bangladesh.",
  },
  "action-figures/the-apothecary-diaries": {
    parentSlug: "action-figures",
    subSlug: "the-apothecary-diaries",
    apiSubSlugs: ["the-apothecary-diaries"],
    title: "Apothecary Diaries Figures in Bangladesh | Kawaii Subete",
    description: "Shop authentic  at Kawaii Subete. Shipped from our Dhaka warehouse across Bangladesh within 24-48 hours with cash on delivery.",
    h1: "",
    introText: "Eight Apothecary Diaries figures, ৳380 to ৳1,700, split between two manufacturers' takes on the same two characters.\n\nThe Sitting Figure line is the entry point at ৳380 — Maomao and Jinshi, 6cm, seated, detailed enough that the green outfit and blue hair accessories read correctly at a glance. They are small. Genuinely small, about the height of a thumb. If you are expecting a shelf centrepiece, adjust expectations before ordering.\n\nThe Bandai Machibouke line runs higher at ৳570, adding Xiaolan and Shisui to the roster alongside Maomao and Jinshi. Better finish, more presence, still compact.\n\nAt the top, a ৳1,700 piece that is the only one in this range with real display presence.\n\nThe Apothecary Diaries is a newer licence in Bangladesh and the collector base is still forming, which means prices here have not inflated the way Demon Slayer or Naruto have. That is worth noting if you are buying to keep.\n\nEverything in stock. Delivered from Dhaka in 48 hours.",
  },
  "action-figures/death-note": {
    parentSlug: "action-figures",
    subSlug: "death-note",
    apiSubSlugs: ["death-note"],
    title: "Death Note Figures in Bangladesh | Kawaii Subete",
    description: "Shop authentic  at Kawaii Subete. Shipped from our Dhaka warehouse across Bangladesh within 24-48 hours with cash on delivery.",
    h1: "",
    introText: "Seven Death Note figures, ৳300 to ৳1,100, across two lines.\n\nThe Noodle Stopper series is the interesting one — L Lawliet at 9cm, Ryuk at 12cm, Light Yagami at 16cm. The name is literal: they are designed to sit on the rim of an instant noodle cup, weighted so they stay put. It is a strange brief for a figure, and it works better than it should. They also sit perfectly well on a shelf edge or monitor stand, which is where most of them end up.\n\nThe Katazun line sits below at ৳300 — Ryuk, Light and Misa Amane in the smaller chibi format, designed to be collected as a set of three.\n\nThe size spread here is unusually wide: 9cm to 16cm within the same series. Check the height on each listing, because two figures from the same line are visibly different sizes and do not display as a matched group.\n\nAll seven are in stock — one of the few categories with no gaps. Delivered from Dhaka within 48 hours, cash on delivery available.",
  },
  "action-figures/attack-on-titan": {
    parentSlug: "action-figures",
    subSlug: "attack-on-titan",
    apiSubSlugs: ["attack-on-titan"],
    title: "Attack on Titan Figures in Bangladesh | Kawaii Subete",
    description: "Shop authentic  at Kawaii Subete. Shipped from our Dhaka warehouse across Bangladesh within 24-48 hours with cash on delivery.",
    h1: "",
    introText: "Seven Attack on Titan figures, ৳400 to ৳5,500 — the widest price spread in the shop, because it spans two completely different products.\n\nAt the top: the 29cm Eren Yeager Attack Titan at ৳5,500. This is the largest single figure we stock and the most expensive. It is a shelf piece that needs clearance above and beside it, and it is not a first purchase.\n\nBelow it, the PalVerse Mini Action Figure series at ৳400 — Erwin Smith, Levi Ackerman, Armin Arlert, Mikasa Ackerman and Eren in Titan form. Small, chibi, designed as a set. The Levi and Mikasa figures are the ones that move.\n\nThe gap between ৳400 and ৳5,500 in one category is worth understanding before you browse: nothing in between exists. You are either buying a small collectible or a large display piece.\n\nTwo are currently out of stock, including the large Eren more often than not. Delivered from Dhaka within 48 hours across Bangladesh.",
  },
  "action-figures/kuroko-s-basketball": {
    parentSlug: "action-figures",
    subSlug: "kuroko-s-basketball",
    apiSubSlugs: ["kuroko-s-basketball"],
    title: "Kuroko's Basketball Figures BD",
    description: "Shop authentic  at Kawaii Subete. Shipped from our Dhaka warehouse across Bangladesh within 24-48 hours with cash on delivery.",
    h1: "",
    introText: "Six Kuroko's Basketball chibi figures, all 10cm, all ৳400. This is the most uniform category in the shop — one price, one scale, one line.\n\nThe full Generation of Miracles is here: Kuroko, Aomine, Kise, Akashi, Murasakibara and Kagami. Six characters, six figures, complete set. At ৳400 each, buying all six is ৳2,400 and gets you the entire lineup — which is the way this range is meant to be bought.\n\nAt 10cm they are larger than the Haikyuu chibis and smaller than the standard collector scale, which puts them in a useful middle ground: enough presence to sit alone on a desk, small enough that six fit on one shelf.\n\nKuroko's Basketball is an older series with a settled collector base. Prices here have not moved much, and nothing in the range is scarce — which means no urgency and no inflation. Buy when you want them.\n\nAll six in stock. Shipped from Dhaka within 48 hours, cash on delivery across Bangladesh.",
  },
  "action-figures/spy-x-family": {
    parentSlug: "action-figures",
    subSlug: "spy-x-family",
    apiSubSlugs: ["spy-x-family"],
    title: "Spy × Family Figures in Bangladesh | Kawaii Subete",
    description: "Shop authentic  at Kawaii Subete. Shipped from our Dhaka warehouse across Bangladesh within 24-48 hours with cash on delivery.",
    h1: "",
    introText: "Four Spy × Family figures, ৳750 to ৳1,200, and the range is essentially an Anya Forger collection with one exception.\n\nThree of the four are Anya: the Look Up Series version, a Statue of Liberty pose, and a cute sitting style. Each is a different treatment of the same character rather than a different character, which is unusual and either appealing or frustrating depending on what you want.\n\nThe fourth is the Anya & Yor Forger two-figure piece at ৳1,200 — mother and daughter together, and the only item in this category that gives you two characters. It is also the best value per figure.\n\nIf you are buying for a child, Anya is the obvious pick and the sitting style at the lower end is the safest choice. If you are collecting, the two-figure piece is the one that holds up.\n\nTwo of the four are out of stock at any time, usually the Yor pairing. Delivered from Dhaka within 48 hours, cash on delivery available.",
  },
  "action-figures/my-hero-academia": {
    parentSlug: "action-figures",
    subSlug: "my-hero-academia",
    apiSubSlugs: ["my-hero-academia"],
    title: "My Hero Academia Figures in Bangladesh | Kawaii Subete",
    description: "Shop authentic  at Kawaii Subete. Shipped from our Dhaka warehouse across Bangladesh within 24-48 hours with cash on delivery.",
    h1: "",
    introText: "Four My Hero Academia Katazun figures, ৳250 to ৳300 — the cheapest action figures in the shop.\n\nThe lineup is the core four: Izuku Midoriya (Deku), Katsuki Bakugo, Shoto Todoroki and Ochaco Uraraka. Small chibi builds, designed to sit together as a class lineup.\n\nAt ৳250–300 this is the lowest-risk way to start a figure collection, or to buy for someone whose taste in anime you are not certain about. Four characters costs under ৳1,200 and covers the main cast.\n\nThe trade-off at this price is size and detail — these are small and the paintwork is simple compared to the ৳800+ range. That is not a defect, it is what ৳250 buys. Set expectations accordingly and they are good value.\n\nMy Hero Academia is one of the longer-running shonen licences with a broad, younger fanbase, which is why this price point exists at all.\n\nAll four in stock. Shipped from Dhaka within 48 hours, cash on delivery across Bangladesh.",
  },
  "action-figures/doraemon": {
    parentSlug: "action-figures",
    subSlug: "doraemon",
    apiSubSlugs: ["doraemon"],
    title: "Doraemon Figures in Bangladesh | Kawaii Subete",
    description: "Shop authentic  at Kawaii Subete. Shipped from our Dhaka warehouse across Bangladesh within 24-48 hours with cash on delivery.",
    h1: "",
    introText: "One Doraemon item: a Doraemon × Sanrio crossover blind box collection at ৳500.\n\nThis is a blind box rather than a specified figure — you buy a box and receive one of the crossover designs at random. That format is either the appeal or the problem depending on the buyer: collectors enjoy the uncertainty, gift buyers usually do not.\n\nThe crossover pairs Doraemon characters with Sanrio styling, which is a genuine novelty rather than a repaint. It works as a small gift, a desk object, or an entry point for someone who likes both franchises.\n\nWe carry one SKU in this category because the licence is narrow in Bangladesh and we would rather stock a single good item than a shelf of filler. If Doraemon sells through, we will expand the range.\n\nIn stock now. Delivered from Dhaka within 48 hours, cash on delivery available across Bangladesh.",
  },
  "action-figures/shinchan": {
    parentSlug: "action-figures",
    subSlug: "shinchan",
    apiSubSlugs: ["shinchan"],
    title: "Shinchan Figures in Bangladesh | Kawaii Subete",
    description: "Shop authentic  at Kawaii Subete. Shipped from our Dhaka warehouse across Bangladesh within 24-48 hours with cash on delivery.",
    h1: "",
    introText: "One Shinchan item: an animal costume blind box mini figure collection at ৳300.\n\nBlind box format — you receive one design at random from the animal costume series. Shinchan in a panda, a cat, a bear and similar outfits, small enough to sit on a monitor stand.\n\nAt ৳300 this is the cheapest way to buy a Shinchan collectible, and the blind box format suits the character: the joke is in the surprise, not the specific figure.\n\nWe carry one SKU here for the same reason as Doraemon — the licence is thin in Bangladesh and a single well-chosen item beats a shelf of duplicates. If it sells through, the range expands.\n\nIn stock. Shipped from Dhaka within 48 hours, cash on delivery across Bangladesh.",
  },
  "action-figures/frieren-beyond-journey-s-end": {
    parentSlug: "action-figures",
    subSlug: "frieren-beyond-journey-s-end",
    apiSubSlugs: ["frieren-beyond-journey-s-end"],
    title: "Frieren Figures in Bangladesh | Kawaii Subete",
    description: "Shop authentic  at Kawaii Subete. Shipped from our Dhaka warehouse across Bangladesh within 24-48 hours with cash on delivery.",
    h1: "",
    introText: "One Frieren figure: the Reading Book Version at ৳900, and it is the best single figure in our mid-range.\n\nFrieren seated with a book, in the pose that has become the defining image of the series. The appeal is the stillness — most figures in this price band are in action poses, and this one is deliberately quiet. It sits on a desk and looks like an object rather than merchandise, which is why it sells to people who have not watched the anime.\n\nAt ৳900 it sits above the chibi range and below the display pieces. Good paintwork, stable base, no assembly.\n\nWe stock one SKU because Frieren is a recent licence in Bangladesh and the collector base is still forming. This is the figure to buy if you want to be early rather than to complete a set.\n\nIn stock. Delivered from Dhaka within 48 hours, cash on delivery available.",
  },
  "character-bricks/disney": {
    parentSlug: "character-bricks",
    subSlug: "disney",
    apiSubSlugs: ["disney"],
    title: "Disney Building Blocks in Bangladesh | Kawaii Subete",
    description: "17 Disney character brick figures from ৳200 — Mickey, Minnie, Donald, Ariel and Rapunzel. Delivered from Dhaka across Bangladesh in 48 hours.",
    h1: "",
    introText: "Seventeen Disney character brick figures, ৳200 to ৳450, which makes this one of the most consistent value categories in the shop.\n\nThe classic group is the core: Mickey, Minnie, Donald, Daisy Duck and Scrooge McDuck all at ৳200. Tom and Jerry join them at the same price, technically Warner rather than Disney but filed here because they sell to the same buyer. Winnie the Pooh sits alongside. These are 100–200 piece builds, roughly 40 minutes each, designed to sit together — the proportions match across the set in a way that brick figures from different manufacturers usually do not.\n\nThe princess line runs higher, up to ৳450: Ariel and Rapunzel specifically, with more detailed builds and larger finished pieces. The extra cost is in the piece count and the printed details rather than the size.\n\nPractically, these are the safest gift purchase in the entire shop. Disney crosses generations in a way that anime does not — a grandparent can buy a Mickey brick figure for a teenager and get it right. At ৳200, buying three is a reasonable decision rather than a commitment.\n\nAll 17 in stock. Shipped from Dhaka within 48 hours.",
  },
  "character-bricks/sanrio": {
    parentSlug: "character-bricks",
    subSlug: "sanrio",
    apiSubSlugs: ["sanrio"],
    title: "Sanrio Building Blocks in Bangladesh | Kawaii Subete",
    description: "12 Sanrio character brick sets and buildings from ৳200. Hello Kitty and friends, delivered from Dhaka across Bangladesh in 48 hours.",
    h1: "",
    introText: "Twelve Sanrio character brick sets, ৳200 to ৳450, covering the characters that actually sell in Bangladesh.\n\nHello Kitty, My Melody, Kuromi and Cinnamoroll lead the range, with multiple versions of the most popular ones — My Melody appears twice, Kuromi has a separate magic-house build in the building category. A pink cat design rounds out the set for buyers who like the aesthetic without a specific character attachment.\n\nPrice sits at ৳200 for most of the range, rising to ৳450 for the larger builds. At this level the decision is mostly about which character, not which price — the difference between one and another is ৳50 in most cases.\n\nSanrio buyers are the most consistent repeat customers we have in the character brick category. People buy one, then come back for the rest of the set. If you are starting out, buy two rather than one — a single character brick figure looks like an unfinished purchase.\n\nAll twelve in stock. Restocked regularly. Delivered from Dhaka within 48 hours, cash on delivery across Bangladesh.",
  },
  "character-bricks/superhero": {
    parentSlug: "character-bricks",
    subSlug: "superhero",
    apiSubSlugs: ["superhero"],
    title: "Marvel & DC Brick Figures in Bangladesh | Kawaii Subete",
    description: "Shop authentic  at Kawaii Subete. Shipped from our Dhaka warehouse across Bangladesh within 24-48 hours with cash on delivery.",
    h1: "",
    introText: "Five superhero brick figures, all ৳200: Batman, Spider-Man, Iron Man, Deadpool and Venom.\n\nThree Marvel, one DC, one that sits on both sides depending on who you ask. All the same format — small brick-built figures, 100–200 pieces, roughly 40 minutes each, designed to stand on a desk.\n\nThe brick-figure format suits superheroes better than you would expect. The blocky silhouette is closer to comic-book proportions than it is to realistic human anatomy, so the characters read correctly without needing detail that bricks cannot deliver. Venom and Deadpool in particular work well — the mask shapes survive the translation.\n\nAt ৳200 each, this is the cheapest way to buy a licensed character build, and buying all five costs ৳1,000. They display well as a group, which is how most people buy them.\n\nAll five in stock. Shipped from Dhaka within 48 hours, cash on delivery available across Bangladesh.",
  },
  "character-bricks/anime-character-figures": {
    parentSlug: "character-bricks",
    subSlug: "anime-character-figures",
    apiSubSlugs: ["anime", "anime-character-figures"],
    title: "Anime Character Brick Figures in Bangladesh | Kawaii Subete",
    description: "Shop authentic anime character brick figures at Kawaii Subete. Shipped from our Dhaka warehouse across Bangladesh within 24-48 hours with cash on delivery.",
    h1: "Anime Character Brick Figures",
    introText: "Thirty-nine anime character brick figures, all at ৳200, covering six series.\n\nOne Piece dominates with 20 characters — Luffy, Zoro, Boa Hancock, Trafalgar Law, Shanks, Sabo, Portgas D. Ace and the rest of the roster. Demon Slayer adds six, Naruto four, Dragon Ball three, and Pokémon six in brick form including Charizard, Bulbasaur, Snorlax, Gengar and Pikachu.\n\nEvery one is ৳200, which is the point: these are designed to be collected in groups rather than bought individually. A One Piece crew lineup, a Pokémon team, a Demon Slayer squad — the format rewards buying five or six at once, and at this price that is ৳1,000–1,200 rather than a decision.\n\nBuild time is short. Most are under an hour, roughly 100–200 pieces, and the finished figures are desk-sized rather than shelf-sized. They work well lined up along a monitor stand.\n\nThese are collector display pieces, not toys for small children — several have small parts.\n\nAll 39 in stock. Delivered from Dhaka within 48 hours, cash on delivery across Bangladesh.",
  },
  "building-bricks/shops": {
    parentSlug: "building-bricks",
    subSlug: "shops",
    apiSubSlugs: ["shops"],
    title: "Mini Shop & Street Cart Building Sets | Kawaii Subete",
    description: "Shop authentic  at Kawaii Subete. Shipped from our Dhaka warehouse across Bangladesh within 24-48 hours with cash on delivery.",
    h1: "",
    introText: "Forty mini shop and street cart sets, ৳250 to ৳350, and the single largest theme within our brick range.\n\nThe sets cover a street's worth of small businesses. Food and drink: a pizzeria, a seafood market, a coffee shop, a convenience store, a ramen stall, a momo cart, a takoyaki cart, an ice cream shop, a popcorn shop, a candy shop, a juice store, a BBQ cart, a lemon tea cart. Retail: a flower boutique in four colourways, a book store, a pet shop, a clock shop, a photo studio, a balloon shop, a fruit stand. Plus the Dream Store series — a cake shop, a coffee shop, a milk tea shop, a burger shop, a fried chicken shop.\n\nEach is a compact build — an evening's work, 150–300 pieces — and each comes with the fittings that make it read as a real place rather than a box: signage, counters, awnings, produce.\n\nThe reason to buy more than one is that they are designed to sit together. Two carts and a shop on one shelf looks like a street. One on its own looks like a model. Most people start with the coffee shop and add from there.\n\nSix of the 40 are out of stock at any time. Ships from Dhaka within 48 hours, cash on delivery across Bangladesh.",
  },
  "building-bricks/windmill": {
    parentSlug: "building-bricks",
    subSlug: "windmill",
    apiSubSlugs: ["windmill"],
    title: "Windmill Cottage Building Sets BD",
    description: "Shop authentic  at Kawaii Subete. Shipped from our Dhaka warehouse across Bangladesh within 24-48 hours with cash on delivery.",
    h1: "",
    introText: "Ten windmill and cottage builds, all ৳350, in two distinct styles.\n\nThe Windmill Cottage series comes in four colours — yellow, blue, purple and red — with the classic architecture-house silhouette: pitched roof, working windmill sails, open interior. These are the ones people buy in pairs, because the colour variants display well side by side as a village.\n\nThe Windmill House series is the other six: a light tower, a Christmas house, and four more in the same scale. The Christmas build is the seasonal seller and the one that goes out of stock first.\n\nAt ৳350 with a modest piece count, these sit in the middle of the brick range — more involved than a ৳250 cart, less involved than a ৳900 treehouse. An evening's build, roughly.\n\nThree are out of stock at any given time, usually the seasonal ones. Delivered from Dhaka within 48 hours, cash on delivery across Bangladesh.",
  },
  "building-bricks/sanrio-buildings": {
    parentSlug: "building-bricks",
    subSlug: "sanrio-buildings",
    apiSubSlugs: ["sanrio-buildings-", "sanrio-buildings"],
    title: "Sanrio Building Sets in Bangladesh | Kawaii Subete",
    description: "Shop authentic sanrio building sets at Kawaii Subete. Shipped from our Dhaka warehouse across Bangladesh within 24-48 hours with cash on delivery.",
    h1: "Sanrio Building Sets",
    introText: "Six Sanrio-style miniature buildings, all ৳450, built to the same scale so they display as a village.\n\nThe set runs: Kuromi Magic House, Pochacco Ice Cream House, Strawberry House, Candy House, Milk Shop and Flower Shop. Each is a small building with an open front, fitted interior and character detailing — around 300 pieces on average, an evening's build.\n\nWhat makes this range worth buying as a group is the consistent footprint. They are designed to sit in a row, share a base height, and use the same colour palette, so six of them on one shelf reads as a street rather than six unrelated models. Most people buy two or three to start.\n\nAt ৳450 they sit above the standard shop sets and below the treehouses. The extra cost over a ৳300 shop goes into interior fittings and character pieces rather than size.\n\nOne is currently out of stock, usually the Kuromi house. Delivered from Dhaka within 48 hours, cash on delivery available.",
  },
  "building-bricks/treehouse": {
    parentSlug: "building-bricks",
    subSlug: "treehouse",
    apiSubSlugs: ["treehouse"],
    title: "Sakura Treehouse Building Sets BD",
    description: "Shop authentic  at Kawaii Subete. Shipped from our Dhaka warehouse across Bangladesh within 24-48 hours with cash on delivery.",
    h1: "",
    introText: "Four sakura treehouse sets, all ৳900, in orange, white, blue and pink. This is the top of our standard brick range before the premium tier.\n\nEach is a large build — several hundred pieces, a full evening or two — with a flowering canopy, a multi-level treehouse structure and interior detail. The sakura blossoms are the defining feature: hundreds of small pink or coloured pieces built up into a canopy, which is the part that takes the time and the part that makes the finished model worth displaying.\n\nAt ৳900 these are the most expensive items in the building bricks category, and they are the ones people buy when they have already built through the smaller sets and want something that takes longer.\n\nThe four colourways display well together, but most buyers take one. Orange sells first.\n\nAll four are in stock, which is unusual for a set at this price. Delivered from Dhaka within 48 hours, cash on delivery across Bangladesh.",
  },
  "building-bricks/flower-house": {
    parentSlug: "building-bricks",
    subSlug: "flower-house",
    apiSubSlugs: ["flower-house"],
    title: "Flower Shop Building Sets BD",
    description: "Shop authentic  at Kawaii Subete. Shipped from our Dhaka warehouse across Bangladesh within 24-48 hours with cash on delivery.",
    h1: "",
    introText: "Four flower shop builds, all ৳250 — the smallest and cheapest buildings we stock.\n\nEach is a miniature florist: display frontage, buckets of flowers, an awning, interior shelving. Around 150–200 pieces, so roughly an hour's build. They are the easiest entry point into the building range, and at ৳250 the lowest-risk way to find out whether you enjoy this kind of set.\n\nFour variants exist, differing mainly in frontage colour and flower arrangement rather than structure. That is deliberate — they are designed to be bought as a pair or set and lined up as a small shopping street alongside the coffee shop and the bakery.\n\nIf you are buying for a child old enough to follow instructions, this is the set we usually recommend first: small enough to finish in one sitting, cheap enough that a mistake is not expensive, and detailed enough to feel like a real model rather than a toy.\n\nAll four in stock. Delivered from Dhaka within 48 hours, cash on delivery available.",
  },
  "cards-stickers/wanted-posters": {
    parentSlug: "cards-stickers",
    subSlug: "wanted-posters",
    apiSubSlugs: ["wanted-posters"],
    title: "One Piece Wanted Posters BD",
    description: "33 One Piece wanted posters at ৳70 each. Bounty poster sets for walls, dorms and desks. Delivered from Dhaka across Bangladesh in 48 hours.",
    h1: "",
    introText: "Thirty-three One Piece wanted poster designs, ৳70 each, and they account for more of our paper sales than everything else combined.\n\nThe format is the one from the anime: aged parchment look, character portrait, bounty amount printed in the classic typeface. Sizes are consistent across the range, which matters if you are buying several — they line up on a wall without looking mismatched.\n\nThe roster runs deep. Luffy, Zoro and Sanji in multiple versions, plus Katakuri, Marco, Sabo and a long tail of supporting characters. Being able to buy a supporting character's poster rather than only the leads is the reason collectors keep coming back.\n\nAt ৳70 the economics are simple. Four posters is ৳280. Six is ৳420. The usual purchase is five or six, because a wall with two posters on it looks like you ran out of money halfway. If you are decorating a dorm room or a bedroom wall, buy six and plan the layout first.\n\nAll 33 in stock. Shipped flat from Dhaka within 48 hours, cash on delivery across Bangladesh.",
  },
  "cards-stickers/cards": {
    parentSlug: "cards-stickers",
    subSlug: "cards",
    apiSubSlugs: ["cards"],
    title: "Anime Trading Cards in Bangladesh | Kawaii Subete",
    description: "Shop authentic  at Kawaii Subete. Shipped from our Dhaka warehouse across Bangladesh within 24-48 hours with cash on delivery.",
    h1: "",
    introText: "Twenty-five LOMO card boxes, ৳300 to ৳500, each containing 96 cards.\n\nThe series list covers what actually sells in Bangladesh: One Piece (two versions, including a wanted-poster edition), Demon Slayer, Naruto, Solo Leveling, Spy × Family, Jujutsu Kaisen and more. Every box is the same format — 96 cards, mixed character set, no duplicates within a box.\n\nThese are LOMO-style collectibles rather than official trading-card-game product. That matters: do not expect tournament-legal cards or a rulebook. What you get is a large, well-printed set to sort through, trade with friends, or display. For most buyers that is the point anyway.\n\nAt ৳300–500 for 96 cards, the per-card cost is roughly ৳3–5. That makes a box a much cheaper way to get a lot of character art than buying individual posters.\n\nNine of the 25 are out of stock at any given time, usually the One Piece and Demon Slayer boxes. Restocks clear quickly. Delivered from Dhaka within 48 hours.",
  },
  "cards-stickers/stickers": {
    parentSlug: "cards-stickers",
    subSlug: "stickers",
    apiSubSlugs: ["stickers"],
    title: "Anime Stickers in Bangladesh | Kawaii Subete",
    description: "Shop authentic  at Kawaii Subete. Shipped from our Dhaka warehouse across Bangladesh within 24-48 hours with cash on delivery.",
    h1: "",
    introText: "Eight sticker products, all ৳200, in two formats.\n\nThe mixed packs are the main line — 50 waterproof decorative stickers per pack, covering a spread of anime characters rather than a single series. Waterproof matters more than it sounds: these survive on a laptop lid, a water bottle, a phone case or a scooter panel, which is where most of them end up. Non-waterproof stickers lift at the edges within weeks.\n\nThe character-specific sheets are the other format — Jujutsu Kaisen with Gojo, Yuji, Sukuna and Megumi; Spy × Family with Anya, Loid and Yor. Fewer stickers, but all from one series, which is what you want if you are decorating around a single show.\n\nAt ৳200 for 50 stickers, this is the cheapest way to personalise something you already own.\n\nSix of the eight are out of stock right now — the most depleted category in the shop. Restocked monthly. Shipped flat from Dhaka within 48 hours, cash on delivery available.",
  },
  "flower-bricks/single-stalk-flower": {
    parentSlug: "flower-bricks",
    subSlug: "single-stalk-flower",
    apiSubSlugs: ["single-stalk-flower"],
    title: "Single Stem Flower Building Sets | Kawaii Subete",
    description: "Shop authentic  at Kawaii Subete. Shipped from our Dhaka warehouse across Bangladesh within 24-48 hours with cash on delivery.",
    h1: "",
    introText: "Ten single-stem flower builds, all ৳200 — the entry point into the botanical range.\n\nThe lineup: blue datura, water lily, tulip, daisy, purple lotus, sunflower and four more, each in the 260- series. Roughly 60–100 pieces per stem, so 20–30 minutes each. Small, quick, and designed to be bought in multiples rather than individually.\n\nThat is the point of this category. One stem on a desk looks sparse. Five stems in a small vase — the standard way people buy them — reads as a real arrangement from a metre away. At ৳200 each, five costs ৳1,000 and gives you something that genuinely looks like flowers.\n\nThey also work as filler alongside the larger potted and basket sets, which are built at a different scale. Mixing two or three stems into a ৳400 basket arrangement is how most of our repeat buyers use them.\n\nAll ten in stock. Delivered from Dhaka within 48 hours, cash on delivery across Bangladesh.",
  },
  "flower-bricks/flower-camera": {
    parentSlug: "flower-bricks",
    subSlug: "flower-camera",
    apiSubSlugs: ["flower-camera"],
    title: "Flower Camera in Bangladesh | Kawaii Subete",
    description: "Shop authentic  at Kawaii Subete. Shipped from our Dhaka warehouse across Bangladesh within 24-48 hours with cash on delivery.",
    h1: "",
    introText: "Nine camera builds, ৳250 to ৳450, and this is the most photographed set we sell.\n\nThe concept is a retro camera built from the same botanical piece system — the body in brick, the lens in brick, and floral elements worked into the casing. There is a trend camera, a vintage camera, a dual-lens model, and colour variants in grey, brown and black.\n\nIt works because it is unexpected. Nobody expects a camera made of flower-building pieces, and the finished object reads as a decorative item rather than a model kit. Several customers buy one purely as a desk object and never build the flower sets it came from.\n\nBuild difficulty is moderate — 200–400 pieces, an evening. The dual-lens version is the most involved and the most rewarding.\n\nAt ৳250–450 this is mid-range for the shop and unusually good value given the piece count.\n\nAll nine in stock. Delivered from Dhaka within 48 hours, cash on delivery available across Bangladesh.",
  },
  "flower-bricks/flower-with-cover": {
    parentSlug: "flower-bricks",
    subSlug: "flower-with-cover",
    apiSubSlugs: ["flower-with-cover"],
    title: "Covered Flower Arrangement Sets | Kawaii Subete",
    description: "Shop authentic  at Kawaii Subete. Shipped from our Dhaka warehouse across Bangladesh within 24-48 hours with cash on delivery.",
    h1: "",
    introText: "Nine covered flower display sets, all ৳550 — floral arrangements built inside a glass-style dome or case.\n\nThe range includes a red rose, a blue rose, a purple fantasy flower, a mixed garden, an ice snow queen and a dream beauty model. Each is a floral centrepiece enclosed in a transparent cover, which changes the object completely: it becomes a display piece rather than a plant, and it does not collect dust.\n\nThat is the practical appeal. An open brick bouquet looks good but needs cleaning. A covered one sits on a shelf indefinitely.\n\nAt ৳550 these are the upper end of the standard flower range. Piece counts run higher than the open arrangements because the cover and base add structure, so expect a longer build — a full evening for most.\n\nNine in stock. Delivered from Dhaka within 48 hours, cash on delivery across Bangladesh.",
  },
  "flower-bricks/flower-pot": {
    parentSlug: "flower-bricks",
    subSlug: "flower-pot",
    apiSubSlugs: ["flower-pot"],
    title: "Flower Pot in Bangladesh | Kawaii Subete",
    description: "Shop authentic  at Kawaii Subete. Shipped from our Dhaka warehouse across Bangladesh within 24-48 hours with cash on delivery.",
    h1: "",
    introText: "Eight potted flower builds, all ৳350, in the classic pot-and-stem format.\n\nThe lineup covers orchid (three versions — standard, wedding, and a white variant), white daisy, tulip, sunflower and a pink-and-purple hydrangea. Each is a flower head on a stem, rooted in a brick pot with visible soil detail.\n\nAt ৳350 these sit between the ৳200 single stems and the ৳550 covered arrangements. The pot is what you are paying for over a single stem — it makes the object self-contained, so it stands on a desk without a vase or holder.\n\nBuild time runs an hour to ninety minutes. The orchid is the most involved and the one people photograph.\n\nMost buyers take two or three and group them, since a single pot looks lonely on a shelf. The scale is consistent across the range, so mixing works.\n\nAll eight in stock. Shipped from Dhaka within 48 hours, cash on delivery available.",
  },
  "flower-bricks/flower-basket": {
    parentSlug: "flower-bricks",
    subSlug: "flower-basket",
    apiSubSlugs: ["flower-basket"],
    title: "Flower Basket in Bangladesh | Kawaii Subete",
    description: "Shop authentic  at Kawaii Subete. Shipped from our Dhaka warehouse across Bangladesh within 24-48 hours with cash on delivery.",
    h1: "",
    introText: "Seven flower basket arrangements, all ৳400 — the largest format in the standard floral range.\n\nRed rose, cream, pink, pastel, green leaf, purple blossom and one fantasy arrangement. Each is a woven-style basket built in brick, filled with a mixed arrangement rather than a single species. The result is denser and more colourful than the potted sets, and it reads as a gift object rather than a desk ornament.\n\nAt ৳400 with a higher piece count, this is a full evening's build. The basket itself takes a third of the time — it is a repetitive weave that holds the whole structure together.\n\nThese are the set we sell most often as a gift, particularly the red rose version. They arrive looking like something that cost more than ৳400.\n\nAll seven in stock. Delivered from Dhaka within 48 hours, cash on delivery across Bangladesh.",
  },
  "animal-bricks/bird-bricks": {
    parentSlug: "animal-bricks",
    subSlug: "bird-bricks",
    apiSubSlugs: ["bird-bricks"],
    title: "Bird Building Block Sets BD",
    description: "Shop authentic  at Kawaii Subete. Shipped from our Dhaka warehouse across Bangladesh within 24-48 hours with cash on delivery.",
    h1: "",
    introText: "Fourteen parrot perch builds, ৳250 to ৳350, and it is the largest single theme in the animal range.\n\nThe parrot perching sets are the core — six colourways of the same design at ৳250, a parrot on a branch with a perch base. Adding colour variants of one design is unusual for us, but it works here: people buy two or three and display them as a small flock.\n\nThe remaining sets run higher at ৳350 with more elaborate perches and backgrounds.\n\nAt ৳250 this is the cheapest animal brick set we sell, and the one most often bought as a first brick build. Around 150 pieces, roughly an hour, no complex techniques.\n\nThe appeal is straightforward: a bird on a branch is a clean, recognisable object that sits on a desk without needing a stand. It photographs well, which is why this range gets shared more than most.\n\nAll fourteen in stock. Delivered from Dhaka within 48 hours, cash on delivery available.",
  },
  "animal-bricks/panda-bricks": {
    parentSlug: "animal-bricks",
    subSlug: "panda-bricks",
    apiSubSlugs: ["panda-bricks"],
    title: "Panda Building Block Sets BD",
    description: "Shop authentic  at Kawaii Subete. Shipped from our Dhaka warehouse across Bangladesh within 24-48 hours with cash on delivery.",
    h1: "",
    introText: "Five panda builds, ৳200 to ৳400, in two sizes across five SKUs.\n\nThe panda is the simplest animal silhouette in the brick format, which is why it works so well — a black-and-white body, round head, dark ears. There is very little that can go wrong, and nothing does. These are clean builds that look correct at any distance.\n\nThe ৳200 versions are the small desk size, roughly 100 pieces, 40 minutes. The ৳400 versions are larger with more detail in the face and paws.\n\nAll five use the same design language, so they group well — a row of pandas in different sizes on one shelf reads as intentional rather than mismatched.\n\nOne is currently out of stock. Delivered from Dhaka within 48 hours, cash on delivery across Bangladesh.",
  },
  "animal-bricks/dog-bricks": {
    parentSlug: "animal-bricks",
    subSlug: "dog-bricks",
    apiSubSlugs: ["dog-bricks"],
    title: "Dog Building Block Sets BD",
    description: "Shop authentic  at Kawaii Subete. Shipped from our Dhaka warehouse across Bangladesh within 24-48 hours with cash on delivery.",
    h1: "",
    introText: "Five dog breed builds, all ৳300 — Maltese, border collie, husky, corgi and beagle.\n\nThis is the set people buy for someone who owns the real thing. The breed is identifiable at a glance: the corgi's proportions, the husky's markings, the border collie's colouring. That specificity is the whole appeal, and it is why buyers come back for a second breed after buying one.\n\nEach is roughly 200 pieces, an hour's build, desk-sized when finished. They sit at a consistent scale, so a set of five displays as a group rather than five unrelated objects.\n\nAt ৳300 they are the same price as the cat range, which means the decision is purely about which animal the recipient actually likes — no price trade-off between breeds.\n\nAll five in stock. Delivered from Dhaka within 48 hours, cash on delivery available across Bangladesh.",
  },
  "animal-bricks/cat-bricks": {
    parentSlug: "animal-bricks",
    subSlug: "cat-bricks",
    apiSubSlugs: ["cat-bricks"],
    title: "Cat Building Block Sets BD",
    description: "Shop authentic  at Kawaii Subete. Shipped from our Dhaka warehouse across Bangladesh within 24-48 hours with cash on delivery.",
    h1: "",
    introText: "Four cat breed builds, all ৳300 — munchkin, black cat, Bengal and Napoleon.\n\nThe same principle as the dog range: identifiable breeds, consistent scale, one price. The munchkin's short legs and the Bengal's markings are the details that make them recognisable rather than generic cats.\n\nRoughly 200 pieces each, an hour's build, desk-sized. They group well with the dog sets since the scale matches, so cat-and-dog households can display both without it looking odd.\n\nAt ৳300 these are the gift we recommend most often for someone whose taste you do not know well. There is no franchise to get wrong, no series to be unfamiliar with — it is a cat, built from bricks, that looks good on a desk.\n\nAll four in stock. Shipped from Dhaka within 48 hours, cash on delivery across Bangladesh.",
  },
  "animal-bricks/sealife-bricks": {
    parentSlug: "animal-bricks",
    subSlug: "sealife-bricks",
    apiSubSlugs: ["sealife-bricks"],
    title: "Sea Life Building Block Sets BD",
    description: "Shop authentic  at Kawaii Subete. Shipped from our Dhaka warehouse across Bangladesh within 24-48 hours with cash on delivery.",
    h1: "",
    introText: "Three sea life builds, all ৳250 — a crab, a blue whale and an octopus.\n\nThis is the smallest subcategory we carry, and it exists because the three designs work unusually well in the brick format. The octopus in particular: the tentacle curvature is a hard thing to build in rigid pieces, and this set solves it with articulated segments rather than approximating it.\n\nThe blue whale is the largest of the three and the most straightforward build. The crab is the most detailed, with working claw pieces.\n\nAt ৳250 each, all three together is ৳750 — the cheapest complete collection in the entire animal range. They display well as a set, which is how most people buy them.\n\nAll three in stock. Delivered from Dhaka within 48 hours, cash on delivery available.",
  },
  "vehicle/truck-bricks": {
    parentSlug: "vehicle",
    subSlug: "truck-bricks",
    apiSubSlugs: ["truck-bricks"],
    title: "Truck Building Block Sets BD",
    description: "Shop authentic  at Kawaii Subete. Shipped from our Dhaka warehouse across Bangladesh within 24-48 hours with cash on delivery.",
    h1: "",
    introText: "Twelve truck builds, all ৳350, in two themes.\n\nSix are food vehicles: a fast food truck, a coffee truck, a dessert truck, and more in the same street-food style. These are the ones that pair with our mini shop sets — a coffee shop, a coffee truck and a hot dog cart on one shelf reads as a street rather than three models.\n\nSix are floral delivery trucks — red rose, pink rose, blue hydrangea and similar — with a flower cargo section and open side panels. These exist because the flower building sets and the vehicle sets share a scale, and someone realised the combination works.\n\nAt ৳350 with roughly 250 pieces, these are a solid evening build. The wheels and chassis are the fiddly part; the body goes quickly.\n\nAll twelve in stock. Delivered from Dhaka within 48 hours, cash on delivery across Bangladesh.",
  },
  "vehicle/car-bricks": {
    parentSlug: "vehicle",
    subSlug: "car-bricks",
    apiSubSlugs: ["car-bricks"],
    title: "Car Building Block Sets BD",
    description: "Shop authentic  at Kawaii Subete. Shipped from our Dhaka warehouse across Bangladesh within 24-48 hours with cash on delivery.",
    h1: "",
    introText: "Twelve formula racing car builds, ৳250 to ৳350, in six colours.\n\nYellow, green, orange, red, blue-and-yellow, and white — all the same F1-style model in the 9215 series, differing only in livery. Buying several gives you a grid, which is what most people do: two or three cars on a shelf looks intentional, one looks unfinished.\n\nRoughly 150–200 pieces each, so an evening for one and a weekend for a set. The builds are simple but the finished objects are convincing — the wing shapes and the low profile read correctly at a glance.\n\nAt ৳250 these are the cheapest brick sets we sell with real mechanical detail, which makes them the usual first purchase for a child old enough to follow instructions, or for an adult testing whether they enjoy the hobby.\n\nSmall parts apply — check age suitability on each listing.\n\nAll twelve in stock. Shipped from Dhaka within 48 hours, cash on delivery available.",
  },
  "vehicle/ship-bricks": {
    parentSlug: "vehicle",
    subSlug: "ship-bricks",
    apiSubSlugs: ["ship-bricks"],
    title: "Pirate Ship Building Block Sets BD",
    description: "Shop authentic  at Kawaii Subete. Shipped from our Dhaka warehouse across Bangladesh within 24-48 hours with cash on delivery.",
    h1: "",
    introText: "Four pirate ship builds, all ৳300, from the Caribbean series in red, brown (two versions) and black.\n\nThese are display ships rather than play models — full hull, masts, rigging built from thin pieces, and a stand. The rigging is the part that takes the time and the part that makes the finished model.\n\nAt ৳300 with roughly 300 pieces, expect a full evening. The masts are fragile during assembly and stable once complete, which is worth knowing before you start.\n\nShips are the smallest vehicle subcategory we carry because they are the hardest to build well and the least forgiving of a rushed job. The four we stock are the ones that hold together.\n\nTwo are currently out of stock. Delivered from Dhaka within 48 hours, cash on delivery across Bangladesh.",
  },
  "accessories/keychains": {
    parentSlug: "accessories",
    subSlug: "keychains",
    apiSubSlugs: ["keychains"],
    title: "Anime Keychains in Bangladesh | Kawaii Subete",
    description: "24 anime keychains and charm accessories from ৳180 — astronaut, starry bear and Demon Slayer designs. Delivered across Bangladesh in 48 hours.",
    h1: "",
    introText: "Twenty-four keychains, ৳180 to ৳250, and the highest repeat-purchase rate of anything in the shop.\n\nTwo ranges dominate. The astronaut keychains — black and orange, black and red, blue and yellow, pink and blue, pink and red, purple — are coloured figures on a wrist strap. The starry bear range runs green, grey, purple and blue on the same strap system. Both are ৳180–250.\n\nThe wrist strap is the detail that matters. A standard keyring pulls out of a pocket at a bad angle and the figure takes the damage. The strap loops over the wrist so the figure hangs free and survives. It is a small design decision that determines whether the thing lasts a month or a year.\n\nAt ৳180–250 these are the cheapest way to add to an order, and the most common add-on at checkout.\n\nTwo are out of stock. Delivered from Dhaka in 48 hours, cash on delivery across Bangladesh.",
  },
  "accessories/bags": {
    parentSlug: "accessories",
    subSlug: "bags",
    apiSubSlugs: ["bags-bags", "bags"],
    title: "Anime Wallets & Bags in Bangladesh | Kawaii Subete",
    description: "Shop authentic anime wallets & bags at Kawaii Subete. Shipped from our Dhaka warehouse across Bangladesh within 24-48 hours with cash on delivery.",
    h1: "Anime Wallets & Bags",
    introText: "Seven compact cat-design faux leather wallets, all ৳250, in six colours — dark pink, dark green, blue, pink, lilac and black.\n\nThese are small pocket wallets rather than full-size bags: card slots, a note compartment, a zip coin section, and an embossed cat face on the front. Faux leather, stitched edges, small enough to fit a jeans pocket or a small handbag.\n\nThe six colourways exist because this is a gift item, and colour is how people choose. If you are buying for someone else, pink and lilac move fastest; black and dark green are the ones people buy for themselves.\n\nAt ৳250 this is the cheapest practical item we sell — everything else in the accessories category is decorative. That is why it converts: it is useful as well as characterful, and it does not require the recipient to be an anime fan.\n\nOne colour is currently out of stock. Delivered from Dhaka within 48 hours, cash on delivery available.",
  },
  "accessories/bracelets": {
    parentSlug: "accessories",
    subSlug: "bracelets",
    apiSubSlugs: ["bracelets"],
    title: "Demon Slayer Charm Bracelets BD",
    description: "Shop authentic  at Kawaii Subete. Shipped from our Dhaka warehouse across Bangladesh within 24-48 hours with cash on delivery.",
    h1: "",
    introText: "Two Demon Slayer charm bracelets, both ৳700 — Tanjiro Kamado and Zenitsu Agatsuma.\n\nThese are proper charm bracelets rather than keychains: a chain with character-specific charms, designed to be worn. The Tanjiro version uses his water-breathing motifs and hanafuda earring shape; the Zenitsu version uses the yellow-and-white triangle pattern from his haori.\n\nAt ৳700 each they are the most expensive accessories we stock, and the price reflects the metalwork rather than the branding. They are the only genuinely wearable item in the category — everything else is a bag charm or a keyring.\n\nThey sell as pairs more often than singly. Two people buying together, or one person buying both characters, accounts for most of the volume.\n\nBoth in stock. Delivered from Dhaka within 48 hours, cash on delivery across Bangladesh.",
  },
};

export function getSubcategorySeo(parentSlug: string, subSlug: string): SubcategorySeoItem {
  const normParent = CATEGORY_ALIAS_MAP[parentSlug] || parentSlug;
  const normSub = CATEGORY_ALIAS_MAP[subSlug] || subSlug;
  const key = `${normParent}/${normSub}`;
  if (SUBCATEGORY_SEO_MAP[key]) {
    return SUBCATEGORY_SEO_MAP[key];
  }
  // Also try raw subSlug in case key matches
  const rawKey = `${normParent}/${subSlug}`;
  if (SUBCATEGORY_SEO_MAP[rawKey]) {
    return SUBCATEGORY_SEO_MAP[rawKey];
  }
  const cleanSub = normSub
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    parentSlug: normParent,
    subSlug: normSub,
    apiSubSlugs: [normSub, subSlug],
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
    "Browse all 535 anime figures, brick sets and collectibles at Kawaii Subete. Prices from ৳70 with delivery across Bangladesh. Ships from Dhaka in 48 hours.",
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
  const stockNum = Number(product.stock ?? 1);
  const isInStock = stockNum > 0;
  
  // Section 5.2 Availability logic:
  // stock > 0 => InStock
  // stock === 0 => PreOrder (never InStock)
  const isPreOrderDisallowed = product.preOrderEnabled === false || (product as any).allow_preorder === false;
  const availability = isInStock
    ? "https://schema.org/InStock"
    : isPreOrderDisallowed
    ? "https://schema.org/OutOfStock"
    : "https://schema.org/PreOrder";

  // Section 5.4: priceValidUntil (today + 1 year)
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  const priceValidUntil = nextYear.toISOString().split("T")[0];

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
          availability: availability,
          itemCondition: "https://schema.org/NewCondition",
          priceValidUntil: priceValidUntil,
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
        numberOfItems: itemElements.length,
        itemListElement: itemElements,
      },
    ],
  };
}

export function buildBlogPostJsonLd(
  post: {
    slug: string;
    title: string;
    excerpt?: string | null;
    publishedAt?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    featuredImage?: string | null;
  },
  seo: { title: string; description: string }
) {
  const publishedDate = post.publishedAt || post.createdAt || "2026-10-01T00:00:00+06:00";
  const modifiedDate = post.updatedAt || publishedDate;
  const imageUrl = post.featuredImage
    ? (post.featuredImage.startsWith("http")
        ? post.featuredImage
        : `${SITE_URL}${post.featuredImage.startsWith("/") ? "" : "/"}${post.featuredImage}`)
    : `${SITE_URL}/logo.png`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: (post.title || seo.title).slice(0, 110),
    description: seo.description,
    image: [imageUrl],
    datePublished: publishedDate,
    dateModified: modifiedDate,
    author: {
      "@type": "Organization",
      name: "Kawaii Subete",
      url: SITE_URL,
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
  };
}

export function buildContactFaqJsonLd() {
  const faqs = [
    {
      q: "How long does shipping take?",
      a: "Inside Dhaka city, deliveries are completed within 24 hours. For all other districts across Bangladesh, standard courier shipping takes 48 hours.",
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
      a: "We offer a 1-day (24-hour) hassle-free replacement if any product is received damaged or with missing parts during transit.",
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

