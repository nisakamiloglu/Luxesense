const API_URL = 'https://luxesense-backend.onrender.com/api';

const jsonHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

// ── Auth ──────────────────────────────────────
export const registerUser = async (userData) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify(userData),
  });
  return res.json();
};

export const loginUser = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const getMe = async (token) => {
  const res = await fetch(`${API_URL}/auth/me`, { headers: jsonHeaders(token) });
  return res.json();
};

// ── LIS ──────────────────────────────────────
export const saveLIS = async (score, segment, notifPref, token) => {
  const res = await fetch(`${API_URL}/auth/lis`, {
    method: 'PUT',
    headers: jsonHeaders(token),
    body: JSON.stringify({ score, segment, notifPref }),
  });
  return res.json();
};

// ── LIRA events ───────────────────────────────
export const ingestLIRAEvent = async (eventType, metadata = {}, token) => {
  const res = await fetch(`${API_URL}/lira/events`, {
    method: 'POST',
    headers: jsonHeaders(token),
    body: JSON.stringify({ eventType, metadata }),
  });
  return res.json();
};

export const ingestLIRABatch = async (events = [], token) => {
  const res = await fetch(`${API_URL}/lira/events/batch`, {
    method: 'POST',
    headers: jsonHeaders(token),
    body: JSON.stringify({ events }),
  });
  return res.json();
};

export const getLIRAScore = async (token) => {
  const res = await fetch(`${API_URL}/lira/score`, { headers: jsonHeaders(token) });
  return res.json();
};

export const getLIRAClients = async (token) => {
  const res = await fetch(`${API_URL}/lira/advisor/clients`, { headers: jsonHeaders(token) });
  return res.json();
};

// ── Advisor ↔ Customer ────────────────────────
export const getAdvisorCustomers = async (token) => {
  const res = await fetch(`${API_URL}/auth/advisor/customers`, { headers: jsonHeaders(token) });
  return res.json();
};

export const assignCustomer = async (customerEmail, token) => {
  const res = await fetch(`${API_URL}/auth/assign-customer`, {
    method: 'PUT',
    headers: jsonHeaders(token),
    body: JSON.stringify({ customerEmail }),
  });
  return res.json();
};

// ── Products ──────────────────────────────────
export const getProducts = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/products${query ? `?${query}` : ''}`);
  return res.json();
};

export const getProduct = async (id) => {
  const res = await fetch(`${API_URL}/products/${id}`);
  return res.json();
};

// ── Brands & Categories ───────────────────────
export const getBrands = async () => {
  const res = await fetch(`${API_URL}/brands`);
  return res.json();
};

export const getCategories = async () => {
  const res = await fetch(`${API_URL}/categories`);
  return res.json();
};

// ── Orders ────────────────────────────────────
export const createOrder = async (orderData, token) => {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: jsonHeaders(token),
    body: JSON.stringify(orderData),
  });
  return res.json();
};

export const getUserOrders = async (token) => {
  const res = await fetch(`${API_URL}/orders`, { headers: jsonHeaders(token) });
  return res.json();
};

export const getOrderById = async (id, token) => {
  const res = await fetch(`${API_URL}/orders/${id}`, { headers: jsonHeaders(token) });
  return res.json();
};

// ── Wishlist ──────────────────────────────────
export const getWishlist = async (token) => {
  const res = await fetch(`${API_URL}/wishlist`, { headers: jsonHeaders(token) });
  return res.json();
};

export const addToWishlistAPI = async (productId, token) => {
  const res = await fetch(`${API_URL}/wishlist`, {
    method: 'POST',
    headers: jsonHeaders(token),
    body: JSON.stringify({ productId }),
  });
  return res.json();
};

export const removeFromWishlistAPI = async (productId, token) => {
  const res = await fetch(`${API_URL}/wishlist/${productId}`, {
    method: 'DELETE',
    headers: jsonHeaders(token),
  });
  return res.json();
};
