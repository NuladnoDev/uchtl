import { motion } from 'motion/react';
import { photos } from '../data/photos';

export default function TeacherCard({ teacher, onClick, index }) {
  const photo = teacher.photo_url || photos[index % photos.length];
  const comments = teacher.previewComments?.slice(0, 2) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: index * 0.06 }}
      style={{ marginBottom: 20 }}
    >
      {/* Photo card */}
      <div
        onClick={() => onClick(teacher, index)}
        style={{
          position: 'relative',
          borderRadius: 20,
          overflow: 'hidden',
          cursor: 'pointer',
          aspectRatio: '4/5',
          background: '#1a1a1a',
        }}
      >
        <img
          src={photo}
          alt={teacher.name}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.05) 100%)',
        }} />

        {/* Subject pill */}
        <div style={{
          position: 'absolute',
          top: 14, right: 14,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 999,
          padding: '5px 12px',
          fontSize: 13, fontWeight: 600, color: '#fff',
        }}>
          {teacher.subject}
        </div>

        {/* Bottom text */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' }}>
              {teacher.name}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, marginLeft: 8 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#FFD900" stroke="#FFD900" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{teacher.rating}</span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginLeft: 2 }}>({teacher.reviews})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preview comments */}
      {comments.map(c => (
        <div key={c.id} style={{
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
          padding: '10px 4px',
          borderBottom: comments[comments.length - 1].id === c.id ? 'none' : '1px solid rgba(255,255,255,0.05)',
        }}>
          <img
            src={c.avatar}
            alt={c.author}
            style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, objectFit: 'cover' }}
          />
          <div style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.45 }}>
            <span style={{ fontWeight: 600, color: 'var(--text-secondary)', marginRight: 6 }}>{c.author}</span>
            {c.text}
          </div>
        </div>
      ))}
    </motion.div>
  );
}
