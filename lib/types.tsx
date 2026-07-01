export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  brand?: string;
  image?: string;
  attributes?: Record<string, any>;
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
  actions: string[];
};