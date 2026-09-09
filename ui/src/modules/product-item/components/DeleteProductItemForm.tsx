import { Box, Typography, Button, Alert } from '@mui/material';
import type { ProductItem } from '../types/product-item.types';

interface DeleteProductItemFormProps {
  item: ProductItem;
  onConfirm: () => void;
  isPending: boolean;
}

export function DeleteProductItemForm({ item, onConfirm, isPending }: DeleteProductItemFormProps) {
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
          {item.name}
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
          {isPending ? 'Deleting...' : 'Delete variant'}
        </Button>
      </Box>
    </Box>
  );
}
