import { useMutation } from '@tanstack/react-query';
import { updateProductItem } from '../actions/productItemActions';
import type { UpdateProductItemDto } from '../types/product-item.types';
export function useUpdateProductItem() {
  return useMutation({
    mutationFn: ({ id, ...dto }: UpdateProductItemDto & { id: string }) =>
      updateProductItem(id, dto as any),
  });
}
