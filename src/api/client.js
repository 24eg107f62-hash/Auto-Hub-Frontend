const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const token = localStorage.getItem('autohub_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`API Error on ${url}:`, err);
    throw err;
  }
}

export const api = {
  // Authentication
  auth: {
    login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    changePassword: (data) => request('/auth/change-password', { method: 'POST', body: JSON.stringify(data) })
  },

  // Customers
  customers: {
    getAll: () => request('/customers'),
    getById: (id) => request(`/customers/${id}`),
    search: (query) => request(`/customers/search?q=${encodeURIComponent(query)}`),
    create: (customer) => request('/customers', { method: 'POST', body: JSON.stringify(customer) }),
    update: (id, customer) => request(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(customer) }),
    delete: (id) => request(`/customers/${id}`, { method: 'DELETE' })
  },

  // Vehicles
  vehicles: {
    getAll: () => request('/vehicles'),
    getById: (id) => request(`/vehicles/${id}`),
    getByCustomer: (customerId) => request(`/vehicles/customer/${customerId}`),
    create: (vehicle) => request('/vehicles', { method: 'POST', body: JSON.stringify(vehicle) }),
    update: (id, vehicle) => request(`/vehicles/${id}`, { method: 'PUT', body: JSON.stringify(vehicle) }),
    delete: (id) => request(`/vehicles/${id}`, { method: 'DELETE' })
  },

  // Services
  services: {
    getAll: () => request('/services'),
    getById: (id) => request(`/services/${id}`),
    create: (service) => request('/services', { method: 'POST', body: JSON.stringify(service) }),
    update: (id, service) => request(`/services/${id}`, { method: 'PUT', body: JSON.stringify(service) }),
    delete: (id) => request(`/services/${id}`, { method: 'DELETE' })
  },

  // Bookings
  bookings: {
    getAll: () => request('/bookings'),
    getById: (id) => request(`/bookings/${id}`),
    getByCustomer: (customerId) => request(`/bookings/customer/${customerId}`),
    create: (booking) => request('/bookings', { method: 'POST', body: JSON.stringify(booking) }),
    updateStatus: (id, status) => request(`/bookings/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
    delete: (id) => request(`/bookings/${id}`, { method: 'DELETE' })
  },

  // Invoices
  invoices: {
    getAll: () => request('/invoices'),
    getById: (id) => request(`/invoices/${id}`),
    getByCustomer: (customerId) => request(`/invoices/customer/${customerId}`),
    getByBooking: (bookingId) => request(`/invoices/booking/${bookingId}`),
    generate: (invoiceData) => request('/invoices', { method: 'POST', body: JSON.stringify(invoiceData) }),
    updateStatus: (id, status) => request(`/invoices/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
    delete: (id) => request(`/invoices/${id}`, { method: 'DELETE' })
  },

  // Payments
  payments: {
    getAll: () => request('/payments'),
    getById: (id) => request(`/payments/${id}`),
    getByInvoice: (invoiceId) => request(`/payments/invoice/${invoiceId}`),
    record: (paymentData) => request('/payments', { method: 'POST', body: JSON.stringify(paymentData) })
  },

  // Dashboard
  dashboard: {
    getStats: () => request('/dashboard/stats')
  }
};
