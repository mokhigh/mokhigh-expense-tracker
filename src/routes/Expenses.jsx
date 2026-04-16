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
import { format, isToday, isYesterday } from 'date-fns';
import { useExpenses } from '../store/useExpenses.js';
import { useCategories } from '../store/useCategories.js';
import { EditExpenseDialog } from '../features/expenses/EditExpenseDialog.jsx';

const cardSx = {
  background: 'linear-gradient(140deg, #0a0a0a 0%, #111111 55%, #161616 100%)',
  border: '1px solid rgba(255,255,255,0.07)',
  boxShadow: '0 0 0 1px rgba(0,0,0,0.3), 0 4px 20px rgba(0,0,0,0.4)',
  borderRadius: 2,
};

function dayLabel(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'EEE, MMM d');
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
        <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)}>
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
  const [search, setSearch] = useState('');
  const [editExpense, setEditExpense] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return expenses;
    return expenses.filter(
      (e) =>
        e.note?.toLowerCase().includes(q) ||
        e.category?.toLowerCase().includes(q) ||
        String(e.amount).includes(q),
    );
  }, [expenses, search]);

  const grouped = useMemo(() => {
    const map = new Map();
    for (const e of filtered) {
      const key = e.spent_at.slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(e);
    }
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  return (
    <Stack spacing={2}>
      <Typography variant="h1">Expenses</Typography>

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
        <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
          {search ? 'No results.' : 'No expenses yet — add your first!'}
        </Typography>
      ) : (
        grouped.map(([day, items]) => (
          <Paper key={day} sx={cardSx}>
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
                  color: 'rgba(255,255,255,0.35)',
                }}
              >
                {dayLabel(day)}
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Roboto Mono", "Courier New", monospace',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.4)',
                }}
              >
                ${items.reduce((sum, e) => sum + Number(e.amount), 0).toFixed(2)}
              </Typography>
            </Box>
            <List disablePadding sx={{ px: 2 }}>
              {items.map((e, i) => (
                <Box key={e.id}>
                  <ExpenseItem expense={e} onDelete={deleteExpense} onEdit={setEditExpense} />
                  {i < items.length - 1 && <Divider />}
                </Box>
              ))}
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
