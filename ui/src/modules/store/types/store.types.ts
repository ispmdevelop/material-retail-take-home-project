export interface StoreItem {
  id: string;
  name: string;
  price: number;
  variants: Record<string, string>;
  stock: number;
  stockAlertBelow: number;
  productName: string;
}

export interface PurchaseDto {
  productItemId: string;
  quantity: number;
}

export interface PurchaseResponse {
  success: boolean;
  productItemId: string;
  previousStock: number;
  remainingStock: number;
  purchased: number;
}
