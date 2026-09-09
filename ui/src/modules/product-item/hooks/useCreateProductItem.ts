import { useMutation } from '@tanstack/react-query';
import { createProductItem } from '../actions/productItemActions';
import type { CreateProductItemDto } from '../types/product-item.types';

export function useCreateProductItem() {
  return useMutation({
    mutationFn: createProductItem,
  });
}
