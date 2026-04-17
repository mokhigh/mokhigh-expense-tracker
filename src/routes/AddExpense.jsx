import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Alert, Box, Fab, Paper, Stack, TextField, Typography } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers';
import { AnimatePresence, motion } from 'motion/react';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { CategoryChips } from '../features/expenses/CategoryChips.jsx';
import { useExpenses } from '../store/useExpenses.js';

const cardSx = (theme) => ({
  p: 2.5,
  background:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(140deg, #0a0a0a 0%, #111111 55%, #161616 100%)'
      : theme.palette.background.paper,
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'}`,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 0 0 1px rgba(0,0,0,0.3), 0 4px 20px rgba(0,0,0,0.4)'
      : '0 2px 12px rgba(0,0,0,0.08)',
});

const labelSx = {
  fontSize: '0.65rem',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'text.secondary',
  mb: 1,
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
    <Box component="form" id="add-expense-form" onSubmit={handleSubmit}>
      <Stack spacing={1}>
        <Paper sx={cardSx}>
          <Stack spacing={2}>
            {/* Amount */}
            <TextField
              label="Amount"
              value={amount}
              placeholder="0.00"
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d*\.?\d{0,2}$/.test(val)) setAmount(val);
              }}
              required
              inputProps={{ inputMode: 'decimal', pattern: '[0-9]*\\.?[0-9]{0,2}' }}
              InputProps={{
                startAdornment: (
                  <Typography sx={{ mr: 0.5, color: 'text.secondary', fontSize: '1.25rem', fontWeight: 400, lineHeight: 1 }}>$</Typography>
                ),
              }}
              sx={{
                '& input': {
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  py: 0.75,
                  fontFamily: '"Roboto Mono", "Courier New", monospace',
                },
                '& input::placeholder': { opacity: 0.3 },
              }}
              autoComplete="off"
            />

            {/* Note */}
            <TextField
              label="Note"
              placeholder="Add note…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              multiline
              rows={3}
              autoComplete="off"
              sx={{
                '& .MuiInputBase-root': { py: 0.75, fontSize: '1rem' },
                '& textarea::placeholder': { opacity: 0.4 },
              }}
            />

            {/* Inline calendar */}
            <Box>
              <Typography sx={labelSx}>Date</Typography>
              <DateCalendar
                value={date}
                onChange={(d) => d && setDate(d)}
                sx={{
                  width: '100%',
                  maxWidth: '100%',
                  m: 0,
                  height: 'auto',
                  '& .MuiPickersDay-root': { width: 25, height: 25, fontSize: '0.7rem' },
                  '& .MuiDayCalendar-weekDayLabel': { width: 32, fontSize: '0.75rem' },
                  '& .MuiPickersCalendarHeader-root': { pl: 1, pr: 1, mb: 0 },
                  '& .MuiDayCalendar-slideTransition': { minHeight: 140 },
                  '& .MuiDayCalendar-weekContainer': { justifyContent: 'space-around', mb: 0 },
                  '& .MuiDayCalendar-header': { justifyContent: 'space-around' },
                  '& .MuiPickersDay-today': {
                    border: '1px solid',
                    borderColor: 'error.main',
                    color: 'error.main',
                    '&.Mui-selected': { bgcolor: 'error.main', color: '#fff' },
                  },
                }}
              />
            </Box>

            {/* Category */}
            <Box>
              <Typography sx={labelSx}>Category</Typography>
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
      </Stack>

      {createPortal(
        <Box
          sx={{
            position: 'fixed',
            bottom: {
              xs: 'calc(100px + env(safe-area-inset-bottom, 0px))',
              md: 32,
            },
            right: { xs: 16, md: 32 },
            zIndex: 1200,
          }}
        >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 380, damping: 22, delay: 0.05 }}
          whileTap={{ scale: 0.88 }}
          style={{ display: 'flex' }}
        >
            <Fab
              type="submit"
              form="add-expense-form"
              color={success ? 'success' : 'primary'}
              disabled={submitting || !amount}
              aria-label="Save expense"
              sx={{
                boxShadow: success
                  ? '0 0 0 6px rgba(76,175,80,0.18)'
                  : '0 4px 20px rgba(0,0,0,0.45)',
                transition: 'box-shadow 0.3s ease, background-color 0.3s ease',
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {success ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0, rotate: -60 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 60 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 24 }}
                    style={{ display: 'flex' }}
                  >
                    <CheckRoundedIcon />
                  </motion.span>
                ) : (
                  <motion.span
                    key="save"
                    initial={{ scale: 0, rotate: 60 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: -60 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 24 }}
                    style={{ display: 'flex' }}
                  >
                    <SaveRoundedIcon />
                  </motion.span>
                )}
              </AnimatePresence>
            </Fab>
        </motion.div>
        </Box>,
        document.body
      )}
    </Box>
  );
}
