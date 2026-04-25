import { avatarGradients, hashCode } from '../data/teachers';

export default function Avatar({ name, tag, avatarUrl, size = 48, online = false }) {
  const gradient = avatarGradients[hashCode(tag || name || 'user') % avatarGradients.length];
  const letter = (name || tag || '?')[0].toUpperCase();

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: avatarUrl ? 'transparent' : gradient,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.38, fontWeight: 600, color: '#fff',
        border: '2.5px solid var(--bg-primary)',
        overflow: 'hidden',
      }}>
        {avatarUrl
          ? <img src={avatarUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : letter
        }
      </div>
      {online && (
        <div style={{
          position: 'absolute', bottom: 1, right: 1,
          width: size * 0.22, height: size * 0.22,
          borderRadius: '50%', background: '#4CAF50',
          border: '2px solid var(--bg-primary)',
        }} />
      )}
    </div>
  );
}
