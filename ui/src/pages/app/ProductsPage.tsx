import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { FormModal } from '@/ui/FormModal';
import { ListProducts } from '@/modules/product/components/ListProducts';
import { CreateProductForm } from '@/modules/product/components/CreateProductForm';
import { UpdateProductForm } from '@/modules/product/components/UpdateProductForm';
import { DeleteProductForm } from '@/modules/product/components/DeleteProductForm';
import { useProducts } from '@/modules/product/hooks/useProducts';
import { useCreateProduct } from '@/modules/product/hooks/useCreateProduct';
import { useUpdateProduct } from '@/modules/product/hooks/useUpdateProduct';
import { useDeleteProduct } from '@/modules/product/hooks/useDeleteProduct';
import type { ProductListItem } from '@/modules/product/types/product.types';

type ModalMode = 'create' | 'update' | 'delete' | null;

export function ProductsPage() {
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductListItem | null>(null);

  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { data: products = [], isLoading } = useProducts();
  const create = useCreateProduct();
  const update = useUpdateProduct();
  const del = useDeleteProduct();

  const handleOpenCreate = () => {
    setSelectedProduct(null);
    setModalMode('create');
  };

  const handleOpenUpdate = (product: ProductListItem) => {
    setSelectedProduct(product);
    setModalMode('update');
  };

  const handleOpenDelete = (product: ProductListItem) => {
    setSelectedProduct(product);
    setModalMode('delete');
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setSelectedProduct(null);
  };

  const handleCreate = (data: { name: string; description?: string; price: number; stock: number; stockAlertBelow: number; variants?: Record<string, string> }) => {
    create.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        enqueueSnackbar('Product created', { variant: 'success' });
        handleCloseModal();
      },
      onError: () => {
        enqueueSnackbar('Failed to create product', { variant: 'error' });
      },
    });
  };

  const handleUpdate = (data: { id: string; name?: string; description?: string }) => {
    update.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['products'] });
        enqueueSnackbar('Product updated', { variant: 'success' });
        handleCloseModal();
      },
      onError: () => {
        enqueueSnackbar('Failed to update product', { variant: 'error' });
      },
    });
  };

  const handleDelete = () => {
    if (!selectedProduct) return;
    del.mutate(selectedProduct.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['products'] });
        enqueueSnackbar('Product deleted', { variant: 'success' });
        handleCloseModal();
      },
      onError: () => {
        enqueueSnackbar('Failed to delete product', { variant: 'error' });
      },
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Products
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
        >
          Add Product
        </Button>
      </Box>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        {isLoading ? (
          <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
            Loading products...
          </Typography>
        ) : (
          <ListProducts
            products={products}
            onEdit={handleOpenUpdate}
            onDelete={handleOpenDelete}
          />
        )}
      </Paper>

      <FormModal
        open={modalMode === 'create'}
        onClose={handleCloseModal}
        title="Create product"
      >
        <CreateProductForm onSubmit={handleCreate} isPending={create.isPending} />
      </FormModal>

      <FormModal
        open={modalMode === 'update' && !!selectedProduct}
        onClose={handleCloseModal}
        title="Update product"
      >
        {selectedProduct && (
          <UpdateProductForm
            product={selectedProduct}
            onSubmit={handleUpdate}
            isPending={update.isPending}
          />
        )}
      </FormModal>

      <FormModal
        open={modalMode === 'delete' && !!selectedProduct}
        onClose={handleCloseModal}
        title="Delete product"
      >
        {selectedProduct && (
          <DeleteProductForm
            product={selectedProduct}
            onConfirm={handleDelete}
            isPending={del.isPending}
          />
        )}
      </FormModal>
    </Box>
  );
}
