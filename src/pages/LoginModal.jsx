import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import { ShieldCheck, UserCheck, KeyRound, Mail, Phone, User, AlertCircle } from 'lucide-react';

export default function LoginModal({ isOpen, onClose }) {
  const { login, register, loading, authError } = useAuth();
  const [isRegister, setIsRegister] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'CUSTOMER'
  });
  const [localError, setLocalError] = useState(null);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    try {
      await login(loginForm.email, loginForm.password);
      onClose();
    } catch (err) {
      setLocalError(err.message || 'Login failed');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    try {
      await register(registerForm);
      onClose();
    } catch (err) {
      setLocalError(err.message || 'Registration failed');
    }
  };

  const handleQuickLogin = (email, password) => {
    setLoginForm({ email, password });
    login(email, password).then(() => onClose()).catch(e => setLocalError(e.message));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isRegister ? 'Create AutoHub Account' : 'Sign in to AutoHub'}
      maxWidth="480px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Toggle Sign In / Register tabs */}
        <div style={{ display: 'flex', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '4px' }}>
          <button
            onClick={() => { setIsRegister(false); setLocalError(null); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              backgroundColor: !isRegister ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
              color: !isRegister ? '#38BDF8' : 'var(--text-muted)'
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsRegister(true); setLocalError(null); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              backgroundColor: isRegister ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
              color: isRegister ? '#38BDF8' : 'var(--text-muted)'
            }}
          >
            Create Account
          </button>
        </div>

        {(localError || authError) && (
          <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#F87171', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            <span>{localError || authError}</span>
          </div>
        )}

        {/* Quick Demo Credentials pill for Viva */}
        {!isRegister && (
          <div style={{
            padding: '12px',
            borderRadius: '10px',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            fontSize: '0.78rem'
          }}>
            <div style={{ fontWeight: 700, color: '#C4B5FD', marginBottom: '8px' }}>
              ⚡ 1-Click Viva / Demo Logins:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@autohub.com', 'admin123')}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  background: 'rgba(6, 182, 212, 0.18)',
                  border: '1px solid rgba(6, 182, 212, 0.4)',
                  color: '#38BDF8',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}
              >
                Workshop Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('tharun@gmail.com', 'tharun123')}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  background: 'rgba(16, 185, 129, 0.18)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#34D399',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}
              >
                Customer (Tharun Reddy)
              </button>
            </div>
          </div>
        )}

        {/* Sign In Form */}
        {!isRegister ? (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Email Address</label>
              <input
                type="email"
                required
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                placeholder="admin@autohub.com"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#FFFFFF', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Password</label>
              <input
                type="password"
                required
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="••••••••"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#FFFFFF', outline: 'none' }}
              />
            </div>

            <button type="submit" className="glow-btn" disabled={loading} style={{ marginTop: '8px' }}>
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Full Name *</label>
              <input
                type="text"
                required
                value={registerForm.name}
                onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                placeholder="e.g. M. Tharun Teja Reddy"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#FFFFFF', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Email Address *</label>
              <input
                type="email"
                required
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                placeholder="name@example.com"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#FFFFFF', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Phone Number *</label>
              <input
                type="text"
                required
                value={registerForm.phone}
                onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                placeholder="9876543210"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#FFFFFF', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Password *</label>
              <input
                type="password"
                required
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                placeholder="Minimum 6 characters"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#FFFFFF', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Account Role</label>
              <select
                value={registerForm.role}
                onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: '#131B2E', color: '#FFFFFF', outline: 'none' }}
              >
                <option value="CUSTOMER">Customer (Vehicle Owner)</option>
                <option value="ADMIN">Workshop Administrator</option>
              </select>
            </div>

            <button type="submit" className="glow-btn" disabled={loading} style={{ marginTop: '8px' }}>
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
}
