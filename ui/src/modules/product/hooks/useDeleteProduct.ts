import { useMutation } from '@tanstack/react-query';
import { deleteProduct } from '../actions/productActions';

export function useDeleteProduct() {
  return useMutation({
    mutationFn: deleteProduct,
  });
}
