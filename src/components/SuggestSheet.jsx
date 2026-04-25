import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';

export default function SuggestSheet({ onClose }) {
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [noPhoto, setNoPhoto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setNoPhoto(false);
  }

  function toggleNoPhoto() {
    setNoPhoto(v => !v);
    if (!noPhoto) { setFile(null); setPreview(null); }
  }

  async function handleSubmit() {
    if (!name.trim()) { setError('Введите ФИО учителя'); return; }
    if (!noPhoto && !file) { setError('Добавьте фото или отметьте «без фото»'); return; }
    setError('');
    setLoading(true);

    let photo_url = null;

    if (file && !noPhoto) {
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('suggestions')
        .upload(path, file, { contentType: file.type });
      if (upErr) { setError('Ошибка загрузки фото'); setLoading(false); return; }
      const { data } = supabase.storage.from('suggestions').getPublicUrl(path);
      photo_url = data.publicUrl;
    }

    const { error: err } = await supabase.from('suggestions').insert({
      name: name.trim(),
      photo_url,
      no_photo: noPhoto,
    });

    setLoading(false);
    if (err) { setError('Ошибка отправки, попробуй ещё раз'); return; }
    setDone(true);
    setTimeout(onClose, 1800);
  }

  return (
    <>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }}
      />

      <motion.div
        key="sheet"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          position: 'fixed',
          bottom: 0, left: 0, right: 0,
          background: '#161616',
          borderRadius: '20px 20px 0 0',
          zIndex: 50,
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div style={{ width: 36, height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.2)', margin: '12px auto 0' }} />

        <div style={{ padding: '20px 20px 28px' }}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Предложить учителя</div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 22 }}>
            Оставь необходимые данные.
          </div>

          {done ? (
            <div style={{ textAlign: 'center', padding: '28px 0', fontSize: 15, color: 'var(--success)' }}>
              ✓ Предложение отправлено, спасибо!
            </div>
          ) : (
            <>
              {/* ФИО */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>ФИО учителя</div>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Иванов Иван Иванович"
                  style={{
                    width: '100%', background: 'var(--surface-2)',
                    border: '1px solid transparent', borderRadius: 12,
                    padding: '12px 14px', fontSize: 16,
                    color: 'var(--text-primary)', outline: 'none',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                  onBlur={e => e.target.style.borderColor = 'transparent'}
                />
              </div>

              {/* Фото с устройства */}
              <AnimatePresence>
                {!noPhoto && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ marginBottom: 16, overflow: 'hidden' }}
                  >
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Фото</div>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFile}
                      style={{ display: 'none' }}
                    />
                    <div
                      onClick={() => fileRef.current?.click()}
                      style={{
                        width: '100%', borderRadius: 12,
                        background: 'var(--surface-2)',
                        border: '1px dashed rgba(255,255,255,0.15)',
                        padding: preview ? 0 : '18px 0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', overflow: 'hidden',
                        minHeight: 56,
                      }}
                    >
                      {preview ? (
                        <img src={preview} alt="preview" style={{ width: '100%', maxHeight: 160, objectFit: 'cover', display: 'block' }} />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 14 }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                          Выбрать фото
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Без фото */}
              <button
                onClick={toggleNoPhoto}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  marginBottom: 22, background: 'none', border: 'none',
                  cursor: 'pointer', padding: 0,
                }}
              >
                <div style={{
                  width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                  border: `2px solid ${noPhoto ? 'var(--accent)' : 'rgba(255,255,255,0.2)'}`,
                  background: noPhoto ? 'var(--accent)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s',
                }}>
                  {noPhoto && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: 15, color: 'var(--text-primary)' }}>Без фото</span>
              </button>

              {error && (
                <div style={{ fontSize: 13, color: 'var(--danger)', marginBottom: 12 }}>{error}</div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  width: '100%', height: 52, borderRadius: 14,
                  border: 'none',
                  fontSize: 19, fontWeight: 700,
                  fontFamily: "'Nunito', sans-serif",
                  letterSpacing: '0.2px',
                  background: 'linear-gradient(135deg, #e8e8e8 0%, #a0a0a0 100%)',
                  color: '#1a1a1a',
                  opacity: loading ? 0.6 : 1,
                  cursor: loading ? 'default' : 'pointer',
                }}
              >
                {loading ? 'Отправка...' : 'Предложить'}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </>
  );
}
