import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';

const FAKE_AVATARS = [
  'https://i.pravatar.cc/40?img=1',
  'https://i.pravatar.cc/40?img=2',
  'https://i.pravatar.cc/40?img=3',
  'https://i.pravatar.cc/40?img=4',
  'https://i.pravatar.cc/40?img=5',
  'https://i.pravatar.cc/40?img=6',
  'https://i.pravatar.cc/40?img=7',
  'https://i.pravatar.cc/40?img=8',
  'https://i.pravatar.cc/40?img=9',
  'https://i.pravatar.cc/40?img=10',
  'https://i.pravatar.cc/40?img=11',
  'https://i.pravatar.cc/40?img=12',
];

function ShareBlock() {
  const [copied, setCopied] = useState(false);
  const url = window.location.origin;

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: 'Project', url });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }

  return (
    <Reveal style={{ padding: '0 16px', marginBottom: 12 }}>
      <motion.button
        onClick={handleShare}
        whileTap={{ scale: 0.97 }}
        style={{
          width: '100%', border: 'none', cursor: 'pointer',
          borderRadius: 24, padding: '22px 24px',
          background: '#0A0A0A',
          position: 'relative', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 16,
        }}
      >
        {/* Stars bg inside button */}
        {[
          { top: '20%', left: '15%', s: 1.5, d: 2.2, dl: 0 },
          { top: '60%', left: '30%', s: 1,   d: 3.1, dl: 0.6 },
          { top: '30%', left: '55%', s: 2,   d: 2.6, dl: 1.2 },
          { top: '70%', left: '70%', s: 1.5, d: 2.9, dl: 0.3 },
          { top: '15%', left: '80%', s: 1,   d: 3.4, dl: 1.8 },
          { top: '50%', left: '90%', s: 2,   d: 2.1, dl: 0.9 },
        ].map((s, i) => (
          <div key={i} style={{
            position: 'absolute', top: s.top, left: s.left,
            width: s.s, height: s.s, borderRadius: '50%', background: '#fff',
            animation: `twinkle ${s.d}s ease-in-out ${s.dl}s infinite`,
            pointerEvents: 'none', zIndex: 0,
          }} />
        ))}

        <div style={{ textAlign: 'left', zIndex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 4, letterSpacing: '-0.3px' }}>
            Поделиться сайтом
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
            {copied ? '✓ Ссылка скопирована' : 'Расскажи друзьям о Project'}
          </div>
        </div>

        <div style={{
          width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
          background: 'rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1,
        }}>
          {copied
            ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
            : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>
              </svg>
          }
        </div>
      </motion.button>
    </Reveal>
  );
}

function AvatarsCounter() {
  const [count, setCount] = useState(47);
  const [avatars, setAvatars] = useState(FAKE_AVATARS);

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, avatar_url, username', { count: 'exact' })
      .limit(12)
      .then(({ data, count: total }) => {
        if (total) setCount(total);
        if (data?.length) {
          setAvatars(data.map(p =>
            p.avatar_url || `https://i.pravatar.cc/40?u=${p.id}`
          ));
        }
      });
  }, []);
  const doubled = [...avatars, ...avatars];
  return (
    <Reveal style={{ padding: '0 16px', marginBottom: 32 }}>
      <div style={{
        borderRadius: 20, padding: '18px 0 18px 20px',
        background: 'rgba(255,255,255,0.03)',
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 20, marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
              {count} <span style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.4)' }}>уже зарегистрировались</span>
            </div>
          </div>
        </div>

        {/* Scrolling avatars */}
        <div style={{ overflow: 'hidden', maskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)' }}>
          <div className="avatars-track">
            {doubled.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  border: '2px solid #0A0A0A',
                  marginRight: -8,
                  objectFit: 'cover',
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

const STARS = [
  { top: '8%',  left: '12%', size: 2,   dur: 2.1, delay: 0 },
  { top: '14%', left: '82%', size: 1.5, dur: 3.2, delay: 0.5 },
  { top: '22%', left: '55%', size: 2.5, dur: 2.8, delay: 1.1 },
  { top: '6%',  left: '38%', size: 1.5, dur: 3.5, delay: 0.3 },
  { top: '30%', left: '90%', size: 2,   dur: 2.4, delay: 1.8 },
  { top: '18%', left: '25%', size: 1,   dur: 4.0, delay: 0.7 },
  { top: '40%', left: '68%', size: 2,   dur: 2.6, delay: 2.2 },
  { top: '10%', left: '70%', size: 1.5, dur: 3.1, delay: 1.4 },
  { top: '35%', left: '8%',  size: 2,   dur: 2.9, delay: 0.9 },
  { top: '25%', left: '45%', size: 1,   dur: 3.8, delay: 2.6 },
  { top: '48%', left: '30%', size: 1.5, dur: 2.3, delay: 0.2 },
  { top: '5%',  left: '92%', size: 2.5, dur: 3.4, delay: 1.6 },
  { top: '42%', left: '85%', size: 1,   dur: 2.7, delay: 3.0 },
  { top: '16%', left: '5%',  size: 2,   dur: 3.6, delay: 0.4 },
  { top: '52%', left: '50%', size: 1.5, dur: 2.2, delay: 1.2 },
];

function StarsBg() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {STARS.map((s, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: s.top, left: s.left,
          width: s.size, height: s.size,
          borderRadius: '50%',
          background: '#fff',
          animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
        }} />
      ))}
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

function Reveal({ children, style, variant = 'fadeUp', delay = 0 }) {
  const v = variant === 'scale' ? scaleIn : fadeUp;
  return (
    <motion.div
      variants={v}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      transition={{ delay }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

function FeatureCard({ icon, title, desc, delay }) {
  return (
    <Reveal delay={delay} variant="scale" style={{ marginBottom: 12 }}>
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
        padding: '24px 20px',
      }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 6, letterSpacing: '-0.3px' }}>{title}</div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{desc}</div>
      </div>
    </Reveal>
  );
}

export default function WelcomePage({ profile, onOpenBetaCode }) {
const features = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4"/>
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
        </svg>
      ),
      title: 'Профили учителей',
      desc: 'Карточки преподавателей с фото, предметом и рейтингом.',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>
      ),
      title: 'Треды комментариев',
      desc: 'Оставляй отзывы и отвечай на комментарии других.',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7"/>
          <path d="M16.5 16.5L21 21"/>
        </svg>
      ),
      title: 'Быстрый поиск',
      desc: 'Найди нужного учителя по имени или предмету.',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14"/>
        </svg>
      ),
      title: 'Предложи учителя',
      desc: 'Знаешь хорошего преподавателя? Предложи его.',
    },
  ];

  return (
    <div style={{ height: '100%', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      <div
        className="feed-scroll"
        style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}
      >
        {/* Hero */}
        <div style={{
          minHeight: '80vh',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '80px 28px 40px',
          textAlign: 'center',
          position: 'relative',
        }}>
          <StarsBg />
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: 24 }}
          >
            <motion.div
              animate={{ rotate: [0, 12, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg width="96" height="96" viewBox="0 0 28 28" fill="none">
                <path d="M14 2 C14 2 15.2 8.8 18.5 11.5 C21.8 14.2 26 14 26 14 C26 14 21.8 13.8 18.5 16.5 C15.2 19.2 14 26 14 26 C14 26 12.8 19.2 9.5 16.5 C6.2 13.8 2 14 2 14 C2 14 6.2 14.2 9.5 11.5 C12.8 8.8 14 2 14 2 Z" fill="white" />
              </svg>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              marginBottom: 20,
            }}
          >
            <motion.div
              animate={{ rotate: [0, 180, 180, 360] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', times: [0, 0.45, 0.55, 1] }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D45E5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 2h14M5 22h14M6 2v4l5 6-5 6v4M18 2v4l-5 6 5 6v4"/>
              </svg>
            </motion.div>
            <span style={{
              fontSize: 12, fontWeight: 700, letterSpacing: '1.5px',
              background: 'linear-gradient(90deg, #D45E5E, #ff9a9a, #D45E5E)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              ПЕРИОД ТЕСТИРОВАНИЯ
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: 42, fontWeight: 800,
              letterSpacing: '-1px', lineHeight: 1.1,
              color: '#fff', marginBottom: 16,
            }}
          >
            Project
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, maxWidth: 300 }}
          >
            Платформа для  отзывов об учителях/персонале Колледжа. Сейчас сайт закрыт — идёт тестирование.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              style={{ marginTop: 52, color: 'rgba(255,255,255,0.2)', fontSize: 22 }}
            >
              ↓
            </motion.div>
          </motion.div>
        </div>

        {/* Section label */}
        <div style={{ padding: '0 16px', marginTop: -60 }}>
          <Reveal style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', letterSpacing: '1.5px', marginBottom: 10 }}>
              ЧТО БУДЕТ НА САЙТЕ
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px', color: '#fff' }}>
              Всё об учителях
            </div>
          </Reveal>

          <Reveal variant="scale">
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 24, overflow: 'hidden' }}>
              {features.map((f, i) => (
                <div key={f.title} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 16,
                  padding: '18px 20px',
                  borderBottom: i < features.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {f.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 3 }}>{f.title}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.55 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Share + Counter */}
        <div style={{ marginTop: 32 }}>
        <ShareBlock />
        <AvatarsCounter />
        </div>

        {/* Closing */}
        <Reveal style={{ padding: '52px 28px 100px', textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 12, letterSpacing: '-0.4px' }}>
            Скоро откроемся
          </div>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65 }}>
            Следи за обновлениями. Как только тестирование завершится — сайт откроется для всех.{' '}
            <span
              onClick={onOpenBetaCode}
              style={{ textDecoration: 'underline', cursor: 'pointer', color: 'rgba(255,255,255,0.55)' }}
            >
              Я тестировщик
            </span>
          </p>
          {profile && (
            <div style={{ marginTop: 16, fontSize: 13, color: 'rgba(255,255,255,0.2)' }}>
              Ты вошёл как <span style={{ color: 'rgba(255,255,255,0.45)' }}>{profile.username}</span>
            </div>
          )}

          <div style={{ marginTop: 32, fontSize: 12, color: 'rgba(255,255,255,0.15)', lineHeight: 1.6 }}>
            © {new Date().getFullYear()} ИП «***». Все права защищены.
          </div>
        </Reveal>
      </div>
    </div>
  );
}
