import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Wrench, 
  UserCheck, 
  ShieldAlert, 
  LogOut, 
  Database, 
  Sparkles,
  ArrowRightLeft
} from 'lucide-react';

export default function Navbar({ onOpenAuth }) {
  const { user, logout, switchPersona, isAdmin } = useAuth();

  return (
    <header style={{
      height: '70px',
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'rgba(11, 15, 25, 0.95)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      {/* Brand Logo & Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)'
        }}>
          <Wrench size={22} color="#FFFFFF" strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', margin: 0 }}>
              AUTO<span style={{ color: 'var(--accent-cyan)' }}>HUB</span>
            </h1>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: 'rgba(6, 182, 212, 0.15)',
              color: 'var(--accent-cyan)',
              border: '1px solid rgba(6, 182, 212, 0.3)'
            }}>
              v1.0 • LIVE
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-sub)', margin: 0 }}>
            Vehicle Service Management System
          </p>
        </div>
      </div>

      {/* Center: System Status Pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }} className="no-print">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '9999px',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          fontSize: '0.75rem',
          color: '#34D399'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#10B981',
            boxShadow: '0 0 8px #10B981'
          }} />
          <Database size={13} />
          <span>Spring Boot 3.4 • MySQL 8 Online</span>
        </div>

        {/* Viva / Presentation Quick Persona Switcher */}
        <button
          onClick={() => switchPersona(isAdmin ? 'CUSTOMER' : 'ADMIN')}
          title="Click to toggle between Admin and Customer roles instantly during viva presentation"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '8px',
            backgroundColor: 'rgba(139, 92, 246, 0.15)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            color: '#C4B5FD',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <ArrowRightLeft size={13} />
          <span>Switch to {isAdmin ? 'Customer View' : 'Admin View'}</span>
        </button>
      </div>

      {/* Right User Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF' }}>
                {user.name}
              </div>
              <div style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: isAdmin ? '#38BDF8' : '#A78BFA'
              }}>
                {isAdmin ? '🛡️ WORKSHOP ADMIN' : '👤 CUSTOMER'}
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#F87171',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="glow-btn"
            style={{ padding: '8px 18px', fontSize: '0.85rem' }}
          >
            Sign In / Register
          </button>
        )}
      </div>
    </header>
  );
}
