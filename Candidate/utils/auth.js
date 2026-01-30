// Simple auth state management using localStorage
const AUTH_KEY = 'job_portal_user';

function getCurrentUser() {
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    return null;
  }
}

function loginUser(userData) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
}

function logoutUser() {
  localStorage.removeItem(AUTH_KEY);
}