import './SkeletonCard.css';

export default function SkeletonCard() {
  return (
    <div style={{ marginBottom: 20 }}>
      {/* Photo skeleton */}
      <div className="skeleton" style={{ width: '100%', aspectRatio: '4/5', borderRadius: 20 }} />
      {/* Comment skeletons */}
      <div style={{ padding: '10px 4px 0' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
          <div className="skeleton" style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ width: '40%', height: 12, borderRadius: 6, marginBottom: 6 }} />
            <div className="skeleton" style={{ width: '90%', height: 12, borderRadius: 6 }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div className="skeleton" style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ width: '30%', height: 12, borderRadius: 6, marginBottom: 6 }} />
            <div className="skeleton" style={{ width: '75%', height: 12, borderRadius: 6 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
