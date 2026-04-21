import { useState, useMemo } from 'react';
import {
  Box,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  Menu,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { AnimatePresence, motion } from 'motion/react';
import { format } from 'date-fns';
import { useExpenses } from '../store/useExpenses.js';
import { useCategories } from '../store/useCategories.js';
import { EditExpenseDialog } from '../features/expenses/EditExpenseDialog.jsx';

const TZ = 'America/Mazatlan';

const toMonthKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

const currentMonthKey = toMonthKey(new Date());
const tzDate = (d) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d instanceof Date ? d : new Date(d));

const cardSx = (theme) => ({
  background:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(140deg, #0a0a0a 0%, #111111 55%, #161616 100%)'
      : theme.palette.background.paper,
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'}`,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 0 0 1px rgba(0,0,0,0.3), 0 4px 20px rgba(0,0,0,0.4)'
      : '0 2px 12px rgba(0,0,0,0.08)',
  borderRadius: 2,
});

const EASE = [0.22, 1, 0.36, 1];
const groupMotion = (i) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.32, ease: EASE, delay: Math.min(i, 6) * 0.05 },
});

const itemMotion = {
  initial: { opacity: 0, x: -12 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 24, transition: { duration: 0.18 } },
  transition: { duration: 0.25, ease: EASE },
};

function dayLabel(dateStr) {
  const today = tzDate(new Date());
  if (dateStr === today) return 'Today';
  const [y, m, d] = today.split('-').map(Number);
  if (dateStr === tzDate(new Date(y, m - 1, d - 1))) return 'Yesterday';
  return format(new Date(dateStr + 'T12:00:00'), 'EEE, MMM d');
}

function MonthCarousel({ value, onChange }) {
  const isNow = value === currentMonthKey;

  const shift = (delta) => {
    const [y, m] = value.split('-').map(Number);
    onChange(toMonthKey(new Date(y, m - 1 + delta, 1)));
  };

  return (
    <Box
      component={motion.div}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.1}
      onDragEnd={(_, info) => {
        if (info.offset.x > 60) shift(-1);
        else if (info.offset.x < -60 && !isNow) shift(1);
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.5,
        py: 0.5,
        userSelect: 'none',
        touchAction: 'pan-y',
      }}
    >
      <IconButton size="small" onClick={() => shift(-1)}>
        <ChevronLeftIcon fontSize="small" />
      </IconButton>
      <Typography
        sx={{
          minWidth: 148,
          textAlign: 'center',
          fontWeight: 700,
          fontSize: '0.9rem',
          letterSpacing: '0.02em',
        }}
      >
        {format(new Date(`${value}-01`), 'MMMM yyyy')}
      </Typography>
      <IconButton size="small" onClick={() => shift(1)} disabled={isNow}>
        <ChevronRightIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}

function ExpenseItem({ expense, onDelete, onEdit }) {
  const [anchor, setAnchor] = useState(null);
  const categories = useCategories((s) => s.categories);
  const cat = categories.find((c) => c.id === expense.category) ?? {
    label: expense.category ?? 'Other',
    color: '#94a3b8',
  };

  return (
    <ListItem
      disableGutters
      secondaryAction={
        <IconButton
          size="small"
          onClick={(e) => setAnchor(e.currentTarget)}
          component={motion.button}
          whileTap={{ scale: 0.85 }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      }
      sx={{ py: 1 }}
    >
      <Stack sx={{ flex: 1, minWidth: 0, pr: 1 }} spacing={0.25}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="body1"
            fontWeight={600}
            sx={{ fontFamily: '"Roboto Mono", "Courier New", monospace' }}
          >
            ${Number(expense.amount).toFixed(2)}
          </Typography>
          <Chip
            label={cat.label}
            size="small"
            sx={{
              bgcolor: `${cat.color}20`,
              color: cat.color,
              fontWeight: 600,
              fontSize: '0.7rem',
              height: 22,
            }}
          />
        </Box>
        {expense.note && (
          <Typography variant="body2" color="text.secondary" noWrap>
            {expense.note}
          </Typography>
        )}
      </Stack>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        <MenuItem onClick={() => { setAnchor(null); onEdit(expense); }}>
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => { setAnchor(null); onDelete(expense.id); }}
          sx={{ color: 'error.main' }}
        >
          Delete
        </MenuItem>
      </Menu>
    </ListItem>
  );
}

export default function Expenses() {
  const expenses = useExpenses((s) => s.expenses);
  const deleteExpense = useExpenses((s) => s.deleteExpense);
  const updateExpense = useExpenses((s) => s.updateExpense);
  const [monthKey, setMonthKey] = useState(currentMonthKey);
  const [search, setSearch] = useState('');
  const [editExpense, setEditExpense] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const base = expenses.filter((e) => tzDate(e.spent_at).startsWith(monthKey));
    if (!q) return base;
    return base.filter(
      (e) =>
        e.note?.toLowerCase().includes(q) ||
        e.category?.toLowerCase().includes(q) ||
        String(e.amount).includes(q),
    );
  }, [expenses, search, monthKey]);

  const grouped = useMemo(() => {
    const map = new Map();
    for (const e of filtered) {
      const key = tzDate(e.spent_at);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(e);
    }
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  return (
    <Stack spacing={2}>
      <MonthCarousel value={monthKey} onChange={setMonthKey} />
      <TextField
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {grouped.length === 0 ? (
        <Typography
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          color="text.secondary"
          sx={{ textAlign: 'center', mt: 4 }}
        >
          {search
            ? 'No results.'
            : `No expenses in ${format(new Date(`${monthKey}-01`), 'MMMM yyyy')}.`}
        </Typography>
      ) : (
        grouped.map(([day, items], gi) => (
          <Paper key={day} component={motion.div} {...groupMotion(gi)} sx={cardSx}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 2,
                pt: 2,
                pb: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'text.secondary',
                }}
              >
                {dayLabel(day)}
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Roboto Mono", "Courier New", monospace',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'text.secondary',
                }}
              >
                ${items.reduce((sum, e) => sum + Number(e.amount), 0).toFixed(2)}
              </Typography>
            </Box>
            <List disablePadding sx={{ px: 2 }}>
              <AnimatePresence initial={false}>
                {items.map((e, i) => (
                  <Box key={e.id} component={motion.div} {...itemMotion}>
                    <ExpenseItem expense={e} onDelete={deleteExpense} onEdit={setEditExpense} />
                    {i < items.length - 1 && <Divider />}
                  </Box>
                ))}
              </AnimatePresence>
            </List>
          </Paper>
        ))
      )}

      {editExpense && (
        <EditExpenseDialog
          key={editExpense.id}
          expense={editExpense}
          onClose={() => setEditExpense(null)}
          onSave={updateExpense}
        />
      )}
    </Stack>
  );
}
