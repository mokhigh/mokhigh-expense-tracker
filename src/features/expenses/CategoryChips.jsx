import { Box, Chip } from '@mui/material';
import { motion } from 'motion/react';
import { useCategories } from '../../store/useCategories.js';

export function CategoryChips({ value, onChange }) {
  const categories = useCategories((s) => s.categories);
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {categories.map((cat, i) => (
        <Box
          key={cat.id}
          component={motion.div}
          initial={{ opacity: 0, y: 6, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1], delay: i * 0.025 }}
          whileTap={{ scale: 0.92 }}
          sx={{ display: 'inline-flex' }}
        >
          <Chip
            label={cat.label}
            onClick={() => onChange(cat.id)}
            variant={value === cat.id ? 'filled' : 'outlined'}
            sx={{
              borderColor: cat.color,
              color: value === cat.id ? '#fff' : cat.color,
              bgcolor: value === cat.id ? cat.color : 'transparent',
              fontWeight: 600,
              transition: 'background-color 0.2s ease, color 0.2s ease',
              '&:hover': {
                bgcolor: value === cat.id ? cat.color : `${cat.color}22`,
              },
            }}
          />
        </Box>
      ))}
    </Box>
  );
}
