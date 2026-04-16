import { useState } from 'react';
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AnimatePresence, motion } from 'motion/react';
import { CategoryChips } from '../features/expenses/CategoryChips.jsx';
import { useExpenses } from '../store/useExpenses.js';

const cardSx = {
  p: 2.5,
  background: 'linear-gradient(140deg, #0a0a0a 0%, #111111 55%, #161616 100%)',
  border: '1px solid rgba(255,255,255,0.07)',
  boxShadow: '0 0 0 1px rgba(0,0,0,0.3), 0 4px 20px rgba(0,0,0,0.4)',
};

export default function AddExpense() {
  const addExpense = useExpenses((s) => s.addExpense);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('other');
  const [date, setDate] = useState(new Date());
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) return;
    setSubmitting(true);
    setError(null);
    try {
      await addExpense({
        amount: parsed,
        category,
        spent_at: date.toISOString(),
        note: note.trim() || null,
      });
      setAmount('');
      setNote('');
      setDate(new Date());
      setCategory('other');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <Typography variant="h1">Add expense</Typography>

        <Paper sx={cardSx}>
          <Stack spacing={2.5}>
            <TextField
              label="Amount"
              value={amount}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d*\.?\d{0,2}$/.test(val)) setAmount(val);
              }}
              required
              inputProps={{ inputMode: 'decimal', pattern: '[0-9]*\\.?[0-9]{0,2}' }}
              InputProps={{
                startAdornment: (
                  <Typography sx={{ mr: 0.5, color: 'text.secondary' }}>$</Typography>
                ),
              }}
              sx={{
                '& input': {
                  fontSize: '2rem',
                  fontWeight: 700,
                  py: 1.5,
                  fontFamily: '"Roboto Mono", "Courier New", monospace',
                },
              }}
              autoComplete="off"
            />
            <TextField
              label="Note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              multiline
              rows={2}
              autoComplete="off"
            />
            <DatePicker
              label="Date"
              value={date}
              onChange={(d) => d && setDate(d)}
              slotProps={{ textField: { fullWidth: true }, dialog: { disablePortal: true } }}
            />
            <Box>
              <Typography
                sx={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.35)',
                  mb: 1,
                }}
              >
                Category
              </Typography>
              <CategoryChips value={category} onChange={setCategory} />
            </Box>
          </Stack>
        </Paper>

        {error && <Alert severity="error">{error}</Alert>}

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Alert severity="success">Expense saved!</Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={submitting || !amount}
          fullWidth
        >
          {submitting ? 'Saving…' : 'Save expense'}
        </Button>
      </Stack>
    </Box>
  );
}
