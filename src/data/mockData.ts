import type { Category, DeliveryCity, Product, PaymentMethod, PaymentDetail } from "@/types";

/* ------------------------------------------------------------------ */
/*  Brand & contact                                                    */
/* ------------------------------------------------------------------ */
export const STORE = {
  name: "Mercy Store",
  tagline: "Premium girls' fashion & accessories",
  phone: "0923313265",
  phoneDisplay: "0923 313 265",
  telegramHandle: "@yemaryammehret21",
  telegramUrl: "https://t.me/yemaryammehret21",
  location: "Adama, Oromia · Ethiopia",
};

export const formatETB = (value: number) =>
  `${Math.round(value).toLocaleString("en-US")}`;

/* ------------------------------------------------------------------ */
/*  Imagery                                                            */
/* ------------------------------------------------------------------ */
const B =
  "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/c878a340-f87b-48dc-aec5-662e4583493d/";

const IMG = {
  logo: "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/attachments/820e4cfb-b67b-4e0d-acfe-8a02a845cd07/1793483633955_kehulumcom-1740387324e7a880e22a.webp",
  gate: "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/attachments/820e4cfb-b67b-4e0d-acfe-8a02a845cd07/1793483801374_images.jpg",
  hero: `${B}hero-editorial-cefe54b3-1793483088214.webp`,
  campus: `${B}astu-campus-be16e033-1793483113728.webp`,
  habesha: `${B}clothing-habesha-c50dc119-1793483086430.webp`,
  gown: `${B}clothing-gown-278c2c10-1793483087170.webp`,
  hoodie: `${B}clothing-hoodie-d388a627-1793483086968.webp`,
  trench: `${B}clothing-trench-fd196638-1793483090098.webp`,
  blazer: `${B}clothing-blazer-799f8e01-1793483090260.webp`,
  silkShirt: `${B}clothing-silk-shirt-095a887f-1793483090268.webp`,
  chelsea: `${B}shoes-chelsea-4bf92d0e-1793483092482.webp`,
  sneakers: `${B}shoes-sneakers-20f29011-1793483093443.webp`,
  heels: `${B}shoes-heels-22228cbf-1793483094818.webp`,
  loafers: `${B}shoes-loafers-0f6177b2-1793483093866.webp`,
  watch: `${B}acc-watch-53ed569c-1793483094436.webp`,
  bag: `${B}acc-bag-f16d3f75-1793483097419.webp`,
  sun: `${B}acc-sunglasses-0af920b3-1793483097082.webp`,
  perfume: `${B}acc-perfume-44d77d23-1793483098937.webp`,
  wallet: `${B}acc-wallet-18d3ba58-1793483097878.webp`,
  earrings: `${B}acc-earrings-0b5ba9a0-1793483098817.webp`,
};

export const HERO_IMAGE = IMG.hero;
export const ASTU_IMAGE = IMG.campus;
export const ASTU_LOGO = IMG.logo;
export const LOGO_IMAGE = IMG.logo;
export const GATE_IMAGE = IMG.gate;

/* ------------------------------------------------------------------ */
/*  Product helpers                                                    */
/* ------------------------------------------------------------------ */
const APP = ["XS", "S", "M", "L", "XL"];
const SHOE = ["36", "37", "38", "39", "40", "41"];
const ONE = ["One size"];

let _n = 0;
const P = (
  name: string,
  category: Category,
  price: number,
  image: string,
  material: string,
  colors: string[],
  sizes: string[],
  extra: Partial<Product> = {},
): Product => ({
  id: `ms-${String(++_n).padStart(3, "0")}`,
  name,
  category,
  price,
  image,
  material,
  colors,
  sizes,
  description:
    extra.description ??
    `${name} — crafted from ${material.toLowerCase()}. A Mercy Store signature piece made for the modern woman.`,
  rating: extra.rating ?? 4.8,
  reviews: extra.reviews ?? Math.floor(20 + Math.random() * 90),
  stock: extra.stock ?? 18,
  tag: extra.tag,
  oldPrice: extra.oldPrice,
  astuPick: extra.astuPick,
});

/* ------------------------------------------------------------------ */
/*  Girls' Collection — Clothing, Shoes, Accessories               */
/* ------------------------------------------------------------------ */
export const PRODUCTS: Product[] = [
  // -------- Girls' Clothing (15) --------
  P("Habesha Noir Couture Gown", "Clothing", 12500, IMG.habesha, "Hand-woven cotton & gold tibeb", ["Ivory", "Obsidian"], APP, { tag: "Limited", rating: 5, reviews: 61, stock: 6 }),
  P("Gold-Thread Habesha Kemis", "Clothing", 9800, IMG.habesha, "Shewa cotton with gold thread", ["Ivory", "Gold"], APP, { tag: "Bestseller", astuPick: true, rating: 4.9 }),
  P("Midnight Velvet Blazer", "Clothing", 7450, IMG.blazer, "Cotton velvet", ["Obsidian", "Plum"], APP, { tag: "New" }),
  P("Camel Cashmere Trench", "Clothing", 11200, IMG.trench, "Mongolian cashmere", ["Camel", "Onyx"], APP, { rating: 4.9 }),
  P("Champagne Silk Blouse", "Clothing", 3450, IMG.silkShirt, "Mulberry silk", ["Champagne", "Ivory", "Onyx"], APP),
  P("Black & Gold Luxe Hoodie", "Clothing", 4200, IMG.hoodie, "480gsm brushed cotton", ["Obsidian", "Bone"], APP, { tag: "Sale", oldPrice: 5200, astuPick: true, rating: 4.7 }),
  P("Gilded Linen Kaftan", "Clothing", 5600, IMG.habesha, "Washed linen", ["Ivory", "Gold"], APP),
  P("Royal Emerald Evening Gown", "Clothing", 15900, IMG.gown, "Silk charmeuse", ["Emerald", "Obsidian"], APP, { tag: "Limited", rating: 5, stock: 4 }),
  P("Studio Streetwear Bomber", "Clothing", 4950, IMG.hoodie, "Technical nylon", ["Obsidian", "Sand"], APP),
  P("Osaka Oversized Tee", "Clothing", 1850, IMG.hoodie, "Heavyweight jersey", ["Bone", "Obsidian"], APP, { tag: "New", astuPick: true, rating: 4.6 }),
  P("Wax-Print Statement Top", "Clothing", 2900, IMG.silkShirt, "Cotton wax print", ["Gold", "Multi"], APP, { astuPick: true }),
  P("Nebula Techwear Jacket", "Clothing", 5900, IMG.blazer, "Water-repellent shell", ["Obsidian", "Slate"], APP, { tag: "New" }),
  P("Cashmere Overcoat", "Clothing", 14800, IMG.trench, "Double-faced cashmere", ["Obsidian", "Camel"], APP),
  P("Silk Slip Dress", "Clothing", 6800, IMG.gown, "Bias-cut silk", ["Champagne", "Onyx"], APP),
  P("Satin Wrap Dress", "Clothing", 5400, IMG.gown, "Heavy satin", ["Onyx", "Champagne"], APP),

  // -------- Shoes (11) --------
  P("Gold-Buckle Chelsea Boots", "Shoes", 8400, IMG.chelsea, "Italian suede", ["Obsidian", "Tobacco"], SHOE, { rating: 4.9 }),
  P("Ivory Designer Sneakers", "Shoes", 5600, IMG.sneakers, "Nappa leather", ["Ivory", "Gold"], SHOE, { tag: "New", astuPick: true }),
  P("Satin Stiletto Heels", "Shoes", 4800, IMG.heels, "Satin with gold heel", ["Obsidian", "Champagne"], SHOE),
  P("Onyx Runner Trainers", "Shoes", 4300, IMG.sneakers, "Engineered mesh", ["Obsidian", "Slate"], SHOE, { astuPick: true, rating: 4.7 }),
  P("Gold-Trim Platform Sandals", "Shoes", 3950, IMG.heels, "Leather with gold trim", ["Gold", "Obsidian"], SHOE, { tag: "Sale", oldPrice: 4600 }),
  P("Desert Suede Boots", "Shoes", 5100, IMG.chelsea, "Water-repellent suede", ["Sand", "Obsidian"], SHOE),
  P("Court Low Leather Kicks", "Shoes", 3600, IMG.sneakers, "Smooth leather", ["Ivory", "Obsidian"], SHOE, { astuPick: true, rating: 4.6 }),
  P("Padded Winter Boots", "Shoes", 6200, IMG.chelsea, "Shearling lined leather", ["Obsidian", "Oak"], SHOE),
  P("Champagne Ballet Flats", "Shoes", 3100, IMG.heels, "Soft nappa", ["Champagne", "Bone"], SHOE),
  P("Chrome Chunky Sneakers", "Shoes", 5200, IMG.sneakers, "Mixed leather & mesh", ["Chrome", "Ivory"], SHOE, { tag: "New" }),
  P("Hand-Stitched Juttis", "Shoes", 2700, IMG.loafers, "Embroidered leather", ["Gold", "Maroon"], SHOE),

  // -------- Accessories (16) --------
  P("24K Clad Chronograph", "Accessories", 15600, IMG.watch, "18k clad steel & sapphire", ["Gold", "Onyx"], ONE, { tag: "Bestseller", rating: 5, reviews: 74, stock: 6 }),
  P("Gold Signet Ring", "Accessories", 3450, IMG.earrings, "Solid gold vermeil", ["Gold"], ONE),
  P("Onyx Leather Crossbody", "Accessories", 6750, IMG.bag, "Pebbled Italian leather", ["Obsidian", "Gold"], ONE),
  P("Champagne Clutch", "Accessories", 4200, IMG.bag, "Satin with gold chain", ["Champagne", "Onyx"], ONE),
  P("Polarized Aviator Shades", "Accessories", 2900, IMG.sun, "Gold alloy frame", ["Gold", "Onyx"], ONE, { astuPick: true }),
  P("Filigree Pendant Necklace", "Accessories", 5300, IMG.earrings, "Hand-finished gold plate", ["Gold"], ONE),
  P("Luxury Leather Bifold", "Accessories", 1900, IMG.wallet, "Vegetable-tanned leather", ["Obsidian", "Espresso"], ONE, { astuPick: true, rating: 4.7 }),
  P("Obsidian Eau de Parfum 100ml", "Accessories", 4650, IMG.perfume, "Oud, amber & black pepper", ["100ml"], ONE, { astuPick: true }),
  P("Amber Oud Parfum 50ml", "Accessories", 5900, IMG.perfume, "Amber, oud & vanilla", ["50ml"], ONE, { tag: "Bestseller" }),
  P("Silk Twill Scarf", "Accessories", 2200, IMG.silkShirt, "Hand-rolled mulberry silk", ["Gold", "Onyx", "Ivory"], ONE),
  P("Gold Hoop Earrings", "Accessories", 3150, IMG.earrings, "18k gold vermeil", ["Gold"], ONE, { astuPick: true }),
  P("Minimalist Steel Watch", "Accessories", 11200, IMG.watch, "Brushed steel & sapphire", ["Steel", "Onyx"], ONE),
  P("Wide-Brim Felt Fedora", "Accessories", 2650, IMG.sun, "Rabbit-felt wool", ["Obsidian", "Sand"], ONE),
  P("Pearl & Gold Bracelet", "Accessories", 3800, IMG.earrings, "Freshwater pearl & vermeil", ["Gold", "Pearl"], ONE, { tag: "Sale", oldPrice: 4700 }),
  P("Obsidian Sunglasses", "Accessories", 2350, IMG.sun, "Acetate with gold arms", ["Obsidian", "Gold"], ONE, { tag: "New", astuPick: true }),
  P("Travel Vanity Case", "Accessories", 3400, IMG.bag, "Quilted leather", ["Onyx", "Champagne"], ONE),
];

/* ------------------------------------------------------------------ */
/*  Delivery                                                           */
/* ------------------------------------------------------------------ */
export const DELIVERY_CITIES: DeliveryCity[] = [
  { name: "Adama", fee: 0, eta: "Same-day", note: "Free courier within Adama town" },
  { name: "Addis Ababa", fee: 250, eta: "1–2 days" },
  { name: "Bishoftu", fee: 200, eta: "1 day" },
  { name: "Adama → ASTU Campus", fee: 0, eta: "Campus drop-point", note: "Free to ASTU dorm drop points" },
  { name: "Jimma", fee: 500, eta: "2–3 days" },
  { name: "Hawassa", fee: 450, eta: "2–3 days" },
  { name: "Bahir Dar", fee: 600, eta: "3–4 days" },
  { name: "Mekelle", fee: 700, eta: "3–5 days" },
  { name: "Dire Dawa", fee: 500, eta: "2–3 days" },
];

/* ------------------------------------------------------------------ */
/*  ASTU student portal                                                */
/* ------------------------------------------------------------------ */
export const ASTU = {
  university: "Adama Science and Technology University",
  city: "Adama",
  blocks: ["Block 1", "Block 2", "Block 3", "Block 4", "Block 5", "Block 6", "Block 7", "Block 8"],
  dropPoints: ["Library gate", "Main gate", "Engineering lobby", "Female dorm – Block 4", "Female dorm – Block 5", "Gymnasium"],
  timeSlots: ["Morning (8–12)", "Afternoon (12–16)", "Evening (16–20)"],
};

/* ------------------------------------------------------------------ */
/*  Payment methods with details                                       */
/* ------------------------------------------------------------------ */
export const PAYMENT_DETAILS: PaymentDetail[] = [
  {
    method: "Telebirr",
    description: "Ethio Telecom mobile money — instant & secure",
    instructions: "Send payment to 0923313265 via Telebirr app. Use your order ID as reference.",
    accountNumber: "0923313265",
  },
  {
    method: "CBE Birr",
    description: "Commercial Bank of Ethiopia mobile wallet",
    instructions: "Transfer via CBE Birr to 0923313265. Include order ID in remarks.",
    accountNumber: "0923313265",
  },
  {
    method: "Bank of Abyssinia",
    description: "BoA Apollo / Bank Transfer",
    instructions: "Transfer to BoA account 1000 2345 6789 (Mercy Store). Reference: order ID.",
    accountNumber: "1000 2345 6789",
  },
  {
    method: "Awash Birr",
    description: "Awash Bank mobile banking",
    instructions: "Send via Awash Birr to 0923313265. Include order ID as reference.",
    accountNumber: "0923313265",
  },
  {
    method: "Cash on Delivery",
    description: "Pay when your order arrives",
    instructions: "Have exact amount ready when our courier delivers. Available in Adama & Addis.",
  },
  {
    method: "Visa / Mastercard",
    description: "International card payment",
    instructions: "Enter your card details at checkout. Processed securely via our payment gateway.",
  },
];

/* ------------------------------------------------------------------ */
/*  Telegram message builder                                           */
/* ------------------------------------------------------------------ */
export const buildTelegramMessage = (lines: string[]) =>
  `${STORE.telegramUrl}?text=${encodeURIComponent(lines.join(String.fromCharCode(10)))}`;