import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../actions/productActions';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });
}
