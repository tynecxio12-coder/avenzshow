export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  gender: 'men' | 'women' | 'kids' | 'unisex';
  price: number;
  oldPrice?: number;
  discount?: number;
  images: string[];
  sizes: number[];
  colors: { name: string; hex: string }[];
  rating: number;
  reviewsCount: number;
  description: string;
  features: string[];
  stock: number;
  sku: string;
  tags: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  isTrending?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: number;
  selectedColor: string;
}

export interface WishlistItem {
  product: Product;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}
