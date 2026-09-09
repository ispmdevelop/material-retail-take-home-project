export interface Product {
  id: string;
  name: string;
  description: string | null;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  stock: number;
  stockAlertBelow: number;
  variants?: Record<string, string>;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
}

export interface ProductListItem extends Product {
  items: ProductItem[];
}

export interface ProductItem {
  id: string;
  name: string;
  price: number;
  variants: Record<string, unknown>;
  stock: number;
  stockAlertBelow: number;
  productId: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}
