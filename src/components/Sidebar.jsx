import React from 'react';
import {
  LayoutDashboard,
  Users,
  Car,
  Wrench,
  CalendarCheck,
  Receipt,
  CreditCard,
  GraduationCap
} from 'lucide-react';

export default function Sidebar({ activeTab, onSelectTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'vehicles', label: 'Vehicles', icon: Car },
    { id: 'services', label: 'Services Catalog', icon: Wrench },
    { id: 'bookings', label: 'Service Bookings', icon: CalendarCheck },
    { id: 'invoices', label: 'Invoices & Billing', icon: Receipt },
    { id: 'payments', label: 'Payments Record', icon: CreditCard },
  ];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#0E1424',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 16px',
      flexShrink: 0
    }} className="no-print">
      {/* Navigation Links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          color: 'var(--text-sub)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          padding: '0 12px 8px 12px'
        }}>
          Main Navigation
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.88rem',
                fontWeight: isActive ? 600 : 500,
                textAlign: 'left',
                transition: 'all 0.15s ease',
                backgroundColor: isActive ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                color: isActive ? '#38BDF8' : 'var(--text-muted)',
                borderLeft: isActive ? '3px solid var(--accent-cyan)' : '3px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.color = '#FFFFFF';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }
              }}
            >
              <Icon size={19} color={isActive ? '#38BDF8' : 'var(--text-sub)'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Project & Student Viva Card */}
      <div style={{
        padding: '14px',
        borderRadius: '12px',
        background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <GraduationCap size={16} color="#38BDF8" />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38BDF8' }}>
            PROJECT DEVELOPER
          </span>
        </div>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF' }}>
          M. Tharun Teja Reddy
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          Branch: AIML-F • ID: 24EG107F62
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-sub)', marginTop: '2px' }}>
          Anurag University
        </div>
      </div>
    </aside>
  );
}
