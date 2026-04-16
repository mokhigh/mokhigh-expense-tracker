import { useEffect } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

import AppShell from './components/layout/AppShell.jsx';
import AddExpense from './routes/AddExpense.jsx';
import Auth from './routes/Auth.jsx';
import Dashboard from './routes/Dashboard.jsx';
import Expenses from './routes/Expenses.jsx';
import Settings from './routes/Settings.jsx';
import { useAuth } from './store/useAuth.js';
import { isSupabaseConfigured } from './lib/supabase.js';

function RequireAuth() {
  const user = useAuth((s) => s.user);
  const loading = useAuth((s) => s.loading);

  if (loading) return null;
  if (isSupabaseConfigured && !user) return <Navigate to="/auth" replace />;
  return <Outlet />;
}

export default function App() {
  const init = useAuth((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route element={<RequireAuth />}>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/add" replace />} />
          <Route path="/add" element={<AddExpense />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/add" replace />} />
    </Routes>
  );
}
