import { useQuery } from '@tanstack/react-query';
import { getStoreItems } from '../actions/storeActions';

export function useStoreItems() {
  return useQuery({
    queryKey: ['store-items'],
    queryFn: getStoreItems,
  });
}
