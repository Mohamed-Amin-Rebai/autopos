export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  brand?: string;
  attributes?: Record<string, any>;
};

export type POSData = {
  logo: string;
  categories: string[];
  products: Product[];
  actions: string[];
};
