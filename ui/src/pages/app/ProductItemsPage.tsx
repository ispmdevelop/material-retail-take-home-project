import { useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { FormModal } from '@/ui/FormModal';
import { ListProductItems } from '@/modules/product-item/components/ListProductItems';
import { CreateProductItemForm } from '@/modules/product-item/components/CreateProductItemForm';
import { UpdateProductItemForm } from '@/modules/product-item/components/UpdateProductItemForm';
import { DeleteProductItemForm } from '@/modules/product-item/components/DeleteProductItemForm';
import { useProductItems } from '@/modules/product-item/hooks/useProductItems';
import { useCreateProductItem } from '@/modules/product-item/hooks/useCreateProductItem';
import { useUpdateProductItem } from '@/modules/product-item/hooks/useUpdateProductItem';
import { useDeleteProductItem } from '@/modules/product-item/hooks/useDeleteProductItem';
import type { ProductItem } from '@/modules/product-item/types/product-item.types';

type ModalMode = 'create' | 'update' | 'delete' | null;

export function ProductItemsPage() {
  const { productId } = useParams<{ productId: string }>();
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedItem, setSelectedItem] = useState<ProductItem | null>(null);

  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { data: items = [], isLoading } = useProductItems(productId!);
  const create = useCreateProductItem();
  const update = useUpdateProductItem();
  const del = useDeleteProductItem();

  const inheritedFeatures = items.length > 0 && items[0].variants
    ? items[0].variants
    : {};

  const handleOpenCreate = () => {
    setSelectedItem(null);
    setModalMode('create');
  };

  const handleOpenUpdate = (item: ProductItem) => {
    setSelectedItem(item);
    setModalMode('update');
  };

  const handleOpenDelete = (item: ProductItem) => {
    setSelectedItem(item);
    setModalMode('delete');
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setSelectedItem(null);
  };

  const handleCreate = (data: { name: string; price: number; variants?: Record<string, string>; stock: number; stockAlertBelow: number }) => {
    create.mutate({ productId: productId!, ...data }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['product-items', productId] });
        enqueueSnackbar('Variant created', { variant: 'success' });
        handleCloseModal();
      },
      onError: () => {
        enqueueSnackbar('Failed to create variant', { variant: 'error' });
      },
    });
  };

  const handleUpdate = (data: { id: string; name?: string; price?: number; variants?: Record<string, string>; stock?: number; stockAlertBelow?: number }) => {
    update.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['product-items', productId] });
        enqueueSnackbar('Variant updated', { variant: 'success' });
        handleCloseModal();
      },
      onError: () => {
        enqueueSnackbar('Failed to update variant', { variant: 'error' });
      },
    });
  };

  const handleDelete = () => {
    if (!selectedItem) return;
    del.mutate(selectedItem.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['product-items', productId] });
        enqueueSnackbar('Variant deleted', { variant: 'success' });
        handleCloseModal();
      },
      onError: () => {
        enqueueSnackbar('Failed to delete variant', { variant: 'error' });
      },
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton component={RouterLink} to="/app/products" size="small">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Variants
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
        >
          Add Variant
        </Button>
      </Box>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        {isLoading ? (
          <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
            Loading variants...
          </Typography>
        ) : (
          <ListProductItems
            items={items}
            onEdit={handleOpenUpdate}
            onDelete={handleOpenDelete}
          />
        )}
      </Paper>

      <FormModal
        open={modalMode === 'create'}
        onClose={handleCloseModal}
        title="Create variant"
      >
        <CreateProductItemForm
          productId={productId!}
          inheritedFeatures={inheritedFeatures}
          onSubmit={handleCreate}
          isPending={create.isPending}
        />
      </FormModal>

      <FormModal
        open={modalMode === 'update' && !!selectedItem}
        onClose={handleCloseModal}
        title="Update variant"
      >
        {selectedItem && (
          <UpdateProductItemForm
            item={selectedItem}
            onSubmit={handleUpdate}
            isPending={update.isPending}
          />
        )}
      </FormModal>

      <FormModal
        open={modalMode === 'delete' && !!selectedItem}
        onClose={handleCloseModal}
        title="Delete variant"
      >
        {selectedItem && (
          <DeleteProductItemForm
            item={selectedItem}
            onConfirm={handleDelete}
            isPending={del.isPending}
          />
        )}
      </FormModal>
    </Box>
  );
}
