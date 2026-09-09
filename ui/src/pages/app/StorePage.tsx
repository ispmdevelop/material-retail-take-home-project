import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  Chip,
} from '@mui/material';
import { Search as SearchIcon, ShoppingCart, LocalOffer as LocalOfferIcon } from '@mui/icons-material';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { FormModal } from '@/ui/FormModal';
import { useStoreItems } from '@/modules/store/hooks/useStoreItems';
import { usePurchaseItem } from '@/modules/store/hooks/usePurchaseItem';
import { PurchaseModal } from '@/modules/store/components/PurchaseModal';
import type { StoreItem } from '@/modules/store/types/store.types';

export function StorePage() {
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);

  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { data: items = [], isLoading } = useStoreItems();
  const purchase = usePurchaseItem();

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.productName.toLowerCase().includes(q) ||
        Object.values(i.variants).some((v) => v.toLowerCase().includes(q)),
    );
  }, [items, search]);

  const handleBuy = (item: StoreItem) => {
    setSelectedItem(item);
  };

  const handleConfirmPurchase = (quantity: number) => {
    if (!selectedItem) return;
    purchase.mutate(
      { productItemId: selectedItem.id, quantity },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: ['store-items'] });
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
          enqueueSnackbar(
            `Purchased ${data.purchased} × ${selectedItem.name} — ${data.remainingStock} remaining`,
            { variant: 'success' },
          );
          setSelectedItem(null);
        },
        onError: (error: any) => {
          enqueueSnackbar(error.response?.data?.message || 'Purchase failed', { variant: 'error' });
          setSelectedItem(null);
        },
      },
    );
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Store
      </Typography>

      <TextField
        fullWidth
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 3 }}
      />

      {isLoading ? (
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 8 }}>
          Loading products...
        </Typography>
      ) : filtered.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
            No products available
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Products will show up once you create them.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filtered.map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    {item.productName}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {item.name}
                  </Typography>

                  {Object.entries(item.variants).length > 0 && (
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1.5 }}>
                      {Object.entries(item.variants).map(([key, value]) => (
                        <Chip
                          key={key}
                          label={`${key}: ${value}`}
                          size="small"
                          variant="outlined"
                          icon={<LocalOfferIcon sx={{ fontSize: 14 }} />}
                        />
                      ))}
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      ${item.price.toFixed(2)}
                    </Typography>
                    {item.stockAlertBelow > 0 && item.stock <= item.stockAlertBelow ? (
                      <Chip label={`Low stock: ${item.stock}`} size="small" color="warning" />
                    ) : (
                      <Chip label={`${item.stock} in stock`} size="small" color="success" variant="outlined" />
                    )}
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<ShoppingCart />}
                    disabled={item.stock === 0}
                    onClick={() => handleBuy(item)}
                  >
                    {item.stock === 0 ? 'Out of stock' : 'Buy'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <FormModal
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title="Purchase"
      >
        {selectedItem && (
          <PurchaseModal
            item={selectedItem}
            onConfirm={handleConfirmPurchase}
            isPending={purchase.isPending}
          />
        )}
      </FormModal>
    </Box>
  );
}
