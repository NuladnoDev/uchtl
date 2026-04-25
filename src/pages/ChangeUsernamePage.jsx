import { useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';

export default function ChangeUsernamePage({ profile, onBack, onSaved }) {
  const [value, setValue] = useState(profile?.username || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSave() {
    if (!value.trim()) { setError('Введи никнейм'); return; }
    if (value.trim() === profile?.username) { onBack(); return; }
    setError('');
    setLoading(true);

    const { error: err } = await supabase
      .from('profiles')
      .update({ username: value.trim(), updated_at: new Date().toISOString() })
      .eq('id', profile.id);

    setLoading(false);
    if (err) {
      setError(err.message.includes('unique') ? 'Этот ник уже занят' : 'Ошибка сохранения');
      return;
    }
    onSaved();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.22 }}
      style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px',
        paddingTop: 'calc(12px + env(safe-area-inset-top))',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
      }}>
        <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span style={{ fontSize: 17, fontWeight: 600 }}>Сменить ник</span>
      </div>

      <div style={{ padding: '28px 20px' }}>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Новый никнейм</div>
        <input
          value={value}
          onChange={e => setValue(e.target.value.replace(/\s/g, ''))}
          autoCapitalize="none"
          autoCorrect="off"
          placeholder="например: ivan_petrov"
          style={{
            width: '100%', background: 'var(--surface-2)',
            border: '1px solid transparent', borderRadius: 12,
            padding: '13px 14px', fontSize: 16,
            color: 'var(--text-primary)', outline: 'none',
          }}
          onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
          onBlur={e => e.target.style.borderColor = 'transparent'}
        />
        {error && <div style={{ fontSize: 13, color: 'var(--danger)', marginTop: 8 }}>{error}</div>}

        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            width: '100%', height: 52, borderRadius: 14, border: 'none',
            marginTop: 24,
            background: 'linear-gradient(135deg, #e8e8e8 0%, #a0a0a0 100%)',
            fontSize: 19, fontWeight: 700, fontFamily: "'Nunito', sans-serif",
            color: '#1a1a1a', opacity: loading ? 0.6 : 1, cursor: loading ? 'default' : 'pointer',
          }}
        >
          {loading ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
    </motion.div>
  );
}
