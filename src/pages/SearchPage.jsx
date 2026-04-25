import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { teachers } from '../data/teachers';
import Avatar from '../components/Avatar';

export default function SearchPage({ onSelectTeacher }) {
  const [query, setQuery] = useState('');

  const results = query.trim()
    ? teachers.filter(t =>
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.tag.toLowerCase().includes(query.toLowerCase()) ||
        t.subject.toLowerCase().includes(query.toLowerCase())
      )
    : teachers;

  function highlight(text, q) {
    if (!q.trim()) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span style={{ color: 'var(--accent)' }}>{text.slice(idx, idx + q.length)}</span>
        {text.slice(idx + q.length)}
      </>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{
        padding: '16px 16px 12px',
        paddingTop: 'calc(16px + env(safe-area-inset-top))',
        flexShrink: 0,
      }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.4px', marginBottom: 12 }}>
          Поиск
        </h1>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          height: 48,
          borderRadius: 12,
          background: 'linear-gradient(90deg, #111111, #1D1F1D)',
          padding: '0 14px',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5, flexShrink: 0 }}>
            <circle cx="11" cy="11" r="7" />
            <path d="M16.5 16.5L21 21" />
          </svg>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Имя, предмет или тег..."
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              fontSize: 16,
              color: 'var(--text-primary)',
            }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ color: 'var(--text-muted)', fontSize: 18, lineHeight: 1 }}>×</button>
          )}
        </div>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain',
        padding: '0 16px',
        paddingBottom: 'calc(var(--bottom-nav-height) + 16px)',
      }}>
        <AnimatePresence>
          {results.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: i * 0.03 }}
              onClick={() => onSelectTeacher(t)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 0',
                borderBottom: '1px solid var(--divider)',
                cursor: 'pointer',
              }}
            >
              <Avatar name={t.name} tag={t.tag} size={44} online={t.online} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {highlight(t.name, query)}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  @{highlight(t.tag, query)} · {highlight(t.subject, query)}
                </div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
                <path d="M9 18l6-6-6-6" />
              </svg>
            </motion.div>
          ))}
        </AnimatePresence>

        {results.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)', fontSize: 14 }}>
            Никого не нашли по запросу «{query}»
          </div>
        )}
      </div>
    </motion.div>
  );
}
