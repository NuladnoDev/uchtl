import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';

function toEmail(username) {
  return `${username.trim().toLowerCase()}@uchtl.app`;
}

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('register'); // 'register' | 'login'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim()) { setError('Введи никнейм'); return; }
    if (password.length < 6) { setError('Пароль минимум 6 символов'); return; }
    setError('');
    setLoading(true);

    const email = toEmail(username);

    if (mode === 'register') {
      const { error: err } = await supabase.auth.signUp({ email, password });
      if (err) {
        setError(err.message.includes('already') ? 'Этот ник уже занят' : err.message);
        setLoading(false);
        return;
      }
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) {
        setError('Неверный ник или пароль');
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    onAuth();
  }

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 24px',
      paddingTop: 'calc(24px + env(safe-area-inset-top))',
      background: 'var(--bg-primary)',
    }}>
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ marginBottom: 40, textAlign: 'center' }}
      >
        <svg width="48" height="48" viewBox="0 0 28 28" fill="none" style={{ marginBottom: 12 }}>
          <path d="M14 2 C14 2 15.2 8.8 18.5 11.5 C21.8 14.2 26 14 26 14 C26 14 21.8 13.8 18.5 16.5 C15.2 19.2 14 26 14 26 C14 26 12.8 19.2 9.5 16.5 C6.2 13.8 2 14 2 14 C2 14 6.2 14.2 9.5 11.5 C12.8 8.8 14 2 14 2 Z" fill="white" />
        </svg>
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.4px' }}>Project</div>
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
          {mode === 'register' ? 'Создай аккаунт' : 'Добро пожаловать'}
        </div>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        onSubmit={handleSubmit}
        style={{ width: '100%', maxWidth: 360 }}
      >
        {/* Mode tabs */}
        <div style={{
          display: 'flex',
          background: 'var(--surface-2)',
          borderRadius: 12,
          padding: 4,
          marginBottom: 24,
        }}>
          {[['register', 'Регистрация'], ['login', 'Войти']].map(([m, label]) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setError(''); }}
              style={{
                flex: 1, height: 38, borderRadius: 9, border: 'none',
                fontSize: 15, fontWeight: 600,
                background: mode === m ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: mode === m ? 'var(--text-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >{label}</button>
          ))}
        </div>

        {/* Username */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Никнейм</div>
          <input
            value={username}
            onChange={e => setUsername(e.target.value.replace(/\s/g, ''))}
            placeholder="например: ivan_petrov"
            autoCapitalize="none"
            autoCorrect="off"
            style={{
              width: '100%', background: 'var(--surface-2)',
              border: '1px solid transparent', borderRadius: 12,
              padding: '13px 14px', fontSize: 16,
              color: 'var(--text-primary)', outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
            onBlur={e => e.target.style.borderColor = 'transparent'}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Пароль</div>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="минимум 6 символов"
            style={{
              width: '100%', background: 'var(--surface-2)',
              border: '1px solid transparent', borderRadius: 12,
              padding: '13px 14px', fontSize: 16,
              color: 'var(--text-primary)', outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
            onBlur={e => e.target.style.borderColor = 'transparent'}
          />
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ fontSize: 13, color: 'var(--danger)', marginBottom: 12, marginTop: 6 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', height: 52, borderRadius: 14,
            border: 'none', marginTop: 10,
            background: 'linear-gradient(135deg, #e8e8e8 0%, #a0a0a0 100%)',
            fontSize: 19, fontWeight: 700,
            fontFamily: "'Nunito', sans-serif",
            color: '#1a1a1a',
            opacity: loading ? 0.6 : 1,
            cursor: loading ? 'default' : 'pointer',
          }}
        >
          {loading ? '...' : mode === 'register' ? 'Создать аккаунт' : 'Войти'}
        </button>
      </motion.form>
    </div>
  );
}
