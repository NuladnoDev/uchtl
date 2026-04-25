import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';

const SUBJECTS = ['Математика', 'Физика', 'Химия', 'Биология', 'История', 'География',
  'Английский язык', 'Русский язык', 'Литература', 'Информатика', 'Обществознание', 'Другое'];

function PhotoEditor({ preview, name, subject, rating, onChangePhoto }) {
  const [pos, setPos] = useState({ x: 50, y: 50 }); // object-position в %
  const dragging = useRef(false);
  const lastTouch = useRef(null);
  const containerRef = useRef(null);

  function getPercent(clientX, clientY) {
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100));
    return { x, y };
  }

  function onMouseDown(e) { dragging.current = true; setPos(getPercent(e.clientX, e.clientY)); }
  function onMouseMove(e) { if (!dragging.current) return; setPos(getPercent(e.clientX, e.clientY)); }
  function onMouseUp() { dragging.current = false; }

  function onTouchStart(e) { const t = e.touches[0]; lastTouch.current = t; setPos(getPercent(t.clientX, t.clientY)); }
  function onTouchMove(e) { e.preventDefault(); const t = e.touches[0]; setPos(getPercent(t.clientX, t.clientY)); }

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 10 }}>
        Превью карточки — перетащи фото чтобы выбрать кадр
      </div>

      {/* Card preview */}
      <div
        ref={containerRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={() => {}}
        style={{
          position: 'relative',
          borderRadius: 20,
          overflow: 'hidden',
          aspectRatio: '4/5',
          background: '#1a1a1a',
          cursor: 'grab',
          userSelect: 'none',
          touchAction: 'none',
        }}
      >
        <img
          src={preview}
          alt="preview"
          draggable={false}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            objectPosition: `${pos.x}% ${pos.y}%`,
            pointerEvents: 'none',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.05) 100%)',
          pointerEvents: 'none',
        }} />

        {/* Subject pill */}
        {subject && (
          <div style={{
            position: 'absolute', top: 14, right: 14,
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 999, padding: '5px 12px',
            fontSize: 13, fontWeight: 600, color: '#fff',
            pointerEvents: 'none',
          }}>
            {subject}
          </div>
        )}

        {/* Bottom text */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 16px 18px', pointerEvents: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' }}>
              {name || 'Имя учителя'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, marginLeft: 8 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#FFD900" stroke="#FFD900" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{rating || '5.0'}</span>
            </div>
          </div>
        </div>

        {/* Drag hint */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)',
          borderRadius: 12, padding: '8px 14px',
          fontSize: 13, color: 'rgba(255,255,255,0.7)',
          pointerEvents: 'none',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          ✥ Перетащи
        </div>
      </div>

      <button
        onClick={onChangePhoto}
        style={{
          marginTop: 10, width: '100%', height: 40, borderRadius: 10, border: 'none',
          background: 'var(--surface-2)', fontSize: 14, color: 'var(--text-secondary)', cursor: 'pointer',
        }}
      >
        Сменить фото
      </button>
    </div>
  );
}

export default function CreateTeacherPage({ onBack, onSaved }) {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [bio, setBio] = useState('');
  const [rating, setRating] = useState('5.0');
  const [verified, setVerified] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSave() {
    if (!name.trim()) { setError('Введи имя учителя'); return; }
    if (!subject) { setError('Выбери предмет'); return; }
    setError('');
    setLoading(true);

    let photo_url = null;

    if (file) {
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('teachers')
        .upload(path, file, { contentType: file.type });
      if (upErr) { setError('Ошибка загрузки фото: ' + upErr.message); setLoading(false); return; }
      const { data } = supabase.storage.from('teachers').getPublicUrl(path);
      photo_url = data.publicUrl;
      console.log('photo_url:', photo_url);
    }

    const tag = name.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-zа-я0-9_]/gi, '');

    const { error: err } = await supabase.from('teachers').insert({
      name: name.trim(),
      tag,
      subject,
      bio: bio.trim() || null,
      rating: parseFloat(rating) || 5.0,
      reviews: 0,
      verified,
      online: false,
      photo_url,
    });

    setLoading(false);
    if (err) { setError('Ошибка сохранения: ' + err.message); return; }
    onSaved();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.22 }}
      style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px',
        paddingTop: 'calc(12px + env(safe-area-inset-top))',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
      }}>
        <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span style={{ fontSize: 17, fontWeight: 600 }}>Новый учитель</span>
      </div>

      {/* Form */}
      <div className="feed-scroll" style={{ flex: 1, overflowY: 'auto', padding: '20px 16px 40px' }}>

        {/* Photo */}
        {preview ? (
          <PhotoEditor
            preview={preview}
            name={name}
            subject={subject}
            rating={rating}
            onChangePhoto={() => fileRef.current?.click()}
          />
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                width: 100, height: 100, borderRadius: 20, cursor: 'pointer',
                background: 'var(--surface-2)',
                border: '2px dashed rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />

        {/* Fields */}
        {[
          { label: 'Имя и фамилия', value: name, set: setName, placeholder: 'Иванов Иван Иванович' },
          { label: 'Описание (необязательно)', value: bio, set: setBio, placeholder: 'Кратко об учителе...', multiline: true },
          { label: 'Рейтинг', value: rating, set: setRating, placeholder: '5.0', type: 'number' },
        ].map(({ label, value, set, placeholder, multiline, type }) => (
          <div key={label} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>{label}</div>
            {multiline
              ? <textarea value={value} onChange={e => set(e.target.value)} placeholder={placeholder} rows={3}
                  style={{ width: '100%', background: 'var(--surface-2)', border: '1px solid transparent', borderRadius: 12, padding: '12px 14px', fontSize: 16, color: 'var(--text-primary)', outline: 'none', resize: 'none' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                  onBlur={e => e.target.style.borderColor = 'transparent'}
                />
              : <input value={value} onChange={e => set(e.target.value)} placeholder={placeholder} type={type || 'text'}
                  style={{ width: '100%', background: 'var(--surface-2)', border: '1px solid transparent', borderRadius: 12, padding: '12px 14px', fontSize: 16, color: 'var(--text-primary)', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                  onBlur={e => e.target.style.borderColor = 'transparent'}
                />
            }
          </div>
        ))}

        {/* Subject */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Предмет</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
            {SUBJECTS.map(s => (
              <button key={s} onClick={() => setSubject(s)} style={{
                padding: '7px 14px', borderRadius: 999, fontSize: 13, fontWeight: 500,
                background: subject === s ? 'var(--accent)' : 'var(--surface-2)',
                color: subject === s ? '#fff' : 'var(--text-secondary)',
                border: 'none', cursor: 'pointer', transition: 'all 0.15s',
              }}>{s}</button>
            ))}
          </div>
          <input
            value={SUBJECTS.includes(subject) ? '' : subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="Или введи свой предмет..."
            style={{
              width: '100%', background: 'var(--surface-2)',
              border: `1px solid ${!SUBJECTS.includes(subject) && subject ? 'rgba(255,255,255,0.15)' : 'transparent'}`,
              borderRadius: 12, padding: '12px 14px', fontSize: 16,
              color: 'var(--text-primary)', outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
            onBlur={e => { if (SUBJECTS.includes(subject) || !subject) e.target.style.borderColor = 'transparent'; }}
          />
        </div>

        {/* Verified toggle */}
        <button
          onClick={() => setVerified(v => !v)}
          style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <div style={{
            width: 22, height: 22, borderRadius: 6, flexShrink: 0,
            border: `2px solid ${verified ? 'var(--accent)' : 'rgba(255,255,255,0.2)'}`,
            background: verified ? 'var(--accent)' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
          }}>
            {verified && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>}
          </div>
          <span style={{ fontSize: 15, color: 'var(--text-primary)' }}>Верифицирован</span>
        </button>

        {error && <div style={{ fontSize: 13, color: 'var(--danger)', marginBottom: 12 }}>{error}</div>}

        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            width: '100%', height: 52, borderRadius: 14, border: 'none',
            background: 'linear-gradient(135deg, #e8e8e8 0%, #a0a0a0 100%)',
            fontSize: 19, fontWeight: 700, fontFamily: "'Nunito', sans-serif",
            color: '#1a1a1a', opacity: loading ? 0.6 : 1, cursor: loading ? 'default' : 'pointer',
          }}
        >
          {loading ? 'Сохранение...' : 'Добавить учителя'}
        </button>
      </div>
    </motion.div>
  );
}
