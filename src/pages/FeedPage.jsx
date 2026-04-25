import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import TeacherCard from '../components/TeacherCard';
import SuggestSheet from '../components/SuggestSheet';
import ProfileSheet from '../components/ProfileSheet';
import Avatar from '../components/Avatar';
import SkeletonCard from '../components/SkeletonCard';
import { supabase } from '../lib/supabase';

// 11 мая 2025, 00:00 по МСК (UTC+3)
const DEADLINE = new Date('2026-05-11T00:00:00+03:00');

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, DEADLINE - Date.now()));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(Math.max(0, DEADLINE - Date.now())), 1000);
    return () => clearInterval(id);
  }, []);

  const d = Math.floor(timeLeft / 86400000);
  const h = Math.floor((timeLeft % 86400000) / 3600000);
  const m = Math.floor((timeLeft % 3600000) / 60000);
  const s = Math.floor((timeLeft % 60000) / 1000);
  return { d, h, m, s, expired: timeLeft === 0 };
}

function Countdown() {
  const { d, h, m, s, expired } = useCountdown();

  const pad = n => String(n).padStart(2, '0');

  return (
    <div style={{
      margin: '0 0 12px',
      borderRadius: 14,
      background: 'var(--surface-2)',
      border: 'none',
      padding: '12px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D45E5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, color: 'rgba(212,94,94,0.8)', marginBottom: 3 }}>
          Проект завершит работу 11 мая
        </div>
        {expired ? (
          <div style={{ fontSize: 14, fontWeight: 700, color: '#D45E5E' }}>Проект завершён</div>
        ) : (
          <div style={{ fontSize: 15, fontWeight: 700, color: '#E1E3E6', letterSpacing: '0.5px' }}>
            {d > 0 && <span>{d}д </span>}
            <span>{pad(h)}:</span>
            <span>{pad(m)}:</span>
            <span>{pad(s)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FeedPage({ onSelectTeacher, profile, onChangeUsername, onChangeAvatar, onCreateTeacher }) {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [showSuggest, setShowSuggest] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.4px', color: 'var(--text-primary)' }}>
            Project
          </h1>
          {profile && (
            <div
              onClick={() => setShowProfile(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
            >
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{profile.username}</span>
              <Avatar name={profile.username} tag={profile.username} avatarUrl={profile.avatar_url} size={32} />
            </div>
          )}
        </div>
        <Countdown />
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
            placeholder="Имя, должность..."
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
        {loading && [0,1,2].map(i => <SkeletonCard key={i} />)}
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

        {/* Suggest banner */}
        {!loading && !query && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setShowSuggest(true)}
            style={{
              borderRadius: 16,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-card)',
              padding: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              marginTop: 4,
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 12, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M14 2 C14 2 15.2 8.8 18.5 11.5 C21.8 14.2 26 14 26 14 C26 14 21.8 13.8 18.5 16.5 C15.2 19.2 14 26 14 26 C14 26 12.8 19.2 9.5 16.5 C6.2 13.8 2 14 2 14 C2 14 6.2 14.2 9.5 11.5 C12.8 8.8 14 2 14 2 Z" fill="white"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                Предложить учителя
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Хочешь видеть здесь ещё кого нибудь?
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto', opacity: 0.3, flexShrink: 0 }}>
              <path d="M9 18l6-6-6-6" />
            </svg>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showSuggest && <SuggestSheet onClose={() => setShowSuggest(false)} />}
        {showProfile && (
          <ProfileSheet
            profile={profile}
            onClose={() => setShowProfile(false)}
            onChangeUsername={() => { setShowProfile(false); onChangeUsername(); }}
            onChangeAvatar={() => { setShowProfile(false); onChangeAvatar(); }}
            onCreateTeacher={() => { setShowProfile(false); onCreateTeacher(); }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
