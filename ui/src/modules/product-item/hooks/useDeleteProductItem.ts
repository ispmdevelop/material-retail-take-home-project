import { useMutation } from '@tanstack/react-query';
import { deleteProductItem } from '../actions/productItemActions';

export function useDeleteProductItem() {
  return useMutation({
    mutationFn: deleteProductItem,
  });
}
