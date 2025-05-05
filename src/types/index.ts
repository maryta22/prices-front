export interface Product {
  id: number;
  name: string;
  description?: string;
}

export interface Store {
  id: number;
  name: string;
  location?: string;
}

export interface PriceVersion {
  id: number;
  product_id: number;
  store_id: number;
  value: number;
  start_datetime: string;
  end_datetime: string;
}

export interface FinalPriceResult {
  product: string;
  store: string;
  base_price: number;
  final_price: number;
  applied_discount: number;
}

export interface Promotion {
  id: number;
  name: string;
  discount_percent: number;
  start_datetime: string;
  end_datetime: string;
}