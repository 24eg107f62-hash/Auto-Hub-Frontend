import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import Modal from '../components/Modal';
import {
  CalendarCheck,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Car,
  User,
  Receipt,
  Trash2,
  ChevronRight
} from 'lucide-react';

export default function Bookings({ initialServiceType, onGenerateInvoiceForBooking }) {
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    vehicleId: '',
    serviceType: '',
    serviceDate: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bData, cData, vData, sData] = await Promise.all([
        api.bookings.getAll(),
        api.customers.getAll(),
        api.vehicles.getAll(),
        api.services.getAll()
      ]);
      setBookings(bData);
      setCustomers(cData);
      setVehicles(vData);
      setServices(sData);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (initialServiceType) {
      handleOpenAdd(initialServiceType);
    }
  }, [initialServiceType]);

  const handleOpenAdd = (presetService = '') => {
    const firstCustId = customers.length > 0 ? customers[0].id : '';
    const matchingVehicles = vehicles.filter(v => v.customerId === firstCustId);
    setFormData({
      customerId: firstCustId,
      vehicleId: matchingVehicles.length > 0 ? matchingVehicles[0].id : (vehicles[0]?.id || ''),
      serviceType: presetService || (services[0]?.serviceName || 'General Maintenance'),
      serviceDate: new Date().toISOString().split('T')[0],
      description: ''
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleCustomerChange = (cId) => {
    const matchingVehicles = vehicles.filter(v => v.customerId === parseInt(cId, 10));
    setFormData({
      ...formData,
      customerId: cId,
      vehicleId: matchingVehicles.length > 0 ? matchingVehicles[0].id : ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = {
        ...formData,
        customerId: parseInt(formData.customerId, 10),
        vehicleId: parseInt(formData.vehicleId, 10)
      };
      await api.bookings.create(payload);
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to create booking');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.bookings.updateStatus(id, newStatus);
      fetchData();
    } catch (err) {
      alert('Could not update status: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this service appointment?')) {
      try {
        await api.bookings.delete(id);
        fetchData();
      } catch (err) {
        alert('Could not delete booking: ' + err.message);
      }
    }
  };

  const getCustomerName = (cId) => {
    const cust = customers.find(c => c.id === cId);
    return cust ? cust.name : `Customer #${cId}`;
  };

  const getVehicleInfo = (vId) => {
    const v = vehicles.find(item => item.id === vId);
    return v ? `${v.brand} ${v.model} (${v.vehicleNumber})` : `Vehicle #${vId}`;
  };

  const filteredBookings = statusFilter === 'ALL'
    ? bookings
    : bookings.filter(b => (b.status || '').toUpperCase() === statusFilter);

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
            Service Bookings & Bay Status
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Live scheduling queue, vehicle intake, and workshop stage transitions
          </p>
        </div>

        <button onClick={() => handleOpenAdd()} className="glow-btn">
          <PlusCircle size={16} />
          <span>New Service Booking</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 600,
              backgroundColor: statusFilter === tab ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              color: statusFilter === tab ? '#38BDF8' : 'var(--text-muted)',
              borderBottom: statusFilter === tab ? '2px solid var(--accent-cyan)' : '2px solid transparent'
            }}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading bookings...
          </div>
        ) : filteredBookings.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No bookings found with status {statusFilter}.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-sub)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 14px' }}>Ticket #</th>
                  <th style={{ padding: '12px 14px' }}>Customer</th>
                  <th style={{ padding: '12px 14px' }}>Vehicle</th>
                  <th style={{ padding: '12px 14px' }}>Service Details</th>
                  <th style={{ padding: '12px 14px' }}>Target Date</th>
                  <th style={{ padding: '12px 14px' }}>Current Status</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => (
                  <tr
                    key={b.id}
                    style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '14px', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                      #AH-{b.id}
                    </td>
                    <td style={{ padding: '14px' }}>
                      <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{getCustomerName(b.customerId)}</div>
                    </td>
                    <td style={{ padding: '14px', color: 'var(--text-muted)' }}>
                      {getVehicleInfo(b.vehicleId)}
                    </td>
                    <td style={{ padding: '14px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{b.serviceType}</div>
                      {b.description && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', marginTop: '2px', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {b.description}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '14px', color: 'var(--text-muted)' }}>
                      {b.serviceDate}
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span className={`badge badge-${(b.status || '').toLowerCase().replace('_', '-')}`}>
                        {b.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                        {/* Quick Status Advance Buttons */}
                        {b.status === 'PENDING' && (
                          <button
                            onClick={() => handleStatusChange(b.id, 'IN_PROGRESS')}
                            title="Intake to Service Bay"
                            style={{
                              padding: '5px 9px',
                              borderRadius: '6px',
                              background: 'rgba(59, 130, 246, 0.2)',
                              border: '1px solid rgba(59, 130, 246, 0.4)',
                              color: '#60A5FA',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                              fontWeight: 600
                            }}
                          >
                            Start Bay
                          </button>
                        )}

                        {b.status === 'IN_PROGRESS' && (
                          <button
                            onClick={() => handleStatusChange(b.id, 'COMPLETED')}
                            title="Mark Service as Completed"
                            style={{
                              padding: '5px 9px',
                              borderRadius: '6px',
                              background: 'rgba(16, 185, 129, 0.2)',
                              border: '1px solid rgba(16, 185, 129, 0.4)',
                              color: '#34D399',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                              fontWeight: 600
                            }}
                          >
                            Complete
                          </button>
                        )}

                        {/* Direct Invoice generation button */}
                        <button
                          onClick={() => onGenerateInvoiceForBooking && onGenerateInvoiceForBooking(b)}
                          title="Generate Invoice / Bill"
                          style={{
                            padding: '5px 9px',
                            borderRadius: '6px',
                            background: 'rgba(139, 92, 246, 0.2)',
                            border: '1px solid rgba(139, 92, 246, 0.4)',
                            color: '#C4B5FD',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Receipt size={12} />
                          <span>Bill</span>
                        </button>

                        <button
                          onClick={() => handleDelete(b.id)}
                          title="Delete Booking"
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Booking Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Vehicle Service Appointment"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {error && (
            <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#F87171', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Select Customer *</label>
            <select
              required
              value={formData.customerId}
              onChange={(e) => handleCustomerChange(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: '#131B2E', color: '#FFFFFF', outline: 'none' }}
            >
              <option value="">Select customer...</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Select Vehicle *</label>
            <select
              required
              value={formData.vehicleId}
              onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: '#131B2E', color: '#FFFFFF', outline: 'none' }}
            >
              <option value="">Select vehicle...</option>
              {vehicles
                .filter(v => !formData.customerId || v.customerId === parseInt(formData.customerId, 10))
                .map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.brand} {v.model} - [{v.vehicleNumber}]
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Required Service Package *</label>
            <select
              required
              value={formData.serviceType}
              onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: '#131B2E', color: '#FFFFFF', outline: 'none' }}
            >
              <option value="">Choose service...</option>
              {services.map((s) => (
                <option key={s.id} value={s.serviceName}>
                  {s.serviceName} - ₹{s.cost}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Appointment Date *</label>
            <input
              type="date"
              required
              value={formData.serviceDate}
              onChange={(e) => setFormData({ ...formData, serviceDate: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#FFFFFF', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Complaints / Special Requests</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Engine noise during cold start, check brake fluid"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#FFFFFF', outline: 'none', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="ghost-btn">
              Cancel
            </button>
            <button type="submit" className="glow-btn">
              Confirm Booking
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
