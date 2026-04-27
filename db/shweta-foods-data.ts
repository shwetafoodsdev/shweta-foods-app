import { hashSync } from "bcrypt-ts-edge";

/** Single placeholder used for every product until real pack shots are uploaded. */
const SAMPLE_PRODUCT_IMAGE = "/images/sample-product.jpg";

/**
 * Demo catalogue for Shweta Foods — Indian snacks, namkeen, and khakhra.
 */
const shwetaFoodsData = {
  user: [
    {
      name: "Shweta Foods Admin",
      email: "admin@example.com",
      password: hashSync("password123", 10),
      role: "admin",
      emailVerified: new Date(),
    },
    {
      name: "Sample Customer",
      email: "user@example.com",
      password: hashSync("password123", 10),
      emailVerified: new Date(),
    },
  ],

  products: [
    {
      name: "Mini Kachori",
      slug: "mini-kachori",
      category: "Snacks & Bites",
      description:
        "Crisp, bite-sized kachori with a spiced filling — perfect for tea time or party platters. Traditional taste, made for sharing.",
      images: [SAMPLE_PRODUCT_IMAGE],
      price: 149,
      brand: "Shweta Foods",
      rating: 4.6,
      stock: 40,
      isVisiable: true,
      isDealOfDay: true,
      dealEndsAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
      banner: null,
    },
    {
      name: "Mini Samosa",
      slug: "mini-samosa",
      category: "Snacks & Bites",
      description:
        "Golden mini samosas with a savoury potato and pea filling. Ideal for quick snacks, gatherings, and tiffin boxes.",
      images: [SAMPLE_PRODUCT_IMAGE],
      price: 139,
      brand: "Shweta Foods",
      rating: 4.5,
      stock: 35,
      isVisiable: true,
      isDealOfDay: false,
      dealEndsAt: null,
      banner: null,
    },
    {
      name: "Tara — Namkeen",
      slug: "tara-namkeen",
      category: "Namkeen",
      description: "A signature snacking line — light, crisp, and seasoned for everyday munching. Part of the Tara family.",
      images: [SAMPLE_PRODUCT_IMAGE],
      price: 99,
      brand: "Shweta Foods",
      rating: 4.3,
      stock: 50,
      isVisiable: true,
      isDealOfDay: false,
      dealEndsAt: null,
      banner: null,
    },
    {
      name: "Sitara — Namkeen",
      slug: "sitara-namkeen",
      category: "Namkeen",
      description: "The Sitara range: bold crunch and balanced spice — great for home, office, and gifting.",
      images: [SAMPLE_PRODUCT_IMAGE],
      price: 99,
      brand: "Shweta Foods",
      rating: 4.4,
      stock: 50,
      isVisiable: true,
      isDealOfDay: false,
      dealEndsAt: null,
      banner: null,
    },
    {
      name: "Khakhra — Assorted Flavours",
      slug: "khakhra-assorted-flavours",
      category: "Khakhra",
      description:
        "Thin, roasted khakhras in multiple flavours — from classic masala to jeera. A staple for diet-friendly crunch.",
      images: [SAMPLE_PRODUCT_IMAGE],
      price: 189,
      brand: "Shweta Foods",
      rating: 4.7,
      stock: 28,
      isVisiable: true,
      isDealOfDay: false,
      dealEndsAt: null,
      banner: null,
    },
    {
      name: "Coin Khakhra",
      slug: "coin-khakhra",
      category: "Khakhra",
      description: "Bite-sized coin khakhra — fun shape, same roasted goodness. Pairs with chutney, tea, or on its own.",
      images: [SAMPLE_PRODUCT_IMAGE],
      price: 119,
      brand: "Shweta Foods",
      rating: 4.5,
      stock: 32,
      isVisiable: true,
      isDealOfDay: false,
      dealEndsAt: null,
      banner: null,
    },
    {
      name: "Besan Puri",
      slug: "besan-puri",
      category: "Namkeen",
      description: "Light besan (gram flour) puri with a traditional crunch — a timeless tea-time partner.",
      images: [SAMPLE_PRODUCT_IMAGE],
      price: 89,
      brand: "Shweta Foods",
      rating: 4.2,
      stock: 45,
      isVisiable: true,
      isDealOfDay: false,
      dealEndsAt: null,
      banner: null,
    },
  ],
};

export default shwetaFoodsData;
