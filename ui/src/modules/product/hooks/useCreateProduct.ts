import { useMutation } from '@tanstack/react-query';
import { createProduct } from '../actions/productActions';
import type { CreateProductDto } from '../types/product.types';

export function useCreateProduct() {
  return useMutation({
    mutationFn: createProduct,
  });
}
