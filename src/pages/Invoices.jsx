import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import Modal from '../components/Modal';
import {
  Receipt,
  PlusCircle,
  Printer,
  CreditCard,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building,
  User,
  Car
} from 'lucide-react';

export default function Invoices({ prefilledBooking, onRecordPaymentForInvoice }) {
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState(null);

  const [formData, setFormData] = useState({
    bookingId: '',
    customerId: '',
    vehicleId: '',
    serviceCost: 1899,
    labourCost: 500,
    partsCost: 350,
    taxRatePercent: 18
  });
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [invData, cData, vData, bData] = await Promise.all([
        api.invoices.getAll(),
        api.customers.getAll(),
        api.vehicles.getAll(),
        api.bookings.getAll()
      ]);
      setInvoices(invData);
      setCustomers(cData);
      setVehicles(vData);
      setBookings(bData);
    } catch (err) {
      console.error('Failed to load invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (prefilledBooking) {
      handleOpenGenerate(prefilledBooking);
    }
  }, [prefilledBooking]);

  const handleOpenGenerate = (booking = null) => {
    if (booking) {
      setFormData({
        bookingId: booking.id,
        customerId: booking.customerId,
        vehicleId: booking.vehicleId,
        serviceCost: 2000,
        labourCost: 500,
        partsCost: 400,
        taxRatePercent: 18
      });
    } else {
      const firstCust = customers[0]?.id || '';
      const firstVeh = vehicles.filter(v => v.customerId === firstCust)[0]?.id || (vehicles[0]?.id || '');
      setFormData({
        bookingId: bookings[0]?.id || '',
        customerId: firstCust,
        vehicleId: firstVeh,
        serviceCost: 1899,
        labourCost: 500,
        partsCost: 300,
        taxRatePercent: 18
      });
    }
    setError(null);
    setIsGenerateOpen(true);
  };

  const handleGenerateSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = {
        bookingId: formData.bookingId ? parseInt(formData.bookingId, 10) : null,
        customerId: parseInt(formData.customerId, 10),
        vehicleId: parseInt(formData.vehicleId, 10),
        serviceCost: parseFloat(formData.serviceCost),
        labourCost: parseFloat(formData.labourCost),
        partsCost: parseFloat(formData.partsCost),
        taxRatePercent: parseFloat(formData.taxRatePercent)
      };
      await api.invoices.generate(payload);
      setIsGenerateOpen(false);
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to generate invoice');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this invoice?')) {
      try {
        await api.invoices.delete(id);
        fetchData();
      } catch (err) {
        alert('Could not delete invoice: ' + err.message);
      }
    }
  };

  const getCustomer = (cId) => customers.find(c => c.id === cId);
  const getVehicle = (vId) => vehicles.find(v => v.id === vId);

  // Live calculation preview in generator modal
  const subtotal = (parseFloat(formData.serviceCost) || 0) + (parseFloat(formData.labourCost) || 0) + (parseFloat(formData.partsCost) || 0);
  const tax = Math.round((subtotal * ((parseFloat(formData.taxRatePercent) || 18) / 100)) * 100) / 100;
  const grandTotal = Math.round((subtotal + tax) * 100) / 100;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
            Invoices & Billing Center
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            GST tax calculation, service itemization, spare parts billing and printable receipts
          </p>
        </div>

        <button onClick={() => handleOpenGenerate()} className="glow-btn">
          <PlusCircle size={16} />
          <span>Generate Tax Invoice</span>
        </button>
      </div>

      {/* Invoices List */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading invoices...
          </div>
        ) : invoices.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No invoices generated yet.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-sub)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 14px' }}>Invoice #</th>
                  <th style={{ padding: '12px 14px' }}>Date</th>
                  <th style={{ padding: '12px 14px' }}>Customer</th>
                  <th style={{ padding: '12px 14px' }}>Vehicle</th>
                  <th style={{ padding: '12px 14px' }}>Breakdown</th>
                  <th style={{ padding: '12px 14px' }}>Total Amount</th>
                  <th style={{ padding: '12px 14px' }}>Status</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => {
                  const cust = getCustomer(inv.customerId);
                  const veh = getVehicle(inv.vehicleId);
                  return (
                    <tr
                      key={inv.id}
                      style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '14px', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                        INV-{String(inv.id).padStart(5, '0')}
                      </td>
                      <td style={{ padding: '14px', color: 'var(--text-muted)' }}>
                        {inv.invoiceDate}
                      </td>
                      <td style={{ padding: '14px', color: '#FFFFFF', fontWeight: 600 }}>
                        {cust ? cust.name : `Customer #${inv.customerId}`}
                      </td>
                      <td style={{ padding: '14px', color: 'var(--text-muted)' }}>
                        {veh ? `${veh.brand} ${veh.model}` : `Vehicle #${inv.vehicleId}`}
                      </td>
                      <td style={{ padding: '14px', fontSize: '0.78rem', color: 'var(--text-sub)' }}>
                        Service: ₹{inv.serviceCost} • Parts: ₹{inv.partsCost} • GST: ₹{inv.tax}
                      </td>
                      <td style={{ padding: '14px', fontWeight: 800, color: '#34D399', fontSize: '0.98rem' }}>
                        ₹{inv.totalAmount?.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '14px' }}>
                        <span className={`badge badge-${(inv.paymentStatus || '').toLowerCase()}`}>
                          {inv.paymentStatus}
                        </span>
                      </td>
                      <td style={{ padding: '14px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                          <button
                            onClick={() => setViewingInvoice(inv)}
                            title="View / Print Tax Invoice"
                            style={{
                              padding: '5px 10px',
                              borderRadius: '6px',
                              background: 'rgba(6, 182, 212, 0.15)',
                              border: '1px solid rgba(6, 182, 212, 0.3)',
                              color: 'var(--accent-cyan)',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Printer size={13} />
                            <span>Print</span>
                          </button>

                          {inv.paymentStatus !== 'PAID' && (
                            <button
                              onClick={() => onRecordPaymentForInvoice && onRecordPaymentForInvoice(inv)}
                              title="Record Payment for this invoice"
                              style={{
                                padding: '5px 10px',
                                borderRadius: '6px',
                                background: 'rgba(16, 185, 129, 0.2)',
                                border: '1px solid rgba(16, 185, 129, 0.4)',
                                color: '#34D399',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <CreditCard size={13} />
                              <span>Pay</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(inv.id)}
                            title="Delete Invoice"
                            style={{
                              padding: '5px 8px',
                              borderRadius: '6px',
                              background: 'rgba(239, 68, 68, 0.15)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              color: '#F87171',
                              cursor: 'pointer'
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Generate Invoice Modal */}
      <Modal
        isOpen={isGenerateOpen}
        onClose={() => setIsGenerateOpen(false)}
        title="Generate Tax Invoice"
        maxWidth="600px"
      >
        <form onSubmit={handleGenerateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {error && (
            <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#F87171', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Customer *</label>
              <select
                required
                value={formData.customerId}
                onChange={(e) => {
                  const cId = e.target.value;
                  const matchingVehicles = vehicles.filter(v => v.customerId === parseInt(cId, 10));
                  setFormData({
                    ...formData,
                    customerId: cId,
                    vehicleId: matchingVehicles[0]?.id || ''
                  });
                }}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: '#131B2E', color: '#FFFFFF', outline: 'none' }}
              >
                <option value="">Select Customer...</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Vehicle *</label>
              <select
                required
                value={formData.vehicleId}
                onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: '#131B2E', color: '#FFFFFF', outline: 'none' }}
              >
                <option value="">Select Vehicle...</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.brand} {v.model} ({v.vehicleNumber})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Service Cost (₹) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.serviceCost}
                onChange={(e) => setFormData({ ...formData, serviceCost: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#FFFFFF', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Labour Charge (₹)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.labourCost}
                onChange={(e) => setFormData({ ...formData, labourCost: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#FFFFFF', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Spare Parts Cost (₹)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.partsCost}
                onChange={(e) => setFormData({ ...formData, partsCost: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#FFFFFF', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>GST Tax Rate (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formData.taxRatePercent}
                onChange={(e) => setFormData({ ...formData, taxRatePercent: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#FFFFFF', outline: 'none' }}
              />
            </div>
          </div>

          {/* Live Bill Summary */}
          <div style={{
            padding: '14px 18px',
            borderRadius: '10px',
            backgroundColor: 'rgba(6, 182, 212, 0.08)',
            border: '1px solid rgba(6, 182, 212, 0.25)',
            fontSize: '0.88rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: 'var(--text-muted)' }}>
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--text-muted)' }}>
              <span>GST ({formData.taxRatePercent}%):</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '8px', fontWeight: 800, color: '#34D399', fontSize: '1.1rem' }}>
              <span>Grand Total:</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button type="button" onClick={() => setIsGenerateOpen(false)} className="ghost-btn">
              Cancel
            </button>
            <button type="submit" className="glow-btn">
              Generate & Save Invoice
            </button>
          </div>
        </form>
      </Modal>

      {/* Printable Invoice View Modal */}
      {viewingInvoice && (
        <Modal
          isOpen={!!viewingInvoice}
          onClose={() => setViewingInvoice(null)}
          title={`Tax Invoice #INV-${String(viewingInvoice.id).padStart(5, '0')}`}
          maxWidth="680px"
        >
          <div className="printable-invoice" style={{ padding: '10px 4px', color: 'var(--text-main)' }}>
            {/* Invoice Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid rgba(255, 255, 255, 0.1)', paddingBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-cyan)', margin: 0 }}>
                  AUTO HUB WORKSHOP
                </h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)', marginTop: '4px' }}>
                  Complete Multi-Brand Vehicle Care & Diagnostics
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Gachibowli Road, Hyderabad - 500032
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  GSTIN: 36AAACH7492C1Z8
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className={`badge badge-${(viewingInvoice.paymentStatus || '').toLowerCase()}`}>
                  {viewingInvoice.paymentStatus}
                </span>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF', marginTop: '8px' }}>
                  INV-{String(viewingInvoice.id).padStart(5, '0')}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-sub)' }}>
                  Date: {viewingInvoice.invoiceDate}
                </div>
              </div>
            </div>

            {/* Customer & Vehicle Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '16px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-sub)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Billed To
                </span>
                {(() => {
                  const c = getCustomer(viewingInvoice.customerId);
                  return (
                    <div style={{ marginTop: '4px' }}>
                      <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{c ? c.name : `Customer #${viewingInvoice.customerId}`}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c?.phone}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>{c?.address}</div>
                    </div>
                  );
                })()}
              </div>

              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-sub)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Vehicle Details
                </span>
                {(() => {
                  const v = getVehicle(viewingInvoice.vehicleId);
                  return (
                    <div style={{ marginTop: '4px' }}>
                      <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{v ? `${v.brand} ${v.model}` : `Vehicle #${viewingInvoice.vehicleId}`}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontFamily: 'monospace' }}>Plate: {v?.vehicleNumber}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>Fuel: {v?.fuelType} • Year: {v?.year}</div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Line items table */}
            <div style={{ padding: '16px 0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-sub)' }}>
                    <th style={{ textAlign: 'left', padding: '8px 0' }}>Description</th>
                    <th style={{ textAlign: 'right', padding: '8px 0' }}>Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '8px 0', color: '#FFFFFF' }}>Base Service Labor & Multi-point Inspection</td>
                    <td style={{ textAlign: 'right', padding: '8px 0' }}>₹{viewingInvoice.serviceCost?.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 0', color: '#FFFFFF' }}>Technician Diagnostic & Repair Labour</td>
                    <td style={{ textAlign: 'right', padding: '8px 0' }}>₹{viewingInvoice.labourCost?.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 0', color: '#FFFFFF' }}>OEM Spare Parts & Consumables</td>
                    <td style={{ textAlign: 'right', padding: '8px 0' }}>₹{viewingInvoice.partsCost?.toFixed(2)}</td>
                  </tr>
                  <tr style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <td style={{ padding: '8px 0', color: 'var(--text-sub)' }}>GST Tax (18%)</td>
                    <td style={{ textAlign: 'right', padding: '8px 0', color: 'var(--text-muted)' }}>₹{viewingInvoice.tax?.toFixed(2)}</td>
                  </tr>
                  <tr style={{ borderTop: '2px solid rgba(255, 255, 255, 0.2)', fontWeight: 800, fontSize: '1.1rem' }}>
                    <td style={{ padding: '12px 0', color: '#FFFFFF' }}>Total Payable:</td>
                    <td style={{ textAlign: 'right', padding: '12px 0', color: '#34D399' }}>
                      ₹{viewingInvoice.totalAmount?.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }} className="no-print">
              <button
                onClick={() => window.print()}
                className="ghost-btn"
              >
                <Printer size={15} />
                <span>Print Document</span>
              </button>
              <button
                onClick={() => setViewingInvoice(null)}
                className="glow-btn"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
