export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  images: string[];
  price: number;
  brand: string;
  rating: number | { toNumber(): number };
  numReviews?: number;
  stock: number;
  isVisiable: boolean;
  isDealOfDay?: boolean;
  dealEndsAt?: Date | null;
  banner?: string | null;
  createdAt: Date;
};