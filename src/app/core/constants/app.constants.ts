// Constantes globales de la aplicación
// Reemplaza los archivos de environment en Angular standalone

export const APP_CONFIG = {
  production: false,
  apiUrl: 'https://api.example.com',
  appName: 'KPI Game',
  version: '1.0.0'
};

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    logout: '/auth/logout',
    refresh: '/auth/refresh'
  },
  users: {
    profile: '/users/profile',
    list: '/users'
  }
};

export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
  PREFERENCES: 'user_preferences'
};

export const ROUTES = {
  HOME: '/home',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard'
};