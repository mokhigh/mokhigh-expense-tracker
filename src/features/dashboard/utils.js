const TZ = 'America/Mazatlan';

export const tzDate = (d) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d instanceof Date ? d : new Date(d));

export const tzYM = (d) => tzDate(d).slice(0, 7);
export const dayOf = (e) => parseInt(tzDate(e.spent_at).slice(8));

export const EASE = [0.22, 1, 0.36, 1];
export const cardMotion = (i) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: EASE, delay: 0.05 + i * 0.06 },
});

export const getCardSx = (theme) => ({
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

export const getHeroSx = (theme) => ({
  p: { xs: 2.5, md: 3 },
  background:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(140deg, #080e24 0%, #0e1a45 55%, #142060 100%)'
      : 'linear-gradient(140deg, #eef0ff 0%, #e8ecff 55%, #e3e9ff 100%)',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(99,130,255,0.18)' : 'rgba(99,130,255,0.25)'}`,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 0 0 1px rgba(99,130,255,0.08), 0 8px 40px rgba(14,26,69,0.7), 0 0 60px rgba(30,58,138,0.25)'
      : '0 4px 20px rgba(99,130,255,0.15)',
});
