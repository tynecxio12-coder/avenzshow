import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { CartItem, Product, WishlistItem } from '@/types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface UserInfo {
  name: string;
  email: string;
}

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: string;
  delivery: string;
  payment: string;
}

interface StoreContextType {
  cart: CartItem[];
  wishlist: WishlistItem[];
  recentlyViewed: Product[];
  user: UserInfo | null;
  orders: Order[];
  login: (user: UserInfo) => void;
  logout: () => void;
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
  placeOrder: (delivery: string, payment: string, total: number) => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch { return fallback; }
}

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => loadFromStorage('avenz_cart', []));
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => loadFromStorage('avenz_wishlist', []));
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<UserInfo | null>(() => loadFromStorage('avenz_user', null));
  const [orders, setOrders] = useState<Order[]>(() => loadFromStorage('avenz_orders', []));

  // Persist to localStorage
  useEffect(() => { localStorage.setItem('avenz_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('avenz_wishlist', JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem('avenz_user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('avenz_orders', JSON.stringify(orders)); }, [orders]);

  const login = useCallback((u: UserInfo) => setUser(u), []);
  const logout = useCallback(() => { setUser(null); toast.info('Logged out successfully'); }, []);

  const addToCart = useCallback((product: Product, size: number, color: string, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.selectedSize === size && i.selectedColor === color);
      if (existing) return prev.map(i => i === existing ? { ...i, quantity: i.quantity + qty } : i);
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
      i.product.id === productId && i.selectedSize === size && i.selectedColor === color ? { ...i, quantity: qty } : i
    ));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);
  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const toggleWishlist = useCallback((product: Product) => {
    setWishlist(prev => {
      const exists = prev.find(i => i.product.id === product.id);
      if (exists) { toast.info(`${product.name} removed from wishlist`); return prev.filter(i => i.product.id !== product.id); }
      toast.success(`${product.name} added to wishlist`);
      return [...prev, { product }];
    });
  }, []);

  const isInWishlist = useCallback((productId: string) => wishlist.some(i => i.product.id === productId), [wishlist]);

  const addToRecentlyViewed = useCallback((product: Product) => {
    setRecentlyViewed(prev => [product, ...prev.filter(p => p.id !== product.id)].slice(0, 10));
  }, []);

  const placeOrder = useCallback((delivery: string, payment: string, total: number): string => {
    const orderId = `AVZ-${Date.now().toString(36).toUpperCase()}`;
    const newOrder: Order = {
      id: orderId,
      items: [...cart],
      total,
      date: new Date().toISOString(),
      status: 'Processing',
      delivery,
      payment,
    };
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    return orderId;
  }, [cart]);

  return (
    <StoreContext.Provider value={{ cart, wishlist, recentlyViewed, user, orders, login, logout, addToCart, removeFromCart, updateCartQty, clearCart, cartTotal, cartCount, toggleWishlist, isInWishlist, addToRecentlyViewed, searchQuery, setSearchQuery, placeOrder }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};
