import { useEffect, useMemo, useRef, useState } from 'react';
import { Reorder, useDragControls } from 'motion/react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../store/useAuth.js';
import { useExpenses } from '../store/useExpenses.js';
import { useBudgets } from '../store/useBudgets.js';
import { useRecurring } from '../store/useRecurring.js';
import { useCategories } from '../store/useCategories.js';
import { isSupabaseConfigured } from '../lib/supabase.js';
import { CategoryChips } from '../features/expenses/CategoryChips.jsx';

const cardSx = {
  p: 2.5,
  background: 'linear-gradient(140deg, #0a0a0a 0%, #111111 55%, #161616 100%)',
  border: '1px solid rgba(255,255,255,0.07)',
  boxShadow: '0 0 0 1px rgba(0,0,0,0.3), 0 4px 20px rgba(0,0,0,0.4)',
};

const sectionLabelSx = {
  fontSize: '0.65rem',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.35)',
  mb: 1.5,
};

// ---- helpers ----

function triggerDownload(content, filename, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  a.click();
  URL.revokeObjectURL(url);
}

// ---- Export ----

function ExportSection({ expenses }) {
  function handleCSV() {
    const cols = ['id', 'amount', 'currency', 'category', 'note', 'spent_at', 'created_at'];
    const rows = expenses.map((e) => cols.map((c) => JSON.stringify(e[c] ?? '')).join(','));
    triggerDownload([cols.join(','), ...rows].join('\n'), 'expenses.csv', 'text/csv');
  }

  function handleJSON() {
    triggerDownload(JSON.stringify(expenses, null, 2), 'expenses.json', 'application/json');
  }

  return (
    <Paper sx={cardSx}>
      <Typography sx={sectionLabelSx}>Export data</Typography>
      <Stack direction="row" spacing={1}>
        <Button variant="outlined" size="small" onClick={handleCSV}>
          Download CSV
        </Button>
        <Button variant="outlined" size="small" onClick={handleJSON}>
          Download JSON
        </Button>
      </Stack>
    </Paper>
  );
}

// ---- Budgets ----

function BudgetRow({ cat, initialAmount, onSave }) {
  const [value, setValue] = useState(initialAmount != null ? String(initialAmount) : '');
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setValue(initialAmount != null ? String(initialAmount) : '');
  }, [initialAmount, focused]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box
        sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: cat.color, flexShrink: 0 }}
      />
      <Typography sx={{ flex: 1, fontSize: '0.875rem' }}>{cat.label}</Typography>
      <TextField
        size="small"
        placeholder="No limit"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          onSave(cat.id, value);
        }}
        inputProps={{ inputMode: 'decimal' }}
        InputProps={{
          startAdornment: (
            <Typography sx={{ mr: 0.25, fontSize: '0.875rem', color: 'text.secondary' }}>
              $
            </Typography>
          ),
        }}
        sx={{ width: 110 }}
      />
    </Box>
  );
}

function BudgetsSection({ categories, budgets, onSet }) {
  const budgetMap = useMemo(
    () => Object.fromEntries(budgets.map((b) => [b.category, b.amount])),
    [budgets],
  );

  return (
    <Paper sx={cardSx}>
      <Typography sx={sectionLabelSx}>Monthly budgets</Typography>
      <Stack spacing={1.5}>
        {categories.map((cat) => (
          <BudgetRow
            key={cat.id}
            cat={cat}
            initialAmount={budgetMap[cat.id]}
            onSave={onSet}
          />
        ))}
      </Stack>
    </Paper>
  );
}

// ---- Recurring ----

function RecurringSection({ categories, recurring, onAdd, onDelete }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [day, setDay] = useState('1');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!category && categories.length > 0) setCategory(categories[0].id);
  }, [category, categories]);

  function getCatLabel(id) {
    return categories.find((c) => c.id === id)?.label ?? id;
  }

  function handleAdd() {
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) return;
    const dayNum = Math.min(Math.max(1, parseInt(day, 10) || 1), 31);
    onAdd({ amount: parsed, category, day_of_month: dayNum, note: note.trim() || null });
    setAmount('');
    setDay('1');
    setNote('');
    setOpen(false);
  }

  return (
    <Paper sx={cardSx}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Typography sx={sectionLabelSx}>Recurring expenses</Typography>
        <IconButton size="small" onClick={() => setOpen(true)} sx={{ mt: -1.5 }}>
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>

      {recurring.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          None set
        </Typography>
      ) : (
        <List disablePadding>
          {recurring.map((r, i) => (
            <Box key={r.id}>
              {i > 0 && <Divider />}
              <ListItem
                disableGutters
                secondaryAction={
                  <IconButton size="small" onClick={() => onDelete(r.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                }
                sx={{ py: 0.75 }}
              >
                <ListItemText
                  primary={`$${Number(r.amount).toFixed(2)} · ${getCatLabel(r.category)}`}
                  secondary={`Day ${r.day_of_month} of every month${r.note ? ` · ${r.note}` : ''}`}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    fontFamily: '"Roboto Mono", "Courier New", monospace',
                  }}
                  secondaryTypographyProps={{ fontSize: '0.75rem' }}
                />
              </ListItem>
            </Box>
          ))}
        </List>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>New recurring expense</DialogTitle>
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
            <TextField
              label="Day of month"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              inputProps={{ inputMode: 'numeric', min: 1, max: 31 }}
              helperText="If the day doesn't exist in a given month, the last day is used instead"
            />
            <TextField
              label="Note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd} disabled={!amount || !category}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

// ---- Categories ----

function CategoryDialog({ cat, onClose, onSave }) {
  const [label, setLabel] = useState(cat?.label ?? '');
  const [color, setColor] = useState(cat?.color ?? '#6366f1');

  function handleSave() {
    if (!label.trim()) return;
    onSave({
      id: cat?.id ?? label.trim().toLowerCase().replace(/\s+/g, '-'),
      label: label.trim(),
      color,
      sort_order: cat?.sort_order ?? Date.now(),
    });
    onClose();
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{cat ? 'Edit category' : 'New category'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Name"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            autoFocus
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Color
            </Typography>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{ width: 44, height: 30, border: 'none', cursor: 'pointer', background: 'none' }}
            />
            <Box sx={{ width: 22, height: 22, borderRadius: '50%', bgcolor: color }} />
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={!label.trim()}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function DraggableCategoryItem({ cat, isLast, totalCount, onEdit, onDelete, onDragEnd }) {
  const controls = useDragControls();
  return (
    <Reorder.Item as="div" value={cat} dragListener={false} dragControls={controls} onDragEnd={onDragEnd}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          py: 0.75,
          ...(!isLast && { borderBottom: '1px solid', borderColor: 'divider' }),
        }}
      >
        <Box
          onPointerDown={(e) => controls.start(e)}
          sx={{ cursor: 'grab', touchAction: 'none', color: 'text.disabled', mr: 0.5, display: 'flex', alignItems: 'center' }}
        >
          <DragIndicatorIcon fontSize="small" />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: cat.color, flexShrink: 0 }} />
          <Typography sx={{ fontSize: '0.875rem' }}>{cat.label}</Typography>
        </Box>
        <Box sx={{ display: 'flex' }}>
          <IconButton size="small" onClick={() => onEdit(cat)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => onDelete(cat.id)} disabled={totalCount <= 1}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Reorder.Item>
  );
}

function CategoriesSection({ categories, onSave, onDelete, onReorder }) {
  const [adding, setAdding] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [localCats, setLocalCats] = useState(categories);
  const localCatsRef = useRef(categories);

  useEffect(() => {
    setLocalCats(categories);
    localCatsRef.current = categories;
  }, [categories]);

  function handleReorder(newOrder) {
    setLocalCats(newOrder);
    localCatsRef.current = newOrder;
  }

  function handleDragEnd() {
    onReorder(localCatsRef.current.map((c) => c.id));
  }

  return (
    <Paper sx={cardSx}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Typography sx={sectionLabelSx}>Categories</Typography>
        <IconButton size="small" onClick={() => setAdding(true)} sx={{ mt: -1.5 }}>
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>

      <Reorder.Group as="div" axis="y" values={localCats} onReorder={handleReorder} style={{ margin: 0, padding: 0 }}>
        {localCats.map((cat, i) => (
          <DraggableCategoryItem
            key={cat.id}
            cat={cat}
            isLast={i === localCats.length - 1}
            totalCount={localCats.length}
            onEdit={setEditCat}
            onDelete={onDelete}
            onDragEnd={handleDragEnd}
          />
        ))}
      </Reorder.Group>

      {adding && (
        <CategoryDialog cat={null} onClose={() => setAdding(false)} onSave={onSave} />
      )}
      {editCat && (
        <CategoryDialog cat={editCat} onClose={() => setEditCat(null)} onSave={onSave} />
      )}
    </Paper>
  );
}

// ---- Danger Zone ----

function DangerZoneSection({ onClearExpenses }) {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);

  function handleClose() {
    setOpen(false);
    setConfirm('');
  }

  async function handleClear() {
    setBusy(true);
    try {
      await onClearExpenses();
      handleClose();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Paper
      sx={{
        ...cardSx,
        border: '1px solid',
        borderColor: 'error.main',
      }}
    >
      <Typography sx={{ ...sectionLabelSx, color: 'error.main' }}>Danger zone</Typography>
      <Button
        variant="outlined"
        color="error"
        size="small"
        onClick={() => setOpen(true)}
      >
        Clear all expenses
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>Clear all expenses?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            This permanently deletes every expense from local storage and your Supabase account.
            This cannot be undone.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Type <strong>DELETE</strong> to confirm
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="DELETE"
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            disabled={confirm !== 'DELETE' || busy}
            onClick={handleClear}
          >
            {busy ? 'Clearing…' : 'Clear all'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

// ---- Main ----

export default function Settings() {
  const user = useAuth((s) => s.user);
  const signOut = useAuth((s) => s.signOut);
  const expenses = useExpenses((s) => s.expenses);
  const clearExpenses = useExpenses((s) => s.clearExpenses);
  const budgets = useBudgets((s) => s.budgets);
  const setBudget = useBudgets((s) => s.setBudget);
  const recurring = useRecurring((s) => s.recurring);
  const addRecurring = useRecurring((s) => s.addRecurring);
  const deleteRecurring = useRecurring((s) => s.deleteRecurring);
  const categories = useCategories((s) => s.categories);
  const saveCategory = useCategories((s) => s.saveCategory);
  const deleteCategory = useCategories((s) => s.deleteCategory);
  const reorderCategories = useCategories((s) => s.reorderCategories);

  return (
    <Stack spacing={2}>
      <Typography variant="h1">Settings</Typography>
      <CategoriesSection
        categories={categories}
        onSave={saveCategory}
        onDelete={deleteCategory}
        onReorder={reorderCategories}
      />
      <BudgetsSection categories={categories} budgets={budgets} onSet={setBudget} />
      <RecurringSection
        categories={categories}
        recurring={recurring}
        onAdd={addRecurring}
        onDelete={deleteRecurring}
      />
      <ExportSection expenses={expenses} />
      <DangerZoneSection onClearExpenses={clearExpenses} />
      <Paper sx={cardSx}>
        <Stack spacing={2}>
          <Box>
            <Typography sx={sectionLabelSx}>Account</Typography>
            {user ? (
              <Typography variant="body1" fontWeight={600} sx={{ color: '#ffffff' }}>
                {user.email}
              </Typography>
            ) : isSupabaseConfigured ? (
              <Typography variant="body2" color="text.secondary">
                Not signed in
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Local mode (Supabase not configured)
              </Typography>
            )}
          </Box>
          {user && (
            <>
              <Divider />
              <Button variant="outlined" color="error" onClick={signOut}>
                Sign out
              </Button>
            </>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
}
