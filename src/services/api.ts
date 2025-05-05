import axios, { AxiosResponse } from "axios";
import type {
  Product,
  Store,
  PriceVersion,
  FinalPriceResult,
  Promotion,
} from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

async function request<T>(
  fn: () => Promise<AxiosResponse<T>>,
  fallback: string
): Promise<T> {
  try {
    const res = await fn();
    return res.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err.response?.data?.error ?? fallback);
  }
}

export const fetchProducts = () =>
  request<Product[]>(() => api.get("/products/"), "Error al obtener productos");

export const createProduct = (p: Partial<Product>) =>
  request<Product>(() => api.post("/products/", p), "Error al crear producto");

export const updateProduct = (id: number, p: Partial<Product>) =>
  request<Product>(
    () => api.patch(`/products/${id}/`, p),
    "Error al actualizar producto"
  );

export const deleteProduct = (id: number) =>
  request<void>(
    () => api.delete(`/products/${id}/`),
    "Error al eliminar producto"
  );

export const fetchStores = () =>
  request<Store[]>(() => api.get("/stores/"), "Error al obtener tiendas");

export const fetchPrices = () =>
  request<PriceVersion[]>(
    () => api.get("/price/"),
    "Error al obtener versiones de precio"
  );

export const createPrice = (pv: {
  value: number;
  start_datetime: string;
  end_datetime: string;
  product: number;
  store: number;
}) =>
  request<PriceVersion>(
    () => api.post("/prices/", pv),
    "Error al crear versión de precio"
  );

export const deletePrice = (id: number) =>
  request<void>(
    () => api.delete(`/price/${id}/`),
    "Error al eliminar versión de precio"
  );

export const getFinalPrice = (
  productId: number,
  storeId: number,
  datetime: string
) =>
  request<FinalPriceResult>(
    () =>
      api.get(
        `/final-price/?product_id=${productId}&store_id=${storeId}&datetime=${encodeURIComponent(
          datetime
        )}`
      ),
    "Error al consultar precio final"
  );
export const fetchStoresWithProducts = () =>
  request<
    {
      store_id: number;
      store_name: string;
      products: { id: number; name: string }[];
    }[]
  >(
    () => api.get("/stores-products/"),
    "Error al obtener productos por tienda"
  );
export const createStore = (s: { name: string; description?: string }) =>
  request(() => api.post("/stores/", s), "Error al crear tienda");

export const deleteStore = (id: number) => api.delete(`/stores/${id}/`);

export const fetchStoreById = (id: number) =>
  request(() => api.get(`/stores/${id}/`), "Error al cargar la tienda");

export const updateStore = (
  id: number,
  data: { name: string; description: string }
) =>
  request(
    () => api.put(`/stores/${id}/`, data),
    "Error al actualizar la tienda"
  );

export const createPromotion = (s: {
  name: string;
  discount_percent: number;
  start_datetime: string;
  end_datetime: string;
}) => request(() => api.post("/promotions/", s), "Error al crear tienda");

export const fetchPromotions = () =>
  request<Promotion[]>(
    () => api.get("/promotions/"),
    "Error al obtener tiendas"
  );

export const deletePromotion = (id: number) =>
  request(
    () => api.delete(`/promotions/${id}/`),
    "Error al eliminar promoción"
  );

export const fetchPromotionById = (id: number) =>
  request<Promotion>(
    () => api.get(`/promotions/${id}/`),
    "Error al obtener promoción"
  );

export const updatePromotion = (
  id: number,
  data: {
    name: string;
    discount_percent: number;
    start_datetime: string;
    end_datetime: string;
  }
) =>
  request(
    () => api.put(`/promotions/${id}/`, data),
    "Error al actualizar promoción"
  );

export function assignPromotion(
  promotionId: number,
  data: { product_ids?: number[]; store_ids?: number[] }
) {
  return request(
    () => api.patch(`/promotions/${promotionId}/assign/`, data),
    "Error al asignar la promoción"
  );
}
