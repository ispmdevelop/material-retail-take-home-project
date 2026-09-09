import { useState, useEffect } from 'react';
import { Box, TextField, Button } from '@mui/material';
import type { ProductListItem } from '../types/product.types';

interface UpdateProductFormProps {
  product: ProductListItem;
  onSubmit: (data: { id: string; name?: string; description?: string }) => void;
  isPending: boolean;
}

export function UpdateProductForm({ product, onSubmit, isPending }: UpdateProductFormProps) {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description || '');

  useEffect(() => {
    setName(product.name);
    setDescription(product.description || '');
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: product.id,
      name: name || undefined,
      description: description || undefined,
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <TextField
        label="Product name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        fullWidth
      />

      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={2}
        fullWidth
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={isPending}
        fullWidth
      >
        {isPending ? 'Updating...' : 'Update product'}
      </Button>
    </Box>
  );
}
