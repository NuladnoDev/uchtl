import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { avatarGradients, hashCode } from '../data/teachers';
import { photos } from '../data/photos';
import { supabase } from '../lib/supabase';
import CommentSheet from '../components/CommentSheet';
import { isModerator } from '../lib/roles';

function getUsername(session) {
  const email = session?.user?.email || '';
  return email.replace('@uchtl.app', '');
}

function MiniAvatar({ name, tag, avatar, size = 34 }) {
  if (avatar) {
    return <img src={avatar} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />;
  }
  const gradient = avatarGradients[hashCode(tag || name || 'user') % avatarGradients.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 700, color: '#fff',
    }}>
      {(name || tag || '?')[0].toUpperCase()}
    </div>
  );
}

export default function TeacherPage({ teacher, teacherIndex, onBack, onOpenTerms, onDeleted }) {
  const photo = teacher.photo_url || photos[teacherIndex % photos.length];
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [activeComment, setActiveComment] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const inputRef = useRef(null);
  const bottomRef = useRef(null);
  const pressTimer = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) {
        supabase.from('profiles').select('*').eq('id', data.session.user.id).single()
          .then(({ data: p }) => setProfile(p));
      }
    });
    supabase
      .from('comments')
      .select('*')
      .eq('teacher_id', teacher.id)
      .order('created_at')
      .then(({ data, error }) => {
        if (!error && data) setComments(data);
        setLoading(false);
      });
  }, [teacher.id]);

  async function addComment() {
    if (!text.trim()) return;
    const newComment = {
      teacher_id: teacher.id,
      author: getUsername(session) || 'Аноним',
      text: text.trim(),
      reply_to: replyTo?.id ?? null,
    };
    const { data, error } = await supabase.from('comments').insert(newComment).select().single();
    if (!error && data) {
      setComments(prev => [...prev, data]);
      navigator.vibrate?.(40);
    }
    setText('');
    setReplyTo(null);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 80);
  }

  async function deleteTeacher() {
    if (!window.confirm(`Удалить учителя «${teacher.name}»?`)) return;
    const { error } = await supabase.from('teachers').delete().eq('id', teacher.id);
    if (error) { alert('Ошибка: ' + error.message); return; }
    onDeleted?.();
  }

  async function deleteComment(id) {
    await supabase.from('comments').delete().eq('id', id);
    setComments(prev => prev.filter(c => c.id !== id));
    setActiveComment(null);
  }

  async function saveEdit() {
    if (!editText.trim() || !editingComment) return;
    const { data } = await supabase
      .from('comments')
      .update({ text: editText.trim() })
      .eq('id', editingComment.id)
      .select()
      .single();
    if (data) setComments(prev => prev.map(c => c.id === data.id ? data : c));
    setEditingComment(null);
    setEditText('');
    setActiveComment(null);
  }

  function handleLongPress(comment) {
    setActiveComment(comment);
  }

  function startPress(comment) {
    pressTimer.current = setTimeout(() => handleLongPress(comment), 500);
  }

  function cancelPress() {
    clearTimeout(pressTimer.current);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px',
        paddingTop: 'calc(12px + env(safe-area-inset-top))',
        flexShrink: 0,
      }}>
        <button onClick={onBack} style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'var(--surface-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span style={{ fontSize: 17, fontWeight: 600 }}>Профиль</span>
      </div>

      {/* Scroll area */}
      <div className="feed-scroll" style={{
        flex: 1, overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain',
        paddingBottom: 24,
      }}>
        {/* Hero card */}
        <div style={{ position: 'relative', width: '100%', overflow: 'hidden', height: 320 }}>
          <img src={photo} alt={teacher.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)',
          }} />
          <div style={{
            position: 'absolute', top: 14, right: 14,
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 999, padding: '5px 12px',
            fontSize: 13, fontWeight: 600, color: '#fff',
          }}>
            {teacher.subject}
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 18px 20px' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.4px' }}>
              {teacher.name}
            </div>
          </div>
        </div>

        {/* Mod: delete teacher */}
        {isModerator(profile) && (
          <div style={{ padding: '12px 16px 0' }}>
            <button
              onClick={deleteTeacher}
              style={{
                width: '100%', height: 46, borderRadius: 12, border: 'none',
                background: 'rgba(212,94,94,0.1)',
                fontSize: 15, fontWeight: 600,
                fontFamily: "'Nunito', sans-serif",
                color: 'var(--danger)', cursor: 'pointer',
              }}
            >
              Удалить учителя
            </button>
          </div>
        )}

        {/* Comments section */}
        <div style={{ padding: '20px 16px 0' }}>

          {/* Input — above comments */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.4 }}>
              Оставляя комментарий, вы принимаете{' '}
              <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={onOpenTerms}>
                пользовательское соглашение
              </span>
            </div>
            <AnimatePresence>
              {editingComment && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13, color: 'var(--text-secondary)' }}
                >
                  <span style={{ color: '#FFD900', fontWeight: 600 }}>Редактирование</span>
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{editingComment.text}</span>
                  <button onClick={() => { setEditingComment(null); setEditText(''); }} style={{ color: 'var(--text-muted)', fontSize: 20, lineHeight: 1 }}>×</button>
                </motion.div>
              )}
              {!editingComment && replyTo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13, color: 'var(--text-secondary)' }}
                >
                  <span style={{ color: 'var(--accent)', fontWeight: 600 }}>&gt;&gt;{replyTo.id}</span>
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{replyTo.text}</span>
                  <button onClick={() => setReplyTo(null)} style={{ color: 'var(--text-muted)', fontSize: 20, lineHeight: 1 }}>×</button>
                </motion.div>
              )}
            </AnimatePresence>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <textarea
                ref={inputRef}
                value={editingComment ? editText : text}
                onChange={e => editingComment ? setEditText(e.target.value) : setText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); editingComment ? saveEdit() : addComment(); } }}
                placeholder="Написать комментарий..."
                rows={1}
                style={{
                  flex: 1, background: 'var(--surface-2)',
                  border: `1px solid ${editingComment ? 'rgba(255,215,0,0.3)' : 'transparent'}`, borderRadius: 22,
                  padding: '11px 16px', fontSize: 16,
                  color: 'var(--text-primary)', outline: 'none',
                  resize: 'none', lineHeight: 1.4, maxHeight: 100, overflowY: 'auto',
                  verticalAlign: 'top',
                }}
                onFocus={e => { if (!editingComment) e.target.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                onBlur={e => { if (!editingComment) e.target.style.borderColor = 'transparent'; }}
                onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px'; }}
              />
              <button
                onClick={editingComment ? saveEdit : addComment}
                disabled={editingComment ? !editText.trim() : !text.trim()}
                style={{
                  width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                  background: (editingComment ? editText.trim() : text.trim()) ? (editingComment ? '#FFD900' : 'var(--accent)') : 'var(--surface-2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.15s',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={editingComment ? '#000' : 'white'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5" />
                  <path d="M5 12l7-7 7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Comments header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 16, fontWeight: 600 }}>Комментарии</span>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{comments.length}</span>
          </div>

          {/* Comments list */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: 14 }}>
              Загрузка...
            </div>
          )}
          {!loading && comments.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: 14 }}>
              Пока нет комментариев. Будь первым.
            </div>
          )}
          <AnimatePresence>
            {comments.map((c, i) => {
              const replyTarget = c.reply_to ? comments.find(x => x.id === c.reply_to) : null;
              const dateStr = c.created_at
                ? new Date(c.created_at).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })
                : 'только что';
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    display: 'flex', gap: 10, alignItems: 'flex-start',
                    padding: '12px 0',
                    borderBottom: i < comments.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    userSelect: 'none',
                  }}
                  onMouseDown={() => startPress(c)}
                  onMouseUp={cancelPress}
                  onMouseLeave={cancelPress}
                  onTouchStart={() => startPress(c)}
                  onTouchEnd={cancelPress}
                  onTouchMove={cancelPress}
                >
                  <MiniAvatar name={c.author} tag={c.tag} avatar={c.avatar} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{c.author}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>#{c.id}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 'auto' }}>{dateStr}</span>
                    </div>
                    {replyTarget && (
                      <div style={{
                        background: 'var(--surface-2)', borderLeft: '2px solid var(--accent)',
                        borderRadius: '0 8px 8px 0', padding: '5px 10px', marginBottom: 6,
                        fontSize: 13, color: 'var(--text-secondary)',
                      }}>
                      <span style={{ color: 'var(--accent)', fontWeight: 600 }}>&gt;&gt;{replyTarget.id}</span>{' '}
                        {replyTarget.text.length > 60 ? replyTarget.text.slice(0, 60) + '…' : replyTarget.text}
                      </div>
                    )}
                    <p style={{ fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.5, wordBreak: 'break-word' }}>
                      {c.text}
                    </p>
                    <button
                      onClick={() => { setReplyTo(c); inputRef.current?.focus(); inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }}
                      style={{ marginTop: 6, fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                      </svg>
                      Ответить
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>
      </div>

      <AnimatePresence>
        {activeComment && (
          <CommentSheet
            comment={activeComment}
            isOwn={activeComment.author === getUsername(session)}
            isMod={isModerator(profile)}
            onClose={() => setActiveComment(null)}
            onDelete={() => deleteComment(activeComment.id)}
            onEdit={() => {
              setEditingComment(activeComment);
              setEditText(activeComment.text);
              setActiveComment(null);
              setTimeout(() => inputRef.current?.focus(), 100);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
