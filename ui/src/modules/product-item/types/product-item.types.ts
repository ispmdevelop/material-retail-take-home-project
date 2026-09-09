export interface ProductItem {
  id: string;
  name: string;
  price: number;
  variants: Record<string, string>;
  stock: number;
  stockAlertBelow: number;
  productId: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductItemDto {
  productId: string;
  name: string;
  price: number;
  variants?: Record<string, string>;
  stock: number;
  stockAlertBelow: number;
}

export interface UpdateProductItemDto {
  id: string;
  name?: string;
  price?: number;
  variants?: Record<string, string>;
  stock?: number;
  stockAlertBelow?: number;
}
