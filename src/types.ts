export type Category = "Clothing" | "Shoes" | "Accessories";

export type ProductTag = "Bestseller" | "New" | "Limited" | "Sale";

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number; // ETB
  oldPrice?: number;
  image: string;
  description: string;
  material: string;
  colors: string[];
  sizes: string[];
  stock: number;
  rating: number;
  reviews: number;
  tag?: ProductTag;
  astuPick?: boolean;
}

export interface CartItem {
  key: string; // product id + size + color
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export interface AstuOrderDetails {
  studentName: string;
  studentId: string;
  block: string;
  room: string;
  dropPoint: string;
  timeSlot: string;
}

export interface CustomerInfo {
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  addressNotes: string;
  isAstuStudent?: boolean;
  astu?: AstuOrderDetails;
}

export type PaymentMethod =
  | "Telebirr"
  | "CBE Birr"
  | "Bank of Abyssinia"
  | "Awash Birr"
  | "Cash on Delivery"
  | "Visa / Mastercard";

export type OrderStatus =
  | "Pending Confirmation"
  | "Processing in Adama"
  | "Dispatched via Courier"
  | "Delivered"
  | "Cancelled";

export interface Order {
  id: string;
  createdAt: string;
  customer: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  transactionRef?: string;
}

export interface CheckoutPayload {
  customer: CustomerInfo;
  paymentMethod: PaymentMethod;
  deliveryFee: number;
  discount: number;
}

export interface DeliveryCity {
  name: string;
  fee: number;
  eta: string;
  note?: string;
}

export const CATEGORIES: Category[] = ["Clothing", "Shoes", "Accessories"];

export const CATEGORY_LABELS: Record<Category, string> = {
  Clothing: "Girls' Clothing",
  Shoes: "Shoes",
  Accessories: "Accessories",
};

export const ORDER_STATUSES: OrderStatus[] = [
  "Pending Confirmation",
  "Processing in Adama",
  "Dispatched via Courier",
  "Delivered",
  "Cancelled",
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  "Telebirr",
  "CBE Birr",
  "Bank of Abyssinia",
  "Awash Birr",
  "Cash on Delivery",
  "Visa / Mastercard",
];

export interface PaymentDetail {
  method: PaymentMethod;
  description: string;
  instructions: string;
  accountNumber?: string;
}

export const FREE_SHIPPING_THRESHOLD = 15000;
export const ASTU_DISCOUNT_RATE = 0.2;
export const ASTU_COUPON = "ASTU2025";