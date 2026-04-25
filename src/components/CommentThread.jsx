import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Avatar from './Avatar';

function Comment({ comment, allComments, onReply }) {
  const replyTarget = comment.replyTo
    ? allComments.find(c => c.id === comment.replyTo)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        padding: '12px 0',
        borderBottom: '1px solid var(--divider)',
      }}
    >
      <div style={{ display: 'flex', gap: 10 }}>
        <Avatar name={comment.author} tag={comment.tag} size={36} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
              {comment.author}
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>#{comment.id}</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 'auto' }}>
              {comment.date}
            </span>
          </div>

          {replyTarget && (
            <div style={{
              background: 'var(--surface-2)',
              borderLeft: '2px solid var(--accent)',
              borderRadius: '0 8px 8px 0',
              padding: '6px 10px',
              marginBottom: 6,
              fontSize: 13,
              color: 'var(--text-secondary)',
            }}>
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>&gt;&gt;{replyTarget.id}</span>{' '}
              {replyTarget.text.length > 60 ? replyTarget.text.slice(0, 60) + '…' : replyTarget.text}
            </div>
          )}

          <p style={{ fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.5, wordBreak: 'break-word' }}>
            {comment.text}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
            <button
              onClick={() => onReply(comment)}
              style={{
                fontSize: 13,
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              Ответить
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-muted)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
                <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
              </svg>
              {comment.likes}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function CommentThread({ comments, onAddComment }) {
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    onAddComment({ text: text.trim(), replyTo: replyTo?.id ?? null });
    setText('');
    setReplyTo(null);
  }

  return (
    <div>
      <div style={{ padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
            Комментарии
          </span>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{comments.length}</span>
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        {comments.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: 14 }}>
            Пока нет комментариев. Будь первым.
          </div>
        )}
        <AnimatePresence>
          {comments.map(c => (
            <Comment
              key={c.id}
              comment={c}
              allComments={comments}
              onReply={setReplyTo}
            />
          ))}
        </AnimatePresence>
      </div>

      <div style={{
        position: 'sticky',
        bottom: 'calc(var(--bottom-nav-height) + env(safe-area-inset-bottom))',
        background: 'var(--bg-primary)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '10px 16px',
        paddingBottom: 'calc(10px + env(safe-area-inset-bottom))',
      }}>
        <AnimatePresence>
          {replyTo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 8,
                fontSize: 13,
                color: 'var(--text-secondary)',
              }}
            >
              <span style={{ color: 'var(--accent)' }}>&gt;&gt;{replyTo.id}</span>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {replyTo.text}
              </span>
              <button onClick={() => setReplyTo(null)} style={{ color: 'var(--text-muted)', fontSize: 18, lineHeight: 1 }}>×</button>
            </motion.div>
          )}
        </AnimatePresence>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Написать комментарий..."
            rows={1}
            style={{
              flex: 1,
              background: 'var(--surface-2)',
              border: '1px solid transparent',
              borderRadius: 12,
              padding: '10px 14px',
              fontSize: 16,
              color: 'var(--text-primary)',
              outline: 'none',
              resize: 'none',
              lineHeight: 1.4,
              maxHeight: 100,
              overflowY: 'auto',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
            onBlur={e => e.target.style.borderColor = 'transparent'}
            onInput={e => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
            }}
          />
          <button
            type="submit"
            disabled={!text.trim()}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: text.trim() ? 'var(--accent)' : 'var(--surface-2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'background 0.15s',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22 11 13 2 9l20-7z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
