import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { CategoryChips } from './CategoryChips.jsx';

export function EditExpenseDialog({ expense, onClose, onSave }) {
  const [amount, setAmount] = useState(String(expense.amount));
  const [category, setCategory] = useState(expense.category ?? 'other');
  const [date, setDate] = useState(new Date(expense.spent_at));
  const [note, setNote] = useState(expense.note ?? '');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) return;
    setSaving(true);
    await onSave(expense.id, {
      amount: parsed,
      category,
      spent_at: date.toISOString(),
      note: note.trim() || null,
    });
    setSaving(false);
    onClose();
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit expense</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputProps={{ inputMode: 'decimal', pattern: '[0-9]*\\.?[0-9]*' }}
            InputProps={{
              startAdornment: (
                <Typography sx={{ mr: 0.5, color: 'text.secondary' }}>$</Typography>
              ),
            }}
          />
          <div>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Category
            </Typography>
            <CategoryChips value={category} onChange={setCategory} />
          </div>
          <DatePicker
            label="Date"
            value={date}
            onChange={(d) => d && setDate(d)}
            slotProps={{ textField: { fullWidth: true }, dialog: { disablePortal: true } }}
          />
          <TextField
            label="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            multiline
            rows={2}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={saving || !amount}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
