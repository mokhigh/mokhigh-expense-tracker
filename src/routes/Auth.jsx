import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useAuth } from '../store/useAuth.js';

export default function Auth() {
  const navigate = useNavigate();
  const signIn = useAuth((s) => s.signIn);
  const verifyOtp = useAuth((s) => s.verifyOtp);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('email'); // 'email' | 'code'
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSend(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signIn(email);
      setStep('code');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await verifyOtp(email, code.trim());
      navigate('/add', { replace: true });
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

        {step === 'email' ? (
          <>
            {error && <Alert severity="error">{error}</Alert>}
            <Typography color="text.secondary" textAlign="center">
              Enter your email to receive a sign-in code.
            </Typography>
            <Box component="form" onSubmit={handleSend}>
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
                  {loading ? 'Sending…' : 'Send sign-in code'}
                </Button>
              </Stack>
            </Box>
          </>
        ) : (
          <>
            {error && <Alert severity="error">{error}</Alert>}
            <Typography color="text.secondary" textAlign="center">
              Check your email for a 6-digit code and enter it below.
            </Typography>
            <Box component="form" onSubmit={handleVerify}>
              <Stack spacing={2}>
                <TextField
                  label="6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  autoFocus
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  inputProps={{ maxLength: 6 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading || code.trim().length < 6}
                  fullWidth
                >
                  {loading ? 'Verifying…' : 'Sign in'}
                </Button>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => { setStep('email'); setError(null); setCode(''); }}
                >
                  Use a different email
                </Button>
              </Stack>
            </Box>
          </>
        )}
      </Stack>
    </Box>
  );
}
