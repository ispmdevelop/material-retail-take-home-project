import { Box, Typography, Button, Alert } from '@mui/material';
import type { ProductListItem } from '../types/product.types';

interface DeleteProductFormProps {
  product: ProductListItem;
  onConfirm: () => void;
  isPending: boolean;
}

export function DeleteProductForm({ product, onConfirm, isPending }: DeleteProductFormProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Alert severity="warning">
        This action cannot be undone.
      </Alert>

      <Box>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Are you sure you want to delete:
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {product.name}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => window.location.reload()}
          fullWidth
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          disabled={isPending}
          fullWidth
        >
          {isPending ? 'Deleting...' : 'Delete product'}
        </Button>
      </Box>
    </Box>
  );
}
