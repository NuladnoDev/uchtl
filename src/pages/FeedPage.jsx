import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import TeacherCard from '../components/TeacherCard';
import { supabase } from '../lib/supabase';

export default function FeedPage({ onSelectTeacher }) {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    supabase
      .from('teachers')
      .select('*')
      .order('id')
      .then(({ data, error }) => {
        if (!error && data) setTeachers(data);
        setLoading(false);
      });
  }, []);

  const results = query.trim()
    ? teachers.filter(t =>
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.tag.toLowerCase().includes(query.toLowerCase()) ||
        t.subject.toLowerCase().includes(query.toLowerCase())
      )
    : teachers;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
    >
      <div style={{
        padding: '16px 16px 12px',
        paddingTop: 'calc(16px + env(safe-area-inset-top))',
        flexShrink: 0,
      }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.4px', color: 'var(--text-primary)', marginBottom: 12 }}>
          Учителя
        </h1>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          height: 48, borderRadius: 12,
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
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 16, color: 'var(--text-primary)' }}
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                onClick={() => setQuery('')}
                style={{ color: 'var(--text-muted)', fontSize: 20, lineHeight: 1 }}
              >×</motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="feed-scroll" style={{
        flex: 1, overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain',
        padding: '0 16px 24px',
      }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)', fontSize: 14 }}>
            Загрузка...
          </div>
        )}
        <AnimatePresence>
          {results.map((teacher, i) => (
            <TeacherCard
              key={teacher.id}
              teacher={teacher}
              index={i}
              onClick={onSelectTeacher}
            />
          ))}
        </AnimatePresence>
        {!loading && results.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)', fontSize: 14 }}>
            {query ? `Никого не нашли по запросу «${query}»` : 'Нет учителей'}
          </div>
        )}
      </div>
    </motion.div>
  );
}
