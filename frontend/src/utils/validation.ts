export const validation = {
  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validateInherentRisk: (value: number): boolean => {
    // Must be a number between 1 and 5 (can be float)
    return typeof value === 'number' && value >= 1 && value <= 5;
  },

  validateKPMR: (value: number): boolean => {
    // Must be an integer between 1 and 5
    return Number.isInteger(value) && value >= 1 && value <= 5;
  },

  validateRequired: (value: any): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    return true;
  },
};
