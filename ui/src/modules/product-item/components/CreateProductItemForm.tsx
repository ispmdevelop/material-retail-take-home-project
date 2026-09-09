import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  AttachMoney,
  Inventory2Outlined,
} from '@mui/icons-material';

interface FeatureRow {
  key: string;
  value: string;
}

interface CreateProductItemFormProps {
  productId: string;
  inheritedFeatures: Record<string, string>;
  onSubmit: (data: { name: string; price: number; variants?: Record<string, string>; stock: number; stockAlertBelow: number }) => void;
  isPending: boolean;
}

export function CreateProductItemForm({ productId: _productId, inheritedFeatures, onSubmit, isPending }: CreateProductItemFormProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('0');
  const [stockAlertBelow, setStockAlertBelow] = useState('0');
  const [enableAlert, setEnableAlert] = useState(false);
  const [features, setFeatures] = useState<FeatureRow[]>(() => {
    const entries = Object.entries(inheritedFeatures) as [string, string][];
    return entries.length > 0
      ? entries.map(([key, value]) => ({ key, value }))
      : [{ key: '', value: '' }];
  });

  const addFeature = () => {
    setFeatures((prev) => [...prev, { key: '', value: '' }]);
  };

  const removeFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  const updateFeature = (index: number, field: 'key' | 'value', val: string) => {
    setFeatures((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const variants = features
      .filter((f) => f.key.trim() && f.value.trim())
      .reduce<Record<string, string>>((acc, f) => {
        acc[f.key] = f.value;
        return acc;
      }, {});

    onSubmit({
      name,
      price: parseFloat(price),
      variants: Object.keys(variants).length > 0 ? variants : undefined,
      stock: parseInt(stock, 10),
      stockAlertBelow: enableAlert ? parseInt(stockAlertBelow, 10) : 0,
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {Object.keys(inheritedFeatures).length > 0 && (
        <Alert severity="info">
          Features pre-filled from the product&apos;s first variant. You can modify them.
        </Alert>
      )}

      <TextField
        label="Variant name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        fullWidth
      />

      <TextField
        label="Price"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        fullWidth
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <AttachMoney />
              </InputAdornment>
            ),
            inputProps: { step: '0.01', min: '0' },
          },
        }}
      />

      <Divider />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Inventory2Outlined fontSize="small" sx={{ color: 'text.secondary' }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
          Stock
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          label="Stock"
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
          fullWidth
          
        />
        <FormControlLabel
          control={
            <Switch
              checked={enableAlert}
              onChange={(e) => setEnableAlert(e.target.checked)}
            />
          }
          label="Low stock alert"
          sx={{ alignSelf: 'center' }}
        />
      </Box>

      {enableAlert && (
        <TextField
          label="Alert when stock falls below"
          type="number"
          value={stockAlertBelow}
          onChange={(e) => setStockAlertBelow(e.target.value)}
          fullWidth
          
        />
      )}

      <Divider />

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
          Variant features
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Key</TableCell>
                <TableCell>Value</TableCell>
                <TableCell sx={{ width: 48 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {features.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TextField
                      size="small"
                      placeholder="e.g. Size"
                      value={row.key}
                      onChange={(e) => updateFeature(index, 'key', e.target.value)}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      placeholder="e.g. 5ml"
                      value={row.value}
                      onChange={(e) => updateFeature(index, 'value', e.target.value)}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => removeFeature(index)}
                      disabled={features.length === 1}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          startIcon={<AddIcon />}
          onClick={addFeature}
          size="small"
          sx={{ mt: 1 }}
        >
          Add feature
        </Button>
      </Box>

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={isPending}
        fullWidth
      >
        {isPending ? 'Creating...' : 'Create variant'}
      </Button>
    </Box>
  );
}
