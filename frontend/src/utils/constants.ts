// Unit types - these are fixed values, not from database
export const UNIT_TYPES = ['LPEI', 'UUS'] as const;

// API Base URL from environment variable
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
