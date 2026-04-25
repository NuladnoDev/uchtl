import { motion } from 'motion/react';
import { isModerator } from '../lib/roles';

export default function ProfileSheet({ profile, onClose, onChangeUsername, onChangeAvatar, onCreateTeacher }) {
  const mod = isModerator(profile);

  const items = [
    { label: 'Сменить ник', action: onChangeUsername },
    { label: 'Сменить аватарку', action: onChangeAvatar },
    ...(mod ? [{ label: 'Добавить учителя', action: onCreateTeacher, accent: true }] : []),
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }}
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: '#161616', borderRadius: '20px 20px 0 0',
          zIndex: 50, paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div style={{ width: 36, height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.2)', margin: '12px auto 0' }} />

        <div style={{ padding: '20px 20px 28px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{profile?.username}</div>
            {mod && (
              <div style={{
                fontSize: 11, fontWeight: 700, color: 'var(--accent)',
                background: 'rgba(0,119,255,0.12)', borderRadius: 6,
                padding: '2px 7px',
              }}>MOD</div>
            )}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Настройки профиля</div>

          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {items.map(({ label, action, accent }) => (
              <button
                key={label}
                onClick={action}
                style={{
                  width: '100%', height: 54, borderRadius: 14, border: 'none',
                  background: accent ? 'rgba(0,119,255,0.15)' : 'var(--surface-2)',
                  fontSize: 19, fontWeight: 700,
                  fontFamily: "'Nunito', sans-serif",
                  color: accent ? 'var(--accent)' : 'var(--text-primary)',
                  cursor: 'pointer',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}
