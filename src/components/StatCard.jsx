import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = '#06B6D4' }) {
  return (
    <div className="glass-panel" style={{
      padding: '20px',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Glow accent pill */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '80px',
        height: '80px',
        background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
        pointerEvents: 'none'
      }} />

      <div>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </span>
        <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#FFFFFF', marginTop: '6px', letterSpacing: '-0.02em' }}>
          {value}
        </div>
        {subtitle && (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', marginTop: '4px' }}>
            {subtitle}
          </div>
        )}
      </div>

      <div style={{
        width: '46px',
        height: '46px',
        borderRadius: '12px',
        backgroundColor: `${color}18`,
        border: `1px solid ${color}35`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color
      }}>
        {Icon && <Icon size={22} />}
      </div>
    </div>
  );
}
