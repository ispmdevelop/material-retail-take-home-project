import { useMutation } from '@tanstack/react-query';
import { updateProduct } from '../actions/productActions';
import type { UpdateProductDto } from '../types/product.types';

export function useUpdateProduct() {
  return useMutation({
    mutationFn: ({ id, ...dto }: UpdateProductDto & { id: string }) =>
      updateProduct(id, dto),
  });
}
