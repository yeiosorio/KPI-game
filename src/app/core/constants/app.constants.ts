// Constantes globales de la aplicación
// Reemplaza los archivos de environment en Angular standalone

export const APP_CONFIG = {
  production: false,
  apiUrl: 'https://api.superlikerslabs.com/v1',
  appName: 'KPI Game',
  version: '1.0.0'
};

export const API_CONFIG = {
  BASE_URL: '/api',
  API_KEY: '32e608447ff50d5b6760c335ffe87262',
  CAMPAIGN: '4u'
};

export const API_ENDPOINTS = {
  auth: {
    login: '/microsite/sessions/login',
    signup: '/participants',
    logout: '/auth/logout',
  }
};

export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'current_user',
  PREFERENCES: 'user_preferences'
};

export const ROUTES = {
  HOME: '/home',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard'
};