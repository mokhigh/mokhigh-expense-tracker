import { useState } from 'react';
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useAuth } from '../store/useAuth.js';

export default function Auth() {
  const signIn = useAuth((s) => s.signIn);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signIn(email);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        bgcolor: 'background.default',
      }}
    >
      <Stack spacing={3} sx={{ width: '100%', maxWidth: 400 }}>
        <Typography variant="h1" textAlign="center">
          Expense Tracker
        </Typography>
        {sent ? (
          <Alert severity="success">
            Check your email — we sent you a sign-in link.
          </Alert>
        ) : (
          <>
            {error && <Alert severity="error">{error}</Alert>}
            <Typography color="text.secondary" textAlign="center">
              Enter your email to receive a sign-in link.
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  inputMode="email"
                  autoComplete="email"
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  fullWidth
                >
                  {loading ? 'Sending…' : 'Send sign-in link'}
                </Button>
              </Stack>
            </Box>
          </>
        )}
      </Stack>
    </Box>
  );
}
