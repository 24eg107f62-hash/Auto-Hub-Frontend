import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import Modal from '../components/Modal';
import {
  CreditCard,
  PlusCircle,
  IndianRupee,
  CheckCircle2,
  Calendar,
  AlertCircle,
  QrCode,
  Smartphone
} from 'lucide-react';

export default function Payments({ initialInvoice, onPaymentCompleted }) {
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    invoiceId: '',
    amount: '',
    paymentMethod: 'UPI'
  });
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [payData, invData] = await Promise.all([
        api.payments.getAll(),
        api.invoices.getAll()
      ]);
      setPayments(payData);
      setInvoices(invData);
    } catch (err) {
      console.error('Failed to load payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (initialInvoice) {
      handleOpenRecord(initialInvoice);
    }
  }, [initialInvoice]);

  const handleOpenRecord = (inv = null) => {
    if (inv) {
      setFormData({
        invoiceId: inv.id,
        amount: inv.totalAmount,
        paymentMethod: 'UPI'
      });
    } else {
      const unpaid = invoices.find(i => i.paymentStatus !== 'PAID');
      setFormData({
        invoiceId: unpaid ? unpaid.id : (invoices[0]?.id || ''),
        amount: unpaid ? unpaid.totalAmount : '',
        paymentMethod: 'UPI'
      });
    }
    setError(null);
    setIsModalOpen(true);
  };

  const handleInvoiceChange = (invId) => {
    const inv = invoices.find(i => i.id === parseInt(invId, 10));
    setFormData({
      ...formData,
      invoiceId: invId,
      amount: inv ? inv.totalAmount : formData.amount
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = {
        invoiceId: parseInt(formData.invoiceId, 10),
        amount: parseFloat(formData.amount),
        paymentMethod: formData.paymentMethod
      };
      await api.payments.record(payload);
      setIsModalOpen(false);
      fetchData();
      if (onPaymentCompleted) onPaymentCompleted();
    } catch (err) {
      setError(err.message || 'Payment recording failed');
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
            Payment Transactions & Settlement
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Multi-channel revenue reconciliation: UPI, cards, cash receipts and settlement ledgers
          </p>
        </div>

        <button onClick={() => handleOpenRecord()} className="glow-btn">
          <PlusCircle size={16} />
          <span>Record New Payment</span>
        </button>
      </div>

      {/* Payments Table */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading payments...
          </div>
        ) : payments.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No payment transactions recorded yet.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-sub)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px' }}>Payment ID</th>
                  <th style={{ padding: '12px 16px' }}>Date</th>
                  <th style={{ padding: '12px 16px' }}>Invoice Reference</th>
                  <th style={{ padding: '12px 16px' }}>Payment Method</th>
                  <th style={{ padding: '12px 16px' }}>Amount Paid</th>
                  <th style={{ padding: '12px 16px' }}>Transaction Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr
                    key={p.id}
                    style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                      #TXN-{String(p.id).padStart(5, '0')}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                      {p.paymentDate}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: '#FFFFFF' }}>
                      INV-{String(p.invoiceId).padStart(5, '0')}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(59, 130, 246, 0.15)',
                        color: '#60A5FA',
                        fontSize: '0.78rem',
                        fontWeight: 600
                      }}>
                        {p.paymentMethod === 'UPI' ? <Smartphone size={12} /> : <CreditCard size={12} />}
                        {p.paymentMethod}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 800, color: '#34D399', fontSize: '1rem' }}>
                      ₹{p.amount?.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className="badge badge-paid">
                        {p.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Payment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record Invoice Settlement"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {error && (
            <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#F87171', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Select Invoice *</label>
            <select
              required
              value={formData.invoiceId}
              onChange={(e) => handleInvoiceChange(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: '#131B2E', color: '#FFFFFF', outline: 'none' }}
            >
              <option value="">Select an invoice...</option>
              {invoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  INV-{String(inv.id).padStart(5, '0')} - ₹{inv.totalAmount} ({inv.paymentStatus})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Settlement Amount (₹) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#FFFFFF', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Payment Mode *</label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: '#131B2E', color: '#FFFFFF', outline: 'none' }}
            >
              <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
              <option value="CREDIT_CARD">Credit Card / POS</option>
              <option value="DEBIT_CARD">Debit Card</option>
              <option value="NET_BANKING">Net Banking / IMPS</option>
              <option value="CASH">Cash Over Counter</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="ghost-btn">
              Cancel
            </button>
            <button type="submit" className="glow-btn">
              Confirm Payment & Settle Invoice
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
