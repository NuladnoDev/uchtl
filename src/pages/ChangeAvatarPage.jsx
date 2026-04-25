import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { avatarGradients, hashCode } from '../data/teachers';

export default function ChangeAvatarPage({ profile, onBack, onSaved }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(profile?.avatar_url || null);
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
    if (!file) { onBack(); return; }
    setError('');
    setLoading(true);

    const ext = file.name.split('.').pop();
    const path = `${profile.id}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true, contentType: file.type });

    if (upErr) { setError('Ошибка загрузки фото'); setLoading(false); return; }

    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    const avatar_url = data.publicUrl + '?t=' + Date.now();

    const { error: err } = await supabase
      .from('profiles')
      .update({ avatar_url, updated_at: new Date().toISOString() })
      .eq('id', profile.id);

    setLoading(false);
    if (err) { setError('Ошибка сохранения'); return; }
    onSaved();
  }

  const gradient = avatarGradients[hashCode(profile?.username || 'user') % avatarGradients.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.22 }}
      style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}
    >
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
        <span style={{ fontSize: 17, fontWeight: 600 }}>Сменить аватарку</span>
      </div>

      <div style={{ padding: '36px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        {/* Preview */}
        <div
          onClick={() => fileRef.current?.click()}
          style={{
            width: 110, height: 110, borderRadius: '50%', cursor: 'pointer',
            background: preview ? 'transparent' : gradient,
            overflow: 'hidden', position: 'relative',
            border: '3px solid var(--bg-primary)',
            boxShadow: '0 0 0 2px rgba(255,255,255,0.12)',
          }}
        >
          {preview
            ? <img src={preview} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 700, color: '#fff' }}>
                {(profile?.username || '?')[0].toUpperCase()}
              </div>
          }
          {/* overlay hint */}
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
        </div>

        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />

        <div style={{ fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center' }}>
          Нажми на аватарку чтобы выбрать фото
        </div>

        {error && <div style={{ fontSize: 13, color: 'var(--danger)' }}>{error}</div>}

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
          {loading ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
    </motion.div>
  );
}
