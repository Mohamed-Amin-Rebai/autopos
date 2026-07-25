export type CategoryListProps = {
  categories: string[];
  selected: string;
  setSelected: (category: string) => void;
};

export type ProductGridProps = {
  products: Product[];
  selectedCategory: string;
  addToCart: (product: Product) => void;
  hasCategories: boolean;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type PaymentMethod =
  | "cash"
  | "bank";

export type CartProps = {
  cart: CartItem[];
  posId: string;
  cashierId?: string;

  onClearCart: () => void;

  removeFromCart: (productId: number) => void;
  increaseQty: (productId: number) => void;
  decreaseQty: (productId: number) => void;

  data?: POSData;
};
// -----------------------------------

export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  brand?: string;
  image?: string;
  attributes?: Record<string, unknown>;
};

export type Discount = {
  name: string;
  value: number;
  active: boolean;
};

export type POSData = {
  categories: string[];
  products: Product[];
  discounts?: Discount[];
};
// -----------------------------------
export type Cashier = {
  id: string;
  username: string;
  openingCash: number;
  shiftStart: string | null;
  shiftEnd: string | null;
  allowedIp?: string;
  isActive: boolean;
  createdAt: string;
};

export type CashierManagementPOS = {
  posId: string;
  posName: string;
  cashiers: Cashier[];
};
// -----------------------------------
export type CashierRequestConfig = {
  openingCash: number;
  shiftStart: string;
  shiftEnd: string;
  allowedIp: string;
};

export type CashierRequestStatus =
  | "pending"
  | "approved"
  | "rejected";

export type CashierRequest = {
  id: string;
  ownerId: string;
  posId: string;
  requestedCashiers: number;
  cashierConfigs: CashierRequestConfig[];
  status: CashierRequestStatus;
  createdAt: string;
};
// -----------------------------------
export type AppliedDiscount = {
  name: string;
  value: number;
};

export type PaymentDetails = {
  method: string;
  amountReceived?: number;
  change?: number;
};

export type OrderItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
};

export type OrderStatus =
  | "pending"
  | "paid"
  | "failed";

export type Order = {
  id: string;
  userId: string;
  posId: string;
  cashierId?: string | null;
  items: OrderItem[];
  total: number;
  discount?: AppliedDiscount | null;
  paymentDetails?: PaymentDetails;
  status: OrderStatus;
  receiptNumber?: string;
  idempotencyKey?: string;
  createdAt: string;
};
// -----------------------------------
export type UserRole =
  | "user"
  | "manager"
  | "admin";

export type User = {
  id: string;
  clerkId: string;
  email: string;
  name?: string | null;
  role: UserRole;
  createdAt: string;
};
// -----------------------------------
export type POSSummary = {
  id: string;
  name: string;
  createdAt: string;
};
// -----------------------------------
export type Notification = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};
// -----------------------------------
export type GeneratedCashierCredentials = {
  id: string;
  username: string;
  password: string;
  url: string;
  openingCash: number;
  shiftStart: string | null;
  shiftEnd: string | null;
};
// -----------------------------------
export type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

export type HistoryVersion = {
  label: string;
};

export type ChatPanelProps = {
  data: POSData;
  onUpdate: (data: POSData) => void;
  historyFromDB: HistoryVersion[];
};
// -----------------------------------
export type POSStoredData = {
  current: POSData;
  history: {
    label: string;
    data: POSData;
  }[];
};
// -----------------------------------
export type AnalyticsProduct = {
  name: string;
  quantity: number;
  revenue: number;
  category?: string;
};

export type AnalyticsCategory = {
  category: string;
  revenue: number;
};
// -----------------------------------
export type CashierConfig = {
  openingCash: number;
  shiftStart: string;
  shiftEnd: string;
};
// -----------------------------------
export type CashierSummary = {
  id: string;
  username: string;
  openingCash: number;
  shiftStart: string | null;
  shiftEnd: string | null;
  isActive: boolean;
  createdAt: Date;
};
// -----------------------------------
export interface AnalyticsData {
  posId: string;
  posName: string;
  revenue: number;
  orderCount: number;
  averageOrderValue: number;
  dailyRevenue: Array<{ date: string; revenue: number }>;
  cashiers: Array<{
    id: string;
    username: string;
    openingCash: number;
    orders: number;
    revenue: number;
  }>;
  topProducts: Array<{
    name: string;
    quantity: number;
    revenue: number;
    category?: string;
  }>;
  topCategories: Array<{
    category: string;
    revenue: number;
  }>;
  busiestHours: Array<{
    hour: string;
    orders: number;
  }>;
}