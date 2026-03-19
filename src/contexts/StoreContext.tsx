import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CartItem, Product, WishlistItem } from '@/types';
import { toast } from 'sonner';

interface StoreContextType {
  cart: CartItem[];
  wishlist: WishlistItem[];
  recentlyViewed: Product[];
  addToCart: (product: Product, size: number, color: string, qty?: number) => void;
  removeFromCart: (productId: string, size: number, color: string) => void;
  updateCartQty: (productId: string, size: number, color: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  addToRecentlyViewed: (product: Product) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const addToCart = useCallback((product: Product, size: number, color: string, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.selectedSize === size && i.selectedColor === color);
      if (existing) {
        return prev.map(i => i === existing ? { ...i, quantity: i.quantity + qty } : i);
      }
      return [...prev, { product, quantity: qty, selectedSize: size, selectedColor: color }];
    });
    toast.success(`${product.name} added to cart`);
  }, []);

  const removeFromCart = useCallback((productId: string, size: number, color: string) => {
    setCart(prev => prev.filter(i => !(i.product.id === productId && i.selectedSize === size && i.selectedColor === color)));
    toast.info('Item removed from cart');
  }, []);

  const updateCartQty = useCallback((productId: string, size: number, color: string, qty: number) => {
    if (qty < 1) return;
    setCart(prev => prev.map(i =>
      i.product.id === productId && i.selectedSize === size && i.selectedColor === color
        ? { ...i, quantity: qty } : i
    ));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const toggleWishlist = useCallback((product: Product) => {
    setWishlist(prev => {
      const exists = prev.find(i => i.product.id === product.id);
      if (exists) {
        toast.info(`${product.name} removed from wishlist`);
        return prev.filter(i => i.product.id !== product.id);
      }
      toast.success(`${product.name} added to wishlist`);
      return [...prev, { product }];
    });
  }, []);

  const isInWishlist = useCallback((productId: string) => wishlist.some(i => i.product.id === productId), [wishlist]);

  const addToRecentlyViewed = useCallback((product: Product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 10);
    });
  }, []);

  return (
    <StoreContext.Provider value={{ cart, wishlist, recentlyViewed, addToCart, removeFromCart, updateCartQty, clearCart, cartTotal, cartCount, toggleWishlist, isInWishlist, addToRecentlyViewed, searchQuery, setSearchQuery }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};
