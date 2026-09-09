import { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, InputAdornment } from '@mui/material';
import { Inventory2Outlined } from '@mui/icons-material';
import type { StoreItem } from '../types/store.types';

interface PurchaseModalProps {
  item: StoreItem;
  onConfirm: (quantity: number) => void;
  isPending: boolean;
}

export function PurchaseModal({ item, onConfirm, isPending }: PurchaseModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const handleQuantityChange = (value: string) => {
    const num = parseInt(value, 10);
    setQuantity(isNaN(num) ? 1 : num);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (quantity < 1) {
      setError('Quantity must be at least 1');
      return;
    }

    if (quantity > item.stock) {
      setError(`Only ${item.stock} available`);
      return;
    }

    onConfirm(quantity);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
        <Inventory2Outlined sx={{ color: 'primary.main' }} />
        <Box>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {item.productName}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {item.name}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Price: <strong>${item.price.toFixed(2)}</strong>
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          In stock: <strong>{item.stock}</strong>
        </Typography>
      </Box>

      <TextField
        label="Quantity"
        type="number"
        value={quantity}
        onChange={(e) => handleQuantityChange(e.target.value)}
        required
        fullWidth
        slotProps={{
          input: {
            endAdornment: <InputAdornment position="end">/ {item.stock}</InputAdornment>,
            inputProps: { min: 1, max: item.stock, step: 1 },
          },
        }}
      />

      {error && <Alert severity="error">{error}</Alert>}

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => setQuantity(1)}
          fullWidth
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isPending}
          fullWidth
        >
          {isPending ? 'Processing...' : `Buy ${quantity} — $${(item.price * quantity).toFixed(2)}`}
        </Button>
      </Box>
    </Box>
  );
}
