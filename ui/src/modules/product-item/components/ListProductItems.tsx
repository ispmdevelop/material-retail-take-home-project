import { useState, useMemo } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  InputAdornment,
  Typography,
  Paper,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalOffer as LocalOfferIcon,
} from '@mui/icons-material';
import type { ProductItem } from '../types/product-item.types';

interface ListProductItemsProps {
  items: ProductItem[];
  onEdit: (item: ProductItem) => void;
  onDelete: (item: ProductItem) => void;
}

export function ListProductItems({ items, onEdit, onDelete }: ListProductItemsProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        Object.values(i.variants).some((v) => v.toLowerCase().includes(q)),
    );
  }, [items, search]);

  if (items.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
          No variants yet
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Click &quot;Add Variant&quot; to create one.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <TextField
        fullWidth
        placeholder="Search variants..."
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

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Features</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="center">Stock</TableCell>
              <TableCell align="center">Alert Below</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {item.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {Object.entries(item.variants).map(([key, value]) => (
                      <Chip
                        key={key}
                        label={`${key}: ${value}`}
                        size="small"
                        variant="outlined"
                        icon={<LocalOfferIcon sx={{ fontSize: 14 }} />}
                      />
                    ))}
                    {Object.keys(item.variants).length === 0 && (
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        —
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    ${Number(item.price).toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  {item.stock <= item.stockAlertBelow && item.stockAlertBelow > 0 ? (
                    <Chip
                      label={`${item.stock}`}
                      size="small"
                      color="warning"
                    />
                  ) : (
                    <Chip
                      label={String(item.stock)}
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  )}
                </TableCell>
                <TableCell align="center">
                  {item.stockAlertBelow > 0 ? (
                    <Chip
                      label={`≤ ${item.stockAlertBelow}`}
                      size="small"
                      variant="outlined"
                      color={item.stock <= item.stockAlertBelow ? 'warning' : 'default'}
                    />
                  ) : (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Off
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(item)}
                    color="primary"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onDelete(item)}
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filtered.length === 0 && search && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            No variants matching &quot;{search}&quot;
          </Typography>
        </Box>
      )}
    </Box>
  );
}
