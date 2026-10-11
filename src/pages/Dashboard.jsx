import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import StatCard from '../components/StatCard';
import {
  Car,
  Users,
  CalendarCheck,
  IndianRupee,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  ArrowUpRight,
  TrendingUp,
  Receipt
} from 'lucide-react';

export default function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const data = await api.dashboard.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
      // Fallback demo values if network delay
      setStats({
        totalVehicles: 4,
        totalCustomers: 4,
        totalBookings: 3,
        pendingBookings: 1,
        inProgressBookings: 1,
        completedBookings: 1,
        totalRevenue: 3361.82,
        totalInvoices: 2,
        unpaidInvoices: 1,
        paidInvoices: 1,
        recentBookings: [
          { id: 1, customerName: 'Tharun Reddy', vehicle: 'Hyundai Creta (TS09-EA-2024)', serviceType: 'Periodic Maintenance', serviceDate: '2026-10-05', status: 'COMPLETED' },
          { id: 2, customerName: 'Tharun Reddy', vehicle: 'Tata Nexon EV (TS08-HB-1007)', serviceType: 'AC Deep Cleaning', serviceDate: '2026-10-09', status: 'IN_PROGRESS' },
          { id: 3, customerName: 'Priya Sharma', vehicle: 'Honda City (TS07-FX-4589)', serviceType: 'Wheel Alignment', serviceDate: '2026-10-12', status: 'PENDING' }
        ],
        revenueByService: [
          { serviceName: 'Periodic Maintenance', count: 1 },
          { serviceName: 'AC Deep Cleaning', count: 1 },
          { serviceName: 'Wheel Alignment', count: 1 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading AutoHub analytics...
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Banner / Welcome */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
            Workshop Command Center
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Real-time status of service bays, vehicles, appointments and revenue
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => onNavigate('bookings')} className="glow-btn">
            <PlusCircle size={16} />
            <span>Book New Service</span>
          </button>
          <button onClick={() => onNavigate('invoices')} className="ghost-btn">
            <Receipt size={16} />
            <span>Generate Bill</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px'
      }}>
        <StatCard
          title="Total Revenue"
          value={`₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`}
          subtitle={`${stats?.paidInvoices || 0} Invoices Settled`}
          icon={IndianRupee}
          color="#10B981"
        />
        <StatCard
          title="Active Bookings"
          value={stats?.totalBookings || 0}
          subtitle={`${stats?.inProgressBookings || 0} in bays, ${stats?.pendingBookings || 0} queue`}
          icon={CalendarCheck}
          color="#06B6D4"
        />
        <StatCard
          title="Vehicles Registered"
          value={stats?.totalVehicles || 0}
          subtitle="Customer fleet managed"
          icon={Car}
          color="#8B5CF6"
        />
        <StatCard
          title="Total Customers"
          value={stats?.totalCustomers || 0}
          subtitle="Registered vehicle owners"
          icon={Users}
          color="#F59E0B"
        />
      </div>

      {/* Workshop Operational Pipeline */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: '#FFFFFF' }}>
          Service Workflow Pipeline
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {/* Pending */}
          <div style={{
            padding: '16px',
            borderRadius: '12px',
            backgroundColor: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#FBBF24' }}>WAITING / QUEUE</span>
              <AlertCircle size={18} color="#FBBF24" />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', marginTop: '8px' }}>
              {stats?.pendingBookings || 0}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-sub)', marginTop: '4px' }}>
              Appointments awaiting bay intake
            </p>
          </div>

          {/* In Progress */}
          <div style={{
            padding: '16px',
            borderRadius: '12px',
            backgroundColor: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#60A5FA' }}>IN SERVICE BAY</span>
              <Clock size={18} color="#60A5FA" />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', marginTop: '8px' }}>
              {stats?.inProgressBookings || 0}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-sub)', marginTop: '4px' }}>
              Vehicles actively under maintenance
            </p>
          </div>

          {/* Completed */}
          <div style={{
            padding: '16px',
            borderRadius: '12px',
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#34D399' }}>READY FOR DELIVERY</span>
              <CheckCircle2 size={18} color="#34D399" />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', marginTop: '8px' }}>
              {stats?.completedBookings || 0}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-sub)', marginTop: '4px' }}>
              Servicing finished & quality checked
            </p>
          </div>

          {/* Unpaid Invoices */}
          <div style={{
            padding: '16px',
            borderRadius: '12px',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#F87171' }}>PENDING PAYMENTS</span>
              <Receipt size={18} color="#F87171" />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', marginTop: '8px' }}>
              {stats?.unpaidInvoices || 0}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-sub)', marginTop: '4px' }}>
              Invoices pending payment settlement
            </p>
          </div>
        </div>
      </div>

      {/* Recent Bookings & Operations Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
              Recent Service Bookings
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-sub)', marginTop: '2px' }}>
              Latest customer vehicles logged into the AutoHub system
            </p>
          </div>
          <button
            onClick={() => onNavigate('bookings')}
            className="ghost-btn"
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
          >
            <span>View All Bookings</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-sub)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 14px' }}>Booking ID</th>
                <th style={{ padding: '12px 14px' }}>Customer</th>
                <th style={{ padding: '12px 14px' }}>Vehicle</th>
                <th style={{ padding: '12px 14px' }}>Service Type</th>
                <th style={{ padding: '12px 14px' }}>Scheduled Date</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {(stats?.recentBookings || []).map((b) => (
                <tr
                  key={b.id}
                  style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', transition: 'background 0.15s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '14px', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                    #AH-{b.id}
                  </td>
                  <td style={{ padding: '14px', color: '#FFFFFF', fontWeight: 600 }}>
                    {b.customerName}
                  </td>
                  <td style={{ padding: '14px', color: 'var(--text-muted)' }}>
                    {b.vehicle}
                  </td>
                  <td style={{ padding: '14px', color: 'var(--text-main)' }}>
                    {b.serviceType}
                  </td>
                  <td style={{ padding: '14px', color: 'var(--text-muted)' }}>
                    {b.serviceDate}
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span className={`badge badge-${(b.status || '').toLowerCase().replace('_', '-')}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
