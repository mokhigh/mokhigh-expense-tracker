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

function dayLabel(dateStr) {
  const d = new Date(dateStr);
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
          <Typography variant="body1" fontWeight={600}>
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
          <Box key={day}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, px: 0.5 }}>
              <Typography variant="body2" fontWeight={600} color="text.secondary">
                {dayLabel(day)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ${items.reduce((sum, e) => sum + Number(e.amount), 0).toFixed(2)}
              </Typography>
            </Box>
            <List
              disablePadding
              sx={{ bgcolor: 'background.paper', borderRadius: 2, px: 2 }}
            >
              {items.map((e, i) => (
                <Box key={e.id}>
                  <ExpenseItem expense={e} onDelete={deleteExpense} onEdit={setEditExpense} />
                  {i < items.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </Box>
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
