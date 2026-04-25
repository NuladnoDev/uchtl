import { motion } from 'motion/react';

function IconFeed({ active }) {
  return (
    <motion.svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      animate={active ? { scale: 1.15, y: -2 } : { scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
    </motion.svg>
  );
}

function IconSearch({ active }) {
  return (
    <motion.svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      animate={active ? { scale: 1.15, y: -2 } : { scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M16.5 16.5L21 21" />
    </motion.svg>
  );
}

export default function TabBar({ active, onChange }) {
  const tabs = [
    { id: 'feed', label: 'Учителя', icon: IconFeed },
    { id: 'search', label: 'Поиск', icon: IconSearch },
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 0, left: 0, right: 0,
      height: 'var(--bottom-nav-height)',
      background: 'var(--bg-primary)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      paddingBottom: 'env(safe-area-inset-bottom)',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 16px',
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
        maxWidth: 320,
        height: 'var(--bottom-nav-pill-height)',
        borderRadius: 999,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        padding: '0 8px',
      }}>
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                flex: 1,
                color: isActive ? '#fff' : 'rgba(255,255,255,0.4)',
                background: 'none',
                border: 'none',
                padding: '8px 0',
                minHeight: 44,
              }}
            >
              <Icon active={isActive} />
              <span style={{ fontSize: 10, fontWeight: 500 }}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
