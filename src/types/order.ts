export type OrderRow = {
  id: string;
  order_number: string | null;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  delivery_option: string;
  payment_method: string;
  payment_status: string;
  status: string;
  tracking_number: string | null;
  courier_name: string | null;
  estimated_delivery: string | null;
  admin_note: string | null;
  notes: string | null;
  subtotal: number;
  discount: number;
  delivery_charge: number;
  total_amount: number;
  created_at: string;
  updated_at: string;
};

export type OrderItemRow = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_image: string | null;
  size: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
};

export type TrackingRow = {
  id: string;
  order_id: string;
  status: string;
  title: string;
  description: string | null;
  location: string | null;
  created_at: string;
  updated_by: string | null;
};

export type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: "customer" | "admin";
};
