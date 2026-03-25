export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
] as const;

export const PAYMENT_STATUSES = [
  "unpaid",
  "pending_verification",
  "paid",
  "failed",
  "refunded",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  unpaid: "Unpaid",
  pending_verification: "Pending verification",
  paid: "Paid",
  failed: "Failed",
  refunded: "Refunded",
};

export const getOrderStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "confirmed":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "packed":
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    case "shipped":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "out_for_delivery":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "delivered":
      return "bg-green-100 text-green-800 border-green-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-muted text-foreground border-border";
  }
};

export const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "unpaid":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "pending_verification":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "paid":
      return "bg-green-100 text-green-800 border-green-200";
    case "failed":
      return "bg-red-100 text-red-800 border-red-200";
    case "refunded":
      return "bg-slate-100 text-slate-800 border-slate-200";
    default:
      return "bg-muted text-foreground border-border";
  }
};

export const buildTrackingTitle = (status: OrderStatus) => {
  switch (status) {
    case "pending":
      return "Order placed";
    case "confirmed":
      return "Order confirmed";
    case "packed":
      return "Order packed";
    case "shipped":
      return "Handed over to courier";
    case "out_for_delivery":
      return "Out for delivery";
    case "delivered":
      return "Delivered successfully";
    case "cancelled":
      return "Order cancelled";
    default:
      return "Status updated";
  }
};
