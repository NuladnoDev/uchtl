import { useState } from 'react';
import { motion } from 'motion/react';

export default function CommentSheet({ comment, isOwn, isMod, onClose, onDelete, onEdit }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(comment.text).then(() => {
      setCopied(true);
      setTimeout(() => { setCopied(false); onClose(); }, 1000);
    });
  }

  const canDelete = isOwn || isMod;
  const canEdit = isOwn;

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
        <div style={{ padding: '16px 20px 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>

          <button onClick={handleCopy} style={btnStyle()}>
            {copied ? '✓ Скопировано' : 'Скопировать'}
          </button>

          {canEdit && (
            <button onClick={onEdit} style={btnStyle()}>
              Редактировать
            </button>
          )}

          {canDelete && (
            <button onClick={onDelete} style={btnStyle('danger')}>
              Удалить
            </button>
          )}

        </div>
      </motion.div>
    </>
  );
}

function btnStyle(type) {
  return {
    width: '100%', height: 54, borderRadius: 14, border: 'none',
    background: type === 'danger' ? 'rgba(212,94,94,0.12)' : 'var(--surface-2)',
    fontSize: 19, fontWeight: 700, fontFamily: "'Nunito', sans-serif",
    color: type === 'danger' ? 'var(--danger)' : 'var(--text-primary)',
    cursor: 'pointer',
  };
}
