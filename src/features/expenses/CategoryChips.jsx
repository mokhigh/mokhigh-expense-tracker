import { Box, Chip } from '@mui/material';
import { useCategories } from '../../store/useCategories.js';

export function CategoryChips({ value, onChange }) {
  const categories = useCategories((s) => s.categories);
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {categories.map((cat) => (
        <Chip
          key={cat.id}
          label={cat.label}
          onClick={() => onChange(cat.id)}
          variant={value === cat.id ? 'filled' : 'outlined'}
          sx={{
            borderColor: cat.color,
            color: value === cat.id ? '#fff' : cat.color,
            bgcolor: value === cat.id ? cat.color : 'transparent',
            fontWeight: 600,
            '&:hover': {
              bgcolor: value === cat.id ? cat.color : `${cat.color}22`,
            },
          }}
        />
      ))}
    </Box>
  );
}
