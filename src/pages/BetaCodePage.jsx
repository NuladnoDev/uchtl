import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BETA_CODES } from '../data/betaCodes';
import { supabase } from '../lib/supabase';

const CODE_LENGTH = 6;
const STORAGE_KEY = 'beta_unlocked';

export default function BetaCodePage({ onBack, onSuccess }) {
  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const inputs = useRef([]);

  // автофокус при открытии
  useState(() => {
    setTimeout(() => inputs.current[0]?.focus(), 100);
  });

  function handleChange(i, val) {
    const char = val.toUpperCase().slice(-1);
    if (!char) return;
    const next = [...digits];
    next[i] = char;
    setDigits(next);
    setError(false);
    if (i < CODE_LENGTH - 1) inputs.current[i + 1]?.focus();
    // auto-check when full
    if (next.every(d => d) && i === CODE_LENGTH - 1) {
      check(next.join(''));
    }
  }

  function handleKeyDown(i, e) {
    if (e.key === 'Backspace') {
      const next = [...digits];
      if (digits[i]) {
        next[i] = '';
        setDigits(next);
      } else if (i > 0) {
        next[i - 1] = '';
        setDigits(next);
        inputs.current[i - 1]?.focus();
      }
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').toUpperCase().replace(/\s/g, '').slice(0, CODE_LENGTH);
    const next = Array(CODE_LENGTH).fill('');
    pasted.split('').forEach((c, i) => { next[i] = c; });
    setDigits(next);
    inputs.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus();
    if (pasted.length === CODE_LENGTH) check(pasted);
  }

  async function check(code) {
    if (!BETA_CODES.includes(code)) {
      setError('Неверный код');
      triggerShake();
      return;
    }

    // проверяем не использован ли
    const { data: used } = await supabase
      .from('beta_codes_used')
      .select('code')
      .eq('code', code)
      .single();

    if (used) {
      setError('Код уже был использован');
      triggerShake();
      return;
    }

    // помечаем как использованный
    const { data: session } = await supabase.auth.getSession();
    await supabase.from('beta_codes_used').insert({
      code,
      user_id: session?.session?.user?.id ?? null,
    });

    // сохраняем локально что этот юзер уже прошёл
    localStorage.setItem(STORAGE_KEY, '1');
    onSuccess();
  }

  function triggerShake() {
    setShake(true);
    setTimeout(() => setShake(false), 500);
    setDigits(Array(CODE_LENGTH).fill(''));
    setTimeout(() => inputs.current[0]?.focus(), 50);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.22 }}
      style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', position: 'fixed', inset: 0 }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px',
        paddingTop: 'calc(12px + env(safe-area-inset-top))',
        flexShrink: 0,
      }}>
        <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'flex-start',
        padding: '80px 32px 60px',
        overflowY: 'auto',
      }}>
        <motion.div
          animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
          transition={{ duration: 0.45 }}
          style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <div style={{ marginBottom: 20 }}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="15" r="4"/>
              <path d="M12 15h8"/>
              <path d="M18 15v-2"/>
              <path d="M20 15v-2"/>
            </svg>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 8, letterSpacing: '-0.3px' }}>
            Код тестировщика
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 36, textAlign: 'center', lineHeight: 1.5 }}>
            Введи код чтобы получить ранний доступ
          </div>

          {/* Code inputs */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={el => inputs.current[i] = el}
                value={d}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                onPaste={handlePaste}
                maxLength={2}
                autoCapitalize="characters"
                style={{
                  width: 44, height: 54, borderRadius: 12,
                  background: '#0d0d0d',
                  border: `1.5px solid ${error ? 'rgba(212,94,94,0.4)' : d ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'}`,
                  fontSize: 22, fontWeight: 700, color: '#fff',
                  textAlign: 'center', outline: 'none',
                  transition: 'all 0.15s',
                  caretColor: 'transparent',
                }}
                onFocus={e => e.target.style.borderColor = error ? 'rgba(212,94,94,0.4)' : 'rgba(255,255,255,0.2)'}
                onBlur={e => e.target.style.borderColor = error ? 'rgba(212,94,94,0.4)' : d ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'}
              />
            ))}
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ fontSize: 13, color: 'var(--danger)', marginBottom: 8 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
