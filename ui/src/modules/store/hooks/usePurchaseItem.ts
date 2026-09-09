import { useMutation } from '@tanstack/react-query';
import { purchaseItem } from '../actions/storeActions';
import type { PurchaseDto } from '../types/store.types';

export function usePurchaseItem() {
  return useMutation({
    mutationFn: purchaseItem,
  });
}
