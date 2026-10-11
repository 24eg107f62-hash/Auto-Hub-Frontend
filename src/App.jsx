import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Vehicles from './pages/Vehicles';
import Services from './pages/Services';
import Bookings from './pages/Bookings';
import Invoices from './pages/Invoices';
import Payments from './pages/Payments';
import LoginModal from './pages/LoginModal';

function MainApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Cross-page workflow states
  const [bookingPresetService, setBookingPresetService] = useState('');
  const [invoicePrefilledBooking, setInvoicePrefilledBooking] = useState(null);
  const [paymentPrefilledInvoice, setPaymentPrefilledInvoice] = useState(null);

  const handleBookService = (serviceName) => {
    setBookingPresetService(serviceName);
    setActiveTab('bookings');
  };

  const handleGenerateInvoiceForBooking = (booking) => {
    setInvoicePrefilledBooking(booking);
    setActiveTab('invoices');
  };

  const handleRecordPaymentForInvoice = (invoice) => {
    setPaymentPrefilledInvoice(invoice);
    setActiveTab('payments');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      {/* Top Navigation */}
      <Navbar onOpenAuth={() => setIsAuthOpen(true)} />

      {/* Main Layout: Sidebar + Page Content */}
      <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 70px)' }}>
        <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

        <main style={{
          flex: 1,
          padding: '32px 36px',
          overflowY: 'auto',
          backgroundColor: '#0B0F19'
        }}>
          {activeTab === 'dashboard' && (
            <Dashboard onNavigate={setActiveTab} />
          )}

          {activeTab === 'customers' && (
            <Customers />
          )}

          {activeTab === 'vehicles' && (
            <Vehicles />
          )}

          {activeTab === 'services' && (
            <Services onBookService={handleBookService} />
          )}

          {activeTab === 'bookings' && (
            <Bookings
              initialServiceType={bookingPresetService}
              onGenerateInvoiceForBooking={handleGenerateInvoiceForBooking}
            />
          )}

          {activeTab === 'invoices' && (
            <Invoices
              prefilledBooking={invoicePrefilledBooking}
              onRecordPaymentForInvoice={handleRecordPaymentForInvoice}
            />
          )}

          {activeTab === 'payments' && (
            <Payments
              initialInvoice={paymentPrefilledInvoice}
              onPaymentCompleted={() => setActiveTab('invoices')}
            />
          )}
        </main>
      </div>

      {/* Auth Modal */}
      <LoginModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
