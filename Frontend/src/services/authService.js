import { request } from './api';

export const authService = {
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  signup: (data) => request('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  verifyOTP: (email, otp_code, new_password) => request('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ email, otp_code, new_password }) })
};
